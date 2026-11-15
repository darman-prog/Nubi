import { describe, expect, it } from 'vitest';
import type { GraphEdge } from '../../../content/schema';
import { describeWeakestLevel, findMatchingPath, getChainHint } from './chain-hints';

const edges: GraphEdge[] = [
  {
    id: 'B-01',
    from: 'A',
    to: 'B',
    status: 'published',
    level: 'E3',
    evidenceIds: ['EV-1'],
    explanation: 'A provoca B directamente.',
    honestLabel: 'Bien establecido',
  },
  {
    id: 'B-02',
    from: 'B',
    to: 'C',
    status: 'published',
    level: 'E2',
    evidenceIds: ['EV-2'],
    explanation: 'B reduce C.',
    honestLabel: 'Moderado',
  },
];

describe('chain-hints', () => {
  it('elige el camino válido más corto que coincide con el prefijo actual', () => {
    const paths = [
      ['A', 'X', 'Y', 'C'],
      ['A', 'B', 'C'],
    ];
    expect(findMatchingPath(['A'], paths)).toEqual(['A', 'B', 'C']);
    expect(findMatchingPath(['A', 'X'], paths)).toEqual(['A', 'X', 'Y', 'C']);
  });

  it('entrega pistas progresivas de nivel 1, 2 y 3', () => {
    const paths = [['A', 'B', 'C']];
    const label = (id: string) => `Nodo ${id}`;

    expect(getChainHint(1, ['A'], paths, edges, label)).toContain('faltan 2 conexiones');
    expect(getChainHint(2, ['A'], paths, edges, label)).toContain('A provoca B directamente.');
    expect(getChainHint(3, ['A'], paths, edges, label)).toContain('Nodo B');
  });

  it('describe el nivel del eslabón más débil en lenguaje claro', () => {
    expect(describeWeakestLevel('E3')).toContain('E3');
    expect(describeWeakestLevel('E2')).toContain('E2');
    expect(describeWeakestLevel('E1')).toContain('E1');
  });
});
