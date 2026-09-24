import { PATTERNS } from '../../../src/constants/patterns';
import { expect, test } from '../fixtures/baseFixtures';

test.describe('toHaveTextContent', () => {
  test.beforeEach(async ({ clipboard, ui }) => {
    await ui.clipboardTestingPage.visit();
    await expect(ui.clipboardTestingPage.status).toHaveText('Idle');

    await clipboard.clear();
  });

  test('should copy text and verify it matches expected data', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveTextContent('Hello, World!');
  });

  test('should copy text and verify it does not match expected data', async ({ clipboard, ui }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).not.toHaveTextContent('Goodbye, World!');
  });

  test('should copy text and verify it matches expected data with trim option', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveTextContent('   Hello, World!   ', { trim: true });
  });

  test('should copy text and verify it matches expected data with ignoreCase option', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveTextContent('HELLO, WORLD!', { ignoreCase: true });
  });

  test('should copy text and verify it matches expected data with both trim and ignoreCase options', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveTextContent('   HELLO, WORLD!   ', {
      trim: true,
      ignoreCase: true,
    });
  });

  test('should copy text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyTextButton.click();

    // then
    await expect(clipboard).toHaveTextContent(/Hello, World!/);
    await expect(clipboard).toHaveTextContent(/Hello, World!/i);
    await expect(clipboard).toHaveTextContent(/Hello, World!/, { ignoreCase: true });
    await expect(clipboard).toHaveTextContent(/Hello, World!/, { trim: true, ignoreCase: true });
    await expect(clipboard).toHaveTextContent(/[A-Z]+/, { ignoreCase: true });
    await expect(clipboard).toHaveTextContent(/[A-Z]+/, { trim: true, ignoreCase: true });
  });

  test('should copy UUID text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyUUIDButton.click();

    // then
    await expect(clipboard).toHaveTextContent(/[0-9a-fA-F-]+/i);
    await expect(clipboard).toHaveTextContent(/[0-9a-fA-F-]+/, { ignoreCase: true });
    await expect(clipboard).toHaveTextContent(PATTERNS.UUID);
  });

  test('should copy Email text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyEmailButton.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.EMAIL);
  });

  test('should copy Phone text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyPhoneButton.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.PHONE);
  });

  test('should copy JWT token text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyJWTButton.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.JWT);
  });

  test('should copy Bearer token text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyBearerButton.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.BEARER);
  });

  test('should copy HEX color text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyHexButton.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.HEX_COLOR);
  });

  test('should copy IPv4 text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyIPV4Button.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.IP.V4);
    await expect(clipboard).toHaveTextContent(PATTERNS.IP.ANY);
  });

  test('should copy IPv6 text and verify it matches expected data with regex', async ({
    clipboard,
    ui,
  }) => {
    // when
    await ui.clipboardTestingPage.copyIPV6Button.click();

    // then
    await expect(clipboard).toHaveTextContent(PATTERNS.IP.V6);
    await expect(clipboard).toHaveTextContent(PATTERNS.IP.ANY);
  });
});
