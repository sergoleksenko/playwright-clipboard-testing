import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('read method', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should read plain text from clipboard', async ({ clipboard, clipboardTestingPage }) => {
    // when
    await clipboardTestingPage.copyTextButton.click();

    // then
    const content = await clipboard.read();
    expect(content).toBe('Hello, World!');
  });
});
