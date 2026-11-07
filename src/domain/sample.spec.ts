import { describe, it, expect } from 'vitest';

// Verificamos que el entorno de pruebas unitarias puras funcione sin dependencias de UI
describe('Pruebas iniciales de dominio (T-00)', () => {
  it('debe ejecutar aserciones básicas correctamente', () => {
    const suma = (a: number, b: number): number => a + b;
    expect(suma(2, 3)).toBe(5);
  });
});
