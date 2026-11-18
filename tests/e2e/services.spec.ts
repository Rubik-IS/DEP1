import { test, expect } from '@playwright/test';
import { EXPECTED_SERVICE_TITLES } from '../fixtures/testData';
import { attachRuntimeErrorCollector } from '../utils/browserHelpers';

test.describe('Our Services Section (Desktop Two-Column & Mobile Accordion Toggle)', () => {
  test('desktop (1440x900) keeps fixed two-column height across all 8 services', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();

    const tablist = servicesSection.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();

    const initialTablistBox = await tablist.boundingBox();
    expect(initialTablistBox).not.toBeNull();

    for (let i = 0; i < EXPECTED_SERVICE_TITLES.length; i++) {
      const title = EXPECTED_SERVICE_TITLES[i];
      const tab = tablist.getByRole('tab', { name: new RegExp(title, 'i') });
      await tab.click();

      const tabpanel = servicesSection.locator('[role="tabpanel"]');
      await expect(tabpanel).toBeVisible();
      await expect(tabpanel).toContainText(title);
      await expect(tabpanel).toContainText('BUSINESS VALUE DELIVERED');
      await expect(tabpanel.locator('ul li')).toHaveCount(6);

      const currentBox = await tablist.boundingBox();
      expect(currentBox!.height).toBeCloseTo(initialTablistBox!.height, 1);
      expect(currentBox!.width).toBeCloseTo(initialTablistBox!.width, 1);
    }

    // Verify 07 IT Support expandable Learn More drawer includes Subgroups A & B
    await tablist
      .getByRole('tab', { name: /IT Support & Managed IT Services/i })
      .click();
    await servicesSection
      .locator('[role="tabpanel"]')
      .getByRole('button', { name: /Learn More/i })
      .click();
    await expect(servicesSection.locator('[role="tabpanel"]')).toContainText(
      'Service Desk & Remote IT Support'
    );
    await expect(servicesSection.locator('[role="tabpanel"]')).toContainText(
      'Onsite IT Support & Infrastructure Operations'
    );

    errors.assertClean();
  });

  for (const width of [320, 375, 430, 768]) {
    test(`mobile/tablet (${width}px) expands inline below clicked item, collapses on 2nd click, and switches cleanly`, async ({
      page,
    }) => {
      const errors = attachRuntimeErrorCollector(page);
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      const servicesSection = page.locator('#services');
      await servicesSection.scrollIntoViewIfNeeded();

      const tab03 = page.locator('#service-tab-custom-software-applications');
      const tab04 = page.locator('#service-tab-enterprise-business-systems');
      const tab06 = page.locator('#service-tab-it-consulting');

      // Default collapsed
      await expect(tab03).toHaveAttribute('aria-expanded', 'false');
      await expect(
        servicesSection.locator('[role="region"]:visible')
      ).toHaveCount(0);

      // 1st click: expand Service 03 directly beneath tab 03
      await tab03.click();
      await expect(tab03).toHaveAttribute('aria-expanded', 'true');
      const card03 = page.locator(
        '#service-panel-mobile-custom-software-applications'
      );
      await expect(card03).toBeVisible();
      await expect(
        servicesSection.locator('[role="region"]:visible')
      ).toHaveCount(1);

      const boxTab03 = await tab03.boundingBox();
      const boxCard03 = await card03.boundingBox();
      const boxTab04 = await tab04.boundingBox();
      expect(boxCard03!.y).toBeGreaterThanOrEqual(
        boxTab03!.y + boxTab03!.height - 2
      );
      expect(boxTab04!.y).toBeGreaterThanOrEqual(
        boxCard03!.y + boxCard03!.height - 2
      );

      // 2nd click on same item: collapses
      await tab03.click();
      await expect(tab03).toHaveAttribute('aria-expanded', 'false');
      await expect(
        servicesSection.locator('[role="region"]:visible')
      ).toHaveCount(0);

      // Click different service (06): opens 06
      await tab06.click();
      await expect(tab06).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#service-panel-mobile-it-consulting')).toBeVisible();
      await expect(
        servicesSection.locator('[role="region"]:visible')
      ).toHaveCount(1);

      errors.assertClean();
    });
  }
});
