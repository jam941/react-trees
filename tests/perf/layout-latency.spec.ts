import { test, expect } from '@playwright/test';

test.describe('Layout latency', () => {
  test('100-node graph completes layout within 5s', async ({ page }) => {
    await page.goto('/stress-test');

    const start = Date.now();

    await page.getByRole('button', { name: '100' }).click();
    await page.waitForSelector('[role="application"]');

    // Wait for nodes to appear (layout complete)
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );

    const elapsed = Date.now() - start;
    // Allow generous CI budget: 5s for 100 nodes
    expect(elapsed).toBeLessThan(5000);
  });
});
