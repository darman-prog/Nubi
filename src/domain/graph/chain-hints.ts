import type { EvidenceLevel, GraphEdge } from '../../../content/schema';

/** Busca el camino válido más corto que comienza exactamente con el prefijo actual. */
export function findMatchingPath(path: string[], validPaths: string[][]): string[] | undefined {
  const matches = validPaths.filter(
    (candidate) =>
      candidate.length >= path.length && path.every((nodeId, idx) => candidate[idx] === nodeId),
  );
  if (matches.length === 0) return undefined;
  return matches.reduce((shortest, candidate) =>
    candidate.length < shortest.length ? candidate : shortest,
  );
}

/** Genera una pista progresiva (niveles 1 a 3) sin revelar la pieza hasta el nivel 3. */
export function getChainHint(
  level: 1 | 2 | 3,
  path: string[],
  validPaths: string[][],
  edges: readonly GraphEdge[],
  nodeLabel: (id: string) => string,
): string {
  const targetPath = findMatchingPath(path, validPaths);
  if (!targetPath || path.length >= targetPath.length) {
    return 'Si este tramo no avanza hacia la meta, prueba deshacer el último paso.';
  }

  const remaining = targetPath.length - path.length;
  if (level === 1) {
    return `Pista 1 de 3: Desde aquí faltan ${remaining} ${remaining === 1 ? 'conexión' : 'conexiones'} para llegar a la meta.`;
  }

  const current = path[path.length - 1];
  const nextId = targetPath[path.length];
  if (level === 2) {
    const edge = edges.find(
      (candidate) =>
        candidate.status === 'published' && candidate.from === current && candidate.to === nextId,
    );
    if (edge?.explanation) {
      return `Pista 2 de 3: Busca la pieza que explica esto: «${edge.explanation}»`;
    }
    return 'Pista 2 de 3: Piensa qué consecuencia directa produce el último nodo de tu cadena.';
  }

  return `Pista 3 de 3: Prueba conectar «${nodeLabel(nextId)}» como siguiente paso.`;
}

/** Traduce el nivel del eslabón más débil a un texto comprensible para adolescentes. */
export function describeWeakestLevel(level: EvidenceLevel | undefined): string {
  if (level === 'E3') return 'E3 · Evidencia sólida en toda la cadena';
  if (level === 'E2') return 'E2 · Evidencia moderada en el eslabón más débil';
  if (level === 'E1') return 'E1 · Incluye un eslabón preliminar o hipótesis';
  return 'Sin calificación de evidencia';
}
