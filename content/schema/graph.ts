import { z } from 'zod';
import { EvidenceLevelSchema } from './common';

export const GraphNodeSchema = z.object({
  id: z.string().regex(/^N-[A-Z-]+$/),
  label: z.string().min(1),
  islandId: z.string().regex(/^ISL-[A-Z]+$/),
});
export type GraphNode = z.infer<typeof GraphNodeSchema>;

export const GraphEdgeSchema = z.object({
  // Los puentes usan dos dígitos para mantener el orden estable en el grafo.
  id: z.string().regex(/^B-\d{2}$/),
  from: z.string(),
  to: z.string(),
  status: z.enum(['published', 'pending']),
  level: EvidenceLevelSchema.optional(),
  evidenceIds: z.array(z.string()).default([]),
  explanation: z.string().min(1),
  honestLabel: z.string().min(1),
});
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;

export const ChainSchema = z.object({
  id: z.string().regex(/^C-\d{2}$/),
  title: z.string().min(1),
  mode: z.enum(['guided', 'free']),
  start: z.string(),
  end: z.string(),
  solution: z.array(z.string()).min(2),
  distractors: z.array(z.string()).default([]),
  isIntegratedHypothesis: z.boolean().optional(),
});
export type Chain = z.infer<typeof ChainSchema>;
