import { expect, test } from '../fixtures/baseFixtures';

test.describe('readJSON method', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should read JSON from clipboard', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyJSONButton.click();

    // then
    const content = await clipboard.readJSON();
    expect(content).toEqual({
      id: 1,
      message: 'Hello, JSON!',
      status: 'task',
      children: [
        { status: 'active', id: 1, deleted: false },
        { status: 'closed', id: 2, deleted: false },
      ],
    });
  });

  test('should throw an error when content is not valid JSON', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard.readJSON()).rejects.toThrow(
      '[playwright-clipboard] Clipboard content is not a valid JSON: "Hello, World!"',
    );
  });
});
