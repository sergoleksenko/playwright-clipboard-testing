import { expect, test } from './fixtures/baseFixtures.js';
import type { ClipboardTestingPage } from './pages/clipboardTesting.page.js';

test.describe('Clipboard Matchers Tests', () => {
  let testingPage: ClipboardTestingPage;

  test.beforeEach(async ({ clipboardTestingPage }) => {
    testingPage = clipboardTestingPage;

    await testingPage.visit();
    await expect(testingPage.status).toHaveText('Idle');
  });

  test.describe('toHaveTextContent', () => {
    test('should copy text and verify it matches expected data', async ({ clipboard }) => {
      await testingPage.copyTextButton.click();

      await expect(clipboard).toHaveTextContent('Hello, World!');
    });

    test('should copy text and verify it does not match expected data', async ({ clipboard }) => {
      await testingPage.copyTextButton.click();

      await expect(clipboard).not.toHaveTextContent('Goodbye, World!');
    });
  });

  test.describe('toHaveJSONContent', () => {
    test('should copy JSON and verify it matches expected data', async ({ clipboard }) => {
      await testingPage.copyJSONButton.click();

      await expect(clipboard).toHaveJSONContent({ message: 'Hello, JSON!' });
    });

    test('should copy JSON and verify it does not match expected data', async ({ clipboard }) => {
      await testingPage.copyJSONButton.click();

      await expect(clipboard).not.toHaveJSONContent({ message: 'Goodbye, JSON!' });
    });
  });
});
