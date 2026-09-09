import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { clipboardFixtures } from './fixtures';
import { clipboardMatchers } from './matchers';
import type { ClipboardHandler } from './utils';

export const test = baseTest.extend<{
  clipboard: ClipboardHandler;
}>(clipboardFixtures);

export const expect = baseExpect.extend({ ...clipboardMatchers });
