import type { Isla } from '../../../content/schema';

/** Snapshot mínimo del progreso; no acopla el dominio al esquema completo del store. */
export interface ProgressSnapshot {
  islands: Record<string, { stages: { sello: boolean } }>;
}

export interface IslandSeal {
  island: Isla;
  earned: boolean;
}

export const PASSPORT_SEALS = 6;

const bySuggestedOrder = (a: Isla, b: Isla): number =>
  (a.ordenSugerido ?? Number.MAX_SAFE_INTEGER) - (b.ordenSugerido ?? Number.MAX_SAFE_INTEGER);

/** Sellos de las islas jugables, en el orden de la ruta sugerida. */
export const deriveStamps = (progress: ProgressSnapshot, islands: Isla[]): IslandSeal[] =>
  islands
    .filter((island) => island.disponibilidad === 'available')
    .sort(bySuggestedOrder)
    .map((island) => ({
      island,
      earned: progress.islands[island.id]?.stages.sello === true,
    }));

export const sealCount = (progress: ProgressSnapshot, islands: Isla[]): number =>
  deriveStamps(progress, islands).filter((seal) => seal.earned).length;

export const hasPassport = (progress: ProgressSnapshot, islands: Isla[]): boolean => {
  const seals = deriveStamps(progress, islands);
  return seals.length >= PASSPORT_SEALS && seals.every((seal) => seal.earned);
};

/** Primera isla disponible sin sello; undefined si el pasaporte está completo. */
export const nextIsland = (progress: ProgressSnapshot, islands: Isla[]): Isla | undefined =>
  deriveStamps(progress, islands).find((seal) => !seal.earned)?.island;
