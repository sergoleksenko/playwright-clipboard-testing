import { test } from '@playwright/test';

const isTestRunning = () => {
  try {
    return !!test.info();
  } catch {
    return false;
  }
};

export const runInStep = async <T>(stepName: string, fn: () => Promise<T>) => {
  if (isTestRunning()) {
    return await test.step(stepName, fn, { box: true });
  } else {
    return await fn();
  }
};
