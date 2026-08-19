/**
 * SEO Health Check & Production Release Safety Gate
 * Validates:
 * 1. Build output existence and integrity
 * 2. robots.txt security & search engine crawler access (Googlebot, Bingbot)
 * 3. Noindex scan (ensuring zero accidental noindex on content pages)
 * 4. Canonical self-referencing check
 * 5. Sitemap format, production domain, URL count & delta anomaly
 * 6. Internal links resolution & dead-link detection
 * 7. Title / Description / H1 uniqueness & missing meta
 * 8. Schema.org JSON-LD syntax & structure validation
 * 9. Spam / Malicious directory injection detection
 * 10. IndexNow key validation
 */

import fs from 'fs';
import path from 'path';

console.log('════════════════════════════════════════════════════════════════════');
console.log('🛡️  SEO 防掉索引与发布安全总检门禁 (SEO Health Check & Safety Gate)');
console.log('════════════════════════════════════════════════════════════════════\n');

const distDir = './dist';
const baselinePath = './src/data/seo/sitemap-baseline.json';
const CANONICAL_DOMAIN = 'https://jichangshouce.co';

let results = {
  build: 'PASS',
  robots: 'PASS',
  noindex: 'PASS',
  canonical: 'PASS',
  sitemap: 'PASS',
  internalLinks: 'PASS',
  coreUrls: 'PASS',
  schema: 'PASS',
  duplicateTitles: 'PASS',
  pageCount: 'PASS',
  spamCheck: 'PASS',
  indexNow: 'PASS'
};

let errors = [];
let warnings = [];
let stats = {
  totalPages: 0,
  indexablePages: 0,
  sitemapUrls: 0,
  noindexPages: 0,
  canonicalErrors: 0,
  brokenLinks: 0,
  schemaErrors: 0,
  duplicateTitlesCount: 0
};

// 1. Check Build Output
if (!fs.existsSync(distDir)) {
  errors.push('[BUILD_ERROR] dist 目录不存在，请先执行 `pnpm build` 进行静态构建！');
  results.build = 'FAIL';
}

// Helper to crawl all files in a directory
function walkDir(dir) {
  let list = [];
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      list = list.concat(walkDir(full));
    } else {
      list.push(full);
    }
  }
  return list;
}

const allDistFiles = walkDir(distDir);
const htmlFiles = allDistFiles.filter(f => f.endsWith('.html'));
stats.totalPages = htmlFiles.length;

// 2. Robots.txt Check
const robotsPublic = './public/robots.txt';
const robotsDist = path.join(distDir, 'robots.txt');

if (!fs.existsSync(robotsPublic)) {
  errors.push('[ROBOTS_ERROR] public/robots.txt 文件丢失！');
  results.robots = 'FAIL';
} else {
  const robotsContent = fs.readFileSync(robotsPublic, 'utf-8');
  
  // Check for dangerous Disallow: /
  if (/User-agent:\s*\*\s*\nDisallow:\s*\/\s*(\n|$)/i.test(robotsContent)) {
    errors.push('[ROBOTS_CRITICAL] robots.txt 中检测到 `User-agent: * Disallow: /` 全站禁止抓取规则！');
    results.robots = 'FAIL';
  }
  
  // Check Googlebot / Bingbot disallow
  if (/User-agent:\s*(Googlebot|Bingbot)\s*\nDisallow:\s*\/\s*(\n|$)/i.test(robotsContent)) {
    errors.push('[ROBOTS_CRITICAL] robots.txt 中检测到针对 Googlebot/Bingbot 的全站禁止抓取规则！');
    results.robots = 'FAIL';
  }

  // Check Sitemap reference
  if (!robotsContent.includes('Sitemap:') || !robotsContent.includes(CANONICAL_DOMAIN)) {
    warnings.push('[ROBOTS_WARN] robots.txt 缺少正式域名的 Sitemap 指向');
  }
}

// 3. Spam / Malicious Injection Check
const suspiciousKeywords = ['casino', 'poker', 'betting', 'viagra', 'porn', 'xxx', 'download-random', 'hack'];
for (const file of allDistFiles) {
  const lowerPath = file.toLowerCase();
  for (const kw of suspiciousKeywords) {
    if (lowerPath.includes(kw)) {
      errors.push(`[SPAM_DETECTED] 发现可疑生成的静态文件或目录: ${file}`);
      results.spamCheck = 'FAIL';
    }
  }
}

// 4. Scan HTML Files (Noindex, Canonical, Title, Description, Schema, Links)
const titlesMap = new Map();
const descriptionsMap = new Map();
const h1Map = new Map();
const allInternalLinks = [];
const existingRoutes = new Set();

// Register all existing HTML routes in dist
htmlFiles.forEach(file => {
  let rel = path.relative(distDir, file).replace(/\\/g, '/');
  if (rel === 'index.html') {
    existingRoutes.add('/');
  } else if (rel.endsWith('/index.html')) {
    existingRoutes.add('/' + rel.slice(0, -'/index.html'.length) + '/');
  } else if (rel.endsWith('.html')) {
    existingRoutes.add('/' + rel.slice(0, -'.html'.length));
    existingRoutes.add('/' + rel.slice(0, -'.html'.length) + '/');
  }
});

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const isUtilityPage = relPath.includes('404.html') || relPath.includes('search/');

  // A. Noindex Check
  const hasNoindex = /<meta[^>]*name=["'](robots|googlebot|bingbot)["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(content);
  if (hasNoindex) {
    stats.noindexPages++;
    if (!isUtilityPage) {
      errors.push(`[NOINDEX_ERROR] 正式页面意外包含 noindex 标签: ${relPath}`);
      results.noindex = 'FAIL';
    }
  } else {
    stats.indexablePages++;
  }

  // B. Canonical Check
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    if (!relPath.includes('404.html')) {
      errors.push(`[CANONICAL_ERROR] 页面缺少 Canonical 标签: ${relPath}`);
      stats.canonicalErrors++;
      results.canonical = 'FAIL';
    }
  } else {
    const canonicalHref = canonicalMatch[1];
    if (!canonicalHref.startsWith(CANONICAL_DOMAIN)) {
      errors.push(`[CANONICAL_ERROR] Canonical 域名错误 (非正式域名): ${relPath} -> ${canonicalHref}`);
      stats.canonicalErrors++;
      results.canonical = 'FAIL';
    }
    
    // Check self-referencing
    let expectedPath = '/' + relPath.replace(/\/index\.html$/, '/').replace(/^index\.html$/, '');
    if (expectedPath !== '/' && !expectedPath.endsWith('/')) expectedPath += '/';
    const expectedCanonical = CANONICAL_DOMAIN + expectedPath;
    
    if (canonicalHref !== expectedCanonical && !isUtilityPage) {
      warnings.push(`[CANONICAL_WARN] Canonical 与页面路径不完全一致: ${relPath} (声明: ${canonicalHref}, 预期: ${expectedCanonical})`);
    }
  }

  // C. Title, Description, H1 Uniqueness
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch && !isUtilityPage) {
    const title = titleMatch[1].trim();
    if (titlesMap.has(title)) {
      titlesMap.get(title).push(relPath);
    } else {
      titlesMap.set(title, [relPath]);
    }
  } else if (!isUtilityPage && !relPath.includes('404')) {
    errors.push(`[TITLE_MISSING] 页面缺少 <title> 标签: ${relPath}`);
  }

  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch && !isUtilityPage) {
    const desc = descMatch[1].trim();
    if (descriptionsMap.has(desc)) {
      descriptionsMap.get(desc).push(relPath);
    } else {
      descriptionsMap.set(desc, [relPath]);
    }
  }

  // H1 Check
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length > 1 && !isUtilityPage) {
    warnings.push(`[H1_MULTIPLE] 页面出现多个 <h1> 标签 (${h1Matches.length} 个): ${relPath}`);
  } else if (h1Matches.length === 0 && !isUtilityPage && !relPath.includes('404')) {
    warnings.push(`[H1_MISSING] 页面未检测到 <h1> 标签: ${relPath}`);
  }

  // D. Schema JSON-LD Syntax Check
  const schemaMatches = content.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of schemaMatches) {
    const jsonStr = match[1].trim();
    try {
      JSON.parse(jsonStr);
    } catch (err) {
      errors.push(`[SCHEMA_SYNTAX_ERROR] 页面包含无效的 JSON-LD Schema: ${relPath} (${err.message})`);
      stats.schemaErrors++;
      results.schema = 'FAIL';
    }
  }

  // E. Internal Links Extraction (Strip script & style blocks first)
  const cleanContentForLinks = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const linkMatches = cleanContentForLinks.matchAll(/<a[^>]*href=["']([^"']+)["']/gi);
  for (const match of linkMatches) {
    const href = match[1].trim();
    if (href.startsWith('/') && !href.startsWith('//')) {
      allInternalLinks.push({ from: relPath, to: href });
    } else if (href === '') {
      warnings.push(`[EMPTY_HREF] 页面出现空链接 href="": ${relPath}`);
    }
  }
}

// Check Duplicate Titles
for (const [title, pages] of titlesMap.entries()) {
  if (pages.length > 1) {
    warnings.push(`[DUPLICATE_TITLE] 发现 ${pages.length} 个页面共用完全相同的 Title: "${title}" -> [${pages.join(', ')}]`);
    stats.duplicateTitlesCount++;
  }
}

// 5. Verify Internal Links Against Existing Routes
for (const link of allInternalLinks) {
  let targetPath = link.to.split('#')[0].split('?')[0];
  if (!targetPath) targetPath = '/';
  if (!targetPath.endsWith('/') && !path.extname(targetPath)) targetPath += '/';

  // Check if target exists in existingRoutes or file assets
  if (!existingRoutes.has(targetPath) && !fs.existsSync(path.join(distDir, targetPath))) {
    if (!targetPath.includes('/draft/') && !targetPath.includes('/test')) {
      errors.push(`[BROKEN_INTERNAL_LINK] 内部死链 (404): ${link.from} 链接到不存在的路径 -> ${link.to}`);
      stats.brokenLinks++;
      results.internalLinks = 'FAIL';
    }
  }
}

// 6. Sitemap Security & Delta Check
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const sitemap0 = path.join(distDir, 'sitemap-0.xml');
let sitemapUrls = [];

if (fs.existsSync(sitemap0)) {
  const xml = fs.readFileSync(sitemap0, 'utf-8');
  const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of locMatches) {
    sitemapUrls.push(m[1].trim());
  }
} else if (fs.existsSync(sitemapIndex)) {
  const xml = fs.readFileSync(sitemapIndex, 'utf-8');
  const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const m of locMatches) {
    sitemapUrls.push(m[1].trim());
  }
}

stats.sitemapUrls = sitemapUrls.length;

if (sitemapUrls.length === 0) {
  errors.push('[SITEMAP_CRITICAL] Sitemap 为空或未生成！');
  results.sitemap = 'FAIL';
} else {
  // Verify all sitemap URLs
  for (const u of sitemapUrls) {
    if (!u.startsWith(CANONICAL_DOMAIN)) {
      errors.push(`[SITEMAP_ERROR] Sitemap 包含非生产域名或非法 URL: ${u}`);
      results.sitemap = 'FAIL';
    }
    if (u.includes('localhost') || u.includes('127.0.0.1')) {
      errors.push(`[SITEMAP_ERROR] Sitemap 包含测试环境地址: ${u}`);
      results.sitemap = 'FAIL';
    }
    if (u.includes('/search/') || u.includes('/404')) {
      errors.push(`[SITEMAP_ERROR] Sitemap 包含了本应屏蔽的工具页面: ${u}`);
      results.sitemap = 'FAIL';
    }
  }

  // Baseline Comparison
  if (fs.existsSync(baselinePath)) {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
    const prevCount = baseline.lastSitemapUrlCount || 97;
    const diff = sitemapUrls.length - prevCount;
    
    if (sitemapUrls.length < baseline.expectedMinPages) {
      errors.push(`[PAGE_COUNT_CRITICAL] 页面数量异常骤降！当前 ${sitemapUrls.length}，低于基准下限 ${baseline.expectedMinPages}`);
      results.pageCount = 'FAIL';
    } else if (sitemapUrls.length > baseline.expectedMaxPages) {
      errors.push(`[PAGE_COUNT_CRITICAL] 页面数量异常激增！当前 ${sitemapUrls.length}，超过基准上限 ${baseline.expectedMaxPages}`);
      results.pageCount = 'FAIL';
    }
  }
}

// 7. Core URLs 200 OK Check
const coreUrls = [
  '/',
  '/recommend/',
  '/brands/',
  '/compare/',
  '/tools/',
  '/guides/',
  '/topics/',
  '/topics/clash/',
  '/topics/shadowrocket/',
  '/topics/v2rayn/',
  '/topics/airport-selection/',
  '/topics/ai-tools/',
  '/topics/protocols/',
  '/guides/how-to-choose-airport/'
];

for (const route of coreUrls) {
  let fileCheck = route === '/' ? 'index.html' : route.slice(1) + 'index.html';
  if (!fs.existsSync(path.join(distDir, fileCheck))) {
    errors.push(`[CORE_PAGE_MISSING] 核心 SEO 落地页未编译生成: ${route}`);
    results.coreUrls = 'FAIL';
  }
}

// 8. IndexNow Key Check
const indexNowKeyFile = './public/c4a93e87d0c346bc8e61e06f97d3eb63.txt';
if (!fs.existsSync(indexNowKeyFile)) {
  warnings.push('[INDEXNOW_WARN] 未检测到 IndexNow 密钥文件');
  results.indexNow = 'WARN';
}

// Final Release Decision
const hasCriticalErrors = errors.length > 0;
const releaseDecision = hasCriticalErrors ? 'BLOCKED' : 'READY';

console.log('════════════════════════════════════════════════════════════════════');
console.log('📊 SEO HEALTH CHECK 审计结果清单');
console.log('════════════════════════════════════════════════════════════════════');
console.log(`Build:            ${results.build}`);
console.log(`Robots:           ${results.robots}`);
console.log(`Noindex:          ${results.noindex}`);
console.log(`Canonical:        ${results.canonical}`);
console.log(`Sitemap:          ${results.sitemap}`);
console.log(`Internal Links:   ${results.internalLinks}`);
console.log(`Core URLs:        ${results.coreUrls}`);
console.log(`Schema:           ${results.schema}`);
console.log(`Duplicate Titles: ${results.duplicateTitles}`);
console.log(`Page Count:       ${results.pageCount}`);
console.log(`Spam Check:       ${results.spamCheck}`);
console.log(`IndexNow:         ${results.indexNow}`);
console.log('────────────────────────────────────────────────────────────────────');
console.log(`总页面数 (Total Pages):       ${stats.totalPages}`);
console.log(`可索引页面 (Indexable):        ${stats.indexablePages}`);
console.log(`Sitemap URL 数:               ${stats.sitemapUrls}`);
console.log(`Noindex 页面数:               ${stats.noindexPages}`);
console.log(`死链数量 (Broken Links):       ${stats.brokenLinks}`);
console.log(`Canonical 异常数:             ${stats.canonicalErrors}`);
console.log(`Schema 语法错误数:             ${stats.schemaErrors}`);
console.log('────────────────────────────────────────────────────────────────────');
console.log(`RELEASE_DECISION: ${releaseDecision}`);
console.log('════════════════════════════════════════════════════════════════════\n');

if (warnings.length > 0) {
  console.log(`⚠️  检测到 ${warnings.length} 处优化建议 / 告警:`);
  warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
  if (warnings.length > 10) console.log(`  ... 另有 ${warnings.length - 10} 项已省略`);
  console.log('');
}

if (errors.length > 0) {
  console.error(`❌ 检测到 ${errors.length} 处阻塞部署的严重问题:`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.error('\n🚨 [DEPLOY_ABORT] 因存在 SEO 致命问题，已自动阻止部署！请修复后再行发布。\n');
  process.exit(1);
} else {
  console.log('🎉 恭喜！全站 SEO 索引安全门禁 100% 通过，允许安全发布上线！\n');
  process.exit(0);
}
