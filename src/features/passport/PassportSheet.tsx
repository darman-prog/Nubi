import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { nextIsland } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import { Sheet } from '@/shared/ui/Sheet';
import styles from './PassportSheet.module.css';

export default function PassportSheet(): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const navigate = useNavigate();
  const close = useCallback(() => navigate('/mapa'), [navigate]);

  // Obtenemos las 6 islas del MVP ordenadas para la libreta de sellos.
  const slots = content.islands
    .filter((island) => (island.ordenSugerido ?? 99) <= 5)
    .sort((a, b) => (a.ordenSugerido ?? 99) - (b.ordenSugerido ?? 99));

  const earned = slots.filter((island) => state.progress.islands[island.id]?.stages.sello);
  const complete = earned.length === slots.length;
  const current = nextIsland(state.progress, content.islands);
  const progressPercent = Math.round((earned.length / slots.length) * 100);

  return (
    <Sheet title="Pasaporte" onClose={close}>
      <p className={styles.subtitle}>Pasaporte de Nubi · Tu libreta de sellos aprendidos</p>

      <div className={styles.stampHeader}>
        <span className={styles.sectionTitle}>Sellos del Viaje</span>
        <span className={styles.badgeCount}>
          {earned.length} de {slots.length} ganados
        </span>
      </div>

      <div className={styles.grid}>
        {slots.map((island) => {
          const hasSeal = state.progress.islands[island.id]?.stages.sello === true;
          const isCurrent = island.id === current?.id && !hasSeal;

          // Determinamos el estado visual de cada casilla del pasaporte.
          let statusClass = styles.locked;
          let badgeText = 'Aún no';
          let badgeClass = styles.badgeLocked;

          if (hasSeal) {
            statusClass = styles.earned;
            badgeText = island.slug === 'nido' ? 'Bienvenida' : 'Ganado';
            badgeClass = styles.badgeEarned;
          } else if (isCurrent) {
            statusClass = styles.current;
            badgeText = 'Vas por aquí';
            badgeClass = styles.badgeCurrent;
          }

          return (
            <div key={island.id} className={`${styles.stamp} ${statusClass}`}>
              {isCurrent ? (
                <span className={styles.nubiIndicator} aria-hidden="true" title="Nubi está aquí">
                  ☁️
                </span>
              ) : null}

              <div className={styles.iconCircle}>
                {hasSeal ? (
                  <img
                    className={styles.sealImg}
                    src={artUrl(`arte/sellos/sello-${island.slug}.webp`)}
                    alt=""
                  />
                ) : isCurrent ? (
                  <span className={styles.currentIcon} aria-hidden="true">
                    🧭
                  </span>
                ) : (
                  <span className={styles.lockIcon} aria-hidden="true">
                    🔒
                  </span>
                )}
              </div>

              <span className={styles.name}>{island.nombre}</span>
              <span className={`${styles.statusBadge} ${badgeClass}`}>{badgeText}</span>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de progreso sereno hacia la coronación */}
      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <span className={styles.progressIcon} aria-hidden="true">
            🎓
          </span>
          <div>
            <p className={styles.progressTitle}>Camino a Sabio del Sueño</p>
            <p className={styles.progressSub}>
              {earned.length} de {slots.length} islas completadas
            </p>
          </div>
        </div>

        <div className={styles.barTrack} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.barFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <p className={styles.note}>
        Los sellos se ganan aprendiendo y completando cada isla. Sin prisas.
      </p>

      <div className={styles.actions}>
        {complete ? (
          <Button className={styles.cta} onClick={() => go('/coronacion')}>
            Ver coronación 👑
          </Button>
        ) : null}
        <Button variant="ghost" onClick={close}>
          Volver al mapa
        </Button>
      </div>
    </Sheet>
  );
}
