import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('toMatchJSONContent', async () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should copy JSON and verify it contains expected data', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).toMatchJSONContent({
      children: [
        { status: 'active', id: 1, deleted: false },
        { status: 'closed', id: 2, deleted: false },
      ],
    });
    await expect(clipboard).toMatchJSONContent({ id: 1, message: 'Hello, JSON!', status: 'task' });
    await expect(clipboard).toMatchJSONContent({ id: 1, message: expect.any(String) });
  });

  test('should copy JSON and verify it does not contain expected data', async ({
    clipboard,
    clipboardTestingPage,
  }) => {
    // when
    await clipboardTestingPage.copyJSONButton.click();

    // then
    await expect(clipboard).not.toMatchJSONContent({
      children: [{ status: 'closed', id: 4, deleted: false }],
    });
  });
});
