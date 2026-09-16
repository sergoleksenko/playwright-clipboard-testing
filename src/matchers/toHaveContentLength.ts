import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { getErrorMessage, normalizeText } from '../utils/matcherUtils.ts';
import type { TimeoutMatcherOptions, TrimMatcherOptions } from './types.ts';

/**
 * Asserts that the clipboard content has the expected length.
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param expected The expected length of the clipboard content.
 * @param options Matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toHaveContentLength(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: number,
  options: TimeoutMatcherOptions & TrimMatcherOptions = {},
) {
  const name = 'toHaveContentLength';
  let pass: boolean;
  let actual: string | undefined;
  let errorReason: Error | null = null;

  const { timeout = 10_000, trim = false } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.read();

        actual = normalizeText(actual, { trim });
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
    await expectation.toHaveLength(expected);

    pass = true;
  } catch {
    pass = false;
  }

  if (this.isNot) pass = !pass;

  const matcherReturn: MatcherReturnType = {
    message: getErrorMessage.call(this, name, expected, actual?.length, errorReason),
    pass,
    name,
    expected,
    actual: actual?.length,
  };

  return matcherReturn;
}
