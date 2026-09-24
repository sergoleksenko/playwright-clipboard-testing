import { expect, test } from '../fixtures/baseFixtures';

test.describe('clear method', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

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
