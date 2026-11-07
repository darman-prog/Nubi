import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ChainSchema,
  EvidenceRecordSchema,
  GraphEdgeSchema,
  GraphNodeSchema,
  IslaSchema,
  MAX_CARACTERES_NUBI,
  MAX_PALABRAS_ESCENA,
  contarPalabras,
} from '../content/schema';
import type {
  Chain,
  EvidenceLevel,
  EvidenceRecord,
  GraphEdge,
  GraphNode,
  Isla,
  ReviewStatus,
} from '../content/schema';

export type ContentGate = 'dev' | 'pilot' | 'prod';

export interface ContentData {
  evidence: EvidenceRecord[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  chains: Chain[];
  islands: Isla[];
}

export interface ValidationOptions {
  gate?: ContentGate;
}

export interface ValidationResult {
  errors: string[];
}

const RANK_EVIDENCIA: Record<EvidenceLevel, number> = { E1: 1, E2: 2, E3: 3 };
const RANK_ESTADO: Record<ReviewStatus, number> = {
  draft: 0,
  source_verified: 1,
  professional_reviewed: 2,
};
const MINIMO_POR_COMPUERTA: Record<ContentGate, number> = { dev: 0, pilot: 1, prod: 2 };

/** Lista del doc 02 §1; ampliable con revisión manual. */
const PALABRAS_PROHIBIDAS = [
  'demostrado',
  'peligroso',
  'adicción',
  'adiccion',
  'enfermedad',
  'trastorno',
  'siempre',
  'nunca',
  'causa',
];

const leerJson = <T>(ruta: string): T => JSON.parse(fs.readFileSync(ruta, 'utf-8')) as T;

const duplicados = (ids: string[], etiqueta: string): string[] => {
  const vistos = new Set<string>();
  const errores: string[] = [];
  for (const id of ids) {
    if (vistos.has(id)) errores.push(`${etiqueta}: ID duplicado ${id}`);
    vistos.add(id);
  }
  return errores;
};

const contarCaracteres = (texto: string): number => texto.trim().length;

const revisarPalabras = (texto: string, ubicacion: string): string[] =>
  PALABRAS_PROHIBIDAS.filter((palabra) =>
    new RegExp(`\\b${palabra}\\b`, 'iu').test(texto),
  ).map((palabra) => `${ubicacion}: palabra prohibida "${palabra}"`);

/** Valida la coherencia del contenido sin tocar el disco (permite pruebas con fixtures). */
export const validateContent = (
  data: ContentData,
  options: ValidationOptions = {},
): ValidationResult => {
  const gate = options.gate ?? 'dev';
  const errors: string[] = [];

  const evidenciaPorId = new Map(data.evidence.map((item) => [item.id, item]));
  const nodoPorId = new Map(data.nodes.map((item) => [item.id, item]));
  const cadenaPorId = new Map(data.chains.map((item) => [item.id, item]));
  const islaPorId = new Map(data.islands.map((item) => [item.id, item]));

  const idsEvidencia = data.evidence.map((item) => item.id);
  const idsNodos = data.nodes.map((item) => item.id);
  const idsAristas = data.edges.map((item) => item.id);
  const idsCadenas = data.chains.map((item) => item.id);
  const idsIslas = data.islands.map((item) => item.id);

  errors.push(...duplicados(idsEvidencia, 'evidencia'));
  errors.push(...duplicados(idsNodos, 'nodos'));
  errors.push(...duplicados(idsAristas, 'puentes'));
  errors.push(...duplicados(idsCadenas, 'cadenas'));
  errors.push(...duplicados(idsIslas, 'islas'));

  for (const item of data.evidence) {
    if (RANK_ESTADO[item.status] < MINIMO_POR_COMPUERTA[gate]) {
      errors.push(`evidencia ${item.id}: estado ${item.status} no cumple la compuerta ${gate}`);
    }
    if (contarPalabras(item.claimTeen) > MAX_PALABRAS_ESCENA) {
      errors.push(`evidencia ${item.id}: claimTeen supera ${MAX_PALABRAS_ESCENA} palabras`);
    }
    errors.push(...revisarPalabras(item.claimTeen, `evidencia ${item.id}`));
  }

  for (const nodo of data.nodes) {
    if (!islaPorId.has(nodo.islandId)) {
      errors.push(`nodo ${nodo.id}: isla inexistente ${nodo.islandId}`);
    }
  }

  for (const arista of data.edges) {
    if (!nodoPorId.has(arista.from) || !nodoPorId.has(arista.to)) {
      errors.push(`puente ${arista.id}: nodo inexistente (${arista.from} → ${arista.to})`);
    }
    if (arista.status === 'published') {
      if (!arista.level) {
        errors.push(`puente ${arista.id}: publicado sin nivel de evidencia`);
      }
      if (arista.evidenceIds.length === 0) {
        errors.push(`puente ${arista.id}: publicado sin ficha de evidencia`);
      }
      const fichas = arista.evidenceIds
        .map((id) => evidenciaPorId.get(id))
        .filter((ficha): ficha is EvidenceRecord => Boolean(ficha));
      if (fichas.length !== arista.evidenceIds.length) {
        errors.push(`puente ${arista.id}: referencia a ficha inexistente`);
      }
      if (fichas.some((ficha) => ficha.restricted)) {
        errors.push(`puente ${arista.id}: usa una ficha restringida`);
      }
      // El nivel del puente no puede sonar más fuerte que su ficha más débil.
      if (arista.level && fichas.length > 0) {
        const masDebil = fichas.reduce((min, ficha) =>
          RANK_EVIDENCIA[ficha.level] < RANK_EVIDENCIA[min.level] ? ficha : min,
        );
        if (RANK_EVIDENCIA[arista.level] > RANK_EVIDENCIA[masDebil.level]) {
          errors.push(
            `puente ${arista.id}: nivel ${arista.level} supera al de su ficha más débil (${masDebil.level})`,
          );
        }
      }
    }
  }

  for (const cadena of data.chains) {
    if (cadena.solution[0] !== cadena.start || cadena.solution.at(-1) !== cadena.end) {
      errors.push(`cadena ${cadena.id}: start/end no coinciden con la solución`);
    }
    for (let i = 0; i < cadena.solution.length - 1; i += 1) {
      const desde = cadena.solution[i];
      const hasta = cadena.solution[i + 1];
      const arista = data.edges.find(
        (edge) => edge.from === desde && edge.to === hasta && edge.status === 'published',
      );
      if (!arista) {
        // Distinguimos un puente pendiente de un salto que no existe en el grafo.
        const pendiente = data.edges.find(
          (edge) => edge.from === desde && edge.to === hasta && edge.status === 'pending',
        );
        if (pendiente) {
          errors.push(`cadena ${cadena.id}: usa un puente pendiente (${pendiente.id})`);
        } else {
          errors.push(`cadena ${cadena.id}: salto inválido ${desde} → ${hasta}`);
        }
      }
    }
    for (const distractor of cadena.distractors) {
      if (!nodoPorId.has(distractor)) {
        errors.push(`cadena ${cadena.id}: distractor inexistente ${distractor}`);
      }
    }
  }

  for (const isla of data.islands) {
    for (const puente of isla.puentes) {
      const arista = data.edges.find((edge) => edge.id === puente);
      if (!arista) {
        errors.push(`isla ${isla.id}: puente inexistente ${puente}`);
      } else if (arista.status === 'pending') {
        errors.push(`isla ${isla.id}: referencia un puente pendiente (${puente})`);
      }
    }
    for (const fuente of isla.fuentes) {
      if (!evidenciaPorId.has(fuente)) {
        errors.push(`isla ${isla.id}: fuente inexistente ${fuente}`);
      }
    }
  }

  for (const isla of data.islands) {
    const disponible = isla.disponibilidad === 'available';
    if (disponible && isla.zona > 0) {
      if (!isla.historia || isla.historia.length < 3) {
        errors.push(`isla ${isla.id}: disponible sin historia (mínimo 3 escenas)`);
      }
      if (!isla.pregunta) errors.push(`isla ${isla.id}: disponible sin pregunta`);
      if (!isla.reto) errors.push(`isla ${isla.id}: disponible sin reto`);
    }
    if (isla.llegada) {
      for (const frase of isla.llegada) {
        if (contarCaracteres(frase) > MAX_CARACTERES_NUBI) {
          errors.push(`isla ${isla.id}: frase de llegada supera ${MAX_CARACTERES_NUBI} caracteres`);
        }
        errors.push(...revisarPalabras(frase, `isla ${isla.id} llegada`));
      }
    }
    for (const escena of isla.historia ?? []) {
      if (contarPalabras(escena.texto) > MAX_PALABRAS_ESCENA) {
        errors.push(`escena ${escena.id}: supera ${MAX_PALABRAS_ESCENA} palabras`);
      }
      if (escena.isHealthClaim) {
        if (!escena.evidenceId) {
          errors.push(`escena ${escena.id}: afirmación de salud sin ficha`);
        } else {
          const ficha = evidenciaPorId.get(escena.evidenceId);
          if (!ficha) errors.push(`escena ${escena.id}: ficha inexistente ${escena.evidenceId}`);
          else if (ficha.restricted) {
            errors.push(`escena ${escena.id}: usa una ficha restringida`);
          }
        }
      }
      errors.push(...revisarPalabras(escena.texto, `escena ${escena.id}`));
    }
    if (isla.pregunta) {
      if (isla.pregunta.isHealthClaim && !isla.pregunta.evidenceId) {
        errors.push(`pregunta ${isla.pregunta.id}: afirmación de salud sin ficha`);
      }
      if (isla.pregunta.evidenceId) {
        const ficha = evidenciaPorId.get(isla.pregunta.evidenceId);
        if (!ficha) {
          errors.push(`pregunta ${isla.pregunta.id}: ficha inexistente ${isla.pregunta.evidenceId}`);
        } else if (ficha.restricted) {
          errors.push(`pregunta ${isla.pregunta.id}: usa una ficha restringida`);
        }
      }
      errors.push(...revisarPalabras(isla.pregunta.enunciado, `pregunta ${isla.pregunta.id}`));
      errors.push(...revisarPalabras(isla.pregunta.explicacion, `pregunta ${isla.pregunta.id}`));
      const correctas = isla.pregunta.opciones.filter((opcion) => opcion.correcta).length;
      if (correctas !== 1) {
        errors.push(`pregunta ${isla.pregunta.id}: debe tener exactamente una opción correcta`);
      }
    }
    if (isla.reto && !cadenaPorId.has(isla.reto.chainId)) {
      errors.push(`isla ${isla.id}: reto apunta a cadena inexistente ${isla.reto.chainId}`);
    }
  }

  return { errors };
};

/** Resultado mínimo que necesita el cargador para no depender del tipo interno de Zod. */
type ResultadoParseo<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Array<{ path: Array<string | number>; message: string }> } };

interface EsquemaParseable<T> {
  safeParse: (valor: unknown) => ResultadoParseo<T>;
}

/** Carga el contenido del disco y valida cada colección con Zod antes de cruzar reglas. */
export const validateContentFromDisk = (
  rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  options: ValidationOptions = {},
): ValidationResult => {
  const contentDir = path.join(rootDir, 'content');
  const errors: string[] = [];

  const cargar = <T>(ruta: string, schema: EsquemaParseable<T>): T[] => {
    if (!fs.existsSync(ruta)) {
      errors.push(`falta el archivo ${path.relative(rootDir, ruta)}`);
      return [];
    }
    const crudo = leerJson<unknown>(ruta);
    if (!Array.isArray(crudo)) {
      errors.push(`${path.relative(rootDir, ruta)}: se esperaba un array`);
      return [];
    }
    const resultado: T[] = [];
    crudo.forEach((item, indice) => {
      const parsed = schema.safeParse(item);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.push(
            `${path.relative(rootDir, ruta)}[${indice}].${issue.path.join('.')}: ${issue.message}`,
          );
        }
        return;
      }
      resultado.push(parsed.data);
    });
    return resultado;
  };

  const evidence = cargar(path.join(contentDir, 'evidence/evidence.json'), EvidenceRecordSchema);
  const nodes = cargar(path.join(contentDir, 'graph/nodes.json'), GraphNodeSchema);
  const edges = cargar(path.join(contentDir, 'graph/edges.json'), GraphEdgeSchema);
  const chains = cargar(path.join(contentDir, 'graph/chains.json'), ChainSchema);

  // Cada isla vive en su propio archivo, no en un array como el resto de colecciones.
  const cargarIsla = (ruta: string): Isla | undefined => {
    if (!fs.existsSync(ruta)) {
      errors.push(`falta el archivo ${path.relative(rootDir, ruta)}`);
      return undefined;
    }
    const parsed = IslaSchema.safeParse(leerJson<unknown>(ruta));
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(
          `${path.relative(rootDir, ruta)}.${issue.path.join('.')}: ${issue.message}`,
        );
      }
      return undefined;
    }
    return parsed.data;
  };

  const islasDir = path.join(contentDir, 'islands');
  const islands: Isla[] = fs.existsSync(islasDir)
    ? fs
        .readdirSync(islasDir)
        .filter((archivo) => archivo.endsWith('.json'))
        .map((archivo) => cargarIsla(path.join(islasDir, archivo)))
        .filter((isla): isla is Isla => isla !== undefined)
    : [];

  const cruzado = validateContent({ evidence, nodes, edges, chains, islands }, options);
  return { errors: [...errors, ...cruzado.errors] };
};
