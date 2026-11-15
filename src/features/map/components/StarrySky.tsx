import type { CSSProperties } from 'react';
import styles from './StarrySky.module.css';

interface StarConfig {
  x: number;
  y: number;
  size: number;
  delay: number;
  gold?: boolean;
}

// Estrellas titilantes distribuidas en coordenadas verticales a lo largo del mapa
const STARS: StarConfig[] = [
  { x: 12, y: 70, size: 14, delay: 0, gold: true },
  { x: 86, y: 160, size: 11, delay: 0.8 },
  { x: 18, y: 290, size: 13, delay: 1.6, gold: true },
  { x: 82, y: 440, size: 10, delay: 2.2 },
  { x: 14, y: 590, size: 12, delay: 0.5 },
  { x: 88, y: 730, size: 15, delay: 1.9, gold: true },
  { x: 22, y: 880, size: 11, delay: 1.1 },
  { x: 80, y: 1040, size: 13, delay: 2.7, gold: true },
];

export function StarrySky(): React.JSX.Element {
  return (
    <div className={styles.ambientLayer} aria-hidden="true">
      {/* Halos de luz de amanecer que colorean el fondo sin interferir en los contrastes */}
      <div className={styles.blobTop} />
      <div className={styles.blobMid} />
      <div className={styles.blobBottom} />

      {/* Constelación de estrellas suaves con desfase de parpadeo */}
      {STARS.map((s, i) => {
        const starStyle = {
          left: `${s.x}%`,
          top: `${s.y}px`,
          animationDelay: `${s.delay}s`,
        } as CSSProperties;

        return (
          <svg
            key={i}
            className={`${styles.star} ${s.gold ? styles.starGold : ''}`}
            style={starStyle}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            focusable="false"
          >
            {/* Destello onírico de cuatro puntas con curvas suaves */}
            <path d="M12 2Q13.3 10.7 22 12Q13.3 13.3 12 22Q10.7 13.3 2 12Q10.7 10.7 12 2Z" />
          </svg>
        );
      })}
    </div>
  );
}
