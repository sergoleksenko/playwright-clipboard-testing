import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('toBeBlank', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

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
