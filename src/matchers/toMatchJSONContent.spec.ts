import { describe, expect, test } from 'vitest';
import { createFakeClipboard } from '../utils/tests/createFakeClipboard';
import { createMatcherState } from '../utils/tests/createMatcherState';
import { clipboardMatchers } from './clipboardMatchers';

const TEST_TIMEOUT = 50;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('toMatchJSONContent', () => {
  describe('when not inverted with .not', () => {
    test.each([
      {
        actual: { id: 1, data: { message: 'Hello, World!' } },
        expected: { data: { message: 'Hello, World!' } },
        pass: true,
      },
      {
        actual: { id: 1, data: { message: 'Hello, World!' } },
        expected: { data: { message: 'GoodBy, World!' } },
        pass: false,
      },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toMatchJSONContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toMatchJSONContent');
        expect(result.actual).toEqual(actual);
        expect(result.expected).toEqual(expected);
        expect(result.message()).not.toContain('not');
      },
    );
  });

  describe('when inverted with .not', () => {
    test.each([
      {
        actual: { id: 1, data: { message: 'Hello, World!' } },
        expected: { data: { message: 'Hello, World!' } },
        pass: true,
      },
      {
        actual: { id: 1, data: { message: 'Hello, World!' } },
        expected: { data: { message: 'GoodBy, World!' } },
        pass: false,
      },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toMatchJSONContent.call(
          matcherStateNot,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toMatchJSONContent');
        expect(result.actual).toEqual(actual);
        expect(result.expected).toEqual(expected);
        expect(result.message()).toContain('not');
      },
    );
  });
});
