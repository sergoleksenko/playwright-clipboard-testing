import { toHaveData } from './toHaveData.js';
import { toHaveJSON } from './toHaveJSON.js';
import { toHaveText } from './toHaveText.js';

/**
 * Export an object containing all the custom clipboard matchers for Playwright.
 */
export const clipboardMatchers = {
  toHaveText,
  toHaveJSON,
  toHaveData,
};
