import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

const LOCAL_CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const resolvedExecutablePath =
  process.env.CHROME_PATH ||
  (process.platform === 'win32' && fs.existsSync(LOCAL_CHROME_PATH)
    ? LOCAL_CHROME_PATH
    : undefined);

export default defineConfig({
  testDir: './tests',
  testMatch: [
    'e2e/**/*.spec.ts',
    'visual/**/*.spec.ts',
    'accessibility/**/*.spec.ts',
    'seo/**/*.spec.ts',
    'analytics/**/*.spec.ts',
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    },
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'tests/reports/playwright-results.json' }],
    ['html', { outputFolder: 'tests/reports/playwright-html', open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: resolvedExecutablePath
      ? { executablePath: resolvedExecutablePath }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
