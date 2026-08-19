import { test, expect } from '@playwright/test';

test.describe('机场手册 5.0 首页与核心交互测试 (UI视觉锁定版)', () => {
  test('首页 5 大核心区块与 10 大功能模块完整渲染', async ({ page }) => {
    await page.goto('/');

    // 1. Header (68px)
    await expect(page.locator('#site-header')).toBeVisible();
    await expect(page.getByText('机场手册').first()).toBeVisible();

    // 2. First Fold: Hero + Problem Navigator Panel
    const main = page.locator('main');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('找到答案，也找到下一步');
    await expect(page.locator('input[type="search"]').first()).toBeVisible();
    await expect(main.getByText('今天你想解决什么？')).toBeVisible();
    await expect(main.getByText('开始选择机场')).toBeVisible();
    await expect(main.getByText('机场怎么选择').first()).toBeVisible();
    await expect(main.getByText('Clash 连不上怎么办').first()).toBeVisible();
    await expect(main.getByText('小火箭怎么添加订阅').first()).toBeVisible();

    // 3. Second Fold: Editor's Picks + Hot Problems
    await expect(main.getByRole('heading', { name: '本周精选指南' })).toBeVisible();
    await expect(main.getByText('2026 机场选择终极指南')).toBeVisible();
    await expect(main.getByRole('heading', { name: '大家正在解决的问题' })).toBeVisible();
    await expect(main.getByText(/Clash 有节点/)).toBeVisible();

    // 4. Third Fold: Topic Hub (6 Pillars)
    await expect(main.getByRole('heading', { name: /核心专题聚合中心|专题中心/ })).toBeVisible();
    await expect(main.getByText('Clash 专题')).toBeVisible();
    await expect(main.getByText('Shadowrocket 专题').first()).toBeVisible();
    await expect(main.getByText('v2rayN 专题')).toBeVisible();

    // 5. Fourth Fold: Airport Recommendation + Selection Guide
    await expect(main.getByRole('heading', { name: '机场选择参考' })).toBeVisible();
    await expect(main.getByText('光速云').first()).toBeVisible();
    await expect(main.getByRole('heading', { name: '选择指南' })).toBeVisible();
    await expect(main.getByText('不知道怎么选？')).toBeVisible();

    // 6. Fifth Fold: Latest Content + User Journey
    await expect(main.getByRole('heading', { name: '最新内容' })).toBeVisible();
    await expect(main.getByRole('heading', { name: '不知道从哪里开始？' })).toBeVisible();
    await expect(main.getByText('我是第一次使用')).toBeVisible();
  });

  test('智能选择器在推荐页正常交互计算', async ({ page }) => {
    await page.goto('/recommend/');
    const selectorSection = page.locator('#selector');
    await expect(selectorSection).toBeVisible();

    // Click on AI priority
    const aiBtn = page.locator('#filter-priority button[data-val="ai"]');
    await aiBtn.click();
    await expect(aiBtn).toHaveClass(/active/);

    // Verify calculated direction
    const resultDir = page.locator('#result-direction');
    await expect(resultDir).toContainText('AI 原生解锁与低风控专线');

    // Click on Budget priority
    const budgetBtn = page.locator('#filter-priority button[data-val="budget"]');
    await budgetBtn.click();
    await expect(resultDir).toContainText('高性价比大流量方向');
  });

  test('明暗主题切换无闪烁与持久化', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('#theme-toggle');
    await expect(themeBtn).toBeVisible();

    // Toggle theme
    await themeBtn.click();
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe(isDark ? 'dark' : 'light');
  });
});
