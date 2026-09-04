export type MatcherOptions = { timeout?: number };

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the clipboard content matches the expected text.
       * Uses smart polling to wait for the clipboard to be updated.
       *
       * @param expected The string to compare against the clipboard content.
       * @param options Matcher options.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toHaveText('Copied value');
       */
      toHaveText(expected: string, options?: MatcherOptions): Promise<R>;

      /**
       * Asserts that the clipboard content matches the expected JSON value.
       * Uses smart polling to wait for the clipboard to be updated.
       *
       * @param expected The JSON value to compare against the clipboard content.
       * @param options Matcher options.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toHaveJSON({ id: 123, status: 'success' });
       */
      toHaveJSON(expected: unknown, options?: MatcherOptions): Promise<R>;

      /**
       * Asserts that the clipboard content matches the expected value.
       * Uses smart polling to wait for the clipboard to be updated.
       * If the `expected` value is an object, it attempts to parse the clipboard
       * content as JSON before comparing.
       *
       * @deprecated Use `toHaveText` or `toHaveJSON` instead. This matcher will be removed in future versions.
       *
       * @param expected The string or object to compare against the clipboard content.
       * @param options Optional settings for the matcher, such as timeout.
       * @returns A Promise that resolves when the assertion completes.
       *
       * @example
       * await expect(clipboard).toHaveData('Copied value');
       * await expect(clipboard).toHaveData({ id: 123, status: 'success' });
       */
      toHaveData(expected: unknown, options?: MatcherOptions): Promise<R>;
    }
  }
}
