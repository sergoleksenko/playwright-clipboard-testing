import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { getErrorMessage, normalizeText } from '../utils/matcherUtils.js';
import type { TimeoutMatcherOptions, TrimMatcherOptions } from './types.js';

/**
 * Asserts that the clipboard content is blank (empty string).
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param options Matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toBeBlank(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  options: TimeoutMatcherOptions & TrimMatcherOptions = {},
) {
  const name = 'toBeBlank';
  let pass: boolean;
  let actual: unknown;
  let normalizedActual: unknown;
  const expected: string = '';
  let errorReason: Error | null = null;

  const { timeout = 10_000, trim = false } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.read();
        normalizedActual = actual;
        normalizedActual = normalizeText(normalizedActual, { trim });
        errorReason = null;

        return normalizedActual;
      } catch (error) {
        errorReason = error instanceof Error ? error : new Error(String(error));
        actual = undefined;
        normalizedActual = undefined;

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
