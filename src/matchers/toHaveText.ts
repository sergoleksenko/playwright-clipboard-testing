import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { getErrorMessage } from '../utils/matcherUtils.js';
import type { MatcherOptions } from './types.js';

/**
 * Asserts that the clipboard content matches the expected text value.
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param expected The expected text value.
 * @param options Matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toHaveText(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: string,
  options: MatcherOptions = {},
) {
  const name = 'toHaveText';
  let pass: boolean;
  let actual: unknown;
  let errorReason: Error | null = null;

  const { timeout = 10_000 } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.read();
        errorReason = null;
        return actual;
      } catch (error) {
        errorReason = error instanceof Error ? error : new Error(String(error));
        actual = undefined;

        throw errorReason;
      }
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
