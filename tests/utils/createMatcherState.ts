import type { ExpectMatcherState } from '@playwright/test';

export const createMatcherState = (isNot = false): ExpectMatcherState => {
  return {
    isNot,
    utils: {
      matcherHint: (name: string) => `${name}`,
      printExpected: (v: unknown) => `${JSON.stringify(v)}`,
      printReceived: (v: unknown) => `${JSON.stringify(v)}`,
    },
  } as unknown as ExpectMatcherState;
};
