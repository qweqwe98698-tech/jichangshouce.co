import { test, expect } from '@playwright/test';

test.describe('文章详情与 GEO 答案页面测试', () => {
  test('文章页 3 栏架构、目录与 AnswerBox 渲染', async ({ page }) => {
    await page.goto('/guides/how-to-choose-airport/');

    // H1 check
    await expect(page.getByRole('heading', { level: 1 })).toContainText('2026 机场选择终极指南');

    // Breadcrumb check
    await expect(page.getByLabel('Breadcrumb')).toBeVisible();

    // 30秒 AnswerBox check
    await expect(page.getByText('30 秒快速答案 (TL;DR)')).toBeVisible();

    // NextStep check
    await expect(page.getByText('🎯 下一步建议 (Next Step)')).toBeVisible();

    // FAQ check
    await expect(page.getByText('常见问题与深度解答 (FAQ)')).toBeVisible();

    // JSON-LD TechArticle schema check
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasArticleSchema = schemas.some(s => s.includes('TechArticle') || s.includes('Article'));
    expect(hasArticleSchema).toBe(true);
  });

  test('GEO 极速排错解答页正常加载', async ({ page }) => {
    await page.goto('/answers/clash-connected-no-internet/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Clash 有节点但无法上网怎么办');
    await expect(page.getByText('30 秒快速答案 (TL;DR)')).toBeVisible();
    await expect(page.getByText('典型症状：Clash 界面中所有节点测速均显示 30ms-60ms 绿色延迟')).toBeVisible();
  });
});
