import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { nextIsland } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import { Sheet } from '@/shared/ui/Sheet';
import { content } from '@/core/content/content-repository';
import styles from '../IslandSheet.module.css';

interface FogSheetProps {
  island: Isla;
  onClose: () => void;
}

export function FogSheet({ island, onClose }: FogSheetProps): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const next = nextIsland(state.progress, content.islands);
  const planned = (island.ordenSugerido ?? 99) <= 5;
  const image = planned
    ? artUrl(`arte/islas/${island.slug}.webp`)
    : artUrl('arte/islas/isla-niebla.webp');

  return (
    <Sheet title={island.nombre} onClose={onClose}>
      <div className={styles.stage}>
        <img className={styles.fogImage} src={image} alt="" />
        <p className={styles.fogBadge}>En construcción · Con calma</p>
        <p className={styles.sceneText}>En construcción. Pronto habrá más.</p>
        {next && next.id !== island.id ? (
          <Button
            className={styles.cta}
            onClick={() => go(`/isla/${next.slug}/llegada`)}
          >
            Ir a {next.nombre}
          </Button>
        ) : null}
        <Button variant="ghost" onClick={onClose}>
          Volver al mapa
        </Button>
      </div>
    </Sheet>
  );
}
