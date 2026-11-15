import { cx } from '@/shared/lib/cx';
import { Icon, type IconName } from './icons/Icon';
import styles from './EvidenceBadge.module.css';

export type EvidenceBadgeLevel = 'E1' | 'E2' | 'E3';

const META: Record<
  EvidenceBadgeLevel,
  { label: string; detail: string; icon: IconName }
> = {
  E3: {
    label: 'Bien establecido',
    detail: 'evidencia sólida con estudios consistentes.',
    icon: 'evidence-e3',
  },
  E2: {
    label: 'Probable',
    detail: 'estudios con adolescentes, aún limitados.',
    icon: 'evidence-e2',
  },
  E1: {
    label: 'Aún se investiga',
    detail: 'evidencia preliminar y en estudio.',
    icon: 'evidence-e1',
  },
};

interface EvidenceBadgeProps {
  level: EvidenceBadgeLevel;
  compact?: boolean;
  className?: string;
}

/** Insignia de nivel de evidencia con icono por forma y lectura completa (doc 04 §8.18). */
export function EvidenceBadge({
  level,
  compact = false,
  className,
}: EvidenceBadgeProps): React.JSX.Element {
  const { label, detail, icon } = META[level];

  return (
    <span
      className={cx(styles.badge, styles[level], compact && styles.compact, className)}
      title={`${label}: ${detail}`}
    >
      <Icon name={icon} size={compact ? 11 : 12} />
      {compact ? (
        <>
          <span aria-hidden="true">{level}</span>
          <span className={styles.srOnly}>{`${label}: ${detail}`}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <span className={styles.srOnly}>{`: ${detail}`}</span>
        </>
      )}
    </span>
  );
}
