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

const LABELS: Record<CardState, string> = {
  new: 'Nueva',
  current: 'Siguiente en tu ruta',
  completed: 'Completada',
  soon: 'Pronto',
  fog: 'En construcción',
};

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
      className={cx(styles.card, styles[state], compact && styles.compact)}
      data-current={state === 'current' ? 'true' : undefined}
      onClick={(event) => {
        event.preventDefault();
        go(to);
      }}
    >
      <svg className={styles.cloudSvg} aria-hidden="true" focusable="false">
        <use href={`#cloud-v${variant}`} width="100%" height="100%" />
      </svg>

      {state === 'current' ? <span className={styles.pill}>Siguiente</span> : null}

      <div className={styles.content}>
        <span className={styles.avatar} aria-hidden="true">
          <img src={image} alt="" />
        </span>
        <span className={styles.text}>
          <span className={styles.title}>{island.nombre}</span>
          <span className={styles.subtitle}>{island.subtitulo}</span>
          <span className={styles.chip}>{LABELS[state]}</span>
        </span>
        {sealSrc ? <img className={styles.seal} src={sealSrc} alt="" aria-hidden="true" /> : null}
      </div>
    </Link>
  );
}
