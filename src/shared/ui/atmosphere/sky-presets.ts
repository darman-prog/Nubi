export interface StarSeed {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  /** Brillo base: las estrellas bajas se apagan por la extinción atmosférica. */
  o: number;
  tint: string;
  big: boolean;
}

/** PRNG determinista: el campo de estrellas es idéntico en cada render y en SSR. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Temperaturas de color estelar: mayoría blancas, algunas cálidas y frías
const STAR_TINTS = ['#ffffff', '#ffffff', '#fff1d6', '#ffe2b8', '#d4e4ff', '#bcd2ff'];

/** Genera un campo de estrellas determinista con más densidad hacia el cenit. */
function buildStars(count: number): StarSeed[] {
  const rand = mulberry32(2050);
  return Array.from({ length: count }, (_, id) => {
    // Exponente 1.7 concentra más estrellas arriba y deja limpio el horizonte
    const y = Math.pow(rand(), 1.7) * 80;
    const big = rand() > 0.88;
    return {
      id,
      x: +(rand() * 100).toFixed(2),
      y: +y.toFixed(2),
      size: +(big ? 2.1 + rand() * 0.6 : 1 + rand() * 0.9).toFixed(2),
      dur: +(3 + rand() * 2.6).toFixed(2),
      delay: +(-rand() * 4).toFixed(2),
      o: +(0.35 + 0.65 * (1 - y / 80)).toFixed(2),
      tint: STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)] ?? '#ffffff',
      big,
    };
  });
}

// Se calcula una sola vez al cargar el módulo: cero trabajo en re-render
export const STARS: StarSeed[] = buildStars(56);

/** Acota desplazamientos del parallax para evitar saltos fuera de cuadro. */
export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));
