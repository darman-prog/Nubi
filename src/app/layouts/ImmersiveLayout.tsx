import { Outlet } from 'react-router-dom';
import { AtmosphericSky } from '@/shared/ui/atmosphere/AtmosphericSky';
import styles from './ImmersiveLayout.module.css';

/** Bienvenida y coronación: sin barra inferior; misma columna centrada sobre fondo sutil. */
export function ImmersiveLayout(): React.JSX.Element {
  return (
    <>
      <AtmosphericSky variant="page" />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
