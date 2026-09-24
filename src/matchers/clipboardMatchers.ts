import type { ExpectMatcherState } from '@playwright/test';
import { toBeBlank } from './toBeBlank';
import { toHaveContentLength } from './toHaveContentLength';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';
import { toMatchJSONContent } from './toMatchJSONContent';

type PlaywrightMatcher = (this: ExpectMatcherState, receiver: any, ...args: any[]) => any;

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
