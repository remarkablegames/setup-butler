import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.mts'],
    coverage: {
      include: ['src/**/*.ts'],
      thresholds: {
        100: true,
      },
    },
  },
});
