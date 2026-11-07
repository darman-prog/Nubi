import { z } from 'zod';

/** Niveles de evidencia del doc 02 §2. */
export const EvidenceLevelSchema = z.enum(['E1', 'E2', 'E3']);
export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;

/** Estados de revisión del doc 02 §3. */
export const ReviewStatusSchema = z.enum(['draft', 'source_verified', 'professional_reviewed']);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const ZonaSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);
export type Zona = z.infer<typeof ZonaSchema>;

/** Límites editoriales del doc 02 §1. */
export const MAX_PALABRAS_ESCENA = 45;
export const MAX_CARACTERES_NUBI = 140;

export const contarPalabras = (texto: string): number =>
  texto.trim().split(/\s+/).filter(Boolean).length;

export const TextoEscenaSchema = z
  .string()
  .min(1)
  .refine((texto) => contarPalabras(texto) <= MAX_PALABRAS_ESCENA, {
    message: `Supera ${MAX_PALABRAS_ESCENA} palabras`,
  });
