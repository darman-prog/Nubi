import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import { Sheet } from '@/shared/ui/Sheet';
import styles from './PassportSheet.module.css';

const ZONES = ['Inicio', 'Entender', 'Causas', 'Efectos', 'Cuidar'];

export default function PassportSheet(): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const navigate = useNavigate();
  const close = useCallback(() => navigate('/mapa'), [navigate]);

  const slots = content.islands
    .filter((island) => (island.ordenSugerido ?? 99) <= 5)
    .sort((a, b) => (a.ordenSugerido ?? 99) - (b.ordenSugerido ?? 99));
  const earned = slots.filter((island) => state.progress.islands[island.id]?.stages.sello);
  const complete = earned.length === slots.length;

  return (
    <Sheet title="Pasaporte" onClose={close}>
      <p className={styles.lead}>
        {earned.length} de {slots.length} sellos. Cada isla deja una huella en tu viaje.
      </p>
      <div className={styles.grid}>
        {slots.map((island) => {
          const hasSeal = state.progress.islands[island.id]?.stages.sello === true;
          return (
            <div key={island.id} className={`${styles.stamp} ${hasSeal ? styles.earned : styles.locked}`}>
              <img
                className={styles.seal}
                src={artUrl(`arte/sellos/sello-${island.slug}.webp`)}
                alt=""
              />
              <span className={styles.name}>{island.nombre}</span>
              <span className={styles.zone}>{ZONES[island.zona] ?? 'Isla'}</span>
              {!hasSeal ? <span className={styles.lock}>Por ganar</span> : null}
            </div>
          );
        })}
      </div>
      {complete ? (
        <Button className={styles.cta} onClick={() => go('/coronacion')}>
          Ver coronación
        </Button>
      ) : (
        <p className={styles.note}>Completa las islas para desbloquear la coronación.</p>
      )}
    </Sheet>
  );
}
