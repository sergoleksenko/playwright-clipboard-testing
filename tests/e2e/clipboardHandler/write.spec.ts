import { expect, test } from '../fixtures/baseFixtures';

test.describe('write method', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should write plain text to clipboard', async ({ clipboard, ui }) => {
    // when
    await clipboard.write('Hello from write test');

    // then
    await ui.clipboardTestingPage.readClipboardButton.click();
    await expect(ui.clipboardTestingPage.output).toHaveText('Hello from write test');
  });
});
