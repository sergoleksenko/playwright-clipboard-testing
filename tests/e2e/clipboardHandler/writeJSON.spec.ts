import { expect, test } from '../fixtures/baseFixtures';

test.describe('writeJSON method', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should write JSON to clipboard', async ({ clipboard, ui }) => {
    // when
    await clipboard.writeJSON({ message: 'Hello from writeJSON test' });

    // then
    await ui.clipboardTestingPage.readClipboardButton.click();
    await expect(ui.clipboardTestingPage.output).toHaveText(
      '{"message":"Hello from writeJSON test"}',
    );
  });

  test('should write primitive value to clipboard', async ({ clipboard, ui }) => {
    // when
    await clipboard.writeJSON(12345);

    await ui.clipboardTestingPage.readClipboardButton.click();
    await expect(ui.clipboardTestingPage.output).toHaveText('12345');
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
