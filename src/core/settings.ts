import { StorageService } from './storage';
import { createInitialState } from './user-state';
import type { Settings } from './user-state';

/** Ajustes persistidos dentro de UserStateV1 y aplicados como atributos de <html>. */
export class SettingsService {
  constructor(private readonly storage: StorageService) {}

  load(): Settings {
    return this.storage.load()?.settings ?? createInitialState().settings;
  }

  update(patch: Partial<Settings>): Settings {
    const state = this.storage.load() ?? createInitialState();
    const settings: Settings = { ...state.settings, ...patch };
    this.storage.save({ ...state, settings });
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
