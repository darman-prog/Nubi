// AtmosphericSky.tsx
import { useEffect, useId, useRef, type CSSProperties, type JSX } from 'react';
import { cx } from '@/shared/lib/cx';
import styles from './AtmosphericSky.module.css';

interface AtmosphericSkyProps {
  /** map muestra la atmósfera completa; page atenúa rayos y estrellas para priorizar lectura. */
  variant?: 'map' | 'page';
  /** Parallax de profundidad al hacer scroll (solo variante map). */
  parallax?: boolean;
}

interface StarSeed {
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  big?: boolean;
}

// Coordenadas fijas para evitar saltos visuales en re-render y limitar nodos DOM en móvil
const STARS: StarSeed[] = [
  { x: 8, y: 9, size: 2.2, dur: 3.1, delay: -0.6, big: true },
  { x: 19, y: 18, size: 1.5, dur: 4.2, delay: -2.1 },
  { x: 31, y: 7, size: 1.8, dur: 3.8, delay: -1.3 },
  { x: 44, y: 14, size: 2.4, dur: 4.6, delay: -3.2, big: true },
  { x: 58, y: 8, size: 1.4, dur: 3.4, delay: -0.9 },
  { x: 71, y: 21, size: 1.7, dur: 4.9, delay: -2.7 },
  { x: 86, y: 11, size: 2.3, dur: 3.9, delay: -1.8, big: true },
  { x: 93, y: 26, size: 1.5, dur: 4.4, delay: -0.4 },
  { x: 12, y: 34, size: 1.6, dur: 4.1, delay: -2.9 },
  { x: 26, y: 42, size: 2.1, dur: 3.6, delay: -1.1 },
  { x: 41, y: 31, size: 1.4, dur: 5.1, delay: -3.8 },
  { x: 64, y: 37, size: 2.2, dur: 3.7, delay: -2.2, big: true },
  { x: 79, y: 44, size: 1.5, dur: 4.5, delay: -0.7 },
  { x: 90, y: 39, size: 1.8, dur: 3.3, delay: -1.5 },
  { x: 15, y: 56, size: 2.3, dur: 4.7, delay: -3.1, big: true },
  { x: 34, y: 61, size: 1.4, dur: 3.5, delay: -2.4 },
  { x: 53, y: 52, size: 1.7, dur: 4.3, delay: -0.8 },
  { x: 73, y: 58, size: 2.1, dur: 3.9, delay: -1.9 },
  { x: 87, y: 64, size: 1.6, dur: 4.8, delay: -3.4 },
  { x: 22, y: 74, size: 1.8, dur: 3.6, delay: -1.2 },
  { x: 48, y: 71, size: 2.2, dur: 4.2, delay: -2.6, big: true },
  { x: 69, y: 76, size: 1.4, dur: 3.8, delay: -0.5 },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Fondo atmosférico multicapa reactivo a Amanecer y Noche, sin filtros blur costosos en móvil. */
export function AtmosphericSky({
  variant = 'map',
  parallax = true,
}: AtmosphericSkyProps): JSX.Element {
  // useId puede incluir ':'; se sanea para que url(#id) sea válido en todos los navegadores
  const auroraGradId = useId().replace(/:/g, '');
  const auroraRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

  // Parallax barato: un solo listener passive + rAF, sin blur ni repintado de capas
  useEffect(() => {
    if (!parallax || variant === 'page') return;
    // Guarda para entornos jsdom/tests donde window.matchMedia no está implementado
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const auroraEl = auroraRef.current;
    const starsEl = starsRef.current;
    const sunEl = sunRef.current;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        if (auroraEl) {
          auroraEl.style.transform = `translate3d(0, ${clamp(-y * 0.03, -70, 70).toFixed(1)}px, 0)`;
        }
        if (starsEl) {
          starsEl.style.transform = `translate3d(0, ${clamp(-y * 0.05, -90, 90).toFixed(1)}px, 0)`;
        }
        if (sunEl) {
          sunEl.style.transform = `translate(-50%, -50%) translate3d(0, ${clamp(-y * 0.015, -40, 40).toFixed(1)}px, 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      if (auroraEl) auroraEl.style.transform = '';
      if (starsEl) starsEl.style.transform = '';
      if (sunEl) sunEl.style.transform = '';
    };
  }, [parallax, variant]);

  return (
    <div
      className={cx(styles.sky, variant === 'page' && styles.pageVariant)}
      data-sky-variant={variant}
      aria-hidden="true"
    >
      <div className={cx(styles.layer, styles.gradient)} />
      <div className={cx(styles.layer, styles.mesh)} />
      <div className={styles.horizon} />
      <div ref={sunRef} className={styles.sun} />
      <div className={cx(styles.layer, styles.rays)} />

      <div ref={auroraRef} className={styles.auroraParallax}>
        <svg
          className={styles.aurora}
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            <linearGradient id={auroraGradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" className={styles.auroraStopA} />
              <stop offset="0.55" className={styles.auroraStopB} />
              <stop offset="1" className={styles.auroraStopA} />
            </linearGradient>
          </defs>
          <path
            d="M-120 300 C 240 120, 520 340, 860 180 S 1320 220, 1560 120"
            fill="none"
            stroke={`url(#${auroraGradId})`}
            strokeWidth="52"
            strokeLinecap="round"
          />
          <path
            d="M-140 400 C 260 240, 600 440, 940 280 S 1360 330, 1580 240"
            fill="none"
            stroke={`url(#${auroraGradId})`}
            strokeWidth="34"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </div>

      <div ref={starsRef} className={styles.stars}>
        {STARS.map((star) => {
          const starStyle = {
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--d': `${star.dur}s`,
            '--delay': `${star.delay}s`,
          } as CSSProperties;

          return (
            <span
              key={`${star.x}-${star.y}`}
              className={cx(styles.star, star.big && styles.starBig)}
              style={starStyle}
            />
          );
        })}
      </div>

      <div className={cx(styles.layer, styles.grain)} />
      <div className={cx(styles.layer, styles.vignette)} />
    </div>
  );
}