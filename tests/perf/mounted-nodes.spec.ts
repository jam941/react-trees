import { test, expect } from '@playwright/test';

test.describe('Virtualization: mounted node count', () => {
  test('500-node stress test mounts only visible nodes at default zoom', async ({ page }) => {
    await page.goto('/stress-test');

    // Select 500-node graph
    await page.getByRole('button', { name: '500' }).click();
    await page.waitForSelector('[role="application"]');

    // Wait for layout to complete — nodes should appear
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );

    const mountedCount = await page.evaluate(
      () => document.querySelectorAll('[data-rpg-node]').length,
    );

    // Virtualization should keep mounted nodes well below 500
    // At default zoom showing a portion of the graph, expect ≤150 nodes
    expect(mountedCount).toBeLessThanOrEqual(150);
    expect(mountedCount).toBeGreaterThan(0);
  });

  test('100-node graph: all nodes visible at fit-to-view zoom', async ({ page }) => {
    await page.goto('/stress-test');

    await page.getByRole('button', { name: '100' }).click();
    await page.waitForSelector('[role="application"]');

    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );

    const mountedCount = await page.evaluate(
      () => document.querySelectorAll('[data-rpg-node]').length,
    );

    // 100 nodes — at fit-to-view all or nearly all should be visible
    expect(mountedCount).toBeGreaterThan(50);
  });
});
