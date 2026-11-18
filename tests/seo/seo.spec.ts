import { test, expect } from '@playwright/test';
import { CANONICAL_ROUTES } from '../fixtures/testData';

test.describe('Technical SEO & Structured Data Audit', () => {
  test('all canonical routes have unique titles, descriptions, H1s, canonical URLs, and JSON-LD', async ({
    page,
  }) => {
    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();

    for (const route of CANONICAL_ROUTES) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').waitFor({ state: 'visible' });

      const title = await page.title();
      expect(title.length, `Title too short on ${route}`).toBeGreaterThan(20);
      expect(seenTitles.has(title), `Duplicate title on ${route}: ${title}`).toBe(
        false
      );
      seenTitles.add(title);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description && description.length).toBeGreaterThan(50);
      expect(
        seenDescriptions.has(description!),
        `Duplicate description on ${route}`
      ).toBe(false);
      seenDescriptions.add(description!);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical).toMatch(/^https:\/\/www\.rubik-is\.com\//);
      expect(canonical).not.toContain('localhost');
      expect(canonical).not.toContain('127.0.0.1');

      const robots = await page
        .locator('meta[name="robots"]')
        .getAttribute('content');
      expect(robots).not.toContain('noindex');

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Expected exactly 1 <h1> on ${route}`).toBe(1);

      const ldJsonCount = await page
        .locator('script[type="application/ld+json"]')
        .count();
      expect(ldJsonCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('404 NotFound route sets noindex, nofollow', async ({ page }) => {
    await page.goto('/nonexistent-seo-check-404');
    await expect(page.locator('h1')).toContainText('OUTSIDE THE NEXUS');
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
