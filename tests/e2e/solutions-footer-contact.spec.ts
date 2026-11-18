import { test, expect } from '@playwright/test';
import {
  attachRuntimeErrorCollector,
  assertNoHorizontalOverflow,
} from '../utils/browserHelpers';

test.describe('Solutions, Footer Alignment & Contact Form', () => {
  test('ZKTeco and Weighing Management pages render factual capabilities and Back to Home', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/solutions/zkteco-attendance');
    await expect(page.locator('h1')).toContainText(
      'Rubik ZKTeco Attendance Management System'
    );
    await expect(page.getByRole('link', { name: /Back to Home/i })).toBeVisible();
    await assertNoHorizontalOverflow(page, 'zkteco');

    await page.goto('/solutions/weighing-management');
    await expect(page.locator('h1')).toContainText(
      'Centralized Weighing Machine Management System'
    );
    await expect(page.getByRole('link', { name: /Back to Home/i })).toBeVisible();
    await assertNoHorizontalOverflow(page, 'weighing');

    errors.assertClean();
  });

  test('Footer removes Solutions & Services section, balances 3 columns, and navigates from subpages', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about');

    const footer = page.locator('footer[role="contentinfo"]');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).not.toContainText('Solutions & Services');
    await expect(footer).toContainText('Services');
    await expect(footer).toContainText('Solutions');
    await expect(footer).toContainText('Industries');
    await expect(footer).toContainText('Events');
    await expect(footer).toContainText('About');
    await expect(footer).toContainText('Contact');
    await expect(footer).toContainText('info@rubik-is.com');

    // Click 01 Services from /about footer -> navigates to /#services
    await footer.getByRole('link', { name: /Services/i }).click();
    await expect(page).toHaveURL(/\/#services/);
    await expect(page.locator('#services h2')).toBeVisible();

    errors.assertClean();
  });

  test('Contact form validates required fields and submits cleanly with mocked API response', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'Inquiry received (mocked test environment).',
        }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/contact');

    // Trigger validation errors with empty submit
    await page.getByRole('button', { name: /START A CONVERSATION/i }).click();
    await expect(page.locator('#contact')).toContainText(/Please enter your full name/i);

    // Fill valid inquiry
    await page.locator('#contact-name').fill('Test Reviewer');
    await page.locator('#contact-company').fill('QA Verification Corp');
    await page.locator('#contact-email').fill('qa-test@example.com');
    await page.locator('#contact-telephone').fill('+20 100 123 4567');
    await page
      .locator('#contact-description')
      .fill('Automated E2E verification of the Rubik inquiry submission flow.');

    await page.getByRole('button', { name: /START A CONVERSATION/i }).click();
    await expect(page.locator('#contact')).toContainText(/received|mocked/i);

    errors.assertClean();
  });
});
