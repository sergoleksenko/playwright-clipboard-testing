import type { BrowserContext, Page, TestFixture } from '@playwright/test';
import { ClipboardHandler } from '../utils/clipboardHandler.js';

/**
 * A fixture that provides an instance of the Clipboard utility for interacting with the system clipboard.
 * It allows reading from the clipboard during tests.
 */
export const clipboardFixture: TestFixture<
  ClipboardHandler,
  { page: Page; context: BrowserContext; browserName: string }
> = async ({ page, context, browserName }, use) => {
  if (browserName !== 'chromium') {
    throw new Error(
      `[playwright-clipboard] Browser '${browserName}' is not supported. ` +
        'Clipboard Permissions API is currently only supported in Chromium-based browsers.\n' +
        `Use test.skip(browserName !== 'chromium') in your tests to skip non-Chromium runs.`,
    );
  }

  const handler = new ClipboardHandler(page, context);
  await use(handler);
};
