import type { GraphEdge } from '../../../content/schema';

/**
 * Devuelve todos los caminos simples entre dos nodos usando solo puentes
 * publicados. Evita ciclos y respeta el máximo de nodos del camino.
 */
export const findPaths = (
  start: string,
  end: string,
  edges: GraphEdge[],
  maxLen = 6,
): string[][] => {
  const published = edges.filter((edge) => edge.status === 'published');
  const paths: string[][] = [];

  const visit = (node: string, path: string[]): void => {
    if (path.length > maxLen) return;
    if (node === end) {
      paths.push(path);
      return;
    }
    for (const edge of published.filter((candidate) => candidate.from === node)) {
      // Un nodo repetido indicaría un ciclo; se descarta esa rama.
      if (path.includes(edge.to)) continue;
      visit(edge.to, [...path, edge.to]);
    }
  };

  visit(start, [start]);
  return paths;
};
