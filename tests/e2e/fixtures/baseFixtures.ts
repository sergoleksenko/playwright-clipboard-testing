import { test as baseTest, expect } from '../../../src/index';
import { ClipboardTestingPage } from '../pages/clipboardTesting.page';

export const test = baseTest.extend<{
  clipboardTestingPage: ClipboardTestingPage;
}>({
  clipboardTestingPage: async ({ page }, use) => {
    await use(new ClipboardTestingPage(page));
  },
});

export { expect };
