import { useEffect, useRef } from 'react';
import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { deriveStamps, nextIsland } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { CloudCard } from './components/CloudCard';
import { CloudSilhouettes } from './components/CloudSilhouettes';
import { RouteConnector, type RouteStatus } from './components/RouteConnector';
import { AtmosphericSky } from '@/shared/ui/atmosphere/AtmosphericSky';
import { Icon } from '@/shared/ui/icons/Icon';
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
  const availableIslands = content.availableIslands();
  const seals = deriveStamps(state.progress, availableIslands);
  const next = nextIsland(state.progress, availableIslands);
  const sealCount = seals.filter((seal) => seal.earned).length;
  const earnedIds = new Set(seals.filter((seal) => seal.earned).map((seal) => seal.island.id));
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = screenRef.current?.querySelector<HTMLElement>('[data-current="true"]');
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'center' });
    }
  }, [next?.id]);

  // Solo las zonas que tienen islas jugables en el MVP para ocultar islas en niebla al presentar.
  const visibleZones = ZONES.filter(({ zone }) =>
    availableIslands.some((island) => island.zona === zone),
  );

  return (
    <div ref={screenRef} className={styles.screen}>
      <CloudSilhouettes />
      {/* Cielo atmosférico multicapa compartido entre Amanecer y Noche */}
      <AtmosphericSky variant="map" />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.moon} aria-hidden="true">
            <Icon name="moon" size={20} />
          </span>
          <div>
            <h1 className={styles.title}>Archipiélago</h1>
            <p className={styles.subtitle}>Ruta al ritmo de tu sueño</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.passport}
          onClick={() => go('/pasaporte', { cloud: false })}
        >
          <span className={styles.passportIcon} aria-hidden="true">
            <Icon name="book" size={16} />
          </span>
          <span>Pasaporte</span>
          <span className={styles.count}>{sealCount}</span>
        </button>
      </header>

      <div className={styles.intro}>
        <span className={styles.introChip}>
          <Icon name="sparkle" size={14} />
          <span>{availableIslands.length} islas para recorrer</span>
        </span>
        <p>Explora hacia arriba · Aprende a tu propio compás</p>
      </div>

      <div className={styles.zonesWrapper}>
        {visibleZones.map(({ zone, label, note }, zoneIndex) => {
          const islands = availableIslands.filter((island) => island.zona === zone);
          const isHere = islands.some((island) => island.id === next?.id);
          const lowerZone = visibleZones[zoneIndex + 1];
          const lowerIslands = lowerZone
            ? availableIslands.filter((island) => island.zona === lowerZone.zone)
            : [];
          // Estado del tramo ascendente desde la zona inferior hacia la actual.
          const routeStatus: RouteStatus = !lowerZone
            ? 'upcoming'
            : lowerIslands.every((island) => earnedIds.has(island.id))
              ? 'completed'
              : lowerIslands.some((island) => island.id === next?.id)
                ? 'active'
                : 'upcoming';

          return (
            <div key={zone} className={styles.zoneGroup}>
              <section className={styles.zone} aria-label={`Zona ${label}`}>
                <div className={styles.zoneHeader}>
                  <span className={styles.zoneLabel}>
                    <span
                      className={`${styles.zoneDot} ${zone === 4 ? styles.dotGold : isHere ? styles.dotActive : ''}`}
                      aria-hidden="true"
                    />
                    Zona {zone} · {label} {zone === 4 ? '(Cima)' : ''}
                  </span>
                  {isHere ? (
                    <span className={styles.herePill}>¡Estás aquí!</span>
                  ) : (
                    <span className={styles.zoneCount}>
                      {islands.length} isla{islands.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
                <p className={styles.zoneNote}>{note}</p>

                <div className={styles.list}>
                  {islands.map((island, index) => {
                    const seal = seals.find((item) => item.island.id === island.id)?.earned ?? false;
                    const current = island.id === next?.id;
                    const cardState = seal ? 'completed' : current ? 'current' : 'new';
                    return (
                      <CloudCard
                        key={island.id}
                        island={island}
                        state={cardState}
                        to={`/isla/${island.slug}/llegada`}
                        image={artUrl(`arte/islas/${island.slug}.webp`)}
                        sealSrc={seal ? artUrl(`arte/sellos/sello-${island.slug}.webp`) : undefined}
                        variant={((index + zone) % 3 + 1) as 1 | 2 | 3}
                      />
                    );
                  })}
                </div>
              </section>

              {lowerZone ? (
                <RouteConnector status={routeStatus} flip={zoneIndex % 2 === 1} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
