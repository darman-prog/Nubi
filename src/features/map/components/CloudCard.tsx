import { Link } from 'react-router-dom';
import type { Isla } from '../../../../content/schema';
import { cx } from '@/shared/lib/cx';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import styles from './CloudCard.module.css';

type CardState = 'new' | 'current' | 'completed' | 'soon' | 'fog';

interface CloudCardProps {
  island: Isla;
  state: CardState;
  to: string;
  image: string;
  sealSrc?: string;
  variant: 1 | 2 | 3;
  compact?: boolean;
}

export function CloudCard({
  island,
  state,
  to,
  image,
  sealSrc,
  variant,
  compact = false,
}: CloudCardProps): React.JSX.Element {
  const go = useTransitionNavigate();

  return (
    <Link
      to={to}
      className={cx(
        styles.card,
        styles[state],
        compact && styles.compact,
        // La variante de silueta también desfasa el ritmo del flote entre zonas.
        variant !== 1 && styles[`float${variant}`],
      )}
      data-current={state === 'current' ? 'true' : undefined}
      onClick={(event) => {
        event.preventDefault();
        go(to);
      }}
    >
      {/* Silueta de nube de mockups/stitch/flujo-arte/02-mapa-pasaporte.html */}
      <svg className={styles.cloudSvg} aria-hidden="true" focusable="false">
        <use href={`#cloud-v${variant}`} width="100%" height="100%" />
      </svg>

      {/* Píldora de ubicación actual flotando sobre el lóbulo superior (02-mapa-pasaporte.html) */}
      {state === 'current' && !compact ? (
        <span className={styles.pill}>
          <span>Siguiente en tu ruta</span>
          <span aria-hidden="true">↑</span>
        </span>
      ) : null}

      <div className={styles.content}>
        <span className={styles.avatar} aria-hidden="true">
          <img src={image} alt="" />
        </span>

        <span className={styles.text}>
          <span className={styles.titleRow}>
            <span className={styles.title}>{island.nombre}</span>
          </span>
          <span className={styles.subtitle}>
            {compact ? 'En construcción' : island.subtitulo}
          </span>
        </span>

        {/* Indicador de sello conseguido o avance interactivo */}
        {sealSrc ? (
          <img className={styles.seal} src={sealSrc} alt="Sello ganado" />
        ) : !compact && state === 'current' ? (
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        ) : null}
      </div>
    </Link>
  );
}
