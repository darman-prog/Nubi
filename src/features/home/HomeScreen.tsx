import { artUrl } from '@/core/content/assets';
import { content } from '@/core/content/content-repository';
import { deriveStamps } from '@/domain/progress/derive-stamps';
import { useTransitionNavigate } from '@/shared/hooks/useTransitionNavigate';
import { useUserState } from '@/shared/state/UserStateContext';
import { Button } from '@/shared/ui/Button';
import { cx } from '@/shared/lib/cx';
import styles from './HomeScreen.module.css';

export default function HomeScreen(): React.JSX.Element {
  const state = useUserState();
  const go = useTransitionNavigate();
  const seals = deriveStamps(state.progress, content.islands);
  const explored = seals.filter((seal) => seal.earned).length;
  const total = seals.length;

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-label="Archipiélago del Sueño">
        <img
          className={styles.heroImage}
          src={artUrl('arte/hero-portada.webp')}
          alt=""
          decoding="async"
        />
        <div className={styles.heroCenter}>
          <div className={styles.logo}>
            <svg
              className={styles.logoCloud}
              viewBox="0 0 300 104"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <path
                transform="translate(0 -4)"
                fill="currentColor"
                d="M38 94 H262
                  A20 20 0 0 0 262 54
                  A26 26 0 0 0 214 36
                  A36 36 0 0 0 150 22
                  A30 30 0 0 0 96 40
                  A31 31 0 0 0 38 54
                  A20 20 0 0 0 38 94 Z"
              />
            </svg>
            <div className={styles.logoText}>
              <h1 className={styles.logoName}>Nubi</h1>
              <span className={styles.logoSub}>y el Archipiélago del Sueño</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-label="Inicio del viaje">
        <p className={styles.subtitle}>
          Un viaje para entender tu sueño: aprende, juega y gana tu sello en cada isla.
        </p>

        <Button className={styles.cta} onClick={() => go('/mapa')}>
          Comenzar viaje
          <span aria-hidden="true">→</span>
        </Button>

        {explored > 0 ? (
          <button
            type="button"
            className={styles.continue}
            onClick={() => go('/mapa')}
            aria-label={`Seguir donde quedaste: ${explored} de ${total} islas exploradas`}
          >
            <span className={styles.continueIcon} aria-hidden="true">
              ▶
            </span>
            <span className={styles.continueText}>
              <span className={styles.continueTitle}>Seguir donde quedaste</span>
              <span className={styles.continueSub}>
                {explored} de {total} islas exploradas
              </span>
            </span>
            <span className={styles.dots} aria-hidden="true">
              {seals.map((seal, index) => (
                <span
                  key={seal.island.id}
                  className={cx(styles.dot, index < explored && styles.dotOn)}
                />
              ))}
            </span>
          </button>
        ) : null}

        <p className={styles.note}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Sin cuentas ni contraseñas: tu viaje se queda en tu celular.
        </p>

        <div className={styles.footer}>
          <button type="button" className={styles.footerButton} onClick={() => go('/ayuda')}>
            <span aria-hidden="true">📖</span> Fuentes y ayuda
          </button>
        </div>
      </section>
    </main>
  );
}
