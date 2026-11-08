import type { EvidenceLevel } from '../../../content/schema';

const RANK: Record<EvidenceLevel, number> = { E1: 1, E2: 2, E3: 3 };

/** Devuelve el nivel más débil de una lista; undefined si está vacía. */
export const weakestLevel = (levels: EvidenceLevel[]): EvidenceLevel | undefined =>
  levels.reduce<EvidenceLevel | undefined>(
    (weakest, level) => (!weakest || RANK[level] < RANK[weakest] ? level : weakest),
    undefined,
  );
