import type { Locator, Page } from '@playwright/test';

export class ClipboardTestingPage {
  constructor(private readonly page: Page) {}

  async visit(): Promise<void> {
    await this.page.goto('index.html', { waitUntil: 'domcontentloaded' });
  }

  get status(): Locator {
    return this.page.getByTestId('status');
  }

  get output(): Locator {
    return this.page.getByTestId('output');
  }

  get readClipboardButton(): Locator {
    return this.page.getByTestId('read-clipboard-button');
  }

  get copyTextButton(): Locator {
    return this.page.getByTestId('copy-text-button');
  }

  get copyJSONButton(): Locator {
    return this.page.getByTestId('copy-json-button');
  }
}
