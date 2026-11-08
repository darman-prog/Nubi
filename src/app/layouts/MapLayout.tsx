import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MapScreen from '@/features/map/MapScreen';
import styles from './MapLayout.module.css';

/**
 * Mantiene el mapa montado detrás de pasaporte, isla y niebla. Cuando hay una
 * hoja abierta, el fondo queda inerte para lectores de pantalla y teclado.
 */
export function MapLayout(): React.JSX.Element {
  const { pathname } = useLocation();
  const isOverlay = pathname !== '/mapa';
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = mapRef.current;
    if (!node) return;
    if (isOverlay) node.setAttribute('inert', '');
    else node.removeAttribute('inert');
  }, [isOverlay]);

  return (
    <div className={styles.layout}>
      <div ref={mapRef} className={styles.map} aria-hidden={isOverlay || undefined}>
        <main id="main-content">
          <MapScreen />
        </main>
      </div>
      <Outlet />
    </div>
  );
}
