import { test, expect } from '@playwright/test';

test.describe('Visual Regression Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Pre-grant consent so banner does not obscure footer/bottom screenshots
      window.localStorage.setItem('rubik_analytics_consent', 'granted');
    });
  });

  test('desktop Hero & Services snapshots match baseline (1440x900)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(450);

    await expect(page.locator('#hero')).toHaveScreenshot('hero-1440x900.png', {
      mask: [page.locator('canvas')],
    });

    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await expect(page.locator('#services')).toHaveScreenshot(
      'services-1440x900.png'
    );

    await page.locator('footer[role="contentinfo"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await expect(page.locator('footer[role="contentinfo"]')).toHaveScreenshot(
      'footer-1440x900.png'
    );
  });

  test('mobile Services accordion & Solutions snapshots match baseline', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.locator('#service-tab-custom-software-applications').click();
    await page.waitForTimeout(400);

    await expect(page.locator('#services')).toHaveScreenshot(
      'services-mobile-375x667.png'
    );

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/solutions/zkteco-attendance', { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);
    await expect(page.locator('main')).toHaveScreenshot(
      'solution-zkteco-1440x900.png'
    );
  });
});
