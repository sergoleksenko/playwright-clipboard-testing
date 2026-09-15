import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['**/tests/e2e/**', '**/tests/integration/**', '**/node_modules/**'],
  },
});
