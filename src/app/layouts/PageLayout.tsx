import { Outlet } from 'react-router-dom';
import { AppNav } from '../AppNav';
import styles from './PageLayout.module.css';

/** Páginas con barra inferior: Diario y Ayuda. */
export function PageLayout(): React.JSX.Element {
  return (
    <div className={styles.layout}>
      <AppNav />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
