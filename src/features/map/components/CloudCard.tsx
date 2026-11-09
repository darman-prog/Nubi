import { Link } from 'react-router-dom';
import type { EvidenceLevel, Isla } from '../../../../content/schema';
import { content } from '@/core/content/content-repository';
import { weakestLevel } from '@/domain/evidence/levels';
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

interface EvidenceBadgeInfo {
  label: string;
  icon: string;
  styleKey: 'E3' | 'E2' | 'E1' | 'nido';
}

// Resuelve la etiqueta científica o pedagógica del mockup 02
function getEvidenceBadge(island: Isla): EvidenceBadgeInfo | null {
  if (island.slug === 'nido') {
    return { label: 'Tu Nido seguro', icon: '🌿', styleKey: 'nido' };
  }
  const levels = island.fuentes
    .map((id) => content.evidenceById(id)?.level)
    .filter((lvl): lvl is EvidenceLevel => Boolean(lvl));
  const level = weakestLevel(levels);
  if (!level) return null;
  if (level === 'E3') return { label: 'Bien establecido', icon: '✓', styleKey: 'E3' };
  if (level === 'E2') return { label: 'Probable', icon: '🔬', styleKey: 'E2' };
  return { label: 'Emergente', icon: '💡', styleKey: 'E1' };
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
  const evidence = !compact ? getEvidenceBadge(island) : null;

  return (
    <Link
      to={to}
      className={cx(styles.card, styles[state], compact && styles.compact)}
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
          {evidence ? (
            <span className={cx(styles.evidenceBadge, styles[evidence.styleKey])}>
              <span aria-hidden="true">{evidence.icon}</span>
              <span>{evidence.label}</span>
            </span>
          ) : null}
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
