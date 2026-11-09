import { NavLink } from 'react-router-dom';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import styles from './AppNav.module.css';

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

function MapIcon(): React.JSX.Element {
  return (
    <svg {...iconProps}>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

function PassportIcon(): React.JSX.Element {
  return (
    <svg {...iconProps}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8" />
    </svg>
  );
}

function DiaryIcon(): React.JSX.Element {
  return (
    <svg {...iconProps}>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path d="M8 4v16M12 8h4M12 12h4" />
    </svg>
  );
}

function HelpIcon(): React.JSX.Element {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ITEMS = [
  { to: '/mapa', label: 'Mapa', Icon: MapIcon },
  { to: '/pasaporte', label: 'Pasaporte', Icon: PassportIcon },
  { to: '/diario', label: 'Diario', Icon: DiaryIcon },
  { to: '/ayuda', label: 'Ayuda', Icon: HelpIcon },
];

/** Barra inferior única en móvil y desktop; 4 destinos, sin elementos de escritorio. */
export function AppNav(): React.JSX.Element {
  const go = useTransitionNavigate();

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {ITEMS.map(({ to, label, Icon }) => (
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
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
