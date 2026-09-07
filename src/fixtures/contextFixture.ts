import type { BrowserContext, TestFixture } from '@playwright/test';
import type { BrowserName } from './types.js';

/**
 * A fixture that provides a BrowserContext with clipboard permissions granted for Chromium browsers.
 */
export const contextFixture: TestFixture<
  BrowserContext,
  { context: BrowserContext; browserName: BrowserName }
> = async ({ context, browserName }, use) => {
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  }

  await use(context);
};
