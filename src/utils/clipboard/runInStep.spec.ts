import { test as pwTest, type TestInfo, type TestStepInfo } from '@playwright/test';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { runInStep } from './runInStep';

describe('runInStep', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fallback branch - outside of Playwright test runner', () => {
    test('should execute the callback directly when no test is running', async () => {
      const infoSpy = vi.spyOn(pwTest, 'info').mockImplementation(() => {
        throw new Error('test.info() can only be called while test is running');
      });

      // given
      const mockFn = vi.fn().mockResolvedValue('fallback-result');

      // when
      const result = await runInStep<string>('Test Step', mockFn);

      // then
      expect(infoSpy).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('fallback-result');
    });

    test('should rethrow errors from the callback when no test is running', async () => {
      const infoSpy = vi.spyOn(pwTest, 'info').mockImplementation(() => {
        throw new Error('test.info() can only be called while test is running');
      });

      // given
      const mockFn = vi.fn().mockRejectedValue(new Error('Clipboard permission denied'));

      // when & then
      await expect(runInStep('Test Step', mockFn)).rejects.toThrow('Clipboard permission denied');
      expect(infoSpy).toHaveBeenCalled();
    });
  });

  describe('step branch - inside of Playwright test runner', () => {
    test('should wrap call into test.step with box: true when test is running', async () => {
      const infoSpy = vi.spyOn(pwTest, 'info').mockReturnValue({ testId: 'test-id' } as TestInfo);
      const stepSpy = vi.spyOn(pwTest, 'step').mockImplementation(async (_name, fn) => {
        return await fn({} as TestStepInfo);
      });

      // given
      const mockFn = vi.fn().mockResolvedValue('step-result');

      // when
      const result = await runInStep<string>('Test Step', mockFn);

      // then
      expect(infoSpy).toHaveBeenCalled();
      expect(stepSpy).toHaveBeenCalledWith('Test Step', mockFn, { box: true });
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('step-result');
    });
  });
});
