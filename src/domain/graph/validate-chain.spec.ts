import { describe, expect, it } from 'vitest';
import type { EvidenceLevel, GraphEdge } from '../../../content/schema';
import { validateChain } from './validate-chain';

const edge = (
  id: string,
  from: string,
  to: string,
  level: EvidenceLevel = 'E3',
  status: 'published' | 'pending' = 'published',
): GraphEdge => ({
  id,
  from,
  to,
  status,
  level,
  evidenceIds: ['EV-001'],
  explanation: 'Prueba',
  honestLabel: 'Prueba',
});

const edges = [
  edge('B-01', 'A', 'B', 'E3'),
  edge('B-02', 'B', 'C', 'E2'),
  edge('B-03', 'A', 'D', 'E3', 'pending'),
  edge('B-04', 'D', 'C', 'E3'),
];

describe('validateChain', () => {
  it('acepta una cadena con todos los pares publicados', () => {
    const result = validateChain(['A', 'B', 'C'], edges);

    expect(result.status).toBe('correct');
    expect(result.links).toHaveLength(2);
    expect(result.weakest).toBe('E2');
  });

  it('marca como parcial una cadena con un par inválido', () => {
    const result = validateChain(['A', 'B', 'X'], edges);

    expect(result.status).toBe('partial');
    expect(result.links[1]?.valid).toBe(false);
  });

  it('rechaza una cadena sin pares válidos', () => {
    expect(validateChain(['A', 'X', 'Y'], edges).status).toBe('incorrect');
  });

  it('nunca acepta una arista pendiente', () => {
    expect(validateChain(['A', 'D'], edges).status).toBe('incorrect');
  });

  it('rechaza una secuencia de menos de dos nodos', () => {
    expect(validateChain(['A'], edges).status).toBe('incorrect');
  });
});
