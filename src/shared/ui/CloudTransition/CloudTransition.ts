import styles from './CloudTransition.module.css';

// Silueta de nube del archivo de referencia; se reutiliza en las cuatro capas.
const CLOUD_PATH =
  'M0 0H440A62 62 0 0 1 440 120A76 76 0 0 1 440 260A56 56 0 0 1 440 360A80 80 0 0 1 440 500A66 66 0 0 1 440 620A58 58 0 0 1 440 720A48 48 0 0 1 440 800H0Z';

interface LayerSpec {
  side: -1 | 1;
  layer: 'back' | 'front';
  inDelay: number;
  outDelay: number;
}

interface Layer extends LayerSpec {
  el: HTMLDivElement;
}

const LAYERS: LayerSpec[] = [
  { side: -1, layer: 'back', inDelay: 0, outDelay: 90 },
  { side: 1, layer: 'back', inDelay: 0, outDelay: 90 },
  { side: -1, layer: 'front', inDelay: 90, outDelay: 0 },
  { side: 1, layer: 'front', inDelay: 90, outDelay: 0 },
];

const DURATION = 500;
const HOLD = 120;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Combina prefers-reduced-motion con el ajuste manual de la app. */
const shouldReduceMotion = (): boolean => {
  if (typeof document === 'undefined') return true;
  const setting = document.documentElement.dataset.reduceMotion;
  if (setting === 'on') return true;
  if (setting === 'off') return false;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Telón de nubes que cubre el cambio de vista. Se monta una vez y se invoca
 * desde la navegación; no usa contexto para no añadir otro provider.
 */
class CloudTransition {
  private root: HTMLDivElement | null = null;
  private layers: Layer[] = [];
  private busy = false;

  mount = (): void => {
    if (this.root || typeof document === 'undefined') return;
    const root = document.createElement('div');
    root.className = styles.root;
    root.setAttribute('aria-hidden', 'true');

    this.layers = LAYERS.map((spec) => {
      const el = document.createElement('div');
      const side = spec.side < 0 ? styles.left : styles.right;
      el.className = `${styles.cloud} ${side} ${styles[spec.layer]}`;
      el.innerHTML = `<svg viewBox="0 0 600 800" preserveAspectRatio="none"><path d="${CLOUD_PATH}"/></svg>`;
      root.appendChild(el);
      return { ...spec, el };
    });

    this.root = root;
    document.body.appendChild(root);
  };

  unmount = (): void => {
    this.layers.forEach((layer) => layer.el.getAnimations().forEach((animation) => animation.cancel()));
    this.root?.remove();
    this.root = null;
    this.layers = [];
  };

  go = async (changeView: () => void | Promise<void>): Promise<void> => {
    if (this.busy) return;
    this.busy = true;

    try {
      if (shouldReduceMotion()) {
        await changeView();
        return;
      }

      this.mount();
      if (!this.root) {
        await changeView();
        return;
      }

      this.root.style.display = 'block';
      await Promise.all(this.layers.map((layer) => this.slide(layer, true)));
      await changeView();
      await sleep(HOLD);
      await Promise.all(this.layers.map((layer) => this.slide(layer, false)));
    } finally {
      // Si changeView falla, el telón igual se retira para no dejar la app bloqueada.
      if (this.root) {
        this.layers.forEach((layer) =>
          layer.el.getAnimations().forEach((animation) => animation.cancel()),
        );
        this.root.style.display = 'none';
      }
      this.busy = false;
    }
  };

  private slide = (layer: Layer, enter: boolean): Promise<void> =>
    layer.el
      .animate(
        [{ transform: `translateX(${layer.side * 100}%)` }, { transform: 'translateX(0)' }],
        {
          duration: DURATION,
          delay: enter ? layer.inDelay : layer.outDelay,
          easing: 'cubic-bezier(.7,0,.3,1)',
          fill: 'both',
          direction: enter ? 'normal' : 'reverse',
        },
      )
      .finished.then(() => undefined);
}

export const cloudTransition = new CloudTransition();
