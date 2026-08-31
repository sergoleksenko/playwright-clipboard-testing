[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# Playwright Clipboard Testing

Effortless clipboard testing for Playwright. Features custom fixtures, smart polling matchers, and auto-managed permissions.

[![npm version](https://img.shields.io/npm/v/playwright-clipboard-testing.svg?style=flat&color=blue)](https://www.npmjs.com/package/playwright-clipboard-testing)
[![npm downloads](https://img.shields.io/npm/dw/playwright-clipboard-testing.svg?color=blue)](https://www.npmjs.com/package/playwright-clipboard-testing)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat&color=blue)](LICENSE)

## Why?
Testing the Clipboard API in Playwright usually requires boilerplate code to manually grant `clipboard-read` and `clipboard-write` permissions for every context, write custom page functions, or deal with tricky async polling issues.

**playwright-clipboard-testing** simplifies this with:
- 🔌 **Zero configuration** — Chromium permissions are granted automatically under the hood (Firefox requires a 1-line config setup).
- 🔄 **Built-in Auto-retries & Polling** — Uses Playwright's native `expect` polling to wait until the clipboard updates asynchronously.
- 📦 **TypeScript Ready** — Out-of-the-box support for JSON objects with full type safety (`readJSON<T>()`).

## Table of Contents
- [Why?](#why)
- [Installation](#installation)
- [Browser Support](#browser-support)
- [Usage](#usage)
  - [Direct Usage](#direct-usage) 
  - [Extended Usage](#extended-usage)
- [API](#api)
  - [Clipboard Fixture](#clipboard-fixture)
  - [toHaveData Matcher](#tohavedata-matcher)
- [Author](#author)
- [License](#license)

## Installation
Install as one of your dev dependencies:
```bash
npm install --save-dev playwright-clipboard-testing
```

## Browser Support
![NOTE](https://img.shields.io/badge/NOTE-WebKit%20browser%20does%20not%20support%20the%20Clipboard%20API-yellow)

Clipboard API testing is currently supported in Chromium-based and Firefox browsers.

> **Note:** Permissions are auto-managed out of the box for Chromium. Firefox requires a one-time preference setup in your config.

If your Playwright setup runs tests in WebKit, you can skip clipboard tests for that browser:
```ts
test('should copy text to clipboard', async ({ page, clipboard, browserName }) => {
  test.skip(browserName === 'webkit', 'Clipboard API is only supported in Chromium and Firefox');

  // test logic...
});
```
If your Playwright setup runs tests in Firefox, manually configure `firefoxUserPrefs` in your Playwright config:
```ts
import { defineConfig, devices } from '@playwright/test';
import { firefoxClipboardPrefs } from 'playwright-clipboard-testing';

export default defineConfig({
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: firefoxClipboardPrefs,
        },
      },
    },
  ],
});
```

## Usage
### Direct Usage

Import `test` and `expect` directly from the package:
```ts
import { test, expect } from 'playwright-clipboard-testing';

test('should copy text to clipboard', async ({ page, clipboard }) => {
  await page.goto('https://example.com');
  await page.locator('#copy-button').click();
  
  await expect(clipboard).toHaveData('Hello, World!');
});
```

### Extended Usage

If you already have a custom test fixture file, extend Playwright's `test` and `expect` with `clipboardFixture` and `clipboardMatchers`:
```ts
import { expect as baseExpect, test as baseTest } from '@playwright/test';
import {
  type ClipboardHandler,
  clipboardFixture,
  clipboardMatchers,
} from 'playwright-clipboard-testing';

export const test = baseTest.extend<{ clipboard: ClipboardHandler }>({
  clipboard: clipboardFixture,
});

export const expect = baseExpect.extend(clipboardMatchers);

```

## API
### Clipboard Fixture
The `clipboard` fixture provides direct access to the browser clipboard during tests:
- `clipboard.read(): Promise<string>` - reads the current plain text content from the clipboard.
- `clipboard.readJSON<T>(): Promise<T>` - reads the current clipboard content and parses it as a JSON object of type `T`. Throws an error if the content is not valid JSON.

![NOTE](https://img.shields.io/badge/NOTE-For%20your%20tests%20we%20recommend%20using%20the%20toHaveData%20matcher-yellow)

### toHaveData Matcher
`expect(clipboard).toHaveData(expected, options?)`

Asserts that the clipboard content matches the expected string or JSON object. Uses Playwright's smart polling mechanism to wait for the clipboard to update.
- `expected: unknown` — Expected text or object to compare against.
- `options.timeout: number (optional, default: 10000ms)` — Time in milliseconds to wait for the clipboard data to match.
```ts
// assert that the clipboard contains the expected text
await expect(clipboard).toHaveData('Hello, World!');
```
```ts
// assert that the clipboard contains the expected JSON data
await expect(clipboard).toHaveData({ message: 'Hello, World!' });
```
```ts
// Custom timeout
await expect(clipboard).toHaveData('Async copied value', { timeout: 5000 });
```

## Author
Sergii Oleksenko <serg.oleksenko@gmail.com>

## License
[MIT](LICENSE)

---
If you find this project useful, give it a ⭐️ on [GitHub](https://github.com/sergoleksenko/playwright-clipboard-testing)!
