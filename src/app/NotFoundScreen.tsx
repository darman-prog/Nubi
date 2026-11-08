import { Link } from 'react-router-dom';
import { ScreenPlaceholder } from '@/shared/ui/ScreenPlaceholder';
import styles from './NotFoundScreen.module.css';

export function NotFoundScreen(): React.JSX.Element {
  return (
    <main id="main-content">
      <ScreenPlaceholder
        title="Página no encontrada"
        note="La isla que buscas no está en el archipiélago."
      />
      <p className={styles.back}>
        <Link to="/mapa">Volver al mapa</Link>
      </p>
    </main>
  );
}
