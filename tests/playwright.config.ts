import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testDir: './visual',
      use: { ...devices['Desktop Chrome'] },
      retries: 0,
    },
    {
      name: 'perf',
      testDir: './perf',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testDir: './a11y',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm --filter @internal/gallery preview --port 5173',
    port: 5173,
    reuseExistingServer: !process.env['CI'],
  },
});
