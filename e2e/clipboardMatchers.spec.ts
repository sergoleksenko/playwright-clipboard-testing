import { expect, test } from './fixtures/baseFixtures.js';

test.describe('Clipboard Matchers Tests', () => {
  test.beforeEach(async ({ clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');
  });

  test.describe('toHaveTextContent', () => {
    test('should copy text and verify it matches expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      await clipboardTestingPage.copyTextButton.click();

      await expect(clipboard).toHaveTextContent('Hello, World!');
    });

    test('should copy text and verify it does not match expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      await clipboardTestingPage.copyTextButton.click();

      await expect(clipboard).not.toHaveTextContent('Goodbye, World!');
    });
  });

  test.describe('toHaveJSONContent', () => {
    test('should copy JSON and verify it matches expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      await clipboardTestingPage.copyJSONButton.click();

      await expect(clipboard).toHaveJSONContent({ message: 'Hello, JSON!' });
    });

    test('should copy JSON and verify it does not match expected data', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      await clipboardTestingPage.copyJSONButton.click();

      await expect(clipboard).not.toHaveJSONContent({ message: 'Goodbye, JSON!' });
    });
  });
});
