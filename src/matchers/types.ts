export type MatcherOptions = { timeout?: number };

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the clipboard content matches the expected value.
       * Uses smart polling to wait for the clipboard to be updated.
       * If the `expected` value is an object, it attempts to parse the clipboard
       * content as JSON before comparing.
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
