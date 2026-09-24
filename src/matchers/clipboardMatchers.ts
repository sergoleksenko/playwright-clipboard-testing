import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { toBeBlank } from './toBeBlank';
import { toHaveContentLength } from './toHaveContentLength';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';
import { toMatchJSONContent } from './toMatchJSONContent';
import type { IgnoreCaseMatcherOptions, TimeoutMatcherOptions, TrimMatcherOptions } from './types';

/**
 * Define the type of the clipboard matchers for TypeScript.
 */
export type ClipboardMatchers = {
  toBeBlank(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    options?: TimeoutMatcherOptions & TrimMatcherOptions,
  ): Promise<MatcherReturnType>;
  toHaveContentLength(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: number,
    options?: TimeoutMatcherOptions & TrimMatcherOptions,
  ): Promise<MatcherReturnType>;
  toHaveJSONContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: unknown,
    options?: TimeoutMatcherOptions,
  ): Promise<MatcherReturnType>;
  toHaveTextContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: string | RegExp,
    options?: TimeoutMatcherOptions & IgnoreCaseMatcherOptions & TrimMatcherOptions,
  ): Promise<MatcherReturnType>;
  toMatchJSONContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: unknown,
    options?: TimeoutMatcherOptions,
  ): Promise<MatcherReturnType>;
};

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers: ClipboardMatchers = {
  toBeBlank,
  toHaveContentLength,
  toHaveJSONContent,
  toHaveTextContent,
  toMatchJSONContent,
};
