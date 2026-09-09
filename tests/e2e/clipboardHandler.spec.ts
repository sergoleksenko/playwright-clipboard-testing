import { expect, test } from './fixtures/baseFixtures';

test.describe('ClipboardHandler', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test.describe('clear method', () => {
    test('should clear clipboard', async ({ clipboard }) => {
      // given
      await clipboard.write('Hello from clear test');

      // when
      await clipboard.clear();

      // then
      const content = await clipboard.read();
      expect(content).toBe('');
    });
  });

  test.describe('write method', () => {
    test('should write plain text to clipboard', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboard.write('Hello from write test');

      // then
      await clipboardTestingPage.readClipboardButton.click();
      await expect(clipboardTestingPage.output).toHaveText('Hello from write test');
    });
  });

  test.describe('writeJSON method', () => {
    test('should write JSON to clipboard', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboard.writeJSON({ message: 'Hello from writeJSON test' });

      // then
      await clipboardTestingPage.readClipboardButton.click();
      await expect(clipboardTestingPage.output).toHaveText(
        '{"message":"Hello from writeJSON test"}',
      );
    });

    test('should write primitive value to clipboard', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboard.writeJSON(12345);

      await clipboardTestingPage.readClipboardButton.click();
      await expect(clipboardTestingPage.output).toHaveText('12345');
    });

    test('should throw an error when trying to write undefined', async ({ clipboard }) => {
      // when
      await expect(clipboard.writeJSON(undefined)).rejects.toThrow(
        '[playwright-clipboard] Provided data cannot be stringified to valid JSON (received undefined).',
      );
    });

    test('should throw an error when trying to write circular JSON', async ({ clipboard }) => {
      // when
      // biome-ignore lint/suspicious/noExplicitAny: any type is used here to create a circular object for testing purposes
      const circularObject: any = {};
      circularObject.self = circularObject;

      // then
      await expect(clipboard.writeJSON(circularObject)).rejects.toThrow(
        '[playwright-clipboard] Provided data cannot be stringified to valid JSON: TypeError: Converting circular structure to JSON',
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
        '[playwright-clipboard] Clipboard content is not a valid JSON: "Hello, World!"',
      );
    });
  });
});
