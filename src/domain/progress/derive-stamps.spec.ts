import { describe, expect, it } from 'vitest';
import type { Isla } from '../../../content/schema';
import {
  PASSPORT_SEALS,
  deriveStamps,
  hasPassport,
  nextIsland,
  sealCount,
} from './derive-stamps';
import type { ProgressSnapshot } from './derive-stamps';

const island = (id: string, order: number, available = true): Isla => ({
  id,
  slug: id.toLowerCase(),
  zona: 1,
  nombre: id,
  subtitulo: 'Prueba',
  disponibilidad: available ? 'available' : 'coming_soon',
  posicion: { x: 50, y: 50 },
  ordenSugerido: order,
  puentes: [],
  fuentes: [],
});

const islands = [
  island('ISL-A', 1),
  island('ISL-B', 2),
  island('ISL-C', 3),
  island('ISL-D', 4),
  island('ISL-E', 5),
  island('ISL-F', 6),
  island('ISL-FOG', 7, false),
];

const progressWith = (earned: string[]): ProgressSnapshot => ({
  islands: Object.fromEntries(
    earned.map((id) => [id, { stages: { sello: true } }]),
  ),
});

describe('deriveStamps', () => {
  it('solo incluye islas disponibles y las ordena por ruta', () => {
    const seals = deriveStamps(progressWith([]), islands);

    expect(seals).toHaveLength(PASSPORT_SEALS);
    expect(seals.map((seal) => seal.island.id)).toEqual([
      'ISL-A',
      'ISL-B',
      'ISL-C',
      'ISL-D',
      'ISL-E',
      'ISL-F',
    ]);
  });

  it('cuenta solo los sellos ganados', () => {
    const progress = progressWith(['ISL-A', 'ISL-C']);

    expect(sealCount(progress, islands)).toBe(2);
    expect(deriveStamps(progress, islands)[0]?.earned).toBe(true);
    expect(deriveStamps(progress, islands)[1]?.earned).toBe(false);
  });

  it('completa el pasaporte solo con los seis sellos', () => {
    expect(hasPassport(progressWith(['ISL-A', 'ISL-B']), islands)).toBe(false);
    expect(hasPassport(progressWith(['ISL-A', 'ISL-B', 'ISL-C', 'ISL-D', 'ISL-E', 'ISL-F']), islands)).toBe(true);
  });

  it('propone la primera isla sin sello', () => {
    expect(nextIsland(progressWith(['ISL-A', 'ISL-B']), islands)?.id).toBe('ISL-C');
    expect(nextIsland(progressWith(['ISL-A', 'ISL-B', 'ISL-C', 'ISL-D', 'ISL-E', 'ISL-F']), islands)).toBeUndefined();
  });
});
