import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { toBeBlank } from './toBeBlank';
import { toHaveContentLength } from './toHaveContentLength';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';
import { toMatchJSONContent } from './toMatchJSONContent';

/**
 * Define the type of the clipboard matchers for TypeScript.
 */
export type ClipboardMatchers = {
  toBeBlank(this: ExpectMatcherState, clipboard: ClipboardHandler): Promise<MatcherReturnType>;
  toHaveContentLength(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: number,
  ): Promise<MatcherReturnType>;
  toHaveJSONContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: unknown,
  ): Promise<MatcherReturnType>;
  toHaveTextContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: string | RegExp,
  ): Promise<MatcherReturnType>;
  toMatchJSONContent(
    this: ExpectMatcherState,
    clipboard: ClipboardHandler,
    expected: unknown,
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
