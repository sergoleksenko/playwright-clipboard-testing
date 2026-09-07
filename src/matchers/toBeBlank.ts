import { type ExpectMatcherState, expect, type MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from 'playwright-clipboard-testing';
import { getErrorMessage } from '../utils/matcherUtils.js';
import type { TimeoutMatcherOptions } from './types.js';

export async function toBeBlank(
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  options: TimeoutMatcherOptions = {},
) {
  const name = 'toBeBlank';
  let pass: boolean;
  let actual: unknown;
  const expected: string = '';
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
    await expectation.toBe(expected);
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
