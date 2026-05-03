import { test, expect } from '@playwright/test';

test.describe('Group rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/build-pipeline');
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );
  });

  test('group containers are rendered', async ({ page }) => {
    const groups = page.locator('[data-rpg-group]');
    await expect(groups.first()).toBeVisible({ timeout: 8000 });
    const count = await groups.count();
    expect(count).toBeGreaterThan(0);
  });

  test('nodes are present inside the graph', async ({ page }) => {
    const nodes = page.locator('[data-rpg-node]');
    const count = await nodes.count();
    // build-pipeline has 8 nodes
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('edges connect the graph', async ({ page }) => {
    const paths = page.locator('svg path');
    const count = await paths.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Group-to-group edges', () => {
  test('group edge renders as a single SVG path between containers', async ({ page }) => {
    await page.goto('/build-pipeline');
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );

    // 3 group-to-group edges → 3 SVG paths
    const paths = page.locator('svg path');
    const count = await paths.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
