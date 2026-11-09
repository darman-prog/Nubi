import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { content } from '@/core/content/content-repository';
import { markChainSolved, markStage } from '@/core/progress-service';
import { STAGES } from '@/core/user-state';
import type { Stage } from '@/core/user-state';
import { nextIsland } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import { Sheet } from '@/shared/ui/Sheet';
import { ArrivalStage } from './stages/ArrivalStage';
import { ChallengesStage } from './stages/ChallengesStage';
import { SealStage } from './stages/SealStage';
import { StoryStage } from './stages/StoryStage';
import { FogSheet } from './components/FogSheet';
import styles from './IslandSheet.module.css';

const STAGE_LABEL: Record<Stage, string> = {
  llegada: 'Llegada',
  historia: 'Historia',
  retos: 'Retos',
  sello: 'Sello',
};

export default function IslandSheet(): React.JSX.Element {
  const { slug, etapa } = useParams();
  const go = useTransitionNavigate();
  const store = useUserStateStore();
  const state = useUserState();
  const island = slug ? content.islandBySlug(slug) : undefined;
  const stage: Stage = STAGES.includes(etapa as Stage) ? (etapa as Stage) : 'llegada';
  // Cerrar una isla vuelve al mapa con el mismo telón que el resto de rutas.
  const close = useCallback(() => go('/mapa'), [go]);

  useEffect(() => {
    if (island && stage === 'llegada' && island.disponibilidad === 'available') {
      markStage(store, island.id, 'llegada');
    }
  }, [island, stage, store]);

  if (!island) {
    return (
      <Sheet title="Isla" onClose={close}>
        <p>No encontramos esa isla en el archipiélago.</p>
      </Sheet>
    );
  }

  if (island.disponibilidad === 'coming_soon') {
    return <FogSheet island={island} onClose={close} />;
  }

  const goStage = (next: Stage): void => go(`/isla/${island.slug}/${next}`);
  const claimed = state.progress.islands[island.id]?.stages.sello === true;
  const next = nextIsland(state.progress, content.islands);

  const finishStory = (): void => {
    markStage(store, island.id, 'historia');
    goStage(island.reto ? 'retos' : 'sello');
  };

  const finishChallenges = (): void => {
    markStage(store, island.id, 'retos');
    if (island.reto) markChainSolved(store, island.reto.chainId);
    goStage('sello');
  };

  const claimSeal = (): void => {
    markStage(store, island.id, 'llegada');
    markStage(store, island.id, 'historia');
    markStage(store, island.id, 'retos');
    markStage(store, island.id, 'sello');
  };

  return (
    <Sheet title={island.nombre} onClose={close}>
      <div
        className={styles.stageNav}
        role="group"
        aria-label={`Etapa ${STAGES.indexOf(stage) + 1} de 4`}
      >
        {STAGES.map((item) => (
          <span
            key={item}
            className={`${styles.stageDot} ${item === stage ? styles.stageDotActive : ''}`}
            aria-current={item === stage ? 'step' : undefined}
          >
            <span className={styles.stageLabel}>{STAGE_LABEL[item]}</span>
          </span>
        ))}
      </div>

      {stage === 'llegada' ? (
        <ArrivalStage island={island} onNext={() => goStage('historia')} />
      ) : null}
      {stage === 'historia' ? (
        <StoryStage island={island} onFinish={finishStory} />
      ) : null}
      {stage === 'retos' ? (
        <ChallengesStage island={island} onFinish={finishChallenges} />
      ) : null}
      {stage === 'sello' ? (
        <SealStage
          island={island}
          claimed={claimed}
          next={next?.id === island.id ? undefined : next}
          onClaim={claimSeal}
          onNext={
            next && next.id !== island.id
              ? () => go(`/isla/${next.slug}/llegada`)
              : undefined
          }
          onMap={() => go('/mapa')}
          onPassport={() => go('/pasaporte', { cloud: false })}
        />
      ) : null}
    </Sheet>
  );
}
