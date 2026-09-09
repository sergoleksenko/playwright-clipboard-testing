import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('writeJSON method', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should write JSON to clipboard', async ({ clipboard, clipboardTestingPage }) => {
    // when
    await clipboard.writeJSON({ message: 'Hello from writeJSON test' });

    // then
    await clipboardTestingPage.readClipboardButton.click();
    await expect(clipboardTestingPage.output).toHaveText('{"message":"Hello from writeJSON test"}');
  });

  test('should write primitive value to clipboard', async ({ clipboard, clipboardTestingPage }) => {
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
