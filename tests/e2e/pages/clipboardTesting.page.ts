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

  get copyUUIDButton(): Locator {
    return this.page.getByTestId('copy-uuid-button');
  }

  get copyIPV4Button(): Locator {
    return this.page.getByTestId('copy-ipv4-button');
  }

  get copyIPV6Button(): Locator {
    return this.page.getByTestId('copy-ipv6-button');
  }

  get copyHexButton(): Locator {
    return this.page.getByTestId('copy-hex-button');
  }

  get copyJWTButton(): Locator {
    return this.page.getByTestId('copy-jwt-button');
  }

  get copyBearerButton(): Locator {
    return this.page.getByTestId('copy-bearer-button');
  }

  get copyEmailButton(): Locator {
    return this.page.getByTestId('copy-email-button');
  }

  get copyJSONButton(): Locator {
    return this.page.getByTestId('copy-json-button');
  }
}
