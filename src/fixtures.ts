import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { clipboardFixtures } from './fixtures/index.js';
import { clipboardMatchers } from './matchers/clipboardMatchers.js';
import type { ClipboardHandler } from './utils/clipboardHandler.js';

export const test = baseTest.extend<{
  clipboard: ClipboardHandler;
}>(clipboardFixtures);

export const expect = baseExpect.extend({ ...clipboardMatchers });
