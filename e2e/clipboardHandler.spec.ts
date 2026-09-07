import { expect, test } from './fixtures/baseFixtures.js';

test.describe('ClipboardHandler', () => {
  test.beforeEach(async ({ clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');
  });

  test.describe('write method', () => {
    test('should write plain text to clipboard', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboard.write('Hello from write test');

      // then
      await clipboardTestingPage.readClipboardButton.click();
      await expect(clipboardTestingPage.output).toHaveText(
        'Read from clipboard: Hello from write test',
      );
    });
  });

  test.describe('read method', () => {
    test('should read plain text from clipboard', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      const content = await clipboard.read();
      expect(content).toBe('Hello, World!');
    });
  });

  test.describe('readJSON method', () => {
    test('should read JSON from clipboard', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboardTestingPage.copyJSONButton.click();

      // then
      const content = await clipboard.readJSON();
      expect(content).toEqual({ message: 'Hello, JSON!' });
    });

    test('should throw an error when content is not valid JSON', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard.readJSON()).rejects.toThrow(
        'Clipboard content is not a valid JSON: "Hello, World!"',
      );
    });
  });
});
