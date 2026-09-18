import { expect, test } from '../fixtures/baseFixtures';

test.describe('toHaveContentLength', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should copy text and verify it has the expected content length', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveContentLength(13);
  });

  test('should copy text and verify it does not have the expected content length', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).not.toHaveContentLength(10);
  });

  test('should copy JSON and verify it has the expected content length', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).toHaveContentLength(236);
  });

  test('should copy text with new lines and verify it has the expected content length', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextWithNewLinesButton.click();

    // then
    await expect(clipboard).toHaveContentLength(22);
  });

  test('should copy text with new lines and verify it has the expected content length with trim option', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextWithNewLinesButton.click();

    // then
    await expect(clipboard).toHaveContentLength(19, { trim: true });
  });
});
