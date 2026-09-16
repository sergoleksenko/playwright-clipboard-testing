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

import type { Page } from '@playwright/test';
import { runInStep } from './runInStep.ts';

export class ClipboardHandler {
  constructor(private readonly page: Page) {}

  private async _write(data: string): Promise<void> {
    await this.page.evaluate((value) => navigator.clipboard.writeText(value), data);
  }

  private async _read(): Promise<string> {
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  /**
   * Reads the current text content from the browser clipboard.
   * If the content is a JSON-encoded string (e.g., has extra quotes),
   * it will be returned as is. Use readJSON for automatic parsing.
   *
   * @returns A promise that resolves to the clipboard string content.
   */
  async read(): Promise<string> {
    return await runInStep('Clipboard "read"', async () => {
      return await this._read();
    });
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
    return await runInStep('Clipboard "readJSON"', async () => {
      const text = await this._read();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          `[playwright-clipboard] Clipboard content is not a valid JSON: ${JSON.stringify(text)}`,
        );
      }
    });
  }

  /**
   * Writes the provided string data to the browser clipboard.
   * @param data The data to write to the clipboard.
   */
  async write(data: string): Promise<void> {
    await runInStep('Clipboard "write"', async () => {
      await this._write(data);
    });
  }

  /**
   * Writes the provided data to the browser clipboard as a JSON string.
   * @param data The data to write to the clipboard. It will be stringified as JSON.
   */
  async writeJSON<T = unknown>(data: T): Promise<void> {
    const errorMessage = '[playwright-clipboard] Provided data cannot be stringified to valid JSON';
    let jsonString: string | undefined;

    try {
      jsonString = JSON.stringify(data);
    } catch (error) {
      const message = error instanceof Error ? error : String(error);
      throw new Error(`${errorMessage}: ${message}`);
    }

    if (jsonString === undefined) {
      throw new Error(`${errorMessage} (received undefined).`);
    }

    await runInStep('Clipboard "writeJSON"', async () => {
      await this._write(jsonString);
    });
  }

  /**
   * Clears the browser clipboard by writing an empty string to it.
   * This effectively removes any existing content from the clipboard.
   */
  async clear(): Promise<void> {
    await runInStep('Clipboard "clear"', async () => {
      await this._write('');
    });
  }
}
