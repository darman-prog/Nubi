import { useEffect, useState } from 'react';
import type { Respiracion } from '../../../../../content/schema';
import { artUrl } from '@/core/content/assets';
import { Button } from '@/shared/ui/controls/Button';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface BreathingExerciseProps {
  islandId: string;
  config: Respiracion;
  onDone?: () => void;
}

const playSoftTone = (): void => {
  if (typeof globalThis.AudioContext !== 'function') return;
  try {
    const ctx = new globalThis.AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 396;
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    // Algunos navegadores bloquean AudioContext sin interacción directa; no interrumpe la práctica.
  }
};

/** MEC-07 · Respiración lenta guiada con Nubi para relajarte (sin promesas clínicas). */
export function BreathingExercise({
  islandId,
  config,
  onDone,
}: BreathingExerciseProps): React.JSX.Element {
  const [minutes, setMinutes] = useState<number>(config.duracionesMin[0] ?? 1);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  const totalSec = minutes * 60;
  const cycleSec = config.inhalaSeg + config.sostieneSeg + config.exhalaSeg;
  const finished = elapsed >= totalSec;

  useEffect(() => {
    if (!running || finished) return;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (soundOn && next % cycleSec === 0 && next < totalSec) playSoftTone();
        if (next >= totalSec) setRunning(false);
        return Math.min(next, totalSec);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, finished, soundOn, cycleSec, totalSec]);

  const pos = elapsed % cycleSec;
  const phase = !running
    ? finished
      ? 'Práctica completa'
      : 'Listo cuando tú quieras'
    : pos < config.inhalaSeg
      ? `Inhala suave (${config.inhalaSeg} s)`
      : pos < config.inhalaSeg + config.sostieneSeg
        ? `Sostiene (${config.sostieneSeg} s)`
        : `Exhala lento (${config.exhalaSeg} s)`;

  const orbClass = !running
    ? ''
    : pos < config.inhalaSeg
      ? styles.orbInhale
      : pos < config.inhalaSeg + config.sostieneSeg
        ? styles.orbHold
        : styles.orbExhale;

  const selectDuration = (m: number): void => {
    setRunning(false);
    setElapsed(0);
    setMinutes(m);
  };

  const remaining = Math.max(0, totalSec - elapsed);
  const minText = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  const pct = Math.min(100, Math.round((elapsed / totalSec) * 100));

  return (
    <div className={styles.box}>
      <div className={styles.promptCard}>
        <h3 className={styles.promptTitle}>{config.titulo}</h3>
        <p className={styles.helper}>
          Respiración lenta para relajarte antes de descansar. Puedes detenerte en cualquier momento.
        </p>
      </div>

      <div className={styles.choiceRow} role="group" aria-label="Duración en minutos">
        {config.duracionesMin.map((m) => (
          <button
            key={m}
            type="button"
            className={styles.choiceBtn}
            aria-pressed={minutes === m}
            onClick={() => selectDuration(m)}
          >
            {m} min
          </button>
        ))}
      </div>

      <div className={styles.breathArena} role="region" aria-label="Guía de respiración">
        <div className={styles.orbWrap}>
          <div className={`${styles.orbRing} ${orbClass}`} aria-hidden="true" />
          <img
            className={styles.orbNubi}
            src={artUrl('arte/nubi/nubi-feliz.webp')}
            alt="Nubi acompañando tu respiración"
          />
        </div>
        <p className={styles.phaseText} aria-live="polite">
          {phase}
        </p>
        <p className={styles.helper}>Tiempo restante: {minText}</p>
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        <label className={styles.subtleToggle}>
          <input
            type="checkbox"
            checked={soundOn}
            onChange={(e) => setSoundOn(e.target.checked)}
          />
          Sonido suave opcional al cambiar de ciclo
        </label>

        <div className={styles.controlsRow}>
          <Button
            className={islandStyles.cta}
            onClick={() => {
              if (finished) setElapsed(0);
              setRunning((prev) => !prev);
            }}
          >
            {running ? 'Pausar' : elapsed > 0 && !finished ? 'Continuar' : 'Iniciar respiración'}
          </Button>
          {/* Detener visible desde que inicia para cumplir "en cualquier momento" */}
          {running || elapsed > 0 ? (
            <button
              type="button"
              className={styles.choiceBtn}
              onClick={() => {
                setRunning(false);
                setElapsed(0);
              }}
            >
              Detener
            </button>
          ) : null}
        </div>
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
