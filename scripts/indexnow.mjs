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
  urlList: allUrls
};

console.log(`🚀 准备向 IndexNow API 提交全部 ${payload.urlList.length} 个最新生产 URL...`);

// Perform HTTP POST to IndexNow endpoints (api.indexnow.org and www.bing.com)
async function submitIndexNow() {
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 正在推送至: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 200 || response.status === 202) {
        console.log(`✅ [${endpoint}] 提交成功！HTTP 状态码: ${response.status}`);
      } else {
        console.log(`⚠️ [${endpoint}] 响应状态: HTTP ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`⚠️ [${endpoint}] 异常: ${err.message}`);
    }
  }
}

submitIndexNow();
