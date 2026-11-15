import { NavLink } from 'react-router-dom';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { Icon, type IconName } from '@/shared/ui/icons/Icon';
import styles from './AppNav.module.css';

const ITEMS: ReadonlyArray<{ to: string; label: string; icon: IconName }> = [
  { to: '/mapa', label: 'Mapa', icon: 'nav-map' },
  { to: '/pasaporte', label: 'Pasaporte', icon: 'nav-passport' },
  { to: '/diario', label: 'Diario', icon: 'nav-diary' },
  { to: '/ayuda', label: 'Ayuda', icon: 'nav-help' },
];

/** Barra inferior única en móvil y desktop; 4 destinos, sin elementos de escritorio. */
export function AppNav(): React.JSX.Element {
  const go = useTransitionNavigate();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/mapa'}
          className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}
          onClick={(event) => {
            // El enlace conserva href y abre en otra pestaña con el menú contextual.
            event.preventDefault();
            // El pasaporte es una hoja que sube sola; el resto navega con nubes.
            go(to, { cloud: to !== '/pasaporte' });
          }}
        >
          <Icon name={icon} size={24} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
