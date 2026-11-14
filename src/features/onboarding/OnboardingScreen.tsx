import { useState } from 'react';
import { artUrl } from '@/core/content/assets';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserStateStore } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import styles from './OnboardingScreen.module.css';

const STEPS = [
  {
    title: '¡Hola! Soy Nubi',
    body: 'Juntos vamos a recorrer el Archipiélago del Sueño para entender qué pasa en tu cuerpo cuando descansas poco.',
    image: 'arte/nubi/nubi-feliz.webp',
    alt: 'Nubi sonriendo con sus manitas en alto',
    isAvatar: true,
  },
  {
    title: 'Sin prisas ni regaños',
    body: 'Cada isla tiene historias, retos sin puntajes ni vidas y un sello para tu pasaporte. No es un examen ni un diagnóstico.',
    image: 'arte/escenas/nido-2.webp',
    alt: 'Vista del archipiélago con islas conectadas por puentes de nubes',
    isAvatar: false,
  },
  {
    title: 'Tu viaje se queda aquí',
    body: 'No pedimos cuentas, correo ni nombre real. Todo lo que guardas vive solo en este dispositivo.',
    image: 'arte/escenas/nido-3.webp',
    alt: 'Nubi entregando un sello dorado a un pasaporte abierto',
    isAvatar: false,
  },
] as const;

export default function OnboardingScreen(): React.JSX.Element {
  const store = useUserStateStore();
  const go = useTransitionNavigate();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState(store.getState().profile.nickname ?? '');

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  const finish = (saveNickname: boolean): void => {
    const clean = nickname.trim().slice(0, 20);
    // Marcamos onboardingDone aunque se salte, para no interrumpir futuras entradas.
    store.update((state) => ({
      ...state,
      profile: saveNickname && clean ? { ...state.profile, nickname: clean } : state.profile,
      progress: { ...state.progress, onboardingDone: true },
    }));
    go('/mapa');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span className={styles.stepLabel}>
          Paso {step + 1} de {STEPS.length}
        </span>
        <button type="button" className={styles.skipBtn} onClick={() => finish(false)}>
          Saltar
        </button>
      </div>

      <section className={styles.card} aria-labelledby="onboarding-title">
        <div className={styles.mediaWrap}>
          <img
            src={artUrl(current.image)}
            alt={current.alt}
            className={current.isAvatar ? styles.avatarImg : styles.sceneImg}
          />
        </div>

        <h1 id="onboarding-title" className={styles.title}>
          {current.title}
        </h1>
        <p className={styles.body}>{current.body}</p>

        {isLast ? (
          <label className={styles.nicknameField}>
            <span>¿Cómo quieres que te llame Nubi? (opcional)</span>
            <input
              type="text"
              maxLength={20}
              value={nickname}
              placeholder="Ej. Sofi"
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
        ) : null}

        <div className={styles.dots} aria-hidden="true">
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={`${styles.dot} ${index === step ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <div className={styles.actions}>
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((prev) => prev - 1)}>
              ← Anterior
            </Button>
          ) : null}
          <Button
            className={styles.nextBtn}
            onClick={() => (isLast ? finish(true) : setStep((prev) => prev + 1))}
          >
            {isLast ? 'Ir al Archipiélago →' : 'Siguiente →'}
          </Button>
        </div>
      </section>
    </div>
  );
}
