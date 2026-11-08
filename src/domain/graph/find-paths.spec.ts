import { describe, expect, it } from 'vitest';
import type { GraphEdge } from '../../../content/schema';
import { findPaths } from './find-paths';

const edge = (from: string, to: string, status: 'published' | 'pending' = 'published'): GraphEdge => ({
  id: `B-${from}${to}`,
  from,
  to,
  status,
  level: 'E3',
  evidenceIds: ['EV-001'],
  explanation: 'Prueba',
  honestLabel: 'Prueba',
});

describe('findPaths', () => {
  const edges = [
    edge('A', 'B'),
    edge('B', 'C'),
    edge('A', 'C'),
    edge('C', 'A'),
    edge('A', 'D', 'pending'),
  ];

  it('encuentra todos los caminos simples publicados', () => {
    expect(findPaths('A', 'C', edges, 4)).toEqual([
      ['A', 'B', 'C'],
      ['A', 'C'],
    ]);
  });

  it('ignora aristas pendientes', () => {
    expect(findPaths('A', 'D', edges, 4)).toEqual([]);
  });

  it('respeta el máximo de nodos', () => {
    expect(findPaths('A', 'C', edges, 2)).toEqual([['A', 'C']]);
  });
});
