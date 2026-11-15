import { content } from '@/core/content/content-repository';
import type { UserStateV1 } from '@/core/user-state';
import styles from '../DiaryScreen.module.css';

interface ExperimentSummaryProps {
  experiments: UserStateV1['experiments'];
  diary: UserStateV1['diary'];
}

/** Muestra el experimento de 7 días activo y resume los días anotados sin juzgar. */
export function ExperimentSummary({
  experiments,
  diary,
}: ExperimentSummaryProps): React.JSX.Element | null {
  const active = experiments.find((item) => item.id === 'EXP-TALLER');
  if (!active || active.items.length === 0) return null;

  const catalog = content.islandBySlug('taller')?.experimentos?.opciones ?? [];
  const names = active.items.map(
    (id) => catalog.find((opt) => opt.id === id)?.titulo ?? id,
  );
  const daysTracked = diary.filter(
    (entry) => entry.date >= active.startedAt && entry.experimentTried !== undefined,
  ).length;

  return (
    <section className={styles.recent} aria-label="Tu experimento de 7 días">
      <h2>Tu experimento de 7 días</h2>
      <p className={styles.subtitle}>
        Probando: {names.join(' · ')} ({daysTracked} de 7 días anotados)
      </p>
      {daysTracked >= 3 ? (
        <p className={styles.duration}>
          {daysTracked >= 7
            ? 'Completaste tu semana de observación. Mira qué te funcionó sin juzgarte.'
            : 'Ya llevas al menos 3 días observando tu descanso; cada intento aporta información.'}
        </p>
      ) : null}
    </section>
  );
}
