import { test as baseTest, expect } from '../../../src/index.js';
import { ClipboardTestingPage } from '../pages/clipboardTesting.page.js';

export const test = baseTest.extend<{
  clipboardTestingPage: ClipboardTestingPage;
}>({
  clipboardTestingPage: async ({ page }, use) => {
    await use(new ClipboardTestingPage(page));
  },
});

export { expect };
