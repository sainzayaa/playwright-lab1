import { test, expect, Page } from '@playwright/test';

// Нэвтрэх үйлдлийг олон тест дахин ашиглахын тулд тусдаа функц болгов.
async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  // Placeholder-аар талбарыг олно (хэрэглэгчид харагддаг текст, тогтвортой locator)
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// Гарах үйлдэл: тест бүрийг зөв төгсгөхөд ашиглана.
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
}

test('амжилттай нэвтрэх', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  // Нэвтэрснийг URL болон хуудасны гарчгаар шалгана
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('title')).toHaveText('Products');

  // Тестийг logout-оор төгсгөж, нэвтрэх хуудас руу буцсаныг шалгана
  await logout(page);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
