import { defineConfig, devices } from '@playwright/test';

// Playwright-ийн тохиргоо: зөвхөн Chromium, saucedemo сайтад чиглэсэн.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // HTML report үүсгэнэ, алдаа гарахад браузер автоматаар нээхгүй
  reporter: [['html', { open: 'never' }]],
  use: {
    // page.goto('/') гэхэд saucedemo нээгдэнэ
    baseURL: 'https://www.saucedemo.com',
    // saucedemo элементүүдэд data-test атрибут ашигладаг (getByTestId-д хэрэгтэй)
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
