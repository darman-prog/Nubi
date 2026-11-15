import { useState } from 'react';
import type { FormEvent } from 'react';
import { fechaLocal } from '@/core/user-state';
import type { UserStateV1 } from '@/core/user-state';
import { useUserState, useUserStateStore } from '@/shared/state/UserStateContext';
import { upsertDiaryEntry } from '@/domain/diary/diary-entry';
import { formatMinutes, isPlausible, sleepMinutes } from '@/domain/diary/sleep-math';
import { Toast } from '@/shared/ui/Toast';
import { Icon } from '@/shared/ui/icons/Icon';
import styles from './DiaryScreen.module.css';

type DiaryEntry = UserStateV1['diary'][number];

const MOODS = [
  { value: 1, label: 'Muy bajo', icon: 'mood-1' },
  { value: 2, label: 'Bajo', icon: 'mood-2' },
  { value: 3, label: 'Normal', icon: 'mood-3' },
  { value: 4, label: 'Bien', icon: 'mood-4' },
  { value: 5, label: 'Muy bien', icon: 'mood-5' },
] as const;

const TRIED_OPTIONS: Array<{ value: NonNullable<DiaryEntry['experimentTried']>; label: string }> = [
  { value: 'yes', label: 'Sí' },
  { value: 'some', label: 'Más o menos' },
  { value: 'no', label: 'No' },
];

export default function DiaryScreen(): React.JSX.Element {
  const state = useUserState();
  const store = useUserStateStore();
  const today = fechaLocal();
  const existing = state.diary.find((entry) => entry.date === today);
  const [bedtime, setBedtime] = useState(existing?.bedtime ?? '23:00');
  const [wake, setWake] = useState(existing?.wake ?? '07:00');
  const [mood, setMood] = useState<DiaryEntry['mood']>(existing?.mood ?? 3);
  const [screens, setScreens] = useState(existing?.screensInBed ?? false);
  const [tried, setTried] = useState<DiaryEntry['experimentTried']>(existing?.experimentTried);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Mostramos la pregunta de seguimiento solo cuando ya exploró o aceptó algún reto/experimento.
  const hasActiveChallenge =
    state.challenges.length > 0 ||
    state.experiments.length > 0 ||
    Object.values(state.progress.islands).some((island) => island.stages.sello);
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
      ...(tried ? { experimentTried: tried } : {}),
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
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.check}>
          <input type="checkbox" checked={screens} onChange={(event) => setScreens(event.target.checked)} />
          Usé pantallas en la cama
        </label>

        {hasActiveChallenge ? (
          <fieldset className={styles.moods}>
            <legend>¿Probaste tu reto o experimento?</legend>
            <div className={styles.triedGrid}>
              {TRIED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.triedBtn} ${tried === opt.value ? styles.triedBtnActive : ''}`}
                  aria-pressed={tried === opt.value}
                  onClick={() => setTried((current) => (current === opt.value ? undefined : opt.value))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {minutes !== null ? (
          <p className={styles.duration}>
            Dormiste <strong>{formatMinutes(minutes)}</strong>
            {warning ? ' · revisa si esas horas son correctas' : ''}
          </p>
        ) : null}
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <Toast message={message || null} onDismiss={() => setMessage('')} />

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
