import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('toHaveContentLength', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should copy text and verify it has the expected content length', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveContentLength(13);
  });

  test('should copy text and verify it does not have the expected content length', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).not.toHaveContentLength(10);
  });

  test('should copy JSON and verify it has the expected content length', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).toHaveContentLength(236);
  });

  test('should copy text with new lines and verify it has the expected content length', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyTextWithNewLinesButton.click();

    // then
    await expect(clipboard).toHaveContentLength(22);
  });

  test('should copy text with new lines and verify it has the expected content length with trim option', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyTextWithNewLinesButton.click();

    // then
    await expect(clipboard).toHaveContentLength(19, { trim: true });
  });
});
