import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import styles from './CoronationScreen.module.css';

export default function CoronationScreen(): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const slots = content.islands.filter((island) => (island.ordenSugerido ?? 99) <= 5);
  const earned = slots.filter((island) => state.progress.islands[island.id]?.stages.sello).length;
  const complete = earned === slots.length;
  const missing = slots.length - earned;

  return (
    <div className={styles.page}>
      <img className={styles.art} src={artUrl('arte/coronacion.webp')} alt="" />
      <img className={styles.nubi} src={artUrl('arte/nubi/nubi-celebrando.webp')} alt="" />
      <p className={styles.kicker}>{complete ? 'Pasaporte completo' : 'Tu coronación te espera'}</p>
      <h1 className={styles.title}>Sabio del Sueño</h1>
      <p className={styles.text}>
        {complete
          ? 'Recorriste el archipiélago, probaste ideas y aprendiste a escuchar tu descanso. Este título es tuyo.'
          : `Te faltan ${missing} ${missing === 1 ? 'sello' : 'sellos'} para completar el archipiélago.`}
      </p>
      <p className={styles.count}>
        {earned} de {slots.length} sellos
      </p>
      {complete ? (
        <Button className={styles.cta} onClick={() => go('/pasaporte', { cloud: false })}>
          Ver mi pasaporte
        </Button>
      ) : (
        <Button className={styles.cta} onClick={() => go('/pasaporte', { cloud: false })}>
          Ir al pasaporte
        </Button>
      )}
      <Button variant="ghost" onClick={() => go('/mapa')}>
        Volver al mapa
      </Button>
    </div>
  );
}
