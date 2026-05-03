import { test, expect } from '@playwright/test';

test.describe('Direction switching', () => {
  test('stress-test page switches direction and re-renders', async ({ page }) => {
    await page.goto('/stress-test');

    // Start with 100 nodes for speed
    await page.getByRole('button', { name: '100' }).click();
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );

    // Capture world transform before switching direction
    const transformBefore = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    // Switch to TB direction
    await page.getByRole('button', { name: 'TB' }).click();

    // Wait for re-layout
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );

    const transformAfter = await page.locator('[role="application"] > div').first().evaluate(
      (el) => (el as HTMLElement).style.transform,
    );

    // Transform should have changed (new layout = new fit)
    expect(transformAfter).not.toBe(transformBefore);
  });

  test('nodes remain visible after direction switch', async ({ page }) => {
    await page.goto('/stress-test');

    await page.getByRole('button', { name: '100' }).click();
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 10000 },
    );

    await page.getByRole('button', { name: 'TB' }).click();

    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );

    const nodes = page.locator('[data-rpg-node]');
    expect(await nodes.count()).toBeGreaterThan(0);
    await expect(nodes.first()).toBeVisible();
  });
});
