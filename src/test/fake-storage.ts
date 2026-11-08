import type { StorageLike } from '@/core/storage';

/** Almacenamiento falso en memoria para pruebas de servicios. */
export class FakeStorage implements StorageLike {
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
