import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByTestId('login-credentials').click();
  await page.locator('body').press('ControlOrMeta+c');
  await page.getByTestId('username').click();
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('login-password').click();
  await page.locator('body').press('ControlOrMeta+c');
  await page.getByTestId('password').click();
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();
});