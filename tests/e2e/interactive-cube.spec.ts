import { test, expect } from '@playwright/test';
import { attachRuntimeErrorCollector } from '../utils/browserHelpers';

test.describe('Interactive 3D Rubik Cube & WebGL Fallback', () => {
  test('mounts 3D canvas, displays accurate hover tooltips, persists selection, switches rapidly, and resets cleanly', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Trigger immediate 3D mount via pointer move
    await page.mouse.move(900, 420);
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(450);

    // Probe cube surface for hover tooltip ("Click to inspect")
    let sawTooltip = false;
    for (const [x, y] of [
      [930, 380],
      [860, 430],
      [980, 460],
      [820, 350],
    ]) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(120);
      const tooltip = page.locator('body > div[role="status"]');
      if ((await tooltip.count()) > 0 && (await tooltip.isVisible())) {
        await expect(tooltip).toContainText('Click to inspect');
        sawTooltip = true;
        break;
      }
    }
    expect(sawTooltip).toBe(true);

    // Click a cubie to open Hero Service Focus Panel
    await page.mouse.click(930, 400);
    const focusPanel = page.locator('#hero [role="region"][aria-label^="Selected Service:"]');
    await expect(focusPanel).toBeVisible();

    // Move pointer away — selection must persist
    await page.mouse.move(40, 450);
    await expect(focusPanel).toBeVisible();

    // Rapidly click another area of the cube — must not crash or get stuck
    await page.mouse.click(830, 340);
    await expect(focusPanel).toBeVisible();

    // Close preview resets selection cleanly
    await page.getByRole('button', { name: /Close service preview/i }).click();
    await expect(focusPanel).toHaveCount(0);

    errors.assertClean();
  });

  test('activates IsometricRubikFallback gracefully when WebGL is unavailable', async ({
    page,
  }) => {
    const errors = attachRuntimeErrorCollector(page);
    // Stub WebGL context creation to simulate unsupported GPU/WebGL
    await page.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        type: string,
        ...args: unknown[]
      ) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return null;
        }
        return origGetContext.apply(this, [type, ...args] as never);
      };
    });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.mouse.move(800, 400);

    const fallbackMatrix = page.locator(
      '[aria-label="Interactive Rubik Nexus 3D Architectural Matrix"]'
    );
    await expect(fallbackMatrix).toBeVisible({ timeout: 10_000 });
    errors.assertClean();
  });
});
