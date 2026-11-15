import { SettingsService } from '@/core/settings';
import type { Settings } from '@/core/user-state';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import styles from '../HelpScreen.module.css';

const THEME_OPTIONS: Array<{ value: Settings['theme']; label: string }> = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
];

const SCALE_OPTIONS: Array<{ value: Settings['textScale']; label: string }> = [
  { value: 1, label: '100 %' },
  { value: 1.25, label: '125 %' },
  { value: 1.5, label: '150 %' },
];

/** Controles de tema, tamaño de texto y sonido persistidos en SettingsService. */
export function SettingsSection(): React.JSX.Element {
  const { settings } = useUserState();
  const store = useUserStateStore();

  const update = (patch: Partial<Settings>): void => {
    // Reutilizamos SettingsService para persistir y actualizar atributos de <html> en un paso.
    new SettingsService(store).update(patch);
  };

  return (
    <section className={styles.card} aria-labelledby="ajustes-title">
      <h2 id="ajustes-title">Ajustes</h2>
      <p className={styles.small}>Adapta la pantalla y el sonido a tu comodidad.</p>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Tema</span>
        <div className={styles.pillRow} role="group" aria-label="Tema de color">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pillBtn} ${settings.theme === opt.value ? styles.pillBtnActive : ''}`}
              aria-pressed={settings.theme === opt.value}
              onClick={() => update({ theme: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Tamaño de texto</span>
        <div className={styles.pillRow} role="group" aria-label="Tamaño de texto">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pillBtn} ${settings.textScale === opt.value ? styles.pillBtnActive : ''}`}
              aria-pressed={settings.textScale === opt.value}
              onClick={() => update({ textScale: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Sonido</span>
        <div className={styles.pillRow} role="group" aria-label="Sonido">
          <button
            type="button"
            className={`${styles.pillBtn} ${!settings.sound ? styles.pillBtnActive : ''}`}
            aria-pressed={!settings.sound}
            onClick={() => update({ sound: false })}
          >
            Apagado
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${settings.sound ? styles.pillBtnActive : ''}`}
            aria-pressed={settings.sound}
            onClick={() => update({ sound: true })}
          >
            Encendido
          </button>
        </div>
      </div>
    </section>
  );
}
