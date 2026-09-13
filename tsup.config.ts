import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    'fixtures/index': 'src/fixtures/index.ts',
    'matchers/index': 'src/matchers/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  target: 'es2022',
  splitting: false,
  external: ['@playwright/test'],
});
