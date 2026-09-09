import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('readJSON method', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

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
