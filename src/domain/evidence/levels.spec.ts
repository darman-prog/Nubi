import { describe, expect, it } from 'vitest';
import type { EvidenceLevel } from '../../../content/schema';
import { weakestLevel } from './levels';

describe('weakestLevel', () => {
  it('devuelve undefined sin niveles', () => {
    expect(weakestLevel([])).toBeUndefined();
  });

  it('devuelve el nivel más bajo', () => {
    const levels: EvidenceLevel[] = ['E3', 'E1', 'E2'];
    expect(weakestLevel(levels)).toBe('E1');
  });
});
