import { useState } from 'react';
import type { Experimentos } from '../../../../../content/schema';
import { fechaLocal } from '@/core/user-state';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/controls/Button';
import { Toast } from '@/shared/ui/feedback/Toast';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface RoutineBuilderProps {
  islandId: string;
  config: Experimentos;
  continueLabel?: string;
  onDone?: () => void;
}

const EXPERIMENT_ID = 'EXP-TALLER';

/** MEC-06 · Selección de hasta 3 hábitos de prueba por 7 días, conectados al Diario. */
export function RoutineBuilder({
  islandId,
  config,
  continueLabel = 'Siguiente actividad →',
  onDone,
}: RoutineBuilderProps): React.JSX.Element {
  const state = useUserState();
  const store = useUserStateStore();
  const saved = state.experiments.find((item) => item.id === EXPERIMENT_ID);
  const [selected, setSelected] = useState<string[]>(saved?.items ?? []);
  const [notice, setNotice] = useState('');

  const toggle = (id: string): void => {
    setNotice('');
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      // Limita la selección al máximo configurado (3 experimentos simultáneos).
      if (current.length >= config.maxSeleccion) return current;
      return [...current, id];
    });
  };

  const saveRoutine = (): void => {
    const startedAt = saved?.startedAt ?? fechaLocal();
    store.update((current) => {
      const rest = current.experiments.filter((item) => item.id !== EXPERIMENT_ID);
      return {
        ...current,
        experiments:
          selected.length > 0 ? [{ id: EXPERIMENT_ID, startedAt, items: selected }, ...rest] : rest,
      };
    });
    setNotice('Experimento de 7 días guardado. En el Diario podrás anotar cómo te va.');
  };

  return (
    <div className={styles.box}>
      <div className={styles.headerRow}>
        <span className={styles.counter}>
          {selected.length} de {config.maxSeleccion} elegidos
        </span>
        <span className={islandStyles.calmBadge}>Ideas para probar, no una receta</span>
      </div>

      <div className={styles.promptCard}>
        <h3 className={styles.promptTitle}>Constructor de rutina (7 días)</h3>
        <p className={styles.helper}>
          Elige hasta {config.maxSeleccion} ideas pequeñas. Si alguna no te sirve, puedes cambiarla sin culpa.
        </p>
      </div>

      {config.opciones.map((option) => {
        const isChecked = selected.includes(option.id);
        const disabled = !isChecked && selected.length >= config.maxSeleccion;
        return (
          <div key={option.id} className={styles.studyCard}>
            <button
              type="button"
              className={`${islandStyles.option} ${isChecked ? islandStyles.optionSelected : ''}`}
              aria-pressed={isChecked}
              disabled={disabled}
              onClick={() => toggle(option.id)}
            >
              <span className={islandStyles.optionText}>
                <strong>{option.titulo}</strong> — {option.detalle}
              </span>
              <span className={islandStyles.optionRadio} aria-hidden="true" />
            </button>
            <SourceBlock islandId={islandId} evidenceId={option.evidenceId} />
          </div>
        );
      })}

      <Toast message={notice || null} tone="success" onDismiss={() => setNotice('')} />

      <Button className={islandStyles.cta} onClick={saveRoutine}>
        Guardar experimento de 7 días
      </Button>

      {selected.length > 0 && onDone ? (
        <Button className={islandStyles.cta} onClick={onDone}>
          {continueLabel}
        </Button>
      ) : null}
    </div>
  );
}
