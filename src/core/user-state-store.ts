import { StorageService } from './storage';
import type { ImportResult } from './storage';
import { createInitialState } from './user-state';
import type { UserStateV1 } from './user-state';

type Listener = () => void;

/**
 * Fuente única del estado del viaje. Mantiene el estado en memoria, lo persiste
 * con debounce a través de StorageService y notifica a los suscriptores.
 */
export class UserStateStore {
  private state: UserStateV1;
  private readonly listeners = new Set<Listener>();

  constructor(
    private readonly storage: StorageService,
    initial?: UserStateV1,
  ) {
    this.state = initial ?? storage.load() ?? createInitialState();
  }

  get available(): boolean {
    return this.storage.available;
  }

  // Arrow para que useSyncExternalStore reciba una referencia estable.
  getState = (): UserStateV1 => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  update = (updater: (state: UserStateV1) => UserStateV1): void => {
    const next = updater(this.state);
    // Evita renders y escrituras si el cambio no produjo un estado nuevo.
    if (next === this.state) return;
    this.state = next;
    this.storage.save(next);
    this.emit();
  };

  /** Reemplaza el estado completo tras una importación ya validada. */
  replace = (state: UserStateV1): void => {
    this.state = state;
    this.storage.save(state);
    this.emit();
  };

  /** Borra las claves de Nubi y vuelve al estado inicial. */
  reset = (): void => {
    this.storage.clear();
    this.state = createInitialState();
    this.storage.save(this.state);
    this.emit();
  };

  exportJson = (): string => JSON.stringify(this.state, null, 2);

  importJson = (text: string): ImportResult => this.storage.importJson(text);

  requestPersistence = (): Promise<boolean> => this.storage.requestPersistence();

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}
