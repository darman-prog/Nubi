import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import styles from '../IslandSheet.module.css';

interface ArrivalStageProps {
  island: Isla;
  onNext: () => void;
}

export function ArrivalStage({ island, onNext }: ArrivalStageProps): React.JSX.Element {
  // Frases de bienvenida de Nubi al llegar a la isla.
  const phrases = island.llegada ?? ['Bienvenido a esta isla.'];

  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 1 · Llegada</span>
      </div>

      {/* Heroica ilustración de la isla al llegar, con resplandor suave */}
      <div className={styles.heroWrapper}>
        <div className={styles.fogGlow} aria-hidden="true" />
        <img className={styles.islandHero} src={artUrl(`arte/islas/${island.slug}.webp`)} alt={island.nombre} />
      </div>

      <div className={styles.nubiRow}>
        <img className={styles.nubi} src={artUrl('arte/nubi/nubi-feliz.webp')} alt="" />
        <div className={styles.speech}>
          {phrases.map((phrase) => (
            <p key={phrase}>{phrase}</p>
          ))}
        </div>
      </div>

      <Button className={styles.cta} onClick={onNext}>
        Comenzar historia →
      </Button>
    </div>
  );
}
