import styles from './ScreenPlaceholder.module.css';

interface ScreenPlaceholderProps {
  title: string;
  note?: string;
}

/** Pantalla temporal del esqueleto; cada feature la reemplaza en su paso. */
export function ScreenPlaceholder({ title, note }: ScreenPlaceholderProps): React.JSX.Element {
  return (
    <section className={styles.screen}>
      <h1 className={styles.title}>{title}</h1>
      {note ? <p className={styles.note}>{note}</p> : null}
    </section>
  );
}
