/** Reemplaza la entrada de la misma fecha y deja las más recientes primero. */
export const upsertDiaryEntry = <T extends { date: string }>(entries: T[], entry: T): T[] =>
  [...entries.filter((item) => item.date !== entry.date), entry].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
