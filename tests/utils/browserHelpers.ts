import { expect, type Page } from '@playwright/test';

export interface RuntimeErrorCollector {
  consoleErrors: string[];
  failedRequests: string[];
  assertClean: () => void;
}

export function attachRuntimeErrorCollector(page: Page): RuntimeErrorCollector {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    const failureText = req.failure()?.errorText ?? 'requestfailed';
    // Ignore aborted requests triggered during rapid navigation
    if (failureText !== 'net::ERR_ABORTED') {
      failedRequests.push(`${req.method()} ${req.url()} (${failureText})`);
    }
  });

  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('/nonexistent')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  return {
    consoleErrors,
    failedRequests,
    assertClean: () => {
      expect(consoleErrors, `Console errors: ${consoleErrors.join('; ')}`).toEqual([]);
      expect(failedRequests, `Failed requests: ${failedRequests.join('; ')}`).toEqual([]);
    },
  };
}

export async function assertNoHorizontalOverflow(page: Page, label?: string): Promise<void> {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    metrics.scrollWidth,
    `Horizontal overflow detected${label ? ` (${label})` : ''}: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`
  ).toBeLessThanOrEqual(metrics.innerWidth);
}
