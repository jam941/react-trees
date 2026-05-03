import { test, expect } from '@playwright/test';

test.describe('Custom node renderer', () => {
  test('renders custom content inside nodes', async ({ page }) => {
    await page.goto('/build-pipeline');
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-node]').length > 0,
      { timeout: 15000 },
    );

    // Custom nodes contain status labels from the data payload
    const nodeWithLabel = page.locator('[data-rpg-node]').filter({ hasText: 'Checkout' });
    await expect(nodeWithLabel.first()).toBeVisible();
  });
});

test.describe('Custom group renderer', () => {
  test('custom renderGroup content is rendered', async ({ page }) => {
    await page.goto('/build-pipeline');
    await page.waitForSelector('[role="application"]');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-rpg-group]').length > 0,
      { timeout: 15000 },
    );

    // The build-pipeline uses a custom renderGroup with a stage label
    const setupLabel = page.locator('text=Setup');
    await expect(setupLabel.first()).toBeVisible();
  });
});

test.describe('onLayoutComplete callback', () => {
  test('fires after layout and updates UI', async ({ page }) => {
    await page.goto('/build-pipeline');
    await page.waitForSelector('[role="application"]');

    // The build-pipeline shows a "Layout complete" indicator when onLayoutComplete fires
    await expect(page.locator('text=Layout complete')).toBeVisible({ timeout: 10000 });
  });
});
