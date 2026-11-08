import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsService } from './settings';
import { StorageService } from './storage';
import type { StorageLike } from './storage';
import { DEFAULT_SETTINGS } from './user-state';

// Almacenamiento falso mínimo para comprobar la persistencia de ajustes.
class FakeStorage implements StorageLike {
  private readonly datos = new Map<string, string>();

  get length(): number {
    return this.datos.size;
  }

  getItem(key: string): string | null {
    return this.datos.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.datos.set(key, value);
  }

  removeItem(key: string): void {
    this.datos.delete(key);
  }

  key(index: number): string | null {
    return Array.from(this.datos.keys())[index] ?? null;
  }
}

beforeEach(() => {
  const root = document.documentElement;
  root.removeAttribute('data-theme');
  root.removeAttribute('data-reduce-motion');
  root.removeAttribute('data-text-scale');
  root.removeAttribute('data-sound');
});

describe('SettingsService', () => {
  it('carga los ajustes por defecto', () => {
    const settings = new SettingsService(new StorageService(null, 0));

    expect(settings.load()).toEqual(DEFAULT_SETTINGS);
  });

  it('update persiste y aplica atributos en <html>', () => {
    const storage = new FakeStorage();
    const storageService = new StorageService(storage, 300);
    const settings = new SettingsService(storageService);

    settings.update({ theme: 'dark', reduceMotion: 'on', textScale: 1.25, sound: true });
    storageService.flush();

    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-reduce-motion')).toBe('on');
    expect(root.getAttribute('data-text-scale')).toBe('1.25');
    expect(root.getAttribute('data-sound')).toBe('on');

    // Un servicio nuevo debe leer los ajustes ya guardados en el almacenamiento.
    expect(new SettingsService(new StorageService(storage, 0)).load()).toEqual({
      theme: 'dark',
      reduceMotion: 'on',
      textScale: 1.25,
      sound: true,
    });
  });

  it('system elimina los atributos para dejar actuar al sistema', () => {
    const storage = new FakeStorage();
    const storageService = new StorageService(storage, 300);
    const settings = new SettingsService(storageService);

    settings.update({ theme: 'dark', reduceMotion: 'on', textScale: 1.5 });
    storageService.flush();
    settings.update({ theme: 'system', reduceMotion: 'system', textScale: 1 });

    const root = document.documentElement;
    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(root.hasAttribute('data-reduce-motion')).toBe(false);
    expect(root.hasAttribute('data-text-scale')).toBe(false);
  });
});
