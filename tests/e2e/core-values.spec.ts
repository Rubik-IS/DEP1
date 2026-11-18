import { test, expect } from '@playwright/test';
import { EXPECTED_CORE_VALUE_TITLES } from '../fixtures/testData';
import {
  attachRuntimeErrorCollector,
  assertNoHorizontalOverflow,
} from '../utils/browserHelpers';

test.describe('Five Core Values Responsive Typography & Fit', () => {
  for (const vp of [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    test(`all 5 core value cards fit cleanly without clipping at ${vp.width}x${vp.height}`, async ({
      page,
    }) => {
      const errors = attachRuntimeErrorCollector(page);
      await page.setViewportSize(vp);
      await page.goto('/');

      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();

      const cards = aboutSection.locator('ul li');
      await expect(cards).toHaveCount(5);

      for (let i = 0; i < EXPECTED_CORE_VALUE_TITLES.length; i++) {
        const card = cards.nth(i);
        await expect(card).toContainText(EXPECTED_CORE_VALUE_TITLES[i]);
        const fit = await card.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const h = el.querySelector('h4')?.getBoundingClientRect();
          const p = el.querySelector('p')?.getBoundingClientRect();
          return {
            w: rect.width,
            hFits: h ? h.right <= rect.right + 1 : true,
            pFits: p ? p.right <= rect.right + 1 : true,
          };
        });
        expect(fit.w).toBeGreaterThan(150);
        expect(fit.hFits).toBe(true);
        expect(fit.pFits).toBe(true);
      }

      await assertNoHorizontalOverflow(page, `core-values-${vp.width}`);
      errors.assertClean();
    });
  }
});
