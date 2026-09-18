import { expect, test } from '../fixtures/baseFixtures';

test.describe('toHaveJSONContent', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should copy JSON and verify it matches expected data', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).toHaveJSONContent({
      id: 1,
      message: 'Hello, JSON!',
      status: 'task',
      children: [
        { status: 'active', id: 1, deleted: false },
        { status: 'closed', id: 2, deleted: false },
      ],
    });
  });

  test('should copy JSON and verify it does not match expected data', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).not.toHaveJSONContent({ message: 'Hello, JSON!' });
  });
});
