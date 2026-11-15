import { useState } from 'react';
import { useUserStateStore } from '@/shared/state/UserStateContext';
import styles from '../HelpScreen.module.css';

/** Opción para borrar el progreso guardado y volver a empezar el viaje desde cero. */
export function DataBackupSection(): React.JSX.Element {
  const store = useUserStateStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState('');

  const clearData = (): void => {
    // Exigimos doble toque para evitar reinicios accidentales del viaje local.
    if (!confirmClear) {
      setConfirmClear(true);
      setMessage('');
      return;
    }
    store.reset();
    setConfirmClear(false);
    setMessage('Tu viaje ha sido reiniciado en este dispositivo.');
  };

  return (
    <section className={styles.card} aria-labelledby="datos-title">
      <h2 id="datos-title">Volver a empezar</h2>
      <p className={styles.small}>
        Si quieres empezar de nuevo desde Isla Nido, puedes borrar tu progreso guardado en este
        dispositivo.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={confirmClear ? styles.dangerConfirm : styles.action}
          onClick={clearData}
        >
          {confirmClear ? '¿Seguro? Toca para borrar todo' : 'Borrar mi viaje'}
        </button>
        {confirmClear ? (
          <button type="button" className={styles.cancelBtn} onClick={() => setConfirmClear(false)}>
            Cancelar
          </button>
        ) : null}
      </div>

      {message ? (
        <p className={styles.message} role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
