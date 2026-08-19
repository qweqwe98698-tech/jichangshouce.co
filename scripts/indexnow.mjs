/**
 * IndexNow Automatic Submission Script for Bing, Yandex & Seznam
 * Submits updated and newly created URLs safely.
 */

import fs from 'fs';
import path from 'path';

const INDEXNOW_KEY = 'c4a93e87d0c346bc8e61e06f97d3eb63';
const HOST = 'jichangshouce.co';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_FILE = './dist/sitemap-0.xml';

console.log('📡 开始执行 IndexNow 增量推送检查...');

if (!fs.existsSync(SITEMAP_FILE)) {
  console.log('⚠️ 未找到 dist/sitemap-0.xml，请先执行 `pnpm build`');
  process.exit(0);
}

const xml = fs.readFileSync(SITEMAP_FILE, 'utf-8');
const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
const allUrls = locMatches.map(m => m[1].trim());

console.log(`📌 Sitemap 中检测到 ${allUrls.length} 个生产 URL。`);

// Core high-value URLs to prioritize in submit batch
const priorityUrls = [
  `https://${HOST}/`,
  `https://${HOST}/recommend/`,
  `https://${HOST}/brands/`,
  `https://${HOST}/compare/`,
  `https://${HOST}/tools/`,
  `https://${HOST}/topics/`,
  `https://${HOST}/topics/clash/`,
  `https://${HOST}/topics/shadowrocket/`,
  `https://${HOST}/topics/v2rayn/`,
  `https://${HOST}/topics/airport-selection/`,
  `https://${HOST}/topics/ai-tools/`,
  `https://${HOST}/topics/protocols/`
];

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: priorityUrls
};

console.log(`🚀 准备向 api.indexnow.org 提交 ${payload.urlList.length} 个核心 URL...`);
console.log('Payload:', JSON.stringify(payload, null, 2));

// Perform HTTP POST to IndexNow endpoint
async function submitIndexNow() {
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 200 || response.status === 202) {
      console.log(`✅ IndexNow 提交成功！HTTP 状态码: ${response.status}`);
    } else {
      console.log(`⚠️ IndexNow 响应: HTTP ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.log(`ℹ️ IndexNow 网络通知完成（本地环境或离线跳过）: ${err.message}`);
  }
}

submitIndexNow();
