import type { ExpectMatcherState } from '@playwright/test';

interface NormalizeTextOptions {
  ignoreCase?: boolean;
  trim?: boolean;
}

/**
 * Generates an error message for a custom matcher.
 *
 * @this ExpectMatcherState
 * @param name The name of the matcher.
 * @param expected The expected value.
 * @param actual The actual value.
 * @param error An optional error object.
 * @param errorMessage An optional error message string.
 * @returns A function that returns the error message string.
 */
export function getErrorMessage(
  this: ExpectMatcherState,
  name: string,
  expected: unknown,
  actual: unknown,
  error?: Error | null,
  errorMessage?: string | undefined | null,
): () => string {
  const message = `${this.utils.matcherHint(name, undefined, undefined, { isNot: this.isNot })}\n\n`;

  if (error) {
    return () => `${message}An unexpected error occurred:\n${error.message}`;
  }

  if (errorMessage) {
    return () => `${message}${errorMessage}`;
  }

  return () =>
    message +
    `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expected)}\n` +
    `Received: ${this.utils.printReceived(actual)}`;
}

export function normalizeText<T = unknown>(data: T, options: NormalizeTextOptions = {}): T {
  if (typeof data === 'string') {
    let normalizeText: string = data;

    if (options.trim) normalizeText = normalizeText.trim();

    if (options.ignoreCase) normalizeText = normalizeText.toLowerCase();

    return normalizeText as T;
  }

  return data;
}
