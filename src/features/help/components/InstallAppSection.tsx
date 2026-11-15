import { useEffect, useState } from 'react';
import {
  isIosSafari,
  isStandaloneDisplay,
  type BeforeInstallPromptEvent,
} from '@/core/pwa/install-state';
import styles from '../HelpScreen.module.css';

/** Sección para instalar Nubi en el dispositivo (Android/desktop/iOS Safari) y ver estado offline. */
export function InstallAppSection(): React.JSX.Element {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const showIosGuide =
    !installed && typeof navigator !== 'undefined' && isIosSafari(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstall = (event: Event): void => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = (): void => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    const handleOnline = (): void => setIsOnline(true);
    const handleOffline = (): void => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <section className={styles.card} aria-labelledby="instalar-title">
      <h2 id="instalar-title">Instalar y usar sin internet</h2>
      <p className={styles.small} role="status">
        Estado de red:{' '}
        {isOnline
          ? 'En línea · Nubi guarda sus islas para cuando no tengas datos.'
          : 'Sin conexión · Puedes seguir usando tus islas y diario guardados.'}
      </p>

      {installed ? (
        <p className={styles.small}>Nubi ya está instalada en este dispositivo.</p>
      ) : null}

      {!installed && deferredPrompt ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            onClick={() => void handleInstallClick()}
          >
            Instalar Nubi en este dispositivo
          </button>
        </div>
      ) : null}

      {showIosGuide ? (
        <p className={styles.small}>
          En iPhone o iPad (Safari): toca el botón Compartir y luego «Añadir a pantalla de inicio»
          para usar Nubi como app sin conexión.
        </p>
      ) : null}
    </section>
  );
}
