import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { clipboardFixture } from './fixtures/clipboardFixture.js';
import { clipboardMatchers } from './matchers/clipboardMatchers.js';
import type { ClipboardHandler } from './utils/clipboardHandler.js';

export const test = baseTest.extend<{
  clipboard: ClipboardHandler;
}>({
  /**
   * A fixture that provides an instance of the Clipboard utility for interacting with the system clipboard.
   * It allows reading from the clipboard during tests.
   */
  clipboard: clipboardFixture,
});

export const expect = baseExpect.extend({ ...clipboardMatchers });
