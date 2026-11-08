import { useState } from 'react';
import type { FormEvent } from 'react';
import { fechaLocal } from '@/core/user-state';
import type { UserStateV1 } from '@/core/user-state';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import { upsertDiaryEntry } from '@/domain/diary/diary-entry';
import { formatMinutes, isPlausible, sleepMinutes } from '@/domain/diary/sleep-math';
import styles from './DiaryScreen.module.css';

type DiaryEntry = UserStateV1['diary'][number];

const MOODS = [
  { value: 1, label: 'Muy bajo', face: '😞' },
  { value: 2, label: 'Bajo', face: '🙁' },
  { value: 3, label: 'Normal', face: '😐' },
  { value: 4, label: 'Bien', face: '🙂' },
  { value: 5, label: 'Muy bien', face: '😊' },
] as const;

export default function DiaryScreen(): React.JSX.Element {
  const state = useUserState();
  const store = useUserStateStore();
  const today = fechaLocal();
  const existing = state.diary.find((entry) => entry.date === today);
  const [bedtime, setBedtime] = useState(existing?.bedtime ?? '23:00');
  const [wake, setWake] = useState(existing?.wake ?? '07:00');
  const [mood, setMood] = useState<DiaryEntry['mood']>(existing?.mood ?? 3);
  const [screens, setScreens] = useState(existing?.screensInBed ?? false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const minutes = sleepMinutes(bedtime, wake);
  const warning = minutes !== null && !isPlausible(minutes);
  const recent = state.diary.slice(0, 7);

  const save = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (minutes === null) {
      setError('Revisa las horas: no pueden ser iguales.');
      return;
    }
    const entry: DiaryEntry = {
      date: today,
      bedtime,
      wake,
      mood,
      screensInBed: screens,
    };
    store.update((current) => ({
      ...current,
      diary: upsertDiaryEntry(current.diary, entry),
    }));
    setError('');
    setMessage('Guardado. Gracias por mirar tu descanso.');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Diario de sueño</p>
        <h1 className={styles.title}>¿Cómo amaneciste?</h1>
        <p className={styles.subtitle}>Toma menos de 30 segundos. No hay respuestas malas.</p>
      </header>

      <form className={styles.card} onSubmit={save}>
        <div className={styles.timeGrid}>
          <label className={styles.field}>
            <span>Me acosté</span>
            <input type="time" value={bedtime} onChange={(event) => setBedtime(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Me levanté</span>
            <input type="time" value={wake} onChange={(event) => setWake(event.target.value)} />
          </label>
        </div>

        <fieldset className={styles.moods}>
          <legend>Ánimo</legend>
          <div className={styles.moodGrid}>
            {MOODS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`${styles.mood} ${mood === item.value ? styles.moodActive : ''}`}
                aria-pressed={mood === item.value}
                onClick={() => setMood(item.value)}
              >
                <span aria-hidden="true">{item.face}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.check}>
          <input type="checkbox" checked={screens} onChange={(event) => setScreens(event.target.checked)} />
          Usé pantallas en la cama
        </label>

        {minutes !== null ? (
          <p className={styles.duration}>
            Dormiste <strong>{formatMinutes(minutes)}</strong>
            {warning ? ' · revisa si esas horas son correctas' : ''}
          </p>
        ) : null}
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {message ? <p className={styles.message} role="status">{message}</p> : null}

        <button type="submit" className={styles.save}>
          Guardar
        </button>
        <button
          type="button"
          className={styles.skip}
          onClick={() => setMessage('Está bien. Mañana puedes volver.')}
        >
          Saltar hoy
        </button>
      </form>

      <section className={styles.recent} aria-label="Últimas noches">
        <h2>Últimas noches</h2>
        {recent.length === 0 ? (
          <p className={styles.empty}>Aún no hay noches registradas.</p>
        ) : (
          <ul>
            {recent.map((entry) => {
              const entryMinutes = sleepMinutes(entry.bedtime, entry.wake);
              const moodLabel = MOODS.find((item) => item.value === entry.mood)?.label ?? 'Normal';
              return (
                <li key={entry.date}>
                  <span>{entry.date}</span>
                  <span>{entryMinutes === null ? '—' : formatMinutes(entryMinutes)}</span>
                  <span>{moodLabel}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className={styles.privacy}>Se queda en este dispositivo. Puedes exportarlo o borrarlo en Ayuda.</p>
      </section>
    </div>
  );
}
