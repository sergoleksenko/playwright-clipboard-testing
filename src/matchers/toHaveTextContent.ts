import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils/clipboardHandler.js';
import { getErrorMessage } from '../utils/matcherUtils.js';
import type {
  IgnoreCaseMatcherOptions,
  TimeoutMatcherOptions,
  TrimMatcherOptions,
} from './types.js';

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
  expected: string,
  options: TimeoutMatcherOptions & IgnoreCaseMatcherOptions & TrimMatcherOptions = {},
) {
  const name = 'toHaveTextContent';
  let pass: boolean;
  let actual: unknown;
  let normalizedActual: unknown;
  let normalizedExpected: unknown;
  let errorReason: Error | null = null;

  const { timeout = 10_000, ignoreCase = false, trim = false } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.read();
        normalizedActual = actual;
        errorReason = null;

        if (trim && typeof normalizedActual === 'string') {
          normalizedActual = normalizedActual.trim();
        }

        if (ignoreCase && typeof normalizedActual === 'string') {
          normalizedActual = normalizedActual.toLowerCase();
        }

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
    normalizedExpected = expected;

    if (trim && typeof normalizedExpected === 'string') {
      normalizedExpected = normalizedExpected.trim();
    }

    if (ignoreCase && typeof normalizedExpected === 'string') {
      normalizedExpected = normalizedExpected.toLowerCase();
    }

    const expectation = this.isNot ? poll.not : poll;
    await expectation.toEqual(normalizedExpected);
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
