/**
 * SEO & Structured Data Validation Script
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 开始执行 SEO & 结构化元数据自动化检查...');

let errors = [];

// 1. Verify site.json
const sitePath = './src/data/site/site.json';
if (!fs.existsSync(sitePath)) {
  errors.push('缺少 src/data/site/site.json 基础站点配置文件');
} else {
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf-8'));
  if (!site.name || !site.url || !site.description) {
    errors.push('site.json 缺少必要字段 (name, url, description)');
  }
}

// 2. Verify robots.txt & favicon
if (!fs.existsSync('./public/robots.txt')) errors.push('缺少 public/robots.txt');
if (!fs.existsSync('./public/favicon.svg')) errors.push('缺少 public/favicon.svg');

// 3. Verify Astro sitemap configuration in astro.config.mjs
const astroConfig = fs.readFileSync('./astro.config.mjs', 'utf-8');
if (!astroConfig.includes('@astrojs/sitemap')) {
  errors.push('astro.config.mjs 中未引入 @astrojs/sitemap 插件');
}

if (errors.length > 0) {
  console.error(`\n❌ SEO 检查发现 ${errors.length} 处问题:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ SEO 元数据、Robots.txt 及站点结构规范检查 100% 通过！\n');
}
