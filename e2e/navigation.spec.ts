import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const curtainDisplay = (page: Page): Promise<string> =>
  page
    .locator('[data-cloud-transition]')
    .evaluate((element) => getComputedStyle(element).display);

test.describe('transiciones de navegación', () => {
  test('mapa, diario y ayuda conservan el telón de nubes', async ({ page }) => {
    const routes = [
      { from: '/diario', label: 'Mapa', to: '/mapa' },
      { from: '/mapa', label: 'Diario', to: '/diario' },
      { from: '/diario', label: 'Ayuda', to: '/ayuda' },
    ];

    for (const route of routes) {
      await page.goto(route.from);
      await page.getByRole('link', { name: route.label }).click();

      // El telón se muestra antes de cambiar de URL y se retira al terminar.
      await expect.poll(() => curtainDisplay(page)).toBe('block');
      await expect(page).toHaveURL(route.to);
      await expect.poll(() => curtainDisplay(page)).toBe('none');
    }
  });

  test('cerrar una isla vuelve al mapa con el telón', async ({ page }) => {
    await page.goto('/isla/nido/llegada');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect.poll(() => curtainDisplay(page)).toBe('block');
    await expect(page).toHaveURL('/mapa');
  });

  test('el pasaporte sube como hoja, sin nubes, y cierra directo al mapa', async ({ page }) => {
    await page.goto('/mapa');

    await page.evaluate(() => {
      const view = window as Window & { __sheetAnimations?: string[] };
      view.__sheetAnimations = [];
      new MutationObserver(() => {
        document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
          dialog.getAnimations().forEach((animation) => {
            const name = (animation as CSSAnimation).animationName;
            if (name && !view.__sheetAnimations?.includes(name)) view.__sheetAnimations?.push(name);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    });

    await page.getByRole('link', { name: 'Pasaporte' }).click();

    const dialog = page.getByRole('dialog', { name: 'Pasaporte' });
    await expect(dialog).toBeVisible();
    await expect.poll(() => curtainDisplay(page)).toBe('none');

    const animations = await page.evaluate(
      () => (window as Window & { __sheetAnimations?: string[] }).__sheetAnimations ?? [],
    );
    expect(animations.length).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page).toHaveURL('/mapa');
    await expect.poll(() => curtainDisplay(page)).toBe('none');
  });
});
