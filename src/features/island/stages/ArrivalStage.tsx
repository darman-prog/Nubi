import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import styles from '../IslandSheet.module.css';

interface ArrivalStageProps {
  island: Isla;
  onNext: () => void;
}

export function ArrivalStage({ island, onNext }: ArrivalStageProps): React.JSX.Element {
  const phrases = island.llegada ?? ['Bienvenido a esta isla.'];

  return (
    <div className={styles.stage}>
      <img className={styles.islandHero} src={artUrl(`arte/islas/${island.slug}.webp`)} alt="" />
      <div className={styles.nubiRow}>
        <img className={styles.nubi} src={artUrl('arte/nubi/nubi-feliz.webp')} alt="" />
        <div className={styles.speech}>
          {phrases.map((phrase) => (
            <p key={phrase}>{phrase}</p>
          ))}
        </div>
      </div>
      <Button className={styles.cta} onClick={onNext}>
        Entrar
      </Button>
    </div>
  );
}
