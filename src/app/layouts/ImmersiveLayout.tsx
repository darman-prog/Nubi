import { Outlet } from 'react-router-dom';
import styles from './ImmersiveLayout.module.css';

/** Coronación: sin barra inferior; misma columna centrada. */
export function ImmersiveLayout(): React.JSX.Element {
  return (
    <main id="main-content" className={styles.main}>
      <Outlet />
    </main>
  );
}
