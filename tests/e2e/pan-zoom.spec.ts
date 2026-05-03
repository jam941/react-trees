import { test, expect } from '@playwright/test';

test.describe('Pan and zoom', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pan-zoom');
    // wait for graph to render — the canvas div gets role=application
    await page.waitForSelector('[role="application"]');
  });

  test('graph canvas is present with role=application', async ({ page }) => {
    const canvas = page.locator('[role="application"]');
    await expect(canvas).toBeVisible();
  });

  test('nodes are rendered inside the graph', async ({ page }) => {
    // At least one rpg-node should be in the DOM after layout
    const nodes = page.locator('[data-rpg-node]');
    await expect(nodes.first()).toBeVisible();
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('wheel event zooms the world layer', async ({ page }) => {
    const canvas = page.locator('[role="application"]');
    const worldBefore = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    // Scroll to zoom in
    await canvas.dispatchEvent('wheel', { deltaY: -200, bubbles: true, cancelable: true });
    await page.waitForTimeout(50);

    const worldAfter = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    expect(worldAfter).not.toBe(worldBefore);
    // Scale should have increased (zoom-in)
    expect(worldAfter).toContain('scale(');
  });

  test('drag-to-pan moves the world layer', async ({ page }) => {
    const canvas = page.locator('[role="application"]');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas not found');

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    const transformBefore = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy + 40, { steps: 5 });
    await page.mouse.up();

    const transformAfter = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    expect(transformAfter).not.toBe(transformBefore);
  });
});
