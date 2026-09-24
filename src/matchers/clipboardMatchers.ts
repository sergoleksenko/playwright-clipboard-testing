import type { ExpectMatcherState, MatcherReturnType } from '@playwright/test';
import type { ClipboardHandler } from '../utils';
import { toBeBlank } from './toBeBlank';
import { toHaveContentLength } from './toHaveContentLength';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';
import { toMatchJSONContent } from './toMatchJSONContent';

type PlaywrightMatcher = (
  this: ExpectMatcherState,
  clipboard: ClipboardHandler,
  // biome-ignore lint/suspicious/noExplicitAny: Playwright matchers accept arbitrary receiver and arguments
  ...args: any[]
) => Promise<MatcherReturnType>;

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers: Record<string, PlaywrightMatcher> = {
  toBeBlank,
  toHaveContentLength,
  toHaveJSONContent,
  toHaveTextContent,
  toMatchJSONContent,
};

/**
 * Export the type of the clipboard matchers for TypeScript.
 */
export type ClipboardMatchers = typeof clipboardMatchers;
