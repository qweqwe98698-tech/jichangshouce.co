import { test, expect } from '@playwright/test';

test.describe('品牌资料与对比页面测试', () => {
  test('品牌详情页展示核验状态与套餐规格', async ({ page }) => {
    await page.goto('/brands/guangsuyun/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('光速云');
    await expect(page.getByText('已完成节点实测与档案核验').first()).toBeVisible();
    await expect(page.getByText('套餐与资费详情')).toBeVisible();
    await expect(page.getByText('优势亮点')).toBeVisible();
  });

  test('横向深度对比页正常渲染维度矩阵', async ({ page }) => {
    await page.goto('/compare/iepl-vs-iplc/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('IEPL 专线 vs IPLC 专线');
    await expect(page.getByText('30 秒速览结论')).toBeVisible();
    await expect(page.getByText('核心维度全景对比')).toBeVisible();
  });

  test('品牌资料库支持 5 维筛选与实时搜索', async ({ page }) => {
    await page.goto('/brands/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('机场服务商品牌资料库');
    const searchInput = page.locator('#brand-search');
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill('光速云');
    const counter = page.locator('#result-counter');
    await expect(counter).toHaveText('1');

    // Clear search
    await searchInput.fill('');
    await expect(counter).toHaveText('16');
  });
});
