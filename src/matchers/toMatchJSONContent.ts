import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { getErrorMessage } from '../utils/matchers/getErrorMessage';
import type { TimeoutMatcherOptions } from './types';

/**
 * Asserts that the clipboard content contains the expected JSON value.
 *
 * @this ExpectMatcherState
 * @param clipboard the clipboard utility instance
 * @param expected The expected JSON value
 * @param options matcher options.
 * @returns A Promise that resolves to a MatcherReturnType object.
 */
export async function toMatchJSONContent(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  expected: unknown,
  options: TimeoutMatcherOptions = {},
): Promise<MatcherReturnType> {
  const name = 'toMatchJSONContent';
  let pass: boolean;
  let actual: unknown;
  let errorReason: Error | null = null;

  const { timeout = 10_000 } = options;

  const poll = expect.poll(
    async () => {
      try {
        actual = await clipboard.readJSON();
        errorReason = null;

        return actual;
      } catch (error) {
        errorReason = error instanceof Error ? error : new Error(String(error));

        try {
          actual = await clipboard.read();
        } catch {
          actual = undefined;
        }

        throw errorReason;
      }
    },
    { timeout },
  );

  try {
    const expectation = this.isNot ? poll.not : poll;
    await expectation.toMatchObject(expected as Record<string, unknown>);
    pass = true;
  } catch {
    pass = false;
  }

  if (this.isNot) pass = !pass;

  return {
    message: getErrorMessage.call(this, name, expected, actual, errorReason),
    pass,
    name,
    expected,
    actual,
  };
}
