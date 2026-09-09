import { vi } from 'vitest';
import type { ClipboardHandler } from '../../src';

export const createFakeClipboard = (
  overrides: { read?: string; readJSON?: unknown } = {},
): ClipboardHandler => {
  const read =
    overrides.read ?? (overrides.readJSON !== undefined ? JSON.stringify(overrides.readJSON) : '');
  const readJSON = overrides.readJSON;

  return {
    read: vi.fn().mockResolvedValue(read),
    readJSON: vi.fn().mockImplementation(<T>() => {
      if (readJSON !== undefined) {
        return readJSON as T;
      }

      try {
        return JSON.parse(read) as T;
      } catch {
        throw new Error(`Clipboard content is not a valid JSON: ${JSON.stringify(read)}`);
      }
    }),
  } as Pick<ClipboardHandler, 'read' | 'readJSON'> as ClipboardHandler;
};
