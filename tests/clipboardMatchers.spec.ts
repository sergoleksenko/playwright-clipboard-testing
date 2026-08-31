import type { ExpectMatcherState } from '@playwright/test';
import { describe, expect, it, vi } from 'vitest';
import type { ClipboardHandler } from '../src/index.js';
import { clipboardMatchers } from '../src/index.js';

const createFakeClipboard = (
  overrides: { read?: string; readJSON?: unknown } = {},
): ClipboardHandler => {
  const { read = '' } = overrides;

  return {
    read: vi.fn().mockResolvedValue(read),
    readJSON: vi.fn().mockImplementation(<T>() => {
      if (overrides.readJSON !== undefined) {
        return overrides.readJSON as T;
      }

      try {
        return JSON.parse(read) as T;
      } catch {
        throw new Error(`Clipboard content is not a valid JSON: ${read}`);
      }
    }),
  } as Pick<ClipboardHandler, 'read' | 'readJSON'> as ClipboardHandler;
};

const createMatcherState = (isNot = false): ExpectMatcherState =>
  ({
    isNot,
    utils: {
      matcherHint: (name: string) => `matcherHint(${name})`,
      printExpected: (v: unknown) => `expected:${JSON.stringify(v)}`,
      printReceived: (v: unknown) => `received:${JSON.stringify(v)}`,
    },
  }) as unknown as ExpectMatcherState;

const matcherState = createMatcherState();

describe('clipboardMatchers', () => {
  describe('toHaveData', () => {
    it.each([
      { expected: 'true fake data', pass: true },
      { expected: 'false fake data', pass: false },
    ])(
      'should return pass=$pass when expected is the string "$expected"',
      async ({ expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ read: 'true fake data' });

        // when
        const result = await clipboardMatchers.toHaveData.call(matcherState, clipboard, expected, {
          timeout: 1000,
        });

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveData');
        expect(result.actual).toBe('true fake data');
        expect(result.expected).toBe(expected);
      },
    );

    it.each([
      { expected: { data: 'true fake data' }, pass: true },
      { expected: { data: 'false fake data' }, pass: false },
    ])(
      'should return pass=$pass when expected is the object "$expected"',
      async ({ expected, pass }) => {
        // given
        const clipboard = createFakeClipboard({ readJSON: { data: 'true fake data' } });

        // when
        const result = await clipboardMatchers.toHaveData.call(matcherState, clipboard, expected, {
          timeout: 1000,
        });

        // then
        expect(result.pass).toBe(pass);
        expect(result.name).toBe('toHaveData');
        expect(result.actual).toEqual({ data: 'true fake data' });
        expect(result.expected).toEqual(expected);
      },
    );
  });
});
