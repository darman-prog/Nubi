import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloudTransition } from './CloudTransition';

describe('cloudTransition', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-reduce-motion');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-reduce-motion');
    cloudTransition.unmount();
  });

  it('con reduceMotion=on navega sin montar el telón', async () => {
    document.documentElement.dataset.reduceMotion = 'on';
    const changeView = vi.fn();
    const childrenBefore = document.body.childElementCount;

    await cloudTransition.go(changeView);

    expect(changeView).toHaveBeenCalledTimes(1);
    expect(document.body.childElementCount).toBe(childrenBefore);
  });

  it('ignora una navegación mientras la anterior sigue en curso', async () => {
    document.documentElement.dataset.reduceMotion = 'on';
    let resolveFirst: (() => void) | undefined;
    const first = cloudTransition.go(
      () =>
        new Promise<void>((resolve) => {
          resolveFirst = resolve;
        }),
    );
    const second = vi.fn();

    await cloudTransition.go(second);
    expect(second).not.toHaveBeenCalled();

    resolveFirst?.();
    await first;
  });
});
