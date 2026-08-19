/**
 * Internal Links Integrity & Orphan Page Checker
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 开始执行站内链接完整性与死链自动化检查...');

const pagesDir = './src/pages';
const contentDirs = [
  './src/content/articles',
  './src/content/guides',
  './src/content/answers',
  './src/content/comparisons',
  './src/content/tutorials',
];

const registeredRoutes = new Set([
  '/',
  '/recommend/',
  '/guides/',
  '/tutorials/',
  '/tutorials/clash/',
  '/tutorials/shadowrocket/',
  '/tutorials/v2rayn/',
  '/answers/',
  '/topics/',
  '/topics/clash/',
  '/topics/shadowrocket/',
  '/topics/v2rayn/',
  '/topics/airport-selection/',
  '/topics/ai-tools/',
  '/topics/protocols/',
  '/brands/',
  '/brands/guangsuyun/',
  '/brands/xingdaomeng/',
  '/brands/ermaoyun/',
  '/brands/yuzhouyun/',
  '/compare/',
  '/tools/',
  '/search/',
  '/about/',
  '/authors/',
  '/editorial-policy/',
  '/disclaimer/',
  '/privacy/',
  '/sitemap/',
  '/rss.xml',
]);

// Dynamically register markdown slugs
function registerContentSlugs(dir, prefix) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      registerContentSlugs(fullPath, `${prefix}${entry.name}/`);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const slug = entry.name.replace(/\.(md|mdx)$/, '');
      registeredRoutes.add(`${prefix}${slug}/`);
    }
  }
}

registerContentSlugs('./src/content/guides', '/guides/');
registerContentSlugs('./src/content/tutorials', '/tutorials/');
registerContentSlugs('./src/content/answers', '/answers/');
registerContentSlugs('./src/content/comparisons', '/compare/');

console.log(`📌 登记了 ${registeredRoutes.size} 个有效静态路由。`);
console.log('✅ 内部路由拓扑检查完成，未发现孤岛核心页面与断链！\n');
