import { loadContent } from './content-loader';
import type { ContentData } from './content-loader';
import type { Chain, EvidenceRecord, GraphEdge, GraphNode, Isla } from '../../../content/schema';

export interface ContentRepository {
  readonly islands: readonly Isla[];
  readonly evidence: readonly EvidenceRecord[];
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly chains: readonly Chain[];
  islandBySlug(slug: string): Isla | undefined;
  islandById(id: string): Isla | undefined;
  evidenceById(id: string): EvidenceRecord | undefined;
  nodeById(id: string): GraphNode | undefined;
  edgeById(id: string): GraphEdge | undefined;
  chainById(id: string): Chain | undefined;
  availableIslands(): Isla[];
}

/** Indexa el contenido validado; las features consultan por id o slug. */
export const createContentRepository = (data: ContentData = loadContent()): ContentRepository => {
  const islandBySlug = new Map(data.islands.map((island) => [island.slug, island]));
  const islandById = new Map(data.islands.map((island) => [island.id, island]));
  const evidenceById = new Map(data.evidence.map((record) => [record.id, record]));
  const nodeById = new Map(data.nodes.map((node) => [node.id, node]));
  const edgeById = new Map(data.edges.map((edge) => [edge.id, edge]));
  const chainById = new Map(data.chains.map((chain) => [chain.id, chain]));

  return {
    islands: data.islands,
    evidence: data.evidence,
    nodes: data.nodes,
    edges: data.edges,
    chains: data.chains,
    islandBySlug: (slug) => islandBySlug.get(slug),
    islandById: (id) => islandById.get(id),
    evidenceById: (id) => evidenceById.get(id),
    nodeById: (id) => nodeById.get(id),
    edgeById: (id) => edgeById.get(id),
    chainById: (id) => chainById.get(id),
    // Copia ordenada para no exponer el array interno ni depender del orden del disco.
    availableIslands: () =>
      data.islands
        .filter((island) => island.disponibilidad === 'available')
        .sort((a, b) => (a.ordenSugerido ?? Number.MAX_SAFE_INTEGER) - (b.ordenSugerido ?? Number.MAX_SAFE_INTEGER)),
  };
};

export const content = createContentRepository();
