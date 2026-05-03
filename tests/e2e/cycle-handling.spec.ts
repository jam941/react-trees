import { test, expect } from '@playwright/test';

test.describe('Cycle handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cycle-demo');
    await page.waitForSelector('[role="application"]');
    // Wait for layout to complete
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );
  });

  test('graph renders despite a cycle', async ({ page }) => {
    const nodes = page.locator('[data-rpg-node]');
    await expect(nodes.first()).toBeVisible();
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('onCycleDetected banner appears', async ({ page }) => {
    // The cycle demo shows a banner when cycles are detected
    const banner = page.locator('text=Cycles detected');
    await expect(banner).toBeVisible({ timeout: 8000 });
  });

  test('cycle edges are visually distinct (data-cycle attribute present)', async ({ page }) => {
    const cycleEdge = page.locator('[data-cycle="true"]');
    await expect(cycleEdge.first()).toBeAttached({ timeout: 8000 });
  });

  test('SVG paths are rendered for all edges', async ({ page }) => {
    const paths = page.locator('svg path');
    const count = await paths.count();
    // 7 edges in the cycle demo — all should have a path
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
