import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { content } from '@/core/content/content-repository';
import { SettingsService } from '@/core/settings';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import styles from './HelpScreen.module.css';

const SIGNS = [
  'Mucho sueño durante el día',
  'Ronquido fuerte',
  'Pesadillas frecuentes',
  'Sentirte mal de forma intensa o por muchos días',
];

export default function HelpScreen(): React.JSX.Element {
  const state = useUserState();
  const store = useUserStateStore();
  const settingsService = new SettingsService(store);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const exportData = (): void => {
    const blob = new Blob([store.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nubi-progreso.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Archivo exportado.');
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = store.importJson(await file.text());
    if (result.ok && result.state) {
      store.replace(result.state);
      setMessage('Progreso importado.');
      setError('');
    } else {
      setError(result.error ?? 'No pudimos leer ese archivo.');
    }
    event.target.value = '';
  };

  const clearData = (): void => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    store.reset();
    setConfirmClear(false);
    setMessage('Datos borrados de este dispositivo.');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Un espacio seguro</p>
        <h1 className={styles.title}>Ayuda</h1>
        <p className={styles.subtitle}>No tienes que resolver esto solo.</p>
      </header>
      <section className={styles.card} aria-labelledby="adulto">
        <h2 id="adulto">Hablar con un adulto</h2>
        <p>
          Si algo te preocupa de tu sueño o de cómo te sientes, busca a una persona de confianza.
          No es exagerar: es cuidarte.
        </p>
        <h3>Señales para consultar</h3>
        <ul>
          {SIGNS.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
        <p>
          Habla con tu familia, un docente, orientación escolar o un profesional de la salud. Si
          necesitas ayuda urgente, busca a un adulto o a un servicio de emergencia de tu país.
        </p>
        <p className={styles.disclaimer}>
          Esta app informa y no reemplaza a un profesional de la salud.
        </p>
      </section>

      <section className={styles.card} aria-labelledby="ajustes">
        <h2 id="ajustes">Ajustes de comodidad</h2>
        <p className={styles.small}>Tema claro, como el flujo del archipiélago.</p>
        <label className={styles.field}>
          <span>Reducir movimiento</span>
          <select
            value={state.settings.reduceMotion}
            onChange={(event) =>
              settingsService.update({
                reduceMotion: event.target.value as typeof state.settings.reduceMotion,
              })
            }
          >
            <option value="system">Seguir al sistema</option>
            <option value="on">Reducir siempre</option>
            <option value="off">Permitir animaciones</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Tamaño del texto</span>
          <select
            value={state.settings.textScale}
            onChange={(event) =>
              settingsService.update({
                textScale: Number(event.target.value) as typeof state.settings.textScale,
              })
            }
          >
            <option value="1">Normal</option>
            <option value="1.25">Grande</option>
            <option value="1.5">Muy grande</option>
          </select>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={state.settings.sound}
            onChange={(event) => settingsService.update({ sound: event.target.checked })}
          />
          Sonido (próximamente)
        </label>
      </section>

      <section className={styles.card} aria-labelledby="datos">
        <h2 id="datos">Tus datos</h2>
        <p className={styles.small}>
          Todo se queda en este dispositivo. Puedes exportarlo, importarlo o borrarlo.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={exportData}>
            Exportar progreso
          </button>
          <label className={styles.action}>
            Importar progreso
            <input type="file" accept="application/json" onChange={importData} />
          </label>
          <button type="button" className={styles.danger} onClick={clearData}>
            {confirmClear ? '¿Seguro? Borrar todo' : 'Borrar mis datos'}
          </button>
        </div>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {message ? <p className={styles.message} role="status">{message}</p> : null}
      </section>

      <section className={styles.card} aria-labelledby="fuentes">
        <h2 id="fuentes">Fuentes y evidencia</h2>
        <p className={styles.small}>Cada afirmación de salud se apoya en una ficha revisable.</p>
        <div className={styles.sources}>
          {content.evidence
            .filter((item) => !item.restricted)
            .map((item) => (
              <details key={item.id} className={styles.source}>
                <summary>
                  {item.id} · {item.claimTeen}
                </summary>
                <p>{item.source.citation}</p>
                <p>
                  {item.population} · {item.design} · Nivel {item.level}
                </p>
                <p>{item.limitations}</p>
              </details>
            ))}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="acerca">
        <h2 id="acerca">Acerca de</h2>
        <p>
          Nubi y el Archipiélago del Sueño es un recorrido para entender tu descanso. No hay
          cuentas, no hay servidores y no se recogen datos personales.
        </p>
      </section>
    </div>
  );
}
