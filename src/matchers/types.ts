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
      toHaveTextContent(expected: string, options?: MatcherOptions): Promise<R>;

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
      toHaveJSONContent(expected: unknown, options?: MatcherOptions): Promise<R>;
    }
  }
}
