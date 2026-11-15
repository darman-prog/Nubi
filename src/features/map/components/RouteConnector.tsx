import { cx } from '@/shared/lib/cx';
import { Icon } from '@/shared/ui/icons/Icon';
import styles from './RouteConnector.module.css';

export type RouteStatus = 'completed' | 'active' | 'upcoming';

interface RouteConnectorProps {
  status: RouteStatus;
  flip?: boolean;
}

// Curvas Bézier ascendentes (de abajo hacia arriba) que pasan por el nodo central (70, 23).
const CURVE_LEFT_FIRST = 'M 70 46 C 102 32, 38 14, 70 0';
const CURVE_RIGHT_FIRST = 'M 70 46 C 38 32, 102 14, 70 0';

/** Conector orgánico en S entre zonas del mapa según el avance del viaje. */
export function RouteConnector({ status, flip = false }: RouteConnectorProps) {
  const pathData = flip ? CURVE_RIGHT_FIRST : CURVE_LEFT_FIRST;

  return (
    <div
      className={cx(styles.connector, styles[status])}
      data-status={status}
      aria-hidden="true"
    >
      <svg className={styles.svg} viewBox="0 0 140 46" focusable="false">
        <path className={styles.halo} d={pathData} />
        <path className={styles.path} d={pathData} />
      </svg>

      <span className={styles.node}>
        {status === 'completed' ? <Icon name="sparkle" size={12} /> : null}
        {status === 'active' ? <Icon name="chevron-up" size={13} /> : null}
      </span>
    </div>
  );
}
