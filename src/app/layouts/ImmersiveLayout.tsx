import { Outlet } from 'react-router-dom';
import styles from './ImmersiveLayout.module.css';

/** Pantallas completas sin barra inferior: ayuda y coronación. */
export function ImmersiveLayout(): React.JSX.Element {
  return (
    <main id="main-content" className={styles.main}>
      <Outlet />
    </main>
  );
}
