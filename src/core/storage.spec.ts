import { afterEach, describe, expect, it, vi } from 'vitest';
import { CORRUPT_KEY, STORAGE_KEY, StorageService } from './storage';
import type { StorageLike } from './storage';
import { createInitialState } from './user-state';

// Almacenamiento falso en memoria que respeta el contrato de StorageLike.
class FakeStorage implements StorageLike {
  private readonly datos = new Map<string, string>();

  constructor(private readonly claveQueFalla?: string) {}

  get length(): number {
    return this.datos.size;
  }

  getItem(key: string): string | null {
    return this.datos.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    // Simula cuota excedida solo en la clave indicada, como haría el navegador real.
    if (this.claveQueFalla === key) throw new Error('QuotaExceededError');
    this.datos.set(key, value);
  }

  removeItem(key: string): void {
    this.datos.delete(key);
  }

  key(index: number): string | null {
    return Array.from(this.datos.keys())[index] ?? null;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe('StorageService', () => {
  it('guarda y recarga con debounce', () => {
    vi.useFakeTimers();
    const storage = new FakeStorage();
    const service = new StorageService(storage, 300);
    const state = createInitialState();

    service.save(state);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();

    // Aún no se cumple el debounce: no debe haber escritura.
    vi.advanceTimersByTime(299);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();

    vi.advanceTimersByTime(1);
    expect(service.load()).toEqual(state);
  });

  it('load devuelve el último estado antes del debounce', () => {
    const storage = new FakeStorage();
    const service = new StorageService(storage, 300);
    const state = createInitialState();

    service.save(state);
    expect(service.load()).toEqual(state);
  });

  it('respalda datos corruptos y empieza limpio', () => {
    const storage = new FakeStorage();
    storage.setItem(STORAGE_KEY, '{roto');
    const service = new StorageService(storage, 0);

    expect(service.load()).toBeNull();
    expect(storage.getItem(CORRUPT_KEY)).toBe('{roto');
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clear elimina solo las claves nubi:*', () => {
    const storage = new FakeStorage();
    storage.setItem(STORAGE_KEY, '{}');
    storage.setItem(CORRUPT_KEY, 'resto');
    storage.setItem('otra:clave', 'se conserva');
    const service = new StorageService(storage, 0);

    service.clear();

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem(CORRUPT_KEY)).toBeNull();
    expect(storage.getItem('otra:clave')).toBe('se conserva');
  });

  it('exporta e importa JSON válido', () => {
    const storage = new FakeStorage();
    const service = new StorageService(storage, 300);
    service.save(createInitialState());
    service.flush();

    const json = service.exportJson();
    expect(json).toContain('"schemaVersion": 1');

    const importado = service.importJson(json);
    expect(importado.ok).toBe(true);
    expect(importado.state).toEqual(createInitialState());
  });

  it('rechaza importaciones inválidas sin tocar el almacenamiento', () => {
    const storage = new FakeStorage();
    const service = new StorageService(storage, 0);
    service.save(createInitialState());
    service.flush();
    const antes = storage.getItem(STORAGE_KEY);

    const esquemaInvalido = service.importJson('{}');
    expect(esquemaInvalido.ok).toBe(false);
    expect(esquemaInvalido.error).toBeDefined();

    const textoRoto = service.importJson('{roto');
    expect(textoRoto.ok).toBe(false);

    expect(storage.getItem(STORAGE_KEY)).toBe(antes);
  });

  it('sin almacenamiento funciona en memoria', () => {
    const service = new StorageService(null);
    const state = createInitialState();

    expect(service.available).toBe(false);
    expect(() => {
      service.save(state);
      service.flush();
    }).not.toThrow();
    expect(service.load()).toEqual(state);
  });

  it('con cuota excedida sigue en memoria y marca no disponible', () => {
    const storage = new FakeStorage(STORAGE_KEY);
    const service = new StorageService(storage, 0);
    const state = createInitialState();

    service.save(state);
    expect(() => service.flush()).not.toThrow();
    expect(service.available).toBe(false);
    expect(service.load()).toEqual(state);
  });

  it('requestPersistence devuelve false sin navigator.storage', async () => {
    const service = new StorageService(new FakeStorage(), 0);
    await expect(service.requestPersistence()).resolves.toBe(false);
  });
});
