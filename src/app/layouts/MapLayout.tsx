import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MapScreen from '@/features/map/MapScreen';
import { AppNav } from '../AppNav';
import styles from './MapLayout.module.css';

/**
 * Mapa + barra inferior + hoja de ruta. El fondo (nav y mapa) queda inerte
 * mientras la hoja modal está abierta; la hoja se renderiza después del main.
 */
export function MapLayout(): React.JSX.Element {
  const { pathname } = useLocation();
  const isOverlay = pathname !== '/mapa';
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = backgroundRef.current;
    if (!node) return;
    if (isOverlay) node.setAttribute('inert', '');
    else node.removeAttribute('inert');
  }, [isOverlay]);

  return (
    <div className={styles.layout}>
      <div ref={backgroundRef} aria-hidden={isOverlay || undefined}>
        <AppNav />
        <main id="main-content" className={styles.map}>
          <MapScreen />
        </main>
      </div>
      <Outlet />
    </div>
  );
}
