import styles from './SkipLink.module.css';

/** Primer control del documento; visible solo al recibir foco. */
export function SkipLink(): React.JSX.Element {
  return (
    <a className={styles.link} href="#main-content">
      Saltar al contenido principal
    </a>
  );
}
