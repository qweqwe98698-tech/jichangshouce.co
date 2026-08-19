import { test, expect } from '@playwright/test';

test.describe('全站搜索中心测试', () => {
  test('即时关键词检索与分类过滤', async ({ page }) => {
    await page.goto('/search/');

    const input = page.locator('#search-input');
    await expect(input).toBeVisible();

    // Type query
    await input.fill('Clash');

    // Check results
    const results = page.locator('#search-results-list');
    await expect(results).toContainText('Clash');

    // Click Category Filter
    const filterCat = page.locator('#search-filter-categories button[data-cat="客户端教程"]');
    await filterCat.click();
    await expect(results).toContainText('客户端教程');
  });
});
