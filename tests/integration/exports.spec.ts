import { describe, expect, test } from 'vitest';

describe('Package Subpath Exports', () => {
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
