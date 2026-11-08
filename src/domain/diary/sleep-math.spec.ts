import { describe, expect, it } from 'vitest';
import { formatMinutes, isPlausible, sleepMinutes } from './sleep-math';

describe('sleepMinutes', () => {
  it('calcula noches que cruzan medianoche', () => {
    expect(sleepMinutes('23:30', '06:00')).toBe(390);
    expect(sleepMinutes('01:00', '07:00')).toBe(360);
    expect(sleepMinutes('22:00', '06:30')).toBe(510);
  });

  it('devuelve null si la hora es igual', () => {
    expect(sleepMinutes('06:00', '06:00')).toBeNull();
  });

  it('marca como no plausible una duración muy corta', () => {
    expect(isPlausible(sleepMinutes('08:00', '08:30') ?? 0)).toBe(false);
  });

  it('formatea horas y minutos', () => {
    expect(formatMinutes(390)).toBe('6 h 30 min');
  });
});
