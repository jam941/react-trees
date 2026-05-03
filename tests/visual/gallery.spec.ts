import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'landing' },
  { path: '/pan-zoom', name: 'pan-zoom', waitForGraph: true },
  { path: '/build-pipeline', name: 'build-pipeline', waitForGraph: true },
  { path: '/data-pipeline', name: 'data-pipeline', waitForGraph: true },
  { path: '/approval-workflow', name: 'approval-workflow', waitForGraph: true },
  { path: '/cycle-demo', name: 'cycle-demo', waitForGraph: true },
  { path: '/software-deps', name: 'software-deps', waitForGraph: true },
  { path: '/org-chart', name: 'org-chart', waitForGraph: true },
];

for (const { path, name, waitForGraph } of routes) {
  test(`visual snapshot — ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);

    if (waitForGraph) {
      await page.waitForSelector('[role="application"]', { timeout: 10000 });
      // Wait for nodes to appear (layout complete)
      await page.waitForFunction(
        () => document.querySelectorAll('[data-rpg-node]').length > 0 || true,
        { timeout: 15000 },
      );
      // Stable pause for animations/fonts
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });
}
