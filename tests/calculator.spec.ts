import { test, expect, Page } from '@playwright/test';

/** Click buttons by their visible label, e.g. press(page, '1 2 + 3 =') */
async function press(page: Page, keys: string) {
  const labels: Record<string, string> = { '+': 'Add', '-': 'Subtract', '*': 'Multiply', '/': 'Divide', '=': 'Equals', '.': 'Decimal', '±': 'Toggle sign', '⌫': 'Delete' };
  for (const key of keys.split(' ')) {
    await page.getByRole('button', { name: labels[key] ?? key, exact: true }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Basic arithmetic', () => {
  const cases = [
    { keys: '1 2 + 3 =', expected: '15' },
    { keys: '9 - 1 2 =', expected: '-3' },
    { keys: '6 * 7 =', expected: '42' },
    { keys: '8 / 4 =', expected: '2' },
    { keys: '1 / 3 =', expected: '0.333333333333' },
    { keys: '0 . 1 + 0 . 2 =', expected: '0.3' },
  ];

  for (const { keys, expected } of cases) {
    test(`${keys} → ${expected}`, async ({ page }) => {
      await press(page, keys);
      await expect(page.getByTestId('display')).toHaveText(expected);
    });
  }
});

test('chains operations left to right', async ({ page }) => {
  await press(page, '2 + 3 * 4 =');
  await expect(page.getByTestId('display')).toHaveText('20');
});

test('shows Error when dividing by zero', async ({ page }) => {
  await press(page, '5 / 0 =');
  await expect(page.getByTestId('display')).toHaveText('Error');
  await press(page, '7');
  await expect(page.getByTestId('display')).toHaveText('7');
});

test('shows pending expression', async ({ page }) => {
  await press(page, '1 2 *');
  await expect(page.getByTestId('expression')).toHaveText('12 ×');
});

test('AC, delete, sign and percent', async ({ page }) => {
  const display = page.getByTestId('display');
  await press(page, '1 2 3 ⌫');
  await expect(display).toHaveText('12');
  await press(page, '±');
  await expect(display).toHaveText('-12');
  await press(page, '%');
  await expect(display).toHaveText('-0.12');
  await press(page, 'AC');
  await expect(display).toHaveText('0');
});

test('only one decimal point allowed', async ({ page }) => {
  await press(page, '1 . . 5');
  await expect(page.getByTestId('display')).toHaveText('1.5');
});

test('supports keyboard input', async ({ page }) => {
  await page.keyboard.type('25*4');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('display')).toHaveText('100');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('display')).toHaveText('0');
});
