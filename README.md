[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# Playwright Clipboard Testing

Effortless clipboard testing for Playwright. Features custom fixtures, smart polling matchers, and auto-managed permissions.

[![Tests](https://github.com/sergoleksenko/playwright-clipboard-testing/actions/workflows/tests.yml/badge.svg)](https://github.com/sergoleksenko/playwright-clipboard-testing/actions/workflows/tests.yml)
[![npm version](https://img.shields.io/npm/v/playwright-clipboard-testing.svg?style=flat&color=blue)](https://www.npmjs.com/package/playwright-clipboard-testing)
[![npm downloads](https://img.shields.io/npm/dw/playwright-clipboard-testing.svg?color=blue)](https://www.npmjs.com/package/playwright-clipboard-testing)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat&color=blue)](LICENSE)

## Why?
Testing the Clipboard API in Playwright usually requires boilerplate code to manually grant `clipboard-read` and `clipboard-write` permissions for every context, write custom page functions, or deal with tricky async polling issues.

**playwright-clipboard-testing** simplifies this with:
- 🔌 **Zero configuration** — Chromium permissions are granted automatically under the hood (Firefox requires a 1-line config setup).
- 🔄 **Built-in Auto-retries & Polling** — Uses Playwright's native `expect` polling to wait until the clipboard updates asynchronously.
- 📦 **TypeScript Ready** — Full type safety for JSON objects with `readJSON<T>()` and `writeJSON<T>()`.

## Table of Contents
- [Why?](#why)
- [Installation](#installation)
- [Browser Support](#browser-support)
- [Usage](#usage)
  - [Direct Usage](#direct-usage) 
  - [Extended Usage](#extended-usage)
- [API](#api)
  - [Fixtures](#fixtures)
  - [ClipboardHandler](#clipboardhandler)
  - [toBeBlank Matcher](#tobeblank-matcher)
  - [toHaveTextContent Matcher](#tohavetextcontent-matcher)
  - [toHaveJSONContent Matcher](#tohavejsoncontent-matcher)
  - [PATTERNS](#patterns)
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
  
  await expect(clipboard).toHaveTextContent('Hello, World!');
});
```

### Extended Usage

If you already have a custom test fixture file, extend Playwright's `test` and `expect` with `clipboardFixtures` and `clipboardMatchers`:
```ts
import { expect as baseExpect, test as baseTest } from '@playwright/test';
import {
  type ClipboardHandler,
  clipboardFixtures,
  clipboardMatchers,
} from 'playwright-clipboard-testing';

export const test = baseTest.extend<{ clipboard: ClipboardHandler }>(clipboardFixtures);

export const expect = baseExpect.extend(clipboardMatchers);
```

## API

### Fixtures
The package exports the following fixtures for Playwright test configuration:

- `clipboardFixtures` — Object containing both `context` and `clipboard` fixtures. Recommended for extending test fixtures.
- `contextFixture` (`context`) — Playwright context fixture that automatically grants `clipboard-read` and `clipboard-write` permissions in Chromium.
- `clipboardFixture` (`clipboard`) — Playwright test fixture that provides access to the `ClipboardHandler` instance in your tests.

### ClipboardHandler
The `clipboard` fixture provides direct access to the `ClipboardHandler` instance for managing clipboard state:

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `clipboard.read()` | `Promise<string>` | Reads plain text content from the clipboard. |
| `clipboard.write(text)` | `Promise<void>` | Writes the specified plain text to the clipboard. |
| `clipboard.readJSON<T>()` | `Promise<T>` | Reads clipboard content and parses it as a JSON object of type `T`. Throws an error if invalid JSON. |
| `clipboard.writeJSON<T>(data)` | `Promise<void>` | Serializes an object of type `T` to JSON and writes it to the clipboard. Throws an error if object cannot be serialized. |
| `clipboard.clear()` | `Promise<void>` | Clears all clipboard content. |

> **Note:** For verifying clipboard content in tests, we recommend using custom matchers (`toBeBlank`, `toHaveTextContent`, `toHaveJSONContent`), which include built-in smart polling.

### toBeBlank Matcher
`expect(clipboard).toBeBlank(options?)`
Asserts that the clipboard is empty. Uses Playwright's smart polling mechanism to wait for the clipboard to update.
- `options.timeout: number (optional, default: 10000ms)`
- `options.trim: boolean (optional, default: false)` — Trims whitespace from the clipboard content before checking if it's blank.
```ts
// assert that the clipboard is empty
await expect(clipboard).toBeBlank();
```
```ts
// assert that the clipboard is not empty with a custom timeout
await expect(clipboard).not.toBeBlank({ timeout: 5000 });
```

### toHaveTextContent Matcher
`expect(clipboard).toHaveTextContent(expected, options?)`

Asserts that the clipboard content matches the expected string or regular expression. Uses Playwright's smart polling mechanism to wait for the clipboard to update.
- `expected: string | RegExp` — Expected text string or regular expression to match against.
- `options.timeout: number (optional, default: 10000ms)` — Time in milliseconds to wait for the clipboard content to match.
- `options.ignoreCase: boolean (optional, default: false)` — Ignores case when comparing strings or matching regular expressions.
- `options.trim: boolean (optional, default: false)` — Trims whitespace from both expected and actual string before comparison.
```ts
// assert that the clipboard contains the expected text
await expect(clipboard).toHaveTextContent('Hello, World!');
```
```ts
// assert that the clipboard text matches a regular expression
await expect(clipboard).toHaveTextContent(/Hello, World!/i);
```
```ts
// assert that the clipboard is not containing the expected text with a custom timeout
await expect(clipboard).not.toHaveTextContent('Async copied value', { timeout: 5000 });
```

### toHaveJSONContent Matcher
`expect(clipboard).toHaveJSONContent(expected, options?)`
Asserts that the clipboard content matches the expected JSON value. Uses Playwright's smart polling mechanism to wait for the clipboard to update.
- `expected: unknown` — Expected JSON value to compare against.
- `options.timeout: number (optional, default: 10000ms)` — Time in milliseconds to wait for the clipboard content to match.
```ts
// assert that the clipboard contains the expected JSON data
await expect(clipboard).toHaveJSONContent({ message: 'Hello, World!' });
```
```ts
// assert that the clipboard is not containing the expected JSON data with a custom timeout
await expect(clipboard).not.toHaveJSONContent({ message: 'Async copied value' }, { timeout: 5000 });
```

### PATTERNS
The package exports pre-defined regular expression patterns for common data formats (`PATTERNS`), which can be passed directly to `toHaveTextContent`:

- `PATTERNS.UUID` — UUID v1–v5 format (e.g., `123e4567-e89b-12d3-a456-426614174000`)
- `PATTERNS.EMAIL` — Email address format (e.g., `user@example.com`)
- `PATTERNS.JWT` — JWT token format (e.g., `header.payload.signature`)
- `PATTERNS.BEARER` — Bearer authentication token format (e.g., `Bearer token123`)
- `PATTERNS.HEX_COLOR` — HEX color format (e.g., `#FFF`, `#FFFFFF`, `#FFFFFFFF`)
- `PATTERNS.IP.V4` — IPv4 address format (e.g., `192.168.1.1`)
- `PATTERNS.IP.V6` — IPv6 address format (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`)
- `PATTERNS.IP.ANY` — Any IP address format (IPv4 or IPv6)

```ts
import { test, expect, PATTERNS } from 'playwright-clipboard-testing';

test('should copy UUID to clipboard', async ({ page, clipboard }) => {
  await page.goto('https://example.com');
  await page.locator('#copy-uuid-button').click();

  await expect(clipboard).toHaveTextContent(PATTERNS.UUID);
});
```

## Author
Sergii Oleksenko <serg.oleksenko@gmail.com>

## License
[MIT](LICENSE)

---
If you find this project useful, give it a ⭐️ on [GitHub](https://github.com/sergoleksenko/playwright-clipboard-testing)!
