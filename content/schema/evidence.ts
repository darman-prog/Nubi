import { z } from 'zod';
import {
  EvidenceLevelSchema,
  ReviewStatusSchema,
  TextoEscenaSchema,
} from './common';

export const EvidenceRecordSchema = z.object({
  // El sufijo opcional permite variantes de una misma ficha (EV-021a).
  id: z.string().regex(/^EV-\d{3}[a-z]?$/, 'ID de evidencia inválido (EV-000)'),
  claimTechnical: z.string().min(1),
  claimTeen: TextoEscenaSchema,
  source: z.object({
    citation: z.string().min(1),
    url: z.string().url().optional(),
    sourceType: z.enum([
      'estudio',
      'revision',
      'posicion-oficial',
      'fuente-clinica',
      'dato-vigilancia',
    ]),
  }),
  population: z.string().min(1),
  design: z.string().min(1),
  finding: z.string().min(1),
  limitations: z.string().min(1),
  level: EvidenceLevelSchema,
  geography: z.enum(['EE.UU.', 'Colombia', 'n/d']),
  usedIn: z.array(z.string()).default([]),
  restricted: z.boolean(),
  status: ReviewStatusSchema,
  verifiedBy: z.string().optional(),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;
