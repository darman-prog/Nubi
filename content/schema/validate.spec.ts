// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { validateContent, validateContentFromDisk } from '../../scripts/validate-content';
import type { ContentData } from '../../scripts/validate-content';

const contenidoBase = (): ContentData => ({
  evidence: [
    {
      id: 'EV-003',
      claimTechnical: 'La fase circadiana se retrasa en la pubertad.',
      claimTeen: 'En la pubertad tu reloj biológico se corre y el sueño llega más tarde.',
      source: { citation: 'Carskadon et al. (2004)', sourceType: 'revision' },
      population: 'Adolescentes',
      design: 'Revisión',
      finding: 'Retraso de fase',
      limitations: 'Revisión narrativa',
      level: 'E3',
      geography: 'n/d',
      usedIn: ['ISL-RELOJ'],
      restricted: false,
      status: 'draft',
    },
  ],
  nodes: [
    { id: 'N-RELOJ', label: 'El reloj se corre', islandId: 'ISL-RELOJ' },
    { id: 'N-DORMIR-TARDE', label: 'Te da sueño más tarde', islandId: 'ISL-RELOJ' },
  ],
  edges: [
    {
      id: 'B-01',
      from: 'N-RELOJ',
      to: 'N-DORMIR-TARDE',
      status: 'published',
      level: 'E3',
      evidenceIds: ['EV-003'],
      explanation: 'Se conectan',
      honestLabel: 'Bien establecido',
    },
  ],
  chains: [
    {
      id: 'C-01',
      title: 'Del reloj al sueño',
      mode: 'guided',
      start: 'N-RELOJ',
      end: 'N-DORMIR-TARDE',
      solution: ['N-RELOJ', 'N-DORMIR-TARDE'],
      distractors: [],
    },
  ],
  islands: [
    {
      id: 'ISL-RELOJ',
      slug: 'reloj',
      zona: 1,
      nombre: 'Isla Reloj',
      subtitulo: 'Tu reloj interno',
      disponibilidad: 'available',
      posicion: { x: 50, y: 60 },
      llegada: ['Aquí vive el reloj de tu cuerpo.'],
      historia: [
        {
          id: 'ESC-RELOJ-1',
          acto: 'sintoma',
          texto: 'A medianoche tienes los ojos abiertos.',
          alt: 'Nube despierta de noche',
          isHealthClaim: false,
        },
        {
          id: 'ESC-RELOJ-2',
          acto: 'causa',
          texto: 'Tu reloj biológico se corre en la pubertad.',
          alt: 'Reloj que se inclina',
          isHealthClaim: true,
          evidenceId: 'EV-003',
        },
        {
          id: 'ESC-RELOJ-3',
          acto: 'cierre',
          texto: 'No es pereza: es biología.',
          alt: 'Nube tranquila',
          isHealthClaim: false,
        },
      ],
      pregunta: {
        id: 'PR-1',
        enunciado: '¿Por qué te da sueño más tarde?',
        opciones: [
          { id: 'a', texto: 'Porque tu reloj se corre', correcta: true },
          { id: 'b', texto: 'Porque las noches son cortas', correcta: false },
        ],
        explicacion: 'El reloj biológico cambia en la pubertad.',
        isHealthClaim: true,
        evidenceId: 'EV-003',
      },
      reto: { chainId: 'C-01', titulo: 'Arma la cadena', huecos: 1 },
      puentes: ['B-01'],
      fuentes: ['EV-003'],
    },
  ],
});

describe('validador de contenido', () => {
  it('acepta la semilla real del repositorio', () => {
    const gate =
      process.env.CONTENT_GATE === 'pilot' || process.env.CONTENT_GATE === 'prod'
        ? process.env.CONTENT_GATE
        : 'dev';
    const resultado = validateContentFromDisk(process.cwd(), { gate });
    expect(resultado.errors).toEqual([]);
  });

  it('rechaza una escena de salud sin ficha', () => {
    const data = contenidoBase();
    data.islands[0]!.historia![1]!.evidenceId = undefined;
    const resultado = validateContent(data);
    expect(resultado.errors.join('\n')).toContain('afirmación de salud sin ficha');
  });

  it('rechaza una pregunta de salud sin ficha', () => {
    const data = contenidoBase();
    data.islands[0]!.pregunta!.evidenceId = undefined;
    const resultado = validateContent(data);
    expect(resultado.errors.join('\n')).toContain('afirmación de salud sin ficha');
  });

  it('rechaza un puente pendiente usado por una isla', () => {
    const data = contenidoBase();
    data.edges[0]!.status = 'pending';
    const resultado = validateContent(data);
    expect(resultado.errors.join('\n')).toContain('puente pendiente');
  });

  it('rechaza un puente pendiente usado por una cadena', () => {
    const data = contenidoBase();
    data.edges[0]!.status = 'pending';
    data.islands[0]!.puentes = [];
    const resultado = validateContent(data);
    expect(resultado.errors.join('\n')).toContain('cadena C-01: usa un puente pendiente (B-01)');
  });

  it('rechaza un salto inválido en una cadena', () => {
    const data = contenidoBase();
    data.edges = [];
    const resultado = validateContent(data);
    expect(resultado.errors.join('\n')).toContain('salto inválido');
  });

  it('rechaza palabras prohibidas y textos largos', () => {
    const data = contenidoBase();
    // 55 palabras: supera el límite editorial y además usa una palabra de la lista.
    data.islands[0]!.historia![0]!.texto =
      'Siempre es lo mismo y esto se repite con muchas palabras para pasar del límite permitido por la guía editorial del proyecto cuando intentamos escribir una escena demasiado larga que no debería publicarse porque nadie la leería completa en una isla y además sobra mucha información extra que tampoco aporta nada nuevo al recorrido.';
    const resultado = validateContent(data);
    const texto = resultado.errors.join('\n');
    expect(texto).toContain('palabra prohibida');
    expect(texto).toContain('45 palabras');
  });

  it('rechaza fichas draft en compuerta de producción', () => {
    const data = contenidoBase();
    const resultado = validateContent(data, { gate: 'prod' });
    expect(resultado.errors.join('\n')).toContain('no cumple la compuerta prod');
  });
});
