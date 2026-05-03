import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  { path: '/', name: 'Landing' },
  { path: '/pan-zoom', name: 'Pan+Zoom' },
  { path: '/build-pipeline', name: 'Build Pipeline' },
  { path: '/data-pipeline', name: 'Data Pipeline' },
  { path: '/approval-workflow', name: 'Approval Workflow' },
  { path: '/cycle-demo', name: 'Cycle Demo' },
  { path: '/software-deps', name: 'Software Deps' },
  { path: '/org-chart', name: 'Org Chart' },
];

for (const { path, name } of routes) {
  test(`${name} — no axe violations`, async ({ page }) => {
    await page.goto(path);

    // Wait for graph routes to finish layout before running axe
    if (path !== '/') {
      await page.waitForSelector('[role="application"]', { timeout: 5000 }).catch(() => {});
      // Give layout a moment to complete
      await page.waitForTimeout(500);
    }

    const results = await new AxeBuilder({ page })
      // Disable color-contrast for unstyled demo components
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
