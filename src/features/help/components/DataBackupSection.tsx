import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fechaLocal } from '@/core/user-state';
import type { UserStateV1 } from '@/core/user-state';
import { useUserStateStore } from '@/shared/state/UserStateContext';
import styles from '../HelpScreen.module.css';

/** Respaldo local: exportar, importar con validación/confirmación y borrar datos del dispositivo. */
export function DataBackupSection(): React.JSX.Element {
  const store = useUserStateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [pendingImport, setPendingImport] = useState<UserStateV1 | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleExport = (): void => {
    const json = store.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nubi-viaje-${fechaLocal()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setError('');
    setMessage('Archivo de respaldo descargado en tu dispositivo.');
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    // Limpiamos el input para permitir volver a elegir el mismo archivo si hay corrección.
    event.target.value = '';
    if (!file) return;

    const text = await file.text();
    const result = store.importJson(text);
    if (!result.ok || !result.state) {
      setPendingImport(null);
      setMessage('');
      setError(result.error ?? 'El archivo no tiene un formato válido de Nubi.');
      return;
    }

    setError('');
    setPendingImport(result.state);
  };

  const confirmImport = (): void => {
    if (!pendingImport) return;
    store.replace(pendingImport);
    setPendingImport(null);
    setMessage('Viaje restaurado desde tu archivo.');
  };

  const clearData = (): void => {
    // Exigimos doble toque para evitar reinicios accidentales del viaje local.
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    store.reset();
    setConfirmClear(false);
    setError('');
    setMessage('Tu viaje ha sido reiniciado en este celular.');
  };

  return (
    <section className={styles.card} aria-labelledby="datos-title">
      <h2 id="datos-title">Tus datos locales</h2>
      <p className={styles.small}>Tu progreso se guarda solo en este dispositivo. Puedes respaldarlo o borrarlo.</p>

      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={handleExport}>
          Exportar mi viaje
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => fileInputRef.current?.click()}
        >
          Importar viaje
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className={styles.hiddenInput}
          aria-label="Seleccionar archivo JSON de respaldo"
          onChange={(event) => void handleFileChange(event)}
        />
      </div>

      {pendingImport ? (
        <div className={styles.confirmBox} role="region" aria-label="Confirmar importación">
          <p className={styles.small}>Este archivo es válido. ¿Quieres reemplazar tu progreso actual?</p>
          <div className={styles.actions}>
            <button type="button" className={styles.action} onClick={confirmImport}>
              Sí, reemplazar progreso
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => setPendingImport(null)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

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

      {error ? <p className={styles.errorMsg} role="alert">{error}</p> : null}
      {message ? <p className={styles.message} role="status">{message}</p> : null}
    </section>
  );
}
