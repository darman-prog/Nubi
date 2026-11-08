import type { UserStateStore } from './user-state-store';
import type { Settings } from './user-state';

/** Persiste los ajustes a través del store y los aplica como atributos de <html>. */
export class SettingsService {
  constructor(private readonly store: UserStateStore) {}

  load(): Settings {
    return this.store.getState().settings;
  }

  update(patch: Partial<Settings>): Settings {
    let settings = this.store.getState().settings;
    this.store.update((state) => {
      settings = { ...state.settings, ...patch };
      return { ...state, settings };
    });
    this.apply(settings);
    return settings;
  }

  init(): Settings {
    const settings = this.load();
    this.apply(settings);
    return settings;
  }

  apply(settings: Settings): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    // "system" y el tamaño base se representan quitando el atributo, para dejar actuar a CSS.
    if (settings.theme === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = settings.theme;
    if (settings.reduceMotion === 'system') root.removeAttribute('data-reduce-motion');
    else root.dataset.reduceMotion = settings.reduceMotion;
    if (settings.textScale === 1) root.removeAttribute('data-text-scale');
    else root.dataset.textScale = String(settings.textScale);
    root.dataset.sound = settings.sound ? 'on' : 'off';
  }
}
