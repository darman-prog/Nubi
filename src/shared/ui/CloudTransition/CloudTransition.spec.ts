import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloudTransition } from './CloudTransition';

describe('cloudTransition', () => {
  const originalAnimate = Element.prototype.animate;
  const originalGetAnimations = Element.prototype.getAnimations;

  beforeEach(() => {
    // jsdom no implementa Web Animations API; simulamos una animación completada.
    Element.prototype.animate = vi.fn(
      () =>
        ({
          finished: Promise.resolve(),
          cancel: vi.fn(),
        }) as unknown as Animation,
    );
    Element.prototype.getAnimations = vi.fn(() => []);
  });

  afterEach(() => {
    cloudTransition.unmount();
    Element.prototype.animate = originalAnimate;
    Element.prototype.getAnimations = originalGetAnimations;
  });

  it('monta el telón de nubes, cambia la vista y oculta la cortina al terminar', async () => {
    const changeView = vi.fn();

    await cloudTransition.go(changeView);

    expect(changeView).toHaveBeenCalledTimes(1);
    const curtain = document.querySelector<HTMLElement>('[data-cloud-transition]');
    expect(curtain).not.toBeNull();
    expect(curtain?.style.display).toBe('none');
  });

  it('ignora una navegación mientras la anterior sigue en curso', async () => {
    let resolveFirst: (() => void) | undefined;
    // Crea la promesa antes de llamar go() para evitar carreras con los microtasks de slide().
    const pendingView = new Promise<void>((resolve) => {
      resolveFirst = resolve;
    });
    const first = cloudTransition.go(() => pendingView);
    const second = vi.fn();

    await cloudTransition.go(second);
    expect(second).not.toHaveBeenCalled();

    resolveFirst?.();
    await first;
  });
});
