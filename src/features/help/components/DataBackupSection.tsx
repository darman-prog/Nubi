import { useState } from 'react';
import { useUserStateStore } from '@/shared/state/UserStateContext';
import { ConfirmDialog } from '@/shared/ui/overlays/ConfirmDialog';
import { Toast } from '@/shared/ui/feedback/Toast';
import styles from '../HelpScreen.module.css';

/** Opción para borrar el progreso guardado y volver a empezar el viaje desde cero. */
export function DataBackupSection(): React.JSX.Element {
  const store = useUserStateStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');

  const confirmReset = (): void => {
    store.reset();
    setConfirmOpen(false);
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
          className={styles.action}
          onClick={() => {
            setMessage('');
            setConfirmOpen(true);
          }}
        >
          Borrar mi viaje
        </button>
      </div>

      <Toast message={message || null} onDismiss={() => setMessage('')} />

      <ConfirmDialog
        open={confirmOpen}
        title="¿Borrar tu viaje?"
        message="Esto elimina todo lo guardado en este dispositivo. No se puede deshacer."
        confirmLabel="Sí, borrar todo"
        tone="danger"
        onConfirm={confirmReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
