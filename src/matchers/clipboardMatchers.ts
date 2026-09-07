import { toBeBlank } from './toBeBlank.js';
import { toHaveData } from './toHaveData.js';
import { toHaveJSONContent } from './toHaveJSONContent.js';
import { toHaveTextContent } from './toHaveTextContent.js';

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers = {
  toBeBlank,
  toHaveData,
  toHaveJSONContent,
  toHaveTextContent,
};
