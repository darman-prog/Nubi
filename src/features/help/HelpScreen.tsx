import { content } from '@/core/content/content-repository';
import { DataBackupSection } from './components/DataBackupSection';
import { InstallAppSection } from './components/InstallAppSection';
import { SettingsSection } from './components/SettingsSection';
import styles from './HelpScreen.module.css';

const SIGNS = [
  { icon: '☀️', title: 'Mucho sueño durante el día', subtitle: 'Cansancio constante en clases o desconexión habitual a la tarde.', bgClass: styles.signSun },
  { icon: '🌬️', title: 'Ronquido fuerte o pausas al respirar', subtitle: 'Despertarte con boca muy seca o sensación de ahogo suave en la noche.', bgClass: styles.signAir },
  { icon: '🛡️', title: 'Pesadillas frecuentes', subtitle: 'Sueños que te intranquilizan a menudo o temor al momento de ir a la cama.', bgClass: styles.signShield },
  { icon: '💜', title: 'Sentirte triste, irritable o abrumado', subtitle: 'Tus emociones se sienten demasiado pesadas durante muchos días continuos.', bgClass: styles.signHeart },
];

export default function HelpScreen(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Un espacio seguro</p>
        <h1 className={styles.title}>Ayuda</h1>
        <p className={styles.subtitle}>Cuidado, fuentes y control de tus datos</p>
      </header>

      <section className={styles.heroCard} aria-labelledby="hero-title">
        <div className={styles.heroAura} aria-hidden="true">☁️</div>
        <h2 id="hero-title" className={styles.heroTitle}>No tienes que resolver esto solo.</h2>
        <p className={styles.heroText}>
          Cuidar tu descanso y tus emociones es un camino acompañado. Estamos aquí para orientarte con tranquilidad y paciencia.
        </p>
        <span className={styles.heroPill}>Espacio amable · Sin presiones</span>
      </section>

      <section className={styles.card} aria-labelledby="senales-title">
        <h2 id="senales-title">Señales para hablar con un adulto</h2>
        <p className={styles.small}>Si notas estas sensaciones durante varias semanas continuas:</p>

        <div className={styles.bentoList}>
          {SIGNS.map((sign) => (
            <div key={sign.title} className={styles.bentoItem}>
              <div className={`${styles.bentoIcon} ${sign.bgClass}`} aria-hidden="true">{sign.icon}</div>
              <div className={styles.bentoText}>
                <h3 className={styles.bentoTitle}>{sign.title}</h3>
                <p className={styles.bentoSub}>{sign.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="que-hacer-title">
        <h2 id="que-hacer-title">Qué puedes hacer</h2>
        <p className={styles.small}>Pasos sencillos para aliviar la carga:</p>

        <div className={styles.stepsList}>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <p className={styles.stepTitle}>Hablar con un adulto de confianza</p>
              <p className={styles.stepSub}>Puede ser tu mamá, papá, docente u orientación escolar de tu colegio.</p>
            </div>
          </div>

          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <p className={styles.stepTitle}>Consultar con un profesional de la salud</p>
              <p className={styles.stepSub}>Pediatra, médico de cabecera o especialista en medicina del sueño.</p>
            </div>
          </div>
        </div>
      </section>

      <SettingsSection />
      <DataBackupSection />
      <InstallAppSection />

      <section className={styles.card} aria-labelledby="fuentes-title">
        <h2 id="fuentes-title">Fuentes y evidencia</h2>
        <p className={styles.small}>Cada afirmación de salud se apoya en una ficha revisable.</p>
        <div className={styles.sources}>
          {content.evidence
            .filter((item) => !item.restricted)
            .map((item) => (
              <details key={item.id} className={styles.source}>
                <summary>{item.id} · {item.claimTeen}</summary>
                <p>{item.source.citation}</p>
                <p>{item.population} · {item.design} · Nivel {item.level}</p>
                <p>{item.limitations}</p>
              </details>
            ))}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="acerca-title">
        <h2 id="acerca-title">Acerca de Nubi</h2>
        <p className={styles.small}>
          Nubi y el Archipiélago del Sueño (v0.1) es una guía educativa interactiva sin cuentas ni analíticas.
          Todo lo que respondes se queda en este dispositivo.
        </p>
      </section>

      <p className={styles.disclaimer}>Esta app informa y no reemplaza a un profesional de la salud.</p>
    </div>
  );
}
