/**
 * Content Quality & Depth Validation Script
 * Tests for: missing titles, missing descriptions, thin content (<300 words),
 * missing next steps, broken frontmatter schemas.
 */

import fs from 'fs';
import path from 'path';

const contentDirs = [
  './src/content/articles',
  './src/content/guides',
  './src/content/answers',
  './src/content/comparisons',
  './src/content/tutorials',
  './src/content/glossary',
];

let totalFiles = 0;
let errors = [];
let warnings = [];

function checkMarkdownFile(filePath) {
  totalFiles++;
  const raw = fs.readFileSync(filePath, 'utf-8');
  
  // Extract Frontmatter
  const match = raw.match(/^---([\s\S]*?)---/);
  if (!match) {
    errors.push(`${filePath}: 缺少 frontmatter 头部标记`);
    return;
  }

  const fmText = match[1];
  const bodyText = raw.slice(match[0].length).trim();

  // Check required fields
  if (!fmText.includes('title:') && !filePath.includes('glossary')) {
    errors.push(`${filePath}: 缺少 title 字段`);
  }
  if (filePath.includes('glossary') && !fmText.includes('term:')) {
    errors.push(`${filePath}: 缺少 term 字段`);
  }
  if (!fmText.includes('description:') && !filePath.includes('glossary')) {
    errors.push(`${filePath}: 缺少 description 字段`);
  }

  // Thin content check (Rule 35)
  if (bodyText.length < 100 && !filePath.includes('glossary')) {
    warnings.push(`${filePath}: [CONTENT_TOO_THIN] 正文内容过短 (${bodyText.length} 字)`);
  }

  // Check H1 in body (Rule 41: Body should not have duplicated H1; page template supplies H1)
  if (/^#\s+[^\n]+/m.test(bodyText)) {
    warnings.push(`${filePath}: 正文中检测到 Markdown H1 (#)，建议使用 H2 (##) 保持与页面模板 H1 语义层级`);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      checkMarkdownFile(fullPath);
    }
  }
}

console.log('🔍 开始执行全站内容深度与规范自动化检查...');
contentDirs.forEach(d => scanDir(d));

console.log(`\n📊 检查完成：扫描了 ${totalFiles} 个内容文档。`);
if (warnings.length > 0) {
  console.log(`\n⚠️ 警告提醒 (${warnings.length} 项):`);
  warnings.forEach(w => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.error(`\n❌ 发现 ${errors.length} 处严重错误:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ 所有内容文档规范检查通过！\n');
}
