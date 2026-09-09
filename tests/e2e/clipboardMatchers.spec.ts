import { expect, test } from './fixtures/baseFixtures';

test.describe('clipboardMatchers', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
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

    test('clipboard should be empty with trim option when containing whitespace', async ({
      clipboard,
    }) => {
      // when
      await clipboard.write('   ');

      // then
      await expect(clipboard).toBeBlank({ trim: true });
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

    test('should copy text and verify it matches expected data with trim option', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard).toHaveTextContent('   Hello, World!   ', { trim: true });
    });

    test('should copy text and verify it matches expected data with ignoreCase option', async ({
      clipboard,
      clipboardTestingPage,
    }) => {
      // when
      await clipboardTestingPage.copyTextButton.click();

      // then
      await expect(clipboard).toHaveTextContent('HELLO, WORLD!', { ignoreCase: true });
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
