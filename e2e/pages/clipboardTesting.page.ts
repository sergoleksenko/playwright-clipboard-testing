import type { Locator, Page } from '@playwright/test';

export class ClipboardTestingPage {
  constructor(private readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('/index.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  get status(): Locator {
    return this.page.getByTestId('status');
  }

  get copyTextButton(): Locator {
    return this.page.getByTestId('copy-text-button');
  }

  get copyJSONButton(): Locator {
    return this.page.getByTestId('copy-json-button');
  }
}
