import { clipboardFixture } from './clipboardFixture.js';
import { contextFixture } from './contextFixture.js';

/**
 * A collection of fixtures related to clipboard testing, including the clipboard fixture and context fixture.
 * These fixtures can be used in Playwright tests to facilitate clipboard interactions and context management.
 */
export const clipboardFixtures = {
  context: contextFixture,
  clipboard: clipboardFixture,
};

export { clipboardFixture, contextFixture };
