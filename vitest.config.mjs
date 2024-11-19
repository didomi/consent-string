import { defineConfig } from 'vitest/config';
import hq from 'alias-hq';

export default defineConfig({
  resolve: {
    alias: hq.get('rollup'),
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/index.ts'],
      thresholds: {
        branches: 83,
        functions: 83,
        lines: 83,
        statements: 83,
      },
    },
  },
});
