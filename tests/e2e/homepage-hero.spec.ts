import { test, expect } from '@playwright/test';
import {
  attachRuntimeErrorCollector,
  assertNoHorizontalOverflow,
} from '../utils/browserHelpers';

test.describe('Homepage & Hero Section', () => {
  test('renders centered Hero immediately on fast load without preloader blocking and toggles Click a block cleanly', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const h1 = page.locator('#hero h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('MAKE EVERY SYSTEM');
    await expect(h1).toContainText('WORK AS ONE.');

    // Fast-load suppression: overlay must not block fast loads
    await expect(
      page.locator('[aria-label*="Loading Rubik Integrated Systems"]')
    ).toHaveCount(0);

    // Numbered Hero service chips must remain removed
    await expect(
      page.locator('[aria-label="Interactive Service Nodes"]')
    ).toHaveCount(0);

    // Hero vertical centering check inside 900px viewport
    const h1Box = await h1.boundingBox();
    expect(h1Box).not.toBeNull();
    expect(h1Box!.y).toBeGreaterThan(220);
    expect(h1Box!.y + h1Box!.height).toBeLessThan(620);

    // Borderless "Click a block" indicator toggle without rectangular outline/border
    const toggleBtn = page.getByRole('button', {
      name: /3D Rubik Cube\. Click a block/i,
    });
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');

    const postClickStyles = await toggleBtn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        borderWidth: cs.borderTopWidth,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
      };
    });
    expect(postClickStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(postClickStyles.borderWidth).toBe('0px');
    expect(
      postClickStyles.outlineStyle === 'none' ||
        postClickStyles.outlineWidth === '0px' ||
        postClickStyles.outlineColor === 'rgba(0, 0, 0, 0)'
    ).toBe(true);

    // Wait past 750ms transition lock and toggle back
    await page.waitForTimeout(820);
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

    await assertNoHorizontalOverflow(page, 'hero-1440x900');
    errors.assertClean();
  });
});
