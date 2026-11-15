import { useState } from 'react';
import type { SimuladorSemana } from '../../../../../content/schema';
import {
  formatMinutes,
  sleepMinutes,
  weekdayWeekendDiffMinutes,
} from '@/domain/diary/sleep-math';
import { Button } from '@/shared/ui/controls/Button';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface WeekSimulatorProps {
  islandId: string;
  config: SimuladorSemana;
  onDone?: () => void;
}

const MAX_BAR_HOURS = 12;

// Escala de 0 a 12 h para que la banda recomendada de 8-10 h quede proporcionada sin alarmas.
const barPercent = (minutes: number): number =>
  Math.min(100, Math.max(4, Math.round((minutes / (MAX_BAR_HOURS * 60)) * 100)));

/** MEC-04 · Simulador neutro entre horarios de colegio y fin de semana (sin guardar ni juzgar). */
export function WeekSimulator({ islandId, config, onDone }: WeekSimulatorProps): React.JSX.Element {
  const [weekBed, setWeekBed] = useState('23:30');
  const [weekWake, setWeekWake] = useState('06:15');
  const [endBed, setEndBed] = useState('00:30');
  const [endWake, setEndWake] = useState('09:30');

  const weekMin = sleepMinutes(weekBed, weekWake) ?? 0;
  const endMin = sleepMinutes(endBed, endWake) ?? 0;
  const diffMin = weekdayWeekendDiffMinutes(weekMin, endMin);
  const bandLeft = `${(config.bandaMinHoras / MAX_BAR_HOURS) * 100}%`;
  const bandWidth = `${((config.bandaMaxHoras - config.bandaMinHoras) / MAX_BAR_HOURS) * 100}%`;

  return (
    <div className={styles.box}>
      <div className={styles.promptCard}>
        <h3 className={styles.promptTitle}>{config.titulo}</h3>
        <p className={styles.helper}>
          Simula tus horarios de colegio y descanso para observar cuántas horas sumas.
        </p>
      </div>

      <fieldset className={styles.studyCard}>
        <legend>Entre semana (colegio)</legend>
        <div className={styles.timePair}>
          <label className={styles.timeField}>
            <span>Acostarse</span>
            <input type="time" value={weekBed} onChange={(e) => setWeekBed(e.target.value)} />
          </label>
          <label className={styles.timeField}>
            <span>Levantarse</span>
            <input type="time" value={weekWake} onChange={(e) => setWeekWake(e.target.value)} />
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.studyCard}>
        <legend>Fin de semana</legend>
        <div className={styles.timePair}>
          <label className={styles.timeField}>
            <span>Acostarse</span>
            <input type="time" value={endBed} onChange={(e) => setEndBed(e.target.value)} />
          </label>
          <label className={styles.timeField}>
            <span>Levantarse</span>
            <input type="time" value={endWake} onChange={(e) => setEndWake(e.target.value)} />
          </label>
        </div>
      </fieldset>

      <div className={styles.trackBox} role="status">
        {[
          { label: 'Entre semana', min: weekMin },
          { label: 'Fin de semana', min: endMin },
        ].map((row) => (
          <div key={row.label} className={styles.barRow}>
            <div className={styles.barLabel}>
              <span>{row.label}</span>
              <span>{row.min === 0 ? 'Revisa la hora' : formatMinutes(row.min)}</span>
            </div>
            <div className={styles.track}>
              <div className={styles.band} style={{ left: bandLeft, width: bandWidth }} aria-hidden="true" />
              <div className={styles.fill} style={{ width: `${barPercent(row.min)}%` }} />
            </div>
          </div>
        ))}

        <p className={styles.neutralNote}>
          Entre semana duermes <strong>{formatMinutes(weekMin)}</strong>; el fin de semana,{' '}
          <strong>{formatMinutes(endMin)}</strong> (diferencia de {formatMinutes(diffMin)}). Para tu
          edad se recomienda entre {config.bandaMinHoras} y {config.bandaMaxHoras} h.
        </p>
      </div>

      <SourceBlock islandId={islandId} evidenceId={config.evidenceId} />

      {onDone ? (
        <Button className={islandStyles.cta} onClick={onDone}>
          Siguiente actividad →
        </Button>
      ) : null}
    </div>
  );
}
