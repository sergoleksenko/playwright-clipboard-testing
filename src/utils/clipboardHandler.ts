/**
 * Playwright-compatible Clipboard utilities.
 *
 * Core functions for interacting with the browser clipboard within Playwright tests.
 * Provides wrappers for reading plain text and JSON.
 *
 * @remarks
 * These utilities require 'clipboard-read' and 'clipboard-write' permissions
 * to be granted in the browser context.
 */

import type { BrowserContext, Page } from '@playwright/test';

export class ClipboardHandler {
  private isPermissionGranted: boolean;

  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext,
  ) {
    this.isPermissionGranted = false;
  }

  /**
   * Grants the necessary clipboard permissions ('clipboard-read' and 'clipboard-write') to the browser context.
   * This method is called internally before any clipboard read operation to ensure permissions are set.
   * @private
   */
  private async grantPermissions() {
    if (!this.isPermissionGranted) {
      await this.context.grantPermissions(['clipboard-read', 'clipboard-write']);
      this.isPermissionGranted = true;
    }
  }

  /**
   * Reads the current text content from the browser clipboard.
   * If the content is a JSON-encoded string (e.g., has extra quotes),
   * it will be returned as is. Use readJSON for automatic parsing.
   *
   * @returns A promise that resolves to the clipboard string content.
   */
  async read(): Promise<string> {
    await this.grantPermissions();
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  /**
   * Reads the clipboard content and parses it as JSON.
   * If the content is a string literal (e.g., '"value"'), it returns the unwrapped string ('value').
   *
   * @template T - The expected type of the parsed JSON object.
   * @returns A promise that resolves to the parsed JSON object of type T.
   * @throws {Error} If the clipboard content is not a valid JSON string.
   */
  async readJSON<T = unknown>(): Promise<T> {
    const text = await this.read();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Clipboard content is not a valid JSON: ${JSON.stringify(text)}`);
    }
  }
}
