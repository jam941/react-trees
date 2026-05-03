import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pan-zoom');
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );
  });

  test('canvas has role=application', async ({ page }) => {
    const canvas = page.locator('[role="application"]');
    await expect(canvas).toBeVisible();
  });

  test('canvas has aria-label', async ({ page }) => {
    const canvas = page.locator('[role="application"]');
    const label = await canvas.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('node containers have role=group', async ({ page }) => {
    const nodes = page.locator('[data-rpg-node][role="group"]');
    await expect(nodes.first()).toBeAttached();
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('node containers have aria-label', async ({ page }) => {
    const node = page.locator('[data-rpg-node]').first();
    const label = await node.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label).toContain('Node');
  });

  test('edges are aria-hidden (decorative)', async ({ page }) => {
    // The SVG element wrapping edges should be aria-hidden
    const svgEdges = page.locator('svg[aria-hidden="true"]');
    await expect(svgEdges.first()).toBeAttached();
  });
});
