import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('write method', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should write plain text to clipboard', async ({ clipboard, clipboardTestingPage }) => {
    // when
    await clipboard.write('Hello from write test');

    // then
    await clipboardTestingPage.readClipboardButton.click();
    await expect(clipboardTestingPage.output).toHaveText('Hello from write test');
  });
});
