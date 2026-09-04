import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { toHaveJSON } from './toHaveJSON.js';
import { toHaveText } from './toHaveText.js';
import type { MatcherOptions } from './types.js';

/**
 * Asserts that the clipboard content matches the expected value.
 * Uses smart polling to wait for the clipboard to be updated.
 * If the `expected` value is an object, it attempts to parse the clipboard
 * content as JSON before comparing.
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param expected The string or object to compare against the clipboard content.
 * @param options Optional settings for the matcher, such as timeout.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toHaveData(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: unknown,
  options: MatcherOptions = {},
) {
  const name = 'toHaveData';
  let matcherReturn: MatcherReturnType;

  if (typeof expected === 'string') {
    matcherReturn = await toHaveText.call(this, clipboard, expected, options);
  } else {
    matcherReturn = await toHaveJSON.call(this, clipboard, expected, options);
  }

  return { ...matcherReturn, name };
}
