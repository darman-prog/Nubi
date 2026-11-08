import { z } from 'zod';

/** Fases del recorrido v0.1 (D-16); sustituyen a las 5 etapas del modelo anterior. */
export const STAGES = ['llegada', 'historia', 'retos', 'sello'] as const;
export type Stage = (typeof STAGES)[number];

export const SettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  reduceMotion: z.enum(['system', 'on', 'off']),
  textScale: z.union([z.literal(1), z.literal(1.25), z.literal(1.5)]),
  sound: z.boolean(),
});
export type Settings = z.infer<typeof SettingsSchema>;

// Solo fechas locales YYYY-MM-DD: evita horas y zonas horarias que rompen el diario.
const FechaLocalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const DiaryEntrySchema = z.object({
  date: FechaLocalSchema,
  bedtime: z.string().regex(/^\d{2}:\d{2}$/),
  wake: z.string().regex(/^\d{2}:\d{2}$/),
  mood: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  screensInBed: z.boolean().optional(),
  experimentTried: z.enum(['yes', 'some', 'no']).optional(),
});

const IslandProgressSchema = z.object({
  visitedAt: FechaLocalSchema.optional(),
  stages: z.object({
    llegada: z.boolean(),
    historia: z.boolean(),
    retos: z.boolean(),
    sello: z.boolean(),
  }),
  sourcesOpened: z.array(z.string()).default([]),
  mechanicsDone: z.array(z.string()).default([]),
});
export type IslandProgress = z.infer<typeof IslandProgressSchema>;

export const UserStateV1Schema = z.object({
  schemaVersion: z.literal(1),
  createdAt: FechaLocalSchema,
  profile: z.object({ nickname: z.string().max(20).optional() }),
  settings: SettingsSchema,
  progress: z.object({
    onboardingDone: z.boolean(),
    islands: z.record(IslandProgressSchema),
    chains: z.array(
      z.object({ chainId: z.string(), solvedAt: FechaLocalSchema }),
    ),
  }),
  challenges: z.array(z.object({ islandId: z.string(), acceptedAt: FechaLocalSchema })),
  experiments: z.array(
    z.object({ id: z.string(), startedAt: FechaLocalSchema, items: z.array(z.string()) }),
  ),
  diary: z.array(DiaryEntrySchema),
});
export type UserStateV1 = z.infer<typeof UserStateV1Schema>;

/** Fecha local en formato YYYY-MM-DD (sin zona horaria, doc 05 §5). */
export const fechaLocal = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  reduceMotion: 'system',
  textScale: 1,
  sound: false,
};

// Estado limpio y válido para primer arranque, importaciones fallidas o almacenamiento vacío.
export const createInitialState = (now = new Date()): UserStateV1 => ({
  schemaVersion: 1,
  createdAt: fechaLocal(now),
  profile: {},
  settings: { ...DEFAULT_SETTINGS },
  progress: { onboardingDone: false, islands: {}, chains: [] },
  challenges: [],
  experiments: [],
  diary: [],
});
