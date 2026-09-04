import type { ExpectMatcherState } from '@playwright/test';
import { describe, expect, it, vi } from 'vitest';
import type { ClipboardHandler } from '../src/index.js';
import { clipboardMatchers } from '../src/index.js';

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
  describe('toHaveText', () => {
    describe('when not inverted with .not', () => {
      it.each([
        { expected: 'true fake data', pass: true },
        { expected: 'false fake data', pass: false },
      ])(
        'should return pass=$pass when strings matches, and format not inverted error message',
        async ({ expected, pass }) => {
          const actual = 'true fake data';

          // given
          const clipboard = createFakeClipboard({ read: actual });

          // when
          const result = await clipboardMatchers.toHaveText.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveText');
          expect(result.actual).toBe(actual);
          expect(result.expected).toBe(expected);
          expect(result.message()).not.toContain('not');
        },
      );
    });

    describe('when inverted with .not', () => {
      it.each([
        { expected: 'true fake data', pass: true },
        { expected: 'false fake data', pass: false },
      ])(
        'should return pass=$pass when strings match, but format inverted error message',
        async ({ expected, pass }) => {
          const actual = 'true fake data';

          // given
          const clipboard = createFakeClipboard({ read: actual });

          // when
          const result = await clipboardMatchers.toHaveText.call(
            matcherStateNot,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveText');
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
          const result = await clipboardMatchers.toHaveText.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(false);
          expect(result.message()).toContain(`Received: ${JSON.stringify(JSON.stringify(actual))}`);
        },
      );
    });
  });

  describe('toHaveJSON', () => {
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
          const result = await clipboardMatchers.toHaveJSON.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveJSON');
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
          const result = await clipboardMatchers.toHaveJSON.call(
            matcherStateNot,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveJSON');
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
          const result = await clipboardMatchers.toHaveJSON.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
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
          const result = await clipboardMatchers.toHaveJSON.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(true);
        },
      );
    });
  });

  describe('toHaveData', () => {
    describe('when not inverted with .not', () => {
      it.each([
        { expected: 'true fake data', pass: true },
        { expected: 'false fake data', pass: false },
      ])(
        'should return pass=$pass when strings matches, and format not inverted error message',
        async ({ expected, pass }) => {
          const actual = 'true fake data';

          // given
          const clipboard = createFakeClipboard({ read: actual });

          // when
          const result = await clipboardMatchers.toHaveData.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveData');
          expect(result.actual).toBe(actual);
          expect(result.expected).toBe(expected);
          expect(result.message()).not.toContain('not');
        },
      );

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
          const result = await clipboardMatchers.toHaveData.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveData');
          expect(result.actual).toEqual(actual);
          expect(result.expected).toEqual(expected);
          expect(result.message()).not.toContain('not');
        },
      );
    });

    describe('when inverted with .not', () => {
      it.each([
        { expected: 'true fake data', pass: true },
        { expected: 'false fake data', pass: false },
      ])(
        'should return pass=$pass when strings match, but format inverted error message',
        async ({ expected, pass }) => {
          const actual = 'true fake data';

          // given
          const clipboard = createFakeClipboard({ read: actual });

          // when
          const result = await clipboardMatchers.toHaveData.call(
            matcherStateNot,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveData');
          expect(result.actual).toBe(actual);
          expect(result.expected).toBe(expected);
          expect(result.message()).toContain('not');
        },
      );

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
          const result = await clipboardMatchers.toHaveData.call(
            matcherStateNot,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(pass);
          expect(result.name).toBe('toHaveData');
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
          const result = await clipboardMatchers.toHaveData.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(false);
          expect(result.message()).toContain('Clipboard content is not a valid JSON');
        },
      );

      it.each([{ actual: { data: 'object fake data' }, expected: 'string fake data' }])(
        'should return pass=false when actual=$actual does not match expected=$expected',
        async ({ actual, expected }) => {
          // given
          const clipboard = createFakeClipboard({ readJSON: actual });

          // when
          const result = await clipboardMatchers.toHaveData.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(false);
          expect(result.message()).toContain(`Received: ${JSON.stringify(JSON.stringify(actual))}`);
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
          const result = await clipboardMatchers.toHaveData.call(
            matcherState,
            clipboard,
            expected,
            { timeout: 1000 },
          );

          // then
          expect(result.pass).toBe(true);
        },
      );
    });
  });
});
