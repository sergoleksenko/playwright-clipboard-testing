import type { ExpectMatcherState } from '@playwright/test';
import type { ClipboardHandler } from 'playwright-clipboard-testing';
import { clipboardMatchers } from 'playwright-clipboard-testing';
import { describe, expect, it, vi } from 'vitest';

const TEST_TIMEOUT = 50;

const createFakeClipboard = (
  overrides: { read?: string; readJSON?: unknown } = {},
): ClipboardHandler => {
  const read =
    overrides.read ?? (overrides.readJSON !== undefined ? JSON.stringify(overrides.readJSON) : '');
  const readJSON = overrides.readJSON;

  return {
    read: vi.fn().mockResolvedValue(read),
    readJSON: vi.fn().mockImplementation(<T>() => {
      if (readJSON !== undefined) {
        return readJSON as T;
      }

      try {
        return JSON.parse(read) as T;
      } catch {
        throw new Error(`Clipboard content is not a valid JSON: ${JSON.stringify(read)}`);
      }
    }),
  } as Pick<ClipboardHandler, 'read' | 'readJSON'> as ClipboardHandler;
};

const createMatcherState = (isNot = false): ExpectMatcherState =>
  ({
    isNot,
    utils: {
      matcherHint: (name: string) => `${name}`,
      printExpected: (v: unknown) => `${JSON.stringify(v)}`,
      printReceived: (v: unknown) => `${JSON.stringify(v)}`,
    },
  }) as unknown as ExpectMatcherState;

const matcherState = createMatcherState();
const matcherStateNot = createMatcherState(true);

describe('clipboardMatchers', () => {
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

  describe('toHaveJSONContent', () => {
    describe('when not inverted with .not', () => {
      it.each([
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
      it.each([
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
      it.each([{ actual: 'string fake data', expected: { data: 'object fake data' } }])(
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
      it.each([
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
});
