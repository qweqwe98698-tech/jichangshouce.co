import { test } from '@playwright/test';

test.describe('视觉验证截图捕获', () => {
  test('捕获 1440x900 桌面端完整首页截图', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'dist/desktop-home-1440.png', fullPage: true });
  });

  test('捕获 390x844 移动端完整首页截图', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'dist/mobile-home-390.png', fullPage: true });
  });
});
