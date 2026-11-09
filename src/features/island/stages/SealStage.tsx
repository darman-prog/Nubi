import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import styles from '../IslandSheet.module.css';

interface SealStageProps {
  island: Isla;
  claimed: boolean;
  next?: Isla;
  onClaim: () => void;
  onNext?: () => void;
  onMap: () => void;
  onPassport: () => void;
}

export function SealStage({
  island,
  claimed,
  next,
  onClaim,
  onNext,
  onMap,
  onPassport,
}: SealStageProps): React.JSX.Element {
  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 4 · Conquista</span>
      </div>

      <div className={styles.celebrationHero}>
        <img className={styles.seal} src={artUrl(`arte/sellos/sello-${island.slug}.webp`)} alt="" />
        <img className={styles.nubiCelebration} src={artUrl('arte/nubi/nubi-celebrando.webp')} alt="" />
      </div>

      <p className={styles.sceneAct}>{claimed ? '¡Sello conseguido!' : 'Tu sello'}</p>
      <h2 className={styles.sealTitle}>{island.nombre}</h2>
      <p className={styles.sealText}>
        {claimed
          ? 'Este sello ya está en tu pasaporte. Lo que aprendiste se queda contigo.'
          : 'Completa la isla y quédate con su sello en el pasaporte.'}
      </p>

      {!claimed ? (
        <Button className={styles.cta} onClick={onClaim}>
          Reclamar sello 🏅
        </Button>
      ) : (
        <>
          {/* Tarjeta de Puente Desbloqueado (07-isla-sello-puente.html) */}
          {next && onNext ? (
            <div className={styles.bridgeCard}>
              <span className={styles.bridgeBadge}>Puente desbloqueado</span>
              <div className={styles.bridgeInfo}>
                <img
                  src={artUrl(`arte/islas/${next.slug}.webp`)}
                  alt=""
                  className={styles.bridgeThumb}
                />
                <div className={styles.bridgeText}>
                  <p className={styles.bridgeTitle}>Camino a {next.nombre}</p>
                  <p className={styles.bridgeSub}>{next.subtitulo}</p>
                </div>
              </div>
              <Button className={styles.cta} onClick={onNext}>
                Cruzar a {next.nombre} →
              </Button>
            </div>
          ) : null}

          <Button variant="secondary" onClick={onPassport}>
            Ver en mi pasaporte
          </Button>
          <Button variant="ghost" onClick={onMap}>
            Volver al mapa
          </Button>
        </>
      )}
    </div>
  );
}
