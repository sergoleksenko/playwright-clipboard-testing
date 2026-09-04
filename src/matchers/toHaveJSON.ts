import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { getErrorMessage } from '../utils/matcherUtils.js';
import type { MatcherOptions } from './types.js';

/**
 * Asserts that the clipboard content matches the expected JSON value.
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param expected The expected JSON value.
 * @param options Matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toHaveJSON(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: unknown,
  options: MatcherOptions = {},
) {
  const name = 'toHaveJSON';
  let pass: boolean;
  let actual: unknown;
  let errorReason: Error | null = null;

  const { timeout = 10_000 } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.readJSON();
      } catch (error) {
        errorReason = error instanceof Error ? error : new Error(String(error));
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

  if (this.isNot) pass = !pass;

  const matcherReturn: MatcherReturnType = {
    message: getErrorMessage.call(this, name, expected, actual, errorReason),
    pass,
    name,
    expected,
    actual,
  };

  return matcherReturn;
}
