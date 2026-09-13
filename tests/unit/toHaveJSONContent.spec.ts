import { describe, expect, test } from 'vitest';
import { clipboardMatchers } from '../../src/matchers/clipboardMatchers.ts';
import { createFakeClipboard } from '../utils/createFakeClipboard.ts';
import { createMatcherState } from '../utils/createMatcherState.ts';

const TEST_TIMEOUT = 50;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('toHaveJSONContent', () => {
  describe('when not inverted with .not', () => {
    test.each([
      { expected: { data: 'true fake data' }, pass: true },
      { expected: { data: 'false fake data' }, pass: false },
    ])(
      'should return pass=$pass when objects matches, and format not inverted error message',
      async ({ expected, pass }) => {
        const actual = { data: 'true fake data' };

        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toHaveJSONContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveJSONContent');
        expect(result.actual).toEqual(actual);
        expect(result.expected).toEqual(expected);
        expect(result.message()).not.toContain('not');
      },
    );
  });

  describe('when inverted with .not', () => {
    test.each([
      { expected: { data: 'true fake data' }, pass: true },
      { expected: { data: 'false fake data' }, pass: false },
    ])(
      'should return pass=$pass when objects matches, but format inverted error message',
      async ({ expected, pass }) => {
        const actual = { data: 'true fake data' };

        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toHaveJSONContent.call(
          matcherStateNot,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveJSONContent');
        expect(result.actual).toEqual(actual);
        expect(result.expected).toEqual(expected);
        expect(result.message()).toContain('not');
      },
    );
  });

  describe('when data types mismatch', () => {
    test.each([{ actual: 'string fake data', expected: { data: 'object fake data' } }])(
      'should return pass=false when actual=$actual does not match expected=$expected',
      async ({ actual, expected }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveJSONContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(false);
        expect(result.message()).toContain('Clipboard content is not a valid JSON');
      },
    );
  });

  describe('primitive JSON types', () => {
    test.each([
      { actual: 123, expected: 123 },
      { actual: null, expected: null },
      { actual: true, expected: true },
      { actual: [1, 2, 3], expected: [1, 2, 3] },
    ])(
      'should return pass=true when actual=$actual matches expected=$expected',
      async ({ actual, expected }) => {
        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toHaveJSONContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(true);
      },
    );
  });
});
