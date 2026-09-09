import { expect, test } from '../fixtures/baseFixtures.ts';

test.describe('clear method', () => {
  test.beforeEach(async ({ clipboard, clipboardTestingPage }) => {
    await clipboardTestingPage.visit();
    await expect(clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should clear clipboard', async ({ clipboard }) => {
    // given
    await clipboard.write('Hello from clear test');

    // when
    await clipboard.clear();

    // then
    const content = await clipboard.read();
    expect(content).toBe('');
  });
});
