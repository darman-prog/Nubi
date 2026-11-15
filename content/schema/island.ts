import { z } from 'zod';
import { TextoEscenaSchema, ZonaSchema } from './common';

export const EscenaSchema = z.object({
  // El id incluye la isla para que sea único incluso al mezclar contenidos.
  id: z.string().regex(/^ESC-[A-Z]+-\d+$/),
  acto: z.enum(['sintoma', 'causa', 'efecto', 'cierre']),
  texto: TextoEscenaSchema,
  alt: z.string().min(1),
  isHealthClaim: z.boolean(),
  // Marca las analogías y síntesis didácticas para etiquetarlas en la interfaz.
  isSimplified: z.boolean().optional(),
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

export const MitoItemSchema = z.object({
  id: z.string().regex(/^MR-\d{2}$/),
  afirmacion: z.string().min(1),
  veredicto: z.enum(['mito', 'realidad', 'depende']),
  explicacion: z.string().min(1),
  isHealthClaim: z.boolean(),
  evidenceId: z.string().optional(),
});
export type MitoItem = z.infer<typeof MitoItemSchema>;

export const DetectiveEstudiosSchema = z.object({
  titulo: z.string().min(1),
  estudios: z
    .array(
      z.object({
        id: z.string().min(1),
        nombre: z.string().min(1),
        participantes: z.string().min(1),
        duracion: z.string().min(1),
        queMidieron: z.string().min(1),
        huboEfecto: z.boolean(),
        evidenceId: z.string(),
      }),
    )
    .min(3)
    .max(4),
  variablesDiferencia: z
    .array(
      z.object({
        id: z.string().min(1),
        texto: z.string().min(1),
        esClave: z.boolean(),
      }),
    )
    .min(2)
    .max(4),
  hipotesisPlausible: z.string().min(1),
  evidenceId: z.string(),
});
export type DetectiveEstudios = z.infer<typeof DetectiveEstudiosSchema>;

export const ExperimentoTallerSchema = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  detalle: z.string().min(1),
  evidenceId: z.string(),
});

export const ExperimentosSchema = z.object({
  maxSeleccion: z.number().int().min(1).max(3),
  opciones: z.array(ExperimentoTallerSchema).min(3).max(6),
});
export type Experimentos = z.infer<typeof ExperimentosSchema>;

export const RespiracionSchema = z.object({
  titulo: z.string().min(1),
  duracionesMin: z.array(z.number().int().min(1).max(5)).min(1).max(3),
  inhalaSeg: z.number().int().min(2).max(8),
  sostieneSeg: z.number().int().min(0).max(6),
  exhalaSeg: z.number().int().min(2).max(10),
  evidenceId: z.string(),
});
export type Respiracion = z.infer<typeof RespiracionSchema>;

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
  miniQuiz: z.array(PreguntaSchema).min(2).max(5).optional(),
  mitosRealidad: z.array(MitoItemSchema).min(1).max(5).optional(),
  detectiveEstudios: DetectiveEstudiosSchema.optional(),
  experimentos: ExperimentosSchema.optional(),
  respiracion: RespiracionSchema.optional(),
  reto: RetoSchema.optional(),
  puentes: z.array(z.string().regex(/^B-\d{2}$/)).default([]),
  fuentes: z.array(z.string()).default([]),
});
export type Isla = z.infer<typeof IslaSchema>;
