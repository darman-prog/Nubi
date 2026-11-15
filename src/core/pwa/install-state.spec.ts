import { describe, expect, it } from 'vitest';
import { isIosSafari, isStandaloneDisplay } from './install-state';

describe('install-state', () => {
  it('detecta Safari en iOS y descarta Chrome/Firefox en iOS o escritorio', () => {
    const iphoneSafari =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
    const iphoneChrome =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1';
    const androidChrome =
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36';

    expect(isIosSafari(iphoneSafari)).toBe(true);
    expect(isIosSafari(iphoneChrome)).toBe(false);
    expect(isIosSafari(androidChrome)).toBe(false);
  });

  it('detecta modo standalone mediante navigator.standalone o display-mode', () => {
    const fakeWin = {
      matchMedia: (query: string) => ({ matches: query === '(display-mode: standalone)' }),
      navigator: {},
    } as unknown as Window;

    expect(isStandaloneDisplay(fakeWin)).toBe(true);

    const iosStandaloneWin = {
      matchMedia: () => ({ matches: false }),
      navigator: { standalone: true },
    } as unknown as Window;

    expect(isStandaloneDisplay(iosStandaloneWin)).toBe(true);
  });
});
