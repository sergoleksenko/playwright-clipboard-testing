import { describe, expect, test } from 'vitest';
import { createFakeClipboard } from '../utils/createFakeClipboard.ts';
import { createMatcherState } from '../utils/createMatcherState.ts';
import { clipboardMatchers } from './clipboardMatchers.ts';

const MATCHER_NAME = 'toHaveContentLength';
const TEST_TIMEOUT = 50;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('toHaveContentLength', () => {
  describe('when not inverted with .not', () => {
    test.each([
      { actual: 'true fake data', expected: 14, pass: true },
      { actual: 'true fake data', expected: 10, pass: false },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveContentLength.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe(MATCHER_NAME);
        expect(result.actual).toBe(actual.length);
        expect(result.expected).toBe(expected);
        expect(result.message()).not.toContain('not');
      },
    );

    test.each([
      { actual: 'true fake data\n', expected: 14, pass: true, options: { trim: true } },
      { actual: 'true fake data\n', expected: 15, pass: false, options: { trim: true } },
      { actual: 'true fake data\n', expected: 15, pass: true, options: { trim: false } },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected with options=$options',
      async ({ actual, expected, pass, options }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveContentLength.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT, ...options },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe(MATCHER_NAME);
        expect(result.actual).toBe(options.trim ? actual.trim().length : actual.length);
        expect(result.expected).toBe(expected);
        expect(result.message()).not.toContain('not');
      },
    );
  });

  describe('when inverted with .not', () => {
    test.each([
      { actual: 'true fake data', expected: 14, pass: true },
      { actual: 'true fake data', expected: 10, pass: false },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveContentLength.call(
          matcherStateNot,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe(MATCHER_NAME);
        expect(result.actual).toBe(actual.length);
        expect(result.expected).toBe(expected);
        expect(result.message()).toContain('not');
      },
    );
  });
});
