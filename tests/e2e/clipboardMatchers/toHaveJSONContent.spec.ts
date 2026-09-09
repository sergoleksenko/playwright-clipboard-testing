import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('toHaveJSONContent', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

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
