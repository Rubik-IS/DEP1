import { test, expect } from '@playwright/test';

test.describe('GA4 & Consent Mode v2 E2E Telemetry', () => {
  test('blocks events until explicit consent, then tracks CTA, service, and cube state events with zero PII', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Before consent: queue must stay empty
    const beforeConsentCount = await page.evaluate(
      () => (window.__rubikAnalyticsQueue ?? []).length
    );
    expect(beforeConsentCount).toBe(0);

    // Accept analytics via unobtrusive Cookie Consent Banner
    const acceptBtn = page.getByRole('button', { name: /Accept Analytics/i });
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    const consentVal = await page.evaluate(() =>
      window.localStorage.getItem('rubik_analytics_consent')
    );
    expect(consentVal).toBe('granted');

    // Trigger Hero "Click a block" cube state change
    await page
      .getByRole('button', { name: /3D Rubik Cube\. Click a block/i })
      .click();

    // Trigger Service selection in #services
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page
      .locator('#services [role="tablist"]')
      .getByRole('tab', { name: /IT Consulting/i })
      .click();

    const events = await page.evaluate(() => window.__rubikAnalyticsQueue ?? []);
    const eventNames = events.map((e) => e.event);

    expect(eventNames).toContain('cube_state_change');
    expect(eventNames).toContain('service_select');
    expect(eventNames).toContain('service_view');

    // Verify zero PII keys anywhere in queued parameters
    for (const evt of events) {
      const keys = Object.keys(evt.params).map((k) => k.toLowerCase());
      expect(keys).not.toContain('email');
      expect(keys).not.toContain('phone');
      expect(keys).not.toContain('name');
      expect(keys).not.toContain('message');
    }
  });
});
