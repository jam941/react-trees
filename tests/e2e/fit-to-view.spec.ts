import { test, expect } from '@playwright/test';

test.describe('Fit to view', () => {
  test('fitOnMount frames the graph: world transform is not identity', async ({ page }) => {
    await page.goto('/pan-zoom');
    await page.waitForSelector('[role="application"]');

    // After layout + fitOnMount the world transform should be something other than
    // translate(0px, 0px) scale(1) — it should be scaled/translated to fit
    const transform = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    expect(transform).not.toBe('');
    // The translate values should be non-trivial (not both 0)
    // or the scale should differ from 1, meaning a fit was applied
    const isIdentity = transform === 'translate(0px, 0px) scale(1)';
    // For a non-trivial graph the fit will change the transform
    // (this assertion may be fragile in jsdom; it's meaningful in a real browser)
    expect(isIdentity).toBe(false);
  });

  test('SVG edge paths are present after layout', async ({ page }) => {
    await page.goto('/pan-zoom');
    await page.waitForSelector('[role="application"]');

    const paths = page.locator('svg path');
    await expect(paths.first()).toBeVisible();
    const count = await paths.count();
    expect(count).toBeGreaterThan(0);
  });

  test('nodes fill the visible graph area after fit', async ({ page }) => {
    await page.goto('/pan-zoom');
    await page.waitForSelector('[role="application"]');

    const container = page.locator('[data-testid="graph-container"]');
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('container not found');

    // All visible nodes should be roughly inside the container bounds
    const nodes = page.locator('[data-rpg-node]');
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);

    // Check first node is within container viewport
    const firstNodeBox = await nodes.first().boundingBox();
    if (!firstNodeBox) throw new Error('node not found');

    // Node should be within container horizontally (with tolerance)
    const tolerance = 20;
    expect(firstNodeBox.x + firstNodeBox.width).toBeGreaterThan(containerBox.x - tolerance);
    expect(firstNodeBox.x).toBeLessThan(containerBox.x + containerBox.width + tolerance);
  });
});
