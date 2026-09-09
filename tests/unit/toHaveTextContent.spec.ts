import { describe, expect, it } from 'vitest';
import { clipboardMatchers } from '../../src';
import { createFakeClipboard } from '../utils/createFakeClipboard.ts';
import { createMatcherState } from '../utils/createMatcherState.ts';

const TEST_TIMEOUT = 50;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('toHaveTextContent', () => {
  describe('when not inverted with .not', () => {
    it.each([
      { actual: 'true fake data', expected: 'true fake data', pass: true },
      { actual: 'true fake data', expected: 'false fake data', pass: false },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveTextContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveTextContent');
        expect(result.actual).toBe(actual);
        expect(result.expected).toBe(expected);
        expect(result.message()).not.toContain('not');
      },
    );

    it.each([
      {
        actual: 'true fake data',
        expected: '   true fake data   ',
        pass: false,
        options: { trim: false },
      },
      {
        actual: 'true fake data',
        expected: '   true fake data   ',
        pass: true,
        options: { trim: true },
      },
      {
        actual: '  true fake data  ',
        expected: '   true fake data   ',
        pass: true,
        options: { trim: true },
      },
      {
        actual: 'true fake data',
        expected: 'TRUE FAKE DATA',
        pass: false,
        options: { ignoreCase: false },
      },
      {
        actual: 'true fake data',
        expected: 'TRUE FAKE DATA',
        pass: true,
        options: { ignoreCase: true },
      },
      {
        actual: '  True Fake Data  ',
        expected: 'true fake data',
        pass: true,
        options: { trim: true, ignoreCase: true },
      },
    ])(
      `should return pass=$pass when actual=$actual and expected=$expected with options=$options`,
      async ({ actual, expected, pass, options }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveTextContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT, ...options },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveTextContent');
        expect(result.actual).toBe(actual);
        expect(result.expected).toBe(expected);
        expect(result.message()).not.toContain('not');
      },
    );
  });

  describe('when inverted with .not', () => {
    it.each([
      { actual: 'true fake data', expected: 'true fake data', pass: true },
      { actual: 'true fake data', expected: 'false fake data', pass: false },
    ])(
      'should return pass=$pass when actual=$actual and expected=$expected',
      async ({ actual, expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ read: actual });

        // when
        const result = await clipboardMatchers.toHaveTextContent.call(
          matcherStateNot,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveTextContent');
        expect(result.actual).toBe(actual);
        expect(result.expected).toBe(expected);
        expect(result.message()).toContain('not');
      },
    );
  });

  describe('when data types mismatch', () => {
    it.each([{ actual: { data: 'object fake data' }, expected: 'string fake data' }])(
      'should return pass=false when actual=$actual does not match expected=$expected',
      async ({ actual, expected }) => {
        // given
        const clipboard = createFakeClipboard({ readJSON: actual });

        // when
        const result = await clipboardMatchers.toHaveTextContent.call(
          matcherState,
          clipboard,
          expected,
          { timeout: TEST_TIMEOUT },
        );

        // then
        expect(result.pass).toBe(false);
        expect(result.message()).toContain(`Received: ${JSON.stringify(JSON.stringify(actual))}`);
      },
    );
  });
});
