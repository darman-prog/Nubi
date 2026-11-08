import { UserStateV1Schema, createInitialState } from './user-state';
import type { UserStateV1 } from './user-state';

export const STORAGE_KEY = 'nubi:v1';
export const CORRUPT_KEY = 'nubi:v1:corrupt';
// Prefijo reservado para poder limpiar todo lo que pertenece a Nubi sin tocar otras apps.
const PREFIX = 'nubi:';

export interface StorageLike {
  readonly length: number;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
}

export interface ImportResult {
  ok: boolean;
  error?: string;
  state?: UserStateV1;
}

const obtenerAlmacenamiento = (): StorageLike | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storage = window.localStorage;
    // Sondeo: en modo privado algunas plataformas lanzan al escribir.
    const probe = '__nubi_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
};

/**
 * Persistencia local del viaje. Si el almacenamiento falla, mantiene el estado
 * en memoria (available=false) para no romper la sesión.
 */
export class StorageService {
  private readonly storage: StorageLike | null;
  private readonly debounceMs: number;
  private memory: UserStateV1 | null = null;
  private pending: UserStateV1 | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private usable: boolean;

  constructor(storage: StorageLike | null = obtenerAlmacenamiento(), debounceMs = 300) {
    this.storage = storage;
    this.debounceMs = debounceMs;
    this.usable = storage !== null;
  }

  get available(): boolean {
    return this.usable;
  }

  load(): UserStateV1 | null {
    // Si hay un guardado en vuelo, esa es la versión más reciente.
    const reciente = this.pending ?? this.memory;
    if (reciente) return reciente;
    if (!this.storage || !this.usable) return this.memory;
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      const result = UserStateV1Schema.safeParse(parsed);
      if (!result.success) throw new Error('esquema inválido');
      return result.data;
    } catch {
      // Respaldo antes de limpiar para no perder datos recuperables.
      try {
        this.storage.setItem(CORRUPT_KEY, raw);
        this.storage.removeItem(STORAGE_KEY);
      } catch {
        this.usable = false;
      }
      return null;
    }
  }

  save(state: UserStateV1): void {
    this.memory = state;
    this.pending = state;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.debounceMs);
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const state = this.pending ?? this.memory;
    this.pending = null;
    if (!state) return;
    if (!this.storage || !this.usable) {
      this.memory = state;
      return;
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Cuota excedida u otro fallo: seguimos en memoria para no perder la sesión.
      this.usable = false;
      this.memory = state;
    }
  }

  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pending = null;
    this.memory = null;
    if (!this.storage) return;
    try {
      const keys: string[] = [];
      for (let i = 0; i < this.storage.length; i += 1) {
        const key = this.storage.key(i);
        if (key && key.startsWith(PREFIX)) keys.push(key);
      }
      keys.forEach((key) => this.storage?.removeItem(key));
    } catch {
      this.usable = false;
    }
  }

  exportJson(): string {
    const state = this.load() ?? this.memory ?? createInitialState();
    return JSON.stringify(state, null, 2);
  }

  importJson(text: string): ImportResult {
    try {
      const parsed: unknown = JSON.parse(text);
      const result = UserStateV1Schema.safeParse(parsed);
      if (!result.success) {
        return { ok: false, error: 'El archivo no tiene un formato válido.' };
      }
      return { ok: true, state: result.data };
    } catch {
      return { ok: false, error: 'El archivo no es un JSON válido.' };
    }
  }

  async requestPersistence(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }
}
