import {
  ChainSchema,
  EvidenceRecordSchema,
  GraphEdgeSchema,
  GraphNodeSchema,
  IslaSchema,
} from '../../../content/schema';
import type { Chain, EvidenceRecord, GraphEdge, GraphNode, Isla } from '../../../content/schema';

// Contrato mínimo de un esquema Zod ya validado; evita acoplar el loader a Zod.
interface Schema<T> {
  safeParse: (value: unknown) =>
    | { success: true; data: T }
    | { success: false; error: { issues: Array<{ path: Array<string | number>; message: string }> } };
}

export interface ContentData {
  islands: Isla[];
  evidence: EvidenceRecord[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  chains: Chain[];
}

import evidenceJson from '../../../content/evidence/evidence.json';
import nodesJson from '../../../content/graph/nodes.json';
import edgesJson from '../../../content/graph/edges.json';
import chainsJson from '../../../content/graph/chains.json';

// Vite convierte el glob en imports estáticos; si un JSON no cumple el esquema,
// el error aparece al arrancar y no se renderiza contenido a medias.
const islandModules = import.meta.glob('../../../content/islands/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

const parse = <T>(schema: Schema<T>, value: unknown, label: string): T => {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const detail = result.error.issues
    .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
    .join('; ');
  throw new Error(`Contenido inválido en ${label}: ${detail}`);
};

const parseCollection = <T>(schema: Schema<T>, values: unknown[], label: string): T[] =>
  values.map((value, index) => parse(schema, value, `${label}[${index}]`));

/** Carga y valida el contenido una sola vez; el build ya lo comprobó. */
export const loadContent = (): ContentData => ({
  islands: Object.entries(islandModules).map(([file, value]) =>
    parse(IslaSchema, value, file),
  ),
  evidence: parseCollection(EvidenceRecordSchema, evidenceJson, 'evidence'),
  nodes: parseCollection(GraphNodeSchema, nodesJson, 'nodes'),
  edges: parseCollection(GraphEdgeSchema, edgesJson, 'edges'),
  chains: parseCollection(ChainSchema, chainsJson, 'chains'),
});
