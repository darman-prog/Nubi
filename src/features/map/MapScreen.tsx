import { useEffect, useRef } from 'react';
import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { deriveStamps, nextIsland } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { CloudCard } from './components/CloudCard';
import { CloudSilhouettes } from './components/CloudSilhouettes';
import styles from './MapScreen.module.css';

const ZONES = [
  { zone: 4, label: 'Cuidar', note: 'El cierre del viaje' },
  { zone: 3, label: 'Efectos', note: 'Lo que sientes al día siguiente' },
  { zone: 2, label: 'Causas', note: 'Lo que influye en tu descanso' },
  { zone: 1, label: 'Entender', note: 'Las bases del sueño' },
  { zone: 0, label: 'Inicio', note: 'El nido de Nubi' },
] as const;

export default function MapScreen(): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const seals = deriveStamps(state.progress, content.islands);
  const next = nextIsland(state.progress, content.islands);
  const sealCount = seals.filter((seal) => seal.earned).length;
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = screenRef.current?.querySelector<HTMLElement>('[data-current="true"]');
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'center' });
    }
  }, [next?.id]);

  const isPlanned = (island: (typeof content.islands)[number]): boolean =>
    island.disponibilidad === 'available' || (island.ordenSugerido ?? 99) <= 5;

  return (
    <div ref={screenRef} className={styles.screen}>
      <CloudSilhouettes />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.moon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z" />
            </svg>
          </span>
          <div>
            <h1 className={styles.title}>Archipiélago</h1>
            <p className={styles.subtitle}>Ruta al ritmo de tu sueño</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.passport}
          onClick={() => go('/pasaporte')}
          aria-label={`Abrir pasaporte con ${sealCount} sellos`}
        >
          <span>Pasaporte</span>
          <span className={styles.count}>{sealCount}</span>
        </button>
      </header>

      <div className={styles.intro}>
        <span className={styles.introChip}>Explora hacia arriba</span>
        <p>Aprende a tu propio compás</p>
      </div>

      {ZONES.map(({ zone, label, note }) => {
        const islands = content.islands
          .filter((island) => island.zona === zone)
          .sort((a, b) => (a.ordenSugerido ?? 99) - (b.ordenSugerido ?? 99));
        if (islands.length === 0) return null;

        const full = islands.filter((island) => {
          const seal = seals.find((item) => item.island.id === island.id)?.earned;
          return seal || island.id === next?.id || isPlanned(island);
        });
        const fog = islands.filter((island) => !full.includes(island));
        const playable = islands.filter(isPlanned).length;

        return (
          <section key={zone} className={styles.zone} aria-label={`Zona ${label}`}>
            <div className={styles.zoneHeader}>
              <span className={styles.zoneLabel}>
                <span className={styles.zoneDot} aria-hidden="true" />
                {label}
              </span>
              <span className={styles.zoneCount}>
                {playable} jugable{playable === 1 ? '' : 's'}
                {fog.length > 0 ? ` · ${fog.length} en niebla` : ''}
              </span>
            </div>
            <p className={styles.zoneNote}>{note}</p>

            <div className={styles.list}>
              {full.map((island, index) => {
                const seal = seals.find((item) => item.island.id === island.id)?.earned ?? false;
                const current = island.id === next?.id;
                const cardState = seal
                  ? 'completed'
                  : current
                    ? 'current'
                    : island.disponibilidad === 'available'
                      ? 'new'
                      : 'soon';
                return (
                  <CloudCard
                    key={island.id}
                    island={island}
                    state={cardState}
                    to={
                      island.disponibilidad === 'available'
                        ? `/isla/${island.slug}/llegada`
                        : `/isla/${island.slug}`
                    }
                    image={artUrl(`arte/islas/${island.slug}.webp`)}
                    sealSrc={
                      seal ? artUrl(`arte/sellos/sello-${island.slug}.webp`) : undefined
                    }
                    variant={((index + zone) % 3 + 1) as 1 | 2 | 3}
                  />
                );
              })}
            </div>

            {fog.length > 0 ? (
              <div className={styles.fogGrid}>
                {fog.map((island, index) => (
                  <CloudCard
                    key={island.id}
                    island={island}
                    state="fog"
                    to={`/isla/${island.slug}`}
                    image={artUrl('arte/islas/isla-niebla.webp')}
                    variant={((index + zone) % 3 + 1) as 1 | 2 | 3}
                    compact
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
