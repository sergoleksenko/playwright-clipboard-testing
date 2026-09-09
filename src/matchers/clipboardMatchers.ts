import { toBeBlank } from './toBeBlank';
import { toHaveJSONContent } from './toHaveJSONContent';
import { toHaveTextContent } from './toHaveTextContent';

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers = {
  toBeBlank,
  toHaveJSONContent,
  toHaveTextContent,
};
