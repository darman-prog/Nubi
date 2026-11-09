import { useState } from 'react';
import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import { SourceBlock } from '../components/SourceBlock';
import styles from '../IslandSheet.module.css';

interface StoryStageProps {
  island: Isla;
  onFinish: () => void;
}

export function StoryStage({ island, onFinish }: StoryStageProps): React.JSX.Element {
  const scenes = island.historia ?? [];
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  const isLast = index === scenes.length - 1;

  if (!scene) {
    return (
      <div className={styles.stage}>
        <p>Esta isla todavía no tiene historia.</p>
        <Button className={styles.cta} onClick={onFinish}>
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 2 · Historia</span>
        <span className={styles.stepBadge}>
          Paso {index + 1} de {scenes.length}
        </span>
      </div>

      <div className={styles.sceneCard}>
        <img
          className={styles.sceneImage}
          src={artUrl(scene.ilustracion ?? `arte/islas/${island.slug}.webp`)}
          alt={scene.alt}
        />
        <div className={styles.sceneBody}>
          <p className={styles.sceneAct}>{scene.acto}</p>
          <p className={styles.sceneText}>{scene.texto}</p>
          <SourceBlock islandId={island.id} evidenceId={scene.evidenceId} />
        </div>
      </div>

      <div className={styles.sceneNav}>
        <div
          className={styles.dots}
          role="group"
          aria-label={`Escena ${index + 1} de ${scenes.length}`}
        >
          {scenes.map((item, itemIndex) => (
            <span
              key={item.id}
              className={`${styles.dot} ${itemIndex === index ? styles.dotActive : ''}`}
              aria-current={itemIndex === index ? 'step' : undefined}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          onClick={() => (isLast ? onFinish() : setIndex((value) => Math.min(value + 1, scenes.length - 1)))}
        >
          {isLast ? (island.reto ? 'Ir a los retos →' : 'Reclamar sello →') : 'Siguiente escena'}
        </Button>
      </div>

      {index > 0 ? (
        <button type="button" className={styles.textButton} onClick={() => setIndex((value) => value - 1)}>
          ← Volver a la escena anterior
        </button>
      ) : null}
    </div>
  );
}
