import { test as baseTest, expect } from '../../../src';
import { ClipboardTestingPage } from '../pages/clipboardTesting.page';

export const test = baseTest.extend<{
  ui: { clipboardTestingPage: ClipboardTestingPage };
}>({
  ui: async ({ page }, use) => {
    await use({ clipboardTestingPage: new ClipboardTestingPage(page) });
  },
});

export { expect };
