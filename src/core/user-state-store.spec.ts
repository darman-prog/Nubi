import { describe, expect, it, vi } from 'vitest';
import { StorageService } from './storage';
import { UserStateStore } from './user-state-store';
import { createInitialState } from './user-state';
import { FakeStorage } from '@/test/fake-storage';

describe('UserStateStore', () => {
  it('carga el estado guardado', () => {
    const storage = new FakeStorage();
    const storageService = new StorageService(storage, 0);
    const saved = createInitialState();
    saved.settings.theme = 'dark';
    storageService.save(saved);
    storageService.flush();

    const store = new UserStateStore(new StorageService(storage, 0));
    expect(store.getState().settings.theme).toBe('dark');
  });

  it('update persiste y notifica a los suscriptores', () => {
    const storage = new FakeStorage();
    const storageService = new StorageService(storage, 300);
    const store = new UserStateStore(storageService);
    const listener = vi.fn();
    store.subscribe(listener);

    store.update((state) => ({ ...state, settings: { ...state.settings, theme: 'dark' } }));
    storageService.flush();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getState().settings.theme).toBe('dark');
    expect(new UserStateStore(new StorageService(storage, 0)).getState().settings.theme).toBe('dark');
  });

  it('no notifica si el updater devuelve el mismo estado', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    const listener = vi.fn();
    store.subscribe(listener);

    store.update((state) => state);

    expect(listener).not.toHaveBeenCalled();
  });

  it('replace reemplaza el estado y reset vuelve al inicial', () => {
    const storage = new FakeStorage();
    const storageService = new StorageService(storage, 300);
    const store = new UserStateStore(storageService);
    const reemplazo = createInitialState();
    reemplazo.profile.nickname = 'Nubi';

    store.replace(reemplazo);
    storageService.flush();
    expect(store.getState().profile.nickname).toBe('Nubi');

    store.reset();
    storageService.flush();
    expect(store.getState().profile.nickname).toBeUndefined();
    expect(new UserStateStore(new StorageService(storage, 0)).getState().profile.nickname).toBeUndefined();
  });

  it('expone la disponibilidad del almacenamiento', () => {
    expect(new UserStateStore(new StorageService(null, 0)).available).toBe(false);
    expect(new UserStateStore(new StorageService(new FakeStorage(), 0)).available).toBe(true);
  });
});
