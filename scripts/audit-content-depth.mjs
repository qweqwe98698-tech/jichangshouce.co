import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/content');
console.log('=== 全站内容深度与质量门禁审计报告 (D1-D6 体系) ===\n');

let failedCount = 0;
let passedCount = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const body = content.replace(/^---[\s\S]*?---/, '');
  const totalChars = content.length;
  const bodyCnChars = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  const faqCount = (content.match(/-\s+q:/g) || []).length;
  const hasMermaid = body.includes('```mermaid');
  const hasTable = body.includes('| :---') || body.includes('|:---');
  const relPath = path.relative('./src/content', f).replace(/\\/g, '/');

  let tier = 'D3';
  let minBodyCn = 500;
  let minH2 = 3;

  if (relPath.startsWith('guides/how-to-choose-airport')) {
    tier = 'D6 Pillar 旗舰';
    minBodyCn = 2000;
    minH2 = 6;
  } else if (relPath.startsWith('guides/')) {
    tier = 'D5 深度选择指南';
    minBodyCn = 1000;
    minH2 = 5;
  } else if (relPath.startsWith('tutorials/')) {
    tier = 'D4 核心教程';
    minBodyCn = 1000;
    minH2 = 5;
  } else if (relPath.startsWith('answers/')) {
    tier = 'D4 故障排障';
    minBodyCn = 600;
    minH2 = 3;
  } else if (relPath.startsWith('comparisons/')) {
    tier = 'D5 深度对比';
    minBodyCn = 450;
    minH2 = 3;
  } else if (relPath.startsWith('glossary/')) {
    tier = 'D2 百科词典';
    minBodyCn = 150;
    minH2 = 1;
  } else if (relPath.startsWith('topics/')) {
    tier = 'D1 Topic 描述';
    minBodyCn = 30;
    minH2 = 0;
  }

  const passed = bodyCnChars >= minBodyCn && h2Count >= minH2;
  if (!passed) failedCount++;
  else passedCount++;

  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${relPath}`);
  console.log(`  等级: ${tier} | 正文汉字: ${bodyCnChars} (门禁: ${minBodyCn}) | 总字符: ${totalChars} | H2: ${h2Count} (门禁: ${minH2}) | FAQ: ${faqCount} | 图表: ${hasMermaid ? 'Mermaid' : '无'} | 表格: ${hasTable ? '有' : '无'}\n`);
});

console.log(`========================================`);
console.log(`审计结果: 全部 ${files.length} 篇 | 合格 ${passedCount} 篇 | 待优化 ${failedCount} 篇`);
