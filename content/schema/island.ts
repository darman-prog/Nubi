import { z } from 'zod';
import { TextoEscenaSchema, ZonaSchema } from './common';

export const EscenaSchema = z.object({
  // El id incluye la isla para que sea único incluso al mezclar contenidos.
  id: z.string().regex(/^ESC-[A-Z]+-\d+$/),
  acto: z.enum(['sintoma', 'causa', 'efecto', 'cierre']),
  texto: TextoEscenaSchema,
  alt: z.string().min(1),
  isHealthClaim: z.boolean(),
  evidenceId: z.string().optional(),
  ilustracion: z.string().optional(),
});
export type Escena = z.infer<typeof EscenaSchema>;

export const OpcionSchema = z.object({
  id: z.string().min(1),
  texto: z.string().min(1),
  correcta: z.boolean(),
});

export const PreguntaSchema = z.object({
  id: z.string().regex(/^PR-\d+$/),
  enunciado: z.string().min(1),
  opciones: z.array(OpcionSchema).min(2).max(4),
  explicacion: z.string().min(1),
  isHealthClaim: z.boolean(),
  evidenceId: z.string().optional(),
});
export type Pregunta = z.infer<typeof PreguntaSchema>;

export const RetoSchema = z.object({
  chainId: z.string().regex(/^C-\d{2}$/),
  titulo: z.string().min(1),
  huecos: z.number().int().min(1).max(3),
});
export type Reto = z.infer<typeof RetoSchema>;

export const IslaSchema = z.object({
  id: z.string().regex(/^ISL-[A-Z]+$/),
  slug: z.string().regex(/^[a-z-]+$/),
  zona: ZonaSchema,
  nombre: z.string().min(1),
  subtitulo: z.string().min(1),
  disponibilidad: z.enum(['available', 'coming_soon']),
  posicion: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }),
  ordenSugerido: z.number().int().optional(),
  llegada: z.array(z.string().min(1)).min(2).max(3).optional(),
  historia: z.array(EscenaSchema).min(3).max(6).optional(),
  pregunta: PreguntaSchema.optional(),
  reto: RetoSchema.optional(),
  puentes: z.array(z.string().regex(/^B-\d{2}$/)).default([]),
  fuentes: z.array(z.string()).default([]),
});
export type Isla = z.infer<typeof IslaSchema>;
