import { describe, expect, it } from 'vitest';
import { clipboardMatchers } from '../../src';
import { createFakeClipboard } from '../utils/createFakeClipboard.ts';
import { createMatcherState } from '../utils/createMatcherState.ts';

const TEST_TIMEOUT = 50;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('toBeBlank', () => {
  describe('when not inverted with .not', () => {
    it('should return pass=true when clipboard is empty', async () => {
      const actual = '';
      const expected = '';

      // given
      const clipboard = createFakeClipboard({ read: actual });

      // when
      const result = await clipboardMatchers.toBeBlank.call(matcherState, clipboard, {
        timeout: TEST_TIMEOUT,
      });

      // then
      expect(result.pass).toBe(true);
      expect(result.name).toBe('toBeBlank');
      expect(result.actual).toBe(actual);
      expect(result.expected).toBe(expected);
      expect(result.message()).not.toContain('not');
    });

    it('should return pass=false when clipboard is not empty', async () => {
      const actual = 'true fake data';
      const expected = '';

      // given
      const clipboard = createFakeClipboard({ read: actual });

      // when
      const result = await clipboardMatchers.toBeBlank.call(matcherState, clipboard, {
        timeout: TEST_TIMEOUT,
      });

      // then
      expect(result.pass).toBe(false);
      expect(result.name).toBe('toBeBlank');
      expect(result.actual).toBe(actual);
      expect(result.expected).toBe(expected);
      expect(result.message()).not.toContain('not');
    });

    it.each([
      {
        actual: '     ',
        pass: true,
        options: { trim: true },
      },
      {
        actual: '   \n\t  ',
        pass: true,
        options: { trim: true },
      },
      {
        actual: '   \n\t  ',
        pass: false,
        options: { trim: false },
      },
    ])(
      'should return pass=$pass when clipboard is $actual with options=$options',
      async ({ actual, pass, options }) => {
        const expected = '';

        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toBeBlank.call(matcherState, clipboard, {
          timeout: TEST_TIMEOUT,
          ...options,
        });

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toBeBlank');
        expect(result.actual).toBe(actual);
        expect(result.expected).toBe(expected);
        expect(result.message()).not.toContain('not');
      },
    );
  });

  describe('when inverted with .not', () => {
    it('should return pass=true when clipboard is empty, but format inverted error message', async () => {
      const actual = '';
      const expected = '';

      // given
      const clipboard = createFakeClipboard({ read: actual });

      // when
      const result = await clipboardMatchers.toBeBlank.call(matcherStateNot, clipboard, {
        timeout: TEST_TIMEOUT,
      });

      // then
      expect(result.pass).toBe(true);
      expect(result.name).toBe('toBeBlank');
      expect(result.actual).toBe(actual);
      expect(result.expected).toBe(expected);
      expect(result.message()).toContain('not');
    });

    it('should return pass=false when clipboard is not empty, but format inverted error message', async () => {
      const actual = 'true fake data';
      const expected = '';

      // given
      const clipboard = createFakeClipboard({ read: actual });

      // when
      const result = await clipboardMatchers.toBeBlank.call(matcherStateNot, clipboard, {
        timeout: TEST_TIMEOUT,
      });

      // then
      expect(result.pass).toBe(false);
      expect(result.name).toBe('toBeBlank');
      expect(result.actual).toBe(actual);
      expect(result.expected).toBe(expected);
      expect(result.message()).toContain('not');
    });
  });
});
