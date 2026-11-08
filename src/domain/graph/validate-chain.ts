import type { EvidenceLevel, GraphEdge } from '../../../content/schema';
import { weakestLevel } from '../evidence/levels';

export interface LinkResult {
  from: string;
  to: string;
  valid: boolean;
  edgeId?: string;
  level?: EvidenceLevel;
}

export interface ChainResult {
  status: 'correct' | 'partial' | 'incorrect';
  links: LinkResult[];
  weakest?: EvidenceLevel;
}

/**
 * Compara una secuencia de nodos con los puentes publicados. Las aristas
 * pendientes nunca cuentan como válidas.
 */
export const validateChain = (nodeIds: string[], edges: GraphEdge[]): ChainResult => {
  if (nodeIds.length < 2) return { status: 'incorrect', links: [] };

  const published = edges.filter((edge) => edge.status === 'published');
  const links = nodeIds.slice(0, -1).map((from, index) => {
    const to = nodeIds[index + 1];
    const edge = published.find((candidate) => candidate.from === from && candidate.to === to);
    return { from, to, valid: Boolean(edge), edgeId: edge?.id, level: edge?.level };
  });

  const validCount = links.filter((link) => link.valid).length;
  const status =
    validCount === links.length ? 'correct' : validCount === 0 ? 'incorrect' : 'partial';
  const levels = links
    .filter((link) => link.valid && link.level)
    .map((link) => link.level as EvidenceLevel);

  return { status, links, weakest: weakestLevel(levels) };
};
