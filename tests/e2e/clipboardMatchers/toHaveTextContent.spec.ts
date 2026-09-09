import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('toHaveTextContent', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

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
