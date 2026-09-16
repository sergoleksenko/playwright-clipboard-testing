import { toBeBlank } from './toBeBlank';
import { toHaveContentLength } from './toHaveContentLength.ts';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';
import { toMatchJSONContent } from './toMatchJSONContent.ts';

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers = {
  toBeBlank,
  toHaveContentLength,
  toHaveJSONContent,
  toHaveTextContent,
  toMatchJSONContent,
};
