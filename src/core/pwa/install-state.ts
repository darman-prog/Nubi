/** Evento estándar de Chromium/Android para diferir el cuadro de instalación PWA. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Detecta Safari en iOS/iPadOS excluyendo otros navegadores iOS que no permiten instalar PWA. */
export function isIosSafari(userAgent: string): boolean {
  const isIosDevice = /iPad|iPhone|iPod/i.test(userAgent);
  const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
  const isSafariEngine = /Safari/i.test(userAgent);
  return isIosDevice && isSafariEngine && !isOtherIosBrowser;
}

/** Verifica si la app ya se ejecuta instalada en modo independiente (standalone). */
export function isStandaloneDisplay(win: Window = window): boolean {
  const mediaStandalone =
    typeof win.matchMedia === 'function' && win.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (win.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mediaStandalone || iosStandalone;
}
