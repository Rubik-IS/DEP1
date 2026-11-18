import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES_TO_AUDIT = [
  '/',
  '/capabilities',
  '/solutions/zkteco-attendance',
  '/solutions/weighing-management',
  '/about',
  '/contact',
];

test.describe('WCAG 2.2 AA Accessibility Audit (@axe-core/playwright)', () => {
  for (const route of ROUTES_TO_AUDIT) {
    test(`zero critical or serious WCAG 2.2 AA violations on ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: 'networkidle' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(
        blocking,
        `Accessibility violations on ${route}: ${JSON.stringify(
          blocking.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            help: v.help,
          })),
          null,
          2
        )}`
      ).toEqual([]);
    });
  }
});
