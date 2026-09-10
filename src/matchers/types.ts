export type TimeoutMatcherOptions = { timeout?: number };

export type IgnoreCaseMatcherOptions = { ignoreCase?: boolean };

export type TrimMatcherOptions = { trim?: boolean };

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the clipboard content is empty.
       * Uses smart polling to wait for the clipboard to be updated.
       *
       * @param options Matcher options.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toBeBlank();
       */
      toBeBlank(options?: TimeoutMatcherOptions & TrimMatcherOptions): Promise<R>;

      /**
       * Asserts that the clipboard content matches the expected text.
       * Uses smart polling to wait for the clipboard to be updated.
       *
       * @param expected The string or regular expression to compare against the clipboard content.
       * @param options Matcher options.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toHaveTextContent('Copied value');
       */
      toHaveTextContent(
        expected: string | RegExp,
        options?: TimeoutMatcherOptions & IgnoreCaseMatcherOptions & TrimMatcherOptions,
      ): Promise<R>;

      /**
       * Asserts that the clipboard content matches the expected JSON value.
       * Uses smart polling to wait for the clipboard to be updated.
       *
       * @param expected The JSON value to compare against the clipboard content.
       * @param options Matcher options.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toHaveJSONContent({ id: 123, status: 'success' });
       */
      toHaveJSONContent(expected: unknown, options?: TimeoutMatcherOptions): Promise<R>;
    }
  }
}
