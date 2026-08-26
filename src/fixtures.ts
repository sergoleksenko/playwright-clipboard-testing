import { type BrowserContext, test as base, type Page, type TestFixture } from '@playwright/test';
import { ClipboardHandler } from './clipboard.js';

export const clipboardFixture: TestFixture<
  ClipboardHandler,
  { page: Page; context: BrowserContext; browserName: string }
> = async ({ page, context, browserName }, use) => {
  if (browserName !== 'chromium') {
    throw new Error(
      `[playwright-clipboard] Browser '${browserName}' is not supported. ` +
        'Clipboard Permissions API is currently only supported in Chromium-based browsers.' +
        `Use test.skip(browserName !== 'chromium') in your tests to skip non-Chromium runs.`,
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
   */
  clipboard: clipboardFixture,
});

export { expect } from '@playwright/test';
