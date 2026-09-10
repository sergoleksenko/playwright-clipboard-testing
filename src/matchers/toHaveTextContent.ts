import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { getErrorMessage, normalizeText } from '../utils/matcherUtils';
import type { IgnoreCaseMatcherOptions, TimeoutMatcherOptions, TrimMatcherOptions } from './types';

/**
 * Asserts that the clipboard content matches the expected text value.
 *
 * @this ExpectMatcherState
 * @param clipboard The Clipboard utility instance.
 * @param expected The expected text value.
 * @param options Matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toHaveTextContent(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: string | RegExp,
  options: TimeoutMatcherOptions & IgnoreCaseMatcherOptions & TrimMatcherOptions = {},
) {
  const name = 'toHaveTextContent';
  let pass: boolean;
  let actual: string | undefined;
  let normalizedActual: string | undefined;
  let errorReason: Error | null = null;

  const { timeout = 10_000, ignoreCase = false, trim = false } = options;

  const normalizedExpected = normalizeText(expected, { ignoreCase, trim });

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.read();

        normalizedActual = actual;
        normalizedActual = normalizeText(normalizedActual, { ignoreCase, trim });
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

    if (expected instanceof RegExp) {
      await expectation.toMatch(normalizedExpected as RegExp);
    } else {
      await expectation.toEqual(normalizedExpected);
    }

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
