import { expect, test } from 'playwright-clipboard-testing';

test.describe('Clipboard Matchers Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'file:///Users/sergii/GitHub/playwright-clipboard-testing/e2e/fixtures/index.html',
    );
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByTestId('status')).toHaveText('Idle');
  });

  test('toHaveTextContent', async ({ page, clipboard }) => {
    await page.getByTestId('copy-text-button').click();

    await expect(clipboard).toHaveTextContent('Hello, World!');
  });
});
