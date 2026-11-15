import { Outlet } from 'react-router-dom';
import { AtmosphericSky } from '@/shared/ui/atmosphere/AtmosphericSky';
import { AppNav } from '../AppNav';
import styles from './PageLayout.module.css';

/** Páginas con barra inferior: Diario y Ayuda. */
export function PageLayout(): React.JSX.Element {
  return (
    <div className={styles.layout}>
      <AtmosphericSky variant="page" />
      <AppNav />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
