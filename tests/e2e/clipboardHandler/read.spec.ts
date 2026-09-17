import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('read method', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should read plain text from clipboard', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    const content = await clipboard.read();
    expect(content).toBe('Hello, World!');
  });
});
