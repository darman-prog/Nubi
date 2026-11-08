import { describe, expect, it } from 'vitest';
import { upsertDiaryEntry } from './diary-entry';

describe('upsertDiaryEntry', () => {
  it('reemplaza la entrada de la misma fecha y ordena descendente', () => {
    const entries = [
      { date: '2026-11-07', minutes: 400 },
      { date: '2026-11-08', minutes: 420 },
    ];

    const result = upsertDiaryEntry(entries, { date: '2026-11-08', minutes: 450 });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ date: '2026-11-08', minutes: 450 });
  });
});
