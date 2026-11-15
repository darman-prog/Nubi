// AtmosphericSky.tsx
import { useEffect, useId, useRef, type CSSProperties, type JSX } from 'react';
import { cx } from '@/shared/lib/cx';
import { clamp, STARS } from './sky-presets';
import styles from './AtmosphericSky.module.css';

interface AtmosphericSkyProps {
  /** map muestra la atmósfera completa; page atenúa rayos, estrellas y nubes para priorizar lectura. */
  variant?: 'map' | 'page';
  /** Parallax de profundidad al hacer scroll (solo variante map). */
  parallax?: boolean;
  /** Nubes procedurales. Desactívalas si necesitas el fondo más barato aún. */
  clouds?: boolean;
}

/** Fondo atmosférico multicapa reactivo a Amanecer y Noche, sin blur ni filtros costosos en móvil. */
export function AtmosphericSky({
  variant = 'map',
  parallax = true,
  clouds = true,
}: AtmosphericSkyProps): JSX.Element {
  // useId puede incluir ':'; se sanea para que url(#id) sea válido en todos los navegadores
  const auroraGradId = useId().replace(/:/g, '');
  const auroraRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);

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
    const cloudsEl = cloudsRef.current;
    let raf = 0;

    // Cada capa se mueve a distinta velocidad: lo lejano (estrellas) más que lo cercano (nubes)
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
        if (cloudsEl) {
          cloudsEl.style.transform = `translate3d(0, ${clamp(-y * 0.02, -50, 50).toFixed(1)}px, 0)`;
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
      if (cloudsEl) cloudsEl.style.transform = '';
      if (sunEl) sunEl.style.transform = '';
    };
  }, [parallax, variant]);

  return (
    <div
      className={cx(styles.sky, variant === 'page' && styles.pageVariant)}
      data-sky-variant={variant}
      aria-hidden="true"
    >
      {/* 1. Bóveda y atmósfera */}
      <div className={cx(styles.layer, styles.gradient)} />
      <div className={cx(styles.layer, styles.mesh)} />

      {/* 2. Cielo profundo (visible sobre todo de noche) */}
      <div className={styles.milky} />
      <div ref={starsRef} className={styles.stars}>
        {STARS.map((star) => {
          const starStyle = {
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--d': `${star.dur}s`,
            '--delay': `${star.delay}s`,
            '--o': star.o,
            '--tint': star.tint,
          } as CSSProperties;

          return (
            <span
              key={star.id}
              className={cx(styles.star, star.big && styles.starBig)}
              style={starStyle}
            />
          );
        })}
      </div>

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

      {/* 3. Horizonte y astro: sol de día, luna de noche (según tokens) */}
      <div className={styles.horizon} />
      <div ref={sunRef} className={styles.sun}>
        <span className={styles.sunHalo} />
        <span className={styles.sunCore} />
      </div>
      <div className={cx(styles.layer, styles.rays)} />

      {/* 4. Nubes delante del astro: la luz se filtra a través de ellas */}
      {clouds && (
        <div ref={cloudsRef} className={styles.cloudsParallax}>
          <div className={cx(styles.clouds, styles.cloudsFar)}>
            <div className={styles.cloudTrack} />
          </div>
          <div className={cx(styles.clouds, styles.cloudsNear)}>
            <div className={styles.cloudTrack} />
          </div>
        </div>
      )}

      {/* 5. Legibilidad y acabado: el velo va sobre todo lo decorativo */}
      <div className={cx(styles.layer, styles.veil)} />
      <div className={cx(styles.layer, styles.grain)} />
      <div className={cx(styles.layer, styles.vignette)} />
    </div>
  );
}