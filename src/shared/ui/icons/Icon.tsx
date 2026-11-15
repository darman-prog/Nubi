import styles from './Icon.module.css';
import { ICON_PATHS, type IconName } from './icon-paths';

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}

/** Icono vectorial unificado para evitar emojis dependientes de plataforma. */
export function Icon({ name, size = 20, label, className }: IconProps) {
  const classes = className ? `${styles.icon} ${className}` : styles.icon;
  // Sin etiqueta explícita es decorativo; con ella expone rol accesible.
  const a11yProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={classes}
      {...a11yProps}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
