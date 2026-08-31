export { clipboardFixture } from './fixtures/clipboardFixture.js';
export { expect, test } from './fixtures.js';
export { clipboardMatchers } from './matchers/clipboardMatchers.js';
export { ClipboardHandler } from './utils/clipboardHandler.js';

export const firefoxClipboardPrefs = {
  'dom.events.asyncClipboard.readText': true,
  'dom.events.asyncClipboard.clipboardData': true,
  'dom.events.testing.asyncClipboard': true,
};
