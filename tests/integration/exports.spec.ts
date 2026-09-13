import { createRequire } from 'node:module';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Package Subpath Exports', () => {
  describe('ESM (import)', () => {
    test('should import the correct root export', async () => {
      const pkg = await import('playwright-clipboard-testing');

      expect(pkg.test).toBeDefined();
      expect(pkg.expect).toBeDefined();
    });

    test('should import the correct /constants export', async () => {
      const pkg = await import('playwright-clipboard-testing/constants');

      expect(pkg.firefoxClipboardPrefs).toBeDefined();
      expect(pkg.PATTERNS).toBeDefined();
    });

    test('should import the correct /fixtures export', async () => {
      const pkg = await import('playwright-clipboard-testing/fixtures');

      expect(pkg.contextFixture).toBeDefined();
      expect(pkg.clipboardFixture).toBeDefined();
      expect(pkg.clipboardFixtures).toBeDefined();
      expect(pkg.ClipboardHandler).toBeDefined();
    });

    test('should import the correct /matchers export', async () => {
      const pkg = await import('playwright-clipboard-testing/matchers');

      expect(pkg.clipboardMatchers).toBeDefined();
    });
  });

  describe('CommonJS (require)', () => {
    let require: NodeJS.Require;

    beforeEach(() => {
      require = createRequire(import.meta.url);
    });

    test('should resolves root export', () => {
      expect(require('playwright-clipboard-testing').test).toBeDefined();
      expect(require('playwright-clipboard-testing').expect).toBeDefined();
    });

    test('should resolves /constants export', () => {
      expect(require('playwright-clipboard-testing/constants').firefoxClipboardPrefs).toBeDefined();
      expect(require('playwright-clipboard-testing/constants').PATTERNS).toBeDefined();
    });

    test('should resolves /fixtures export', () => {
      expect(require('playwright-clipboard-testing/fixtures').contextFixture).toBeDefined();
      expect(require('playwright-clipboard-testing/fixtures').clipboardFixture).toBeDefined();
      expect(require('playwright-clipboard-testing/fixtures').clipboardFixtures).toBeDefined();
      expect(require('playwright-clipboard-testing/fixtures').ClipboardHandler).toBeDefined();
    });

    test('should resolves /matchers export', () => {
      expect(require('playwright-clipboard-testing/matchers').clipboardMatchers).toBeDefined();
    });
  });
});
