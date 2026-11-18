import { test } from '@playwright/test';
import { TEST_VIEWPORTS } from '../fixtures/testData';
import {
  attachRuntimeErrorCollector,
  assertNoHorizontalOverflow,
} from '../utils/browserHelpers';

test.describe('Full Responsive Viewport Sweep (320px to 2560px)', () => {
  for (const vp of TEST_VIEWPORTS) {
    test(`zero horizontal overflow and clean runtime at ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      const errors = attachRuntimeErrorCollector(page);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      await assertNoHorizontalOverflow(page, `${vp.name}-${vp.width}x${vp.height}`);
      errors.assertClean();
    });
  }
});
