import { test, expect } from '@playwright/test';
import {
  attachRuntimeErrorCollector,
  assertNoHorizontalOverflow,
} from '../utils/browserHelpers';

test.describe('Main Navigation & Discuss a Project Containment', () => {
  for (const width of [320, 375, 430, 768, 900]) {
    test(`mobile/tablet drawer contains navigation and Discuss a Project at ${width}px`, async ({
      page,
    }) => {
      const errors = attachRuntimeErrorCollector(page);
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      const trigger = page.getByRole('button', { name: /Open navigation menu/i });
      await expect(trigger).toBeVisible();
      await trigger.click();

      const drawer = page.locator('#rubik-mobile-drawer');
      await expect(drawer).toBeVisible();
      const drawerCta = drawer.getByRole('button', { name: /Discuss a Project/i });
      await expect(drawerCta).toBeVisible();

      const drawerBox = await drawer.boundingBox();
      const ctaBox = await drawerCta.boundingBox();
      expect(drawerBox).not.toBeNull();
      expect(ctaBox).not.toBeNull();
      expect(ctaBox!.x).toBeGreaterThanOrEqual(drawerBox!.x);
      expect(ctaBox!.x + ctaBox!.width).toBeLessThanOrEqual(
        drawerBox!.x + drawerBox!.width + 1
      );

      await assertNoHorizontalOverflow(page, `nav-drawer-${width}px`);
      errors.assertClean();
    });
  }

  for (const width of [1024, 1280, 1440, 1920]) {
    test(`desktop navbar keeps Discuss a Project inside <nav> without overlap at ${width}px`, async ({
      page,
    }) => {
      const errors = attachRuntimeErrorCollector(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const nav = page.locator('header nav');
      const contactLink = nav.getByRole('link', { name: /Contact/i });
      const ctaBtn = nav.getByRole('button', { name: /Discuss a Project/i });

      await expect(contactLink).toBeVisible();
      await expect(ctaBtn).toBeVisible();

      const navBox = await nav.boundingBox();
      const contactBox = await contactLink.boundingBox();
      const ctaBox = await ctaBtn.boundingBox();

      expect(navBox && contactBox && ctaBox).toBeTruthy();
      expect(ctaBox!.x).toBeGreaterThan(contactBox!.x + contactBox!.width + 8);
      expect(ctaBox!.x + ctaBox!.width).toBeLessThanOrEqual(
        navBox!.x + navBox!.width
      );

      await assertNoHorizontalOverflow(page, `nav-desktop-${width}px`);
      errors.assertClean();
    });
  }

  test('Solutions dropdown navigates to both flagship solutions and Back to Home returns cleanly', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('header nav').getByRole('button', { name: /Solutions/i }).click();
    const menu = page.locator('#solutions-desktop-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('menuitem', { name: /ZKTeco/i }).click();

    await expect(page).toHaveURL(/\/solutions\/zkteco-attendance/);
    await expect(page.locator('h1')).toContainText('ZKTeco');
    await page.getByRole('link', { name: /Back to Home/i }).click();
    await expect(page).toHaveURL(/\/$/);

    errors.assertClean();
  });
});
