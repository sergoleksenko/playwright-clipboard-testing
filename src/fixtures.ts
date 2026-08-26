import { type BrowserContext, test as base, type Page, type TestFixture } from '@playwright/test';
import { ClipboardHandler } from './clipboard.js';

export const clipboardFixture: TestFixture<
  ClipboardHandler,
  { page: Page; context: BrowserContext; browserName: string }
> = async ({ page, context, browserName }, use) => {
  if (browserName !== 'chromium') {
    throw new Error(
      `[playwright-clipboard] Browser '${browserName}' is not supported. ` +
        'Clipboard Permissions API is currently only supported in Chromium-based browsers.',
    );
  }

  const handler = new ClipboardHandler(page, context);
  await use(handler);
};

export const test = base.extend<{
  clipboard: ClipboardHandler;
}>({
  /**
   * A fixture that provides an instance of the Clipboard utility for interacting with the system clipboard.
   * It allows reading from the clipboard during tests.
   *
   * @remarks
   * To check the clipboard content in the tests, you can use custom matcher.
   *
   * @example
   * `await expect(clipboard).toHaveData('expected text');`
   */
  clipboard: clipboardFixture,
});

export { expect } from '@playwright/test';
