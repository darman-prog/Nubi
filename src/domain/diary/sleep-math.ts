/** Minutos entre acostarse y levantarse; null si la hora es ambigua. */
export const sleepMinutes = (bed: string, wake: string): number | null => {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const diff = (toMinutes(wake) - toMinutes(bed) + 1440) % 1440;
  return diff === 0 ? null : diff;
};

/** Fuera de 1–16 h se pide confirmar; no se bloquea el registro. */
export const isPlausible = (minutes: number): boolean => minutes >= 60 && minutes <= 16 * 60;

export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} h ${rest} min`;
};
