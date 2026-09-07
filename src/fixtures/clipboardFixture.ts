import type { Page, TestFixture } from '@playwright/test';
import { ClipboardHandler } from '../utils/index.js';
import type { BrowserName } from './types.js';

/**
 * A fixture that provides an instance of the Clipboard utility for interacting with the system clipboard.
 * It allows reading from the clipboard during tests.
 */
export const clipboardFixture: TestFixture<
  ClipboardHandler,
  { page: Page; browserName: BrowserName }
> = async ({ page, browserName }, use) => {
  if (browserName === 'webkit') {
    throw new Error(
      `[playwright-clipboard] Browser '${browserName}' is not supported. ` +
        'Clipboard API testing is currently supported only in Chromium-based and Firefox browsers.\n' +
        `Add test.skip(browserName === 'webkit', 'Clipboard API is only supported in Chromium and Firefox'); to your test body.`,
    );
  }

  const handler = new ClipboardHandler(page);
  await use(handler);
};
