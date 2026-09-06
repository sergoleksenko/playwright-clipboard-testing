import path from 'node:path';
import { expect, test } from 'playwright-clipboard-testing';

test.describe('Clipboard Matchers Tests', () => {
  test.beforeEach(async ({ page }) => {
    const filePath = path.resolve(process.cwd(), 'e2e/fixtures/index.html');
    await page.goto(`file://${filePath}`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByTestId('status')).toHaveText('Idle');
  });

  test('toHaveTextContent', async ({ page, clipboard }) => {
    await page.getByTestId('copy-text-button').click();

    await expect(clipboard).toHaveTextContent('Hello, World!');
  });
});
