import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    passWithNoTests: true,
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/index.ts',
        'src/types.ts',
        '**/*.test.ts',
        '**/*.test-d.ts',
        '**/*.test.tsx',
      ],
      thresholds: {
        statements: 75,
        functions: 75,
      },
    },
  },
});
