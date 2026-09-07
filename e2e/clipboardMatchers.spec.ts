import { expect, test } from './fixtures/baseFixtures.js';

test.describe('clipboardMatchers', () => {
  test.beforeEach(async ({ clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');
  });

  test.describe('toBeBlank', () => {
    test('clipboard should be empty', async ({ clipboard }) => {
      // then
      await expect(clipboard).toBeBlank();
    });

    test('clipboard should not be empty', async ({ clipboard, clipboardTestingPage }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard).not.toBeBlank();
    });
  });

  test.describe('toHaveTextContent', () => {
    test('should copy text and verify it matches expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard).toHaveTextContent('Hello, World!');
    });

    test('should copy text and verify it does not match expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard).not.toHaveTextContent('Goodbye, World!');
    });
  });

  test.describe('toHaveJSONContent', () => {
    test('should copy JSON and verify it matches expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyJSONButton.click();

      // then
      await expect(clipboard).toHaveJSONContent({ message: 'Hello, JSON!' });
    });

    test('should copy JSON and verify it does not match expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyJSONButton.click();

      // then
      await expect(clipboard).not.toHaveJSONContent({ message: 'Goodbye, JSON!' });
    });
  });
});
