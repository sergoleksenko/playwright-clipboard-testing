import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { getErrorMessage } from '../utils/matcherUtils.js';
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
  let pass: boolean;
  let actual: unknown;

  const { timeout = 10_000 } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.readJSON();
      } catch {
        actual = await clipboard.read();
      }

      if (typeof expected === 'string' && actual !== null && actual !== undefined) {
        return String(actual);
      }

      return actual;
    },
    { timeout },
  );

  try {
    const expectation = this.isNot ? poll.not : poll;
    await expectation.toEqual(expected);
    pass = true;
  } catch {
    pass = false;
  }

  /**
   * NOTE ON INVERSION:
   * In Playwright custom matchers, if `this.isNot` is true, the matcher must return
   * `pass: false` for the assertion to pass. Since `poll.not.toEqual` resolves
   * to `true` when the condition is met, we invert it back to align with Playwright's expectations.
   */
  if (this.isNot) pass = !pass;

  const matcherReturn: MatcherReturnType = {
    message: getErrorMessage.call(this, name, expected, actual),
    pass,
    name,
    expected,
    actual,
  };

  return matcherReturn;
}
