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
        {/* Cabecera heroica: isla flotante amplia con aureola celestial */}
        <div className={styles.fogHeroWrapper}>
          <div className={styles.fogGlow} aria-hidden="true" />
          <img className={styles.fogImage} src={image} alt={island.nombre} />
        </div>

        {/* Datos y estado amable de la isla */}
        <div className={styles.fogDetails}>
          <span className={styles.fogBadge}>
            <span aria-hidden="true">✦</span>
            <span>En construcción · Con calma</span>
          </span>
          <h3 className={styles.fogTitle}>{island.nombre}</h3>
          <p className={styles.fogSubtitle}>{island.subtitulo}</p>
        </div>

        {/* Tarjeta pedagógica de transparencia científica */}
        <div className={styles.fogInfoCard}>
          <span className={styles.fogInfoIcon} aria-hidden="true">
            🔭
          </span>
          <p className={styles.fogDescription}>
            Esta isla está cubierta por la niebla mientras revisamos y respaldamos cada dato con
            evidencia científica verificable.
          </p>
        </div>

        {next && next.id !== island.id ? (
          <Button
            className={styles.cta}
            onClick={() => go(`/isla/${next.slug}/llegada`)}
          >
            Ir a {next.nombre} →
          </Button>
        ) : null}
        <Button variant="ghost" onClick={onClose}>
          Volver al mapa
        </Button>
      </div>
    </Sheet>
  );
}
