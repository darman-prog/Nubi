import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { name: 'portada', path: '/' },
  { name: 'bienvenida', path: '/bienvenida' },
  { name: 'mapa', path: '/mapa' },
  { name: 'isla-llegada', path: '/isla/reloj/llegada' },
  { name: 'isla-historia', path: '/isla/reloj/historia' },
  { name: 'isla-retos', path: '/isla/reloj/retos' },
  { name: 'isla-sello', path: '/isla/reloj/sello' },
  { name: 'pasaporte', path: '/pasaporte' },
  { name: 'diario', path: '/diario' },
  { name: 'ayuda', path: '/ayuda' },
  { name: 'coronacion', path: '/coronacion' },
  { name: 'niebla', path: '/isla/pantalla' },
];

const VIEWPORTS = [
  { name: '360', width: 360, height: 780 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'landscape', width: 844, height: 390 },
];

const THEMES = ['light', 'dark'] as const;

const seedUserState = (theme: 'light' | 'dark', textScale: 1 | 1.5 = 1) => ({
  schemaVersion: 1,
  createdAt: '2026-11-14',
  profile: {},
  settings: { theme, reduceMotion: 'system', textScale, sound: true },
  progress: { onboardingDone: true, islands: {}, chains: [] },
  challenges: [],
  experiments: [],
  diary: [],
});

for (const theme of THEMES) {
  for (const viewport of VIEWPORTS) {
    test.describe(`responsive ${theme} ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test.beforeEach(async ({ page }) => {
        const seeded = seedUserState(theme, 1);
        await page.addInitScript((state) => {
          window.localStorage.setItem('nubi:v1', JSON.stringify(state));
        }, seeded);
      });

      for (const route of ROUTES) {
        test(`${route.name} (${theme}) sin desborde y accesible`, async ({ page }) => {
          await page.goto(route.path);
          await page.waitForLoadState('networkidle');

          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          expect(overflow, `${route.path} (${theme}) a ${viewport.width}px`).toBeLessThanOrEqual(1);

          // Pasada axe en móvil y desktop para ambos temas.
          if (viewport.name === '360' || viewport.name === 'desktop') {
            const results = await new AxeBuilder({ page }).analyze();
            const serious = results.violations.filter(
              (violation) => violation.impact === 'serious' || violation.impact === 'critical',
            );
            expect(
              serious.map((violation) => ({ id: violation.id, nodes: violation.nodes.length })),
              `${route.path} (${theme}) axe`,
            ).toEqual([]);

            await page.screenshot({
              path: `test-results/screens/${route.name}-${theme}-${viewport.name}.png`,
            });
          }
        });
      }
    });
  }
}

test('escala 150 % en 320px no produce scroll horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript((state) => {
    window.localStorage.setItem('nubi:v1', JSON.stringify(state));
  }, seedUserState('light', 1.5));

  for (const path of ['/', '/mapa', '/pasaporte', '/diario', '/ayuda', '/isla/reloj/llegada']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${path} al 150 % en 320px`).toBeLessThanOrEqual(1);
  }
});

test('teclado Tab muestra foco visible y animaciones permanecen activas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((state) => {
    window.localStorage.setItem('nubi:v1', JSON.stringify(state));
  }, seedUserState('dark', 1));

  await page.goto('/mapa');
  await page.waitForLoadState('networkidle');

  await page.keyboard.press('Tab');
  const activeOutline = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? getComputedStyle(el).outlineStyle : 'none';
  });
  expect(activeOutline).not.toBe('none');

  // Incluso con prefers-reduced-motion del SO activo, las animaciones e islas siguen flotando.
  const activeLoops = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((anim) => anim.effect?.getComputedTiming().iterations === Infinity).length,
  );
  expect(activeLoops).toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Diario' }).click();
  await expect
    .poll(() =>
      page
        .locator('[data-cloud-transition]')
        .evaluate((el) => getComputedStyle(el).display),
    )
    .toBe('block');
  await expect(page).toHaveURL('/diario');
});
