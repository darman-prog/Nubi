import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { name: 'portada', path: '/' },
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
  { name: '320', width: 320, height: 568 },
  { name: '390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of VIEWPORTS) {
  test.describe(`responsive ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route.name} no desborda`, async ({ page }) => {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${route.path} a ${viewport.width}px`).toBeLessThanOrEqual(1);

        if (viewport.name === '390' || viewport.name === 'desktop') {
          const results = await new AxeBuilder({ page }).analyze();
          const serious = results.violations.filter(
            (violation) => violation.impact === 'serious' || violation.impact === 'critical',
          );
          expect(
            serious.map((violation) => ({ id: violation.id, nodes: violation.nodes.length })),
            `${route.path} axe`,
          ).toEqual([]);

          await page.screenshot({
            path: `test-results/screens/${route.name}-${viewport.name}.png`,
          });
          if (route.name === 'mapa') {
            await page.screenshot({
              path: `test-results/screens/mapa-${viewport.name}-full.png`,
              fullPage: true,
            });
          }
        }
      });
    }
  });
}
