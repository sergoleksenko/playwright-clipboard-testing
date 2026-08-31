import type { BrowserContext, Page, TestFixture } from '@playwright/test';
import type { browserNameType } from '../types.js';
import { ClipboardHandler } from '../utils/clipboardHandler.js';

/**
 * A fixture that provides an instance of the Clipboard utility for interacting with the system clipboard.
 * It allows reading from the clipboard during tests.
 */
export const clipboardFixture: TestFixture<
  ClipboardHandler,
  { page: Page; context: BrowserContext; browserName: browserNameType }
> = async ({ page, context, browserName }, use) => {
  if (browserName === 'webkit') {
    throw new Error(
      `[playwright-clipboard] Browser '${browserName}' is not supported. ` +
        'Clipboard Permissions API is currently only supported in Chromium-based and Firefox browsers.\n' +
        `Use test.skip(browserName === 'webkit') in your tests to skip tests that require clipboard access for unsupported browsers.`,
    );
  }

  const handler = new ClipboardHandler(page, context, browserName);
  await use(handler);
};
