/**
 * Auto-publish In-depth SEO/GEO Pillar Articles using DeepSeek-V3 API
 * 
 * Features:
 * 1. URL 防批量 AI 识别优化系统 (Anti-Pattern Semantic Slug Optimization System)
 * 2. 深度主线方向矩阵选题池 (16+ Curated Enterprise Topics + Dynamic AI Synthesizer)
 * 3. 万字级双阶段深度技术扩写管道 (Outline -> Multi-Section Deep Expansion -> Assembly)
 * 4. 内链网状织网器 (Internal Topical Graph Mesh Weaver)
 * 5. 全站构建、SEO 安全门禁与 IndexNow 即时推送
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const GUIDES_DIR = './src/content/guides';
const ARTICLES_DIR = './src/content/articles';
const BASELINE_PATH = './src/data/seo/sitemap-baseline.json';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('❌ 缺少环境变量 DEEPSEEK_API_KEY！请在 GitHub Secrets 或运行环境中配置。');
  process.exit(1);
}

// ============================================================================
// 1. 防批量 AI 识别的 URL 优化与校验系统 (Anti-Pattern Semantic Slug Engine)
// ============================================================================

/**
 * 校验并规范化 Slug，杜绝批量生成与 AI 模板特征
 * - 拒绝流水号、序列号（如 part-1, post-05, article-1）
 * - 拒绝日期戳（如 2026-10-02）
 * - 拒绝过度堆砌的 SEO 营销词（如 best-, top-, cheapest-）
 * - 词长保持在 3~6 个有效英文语义词
 * - 严格规范字符集：仅限小写字母与单个短横线
 */
function normalizeAndValidateSlug(rawSlug, existingSlugs) {
  let slug = rawSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊符号
    .replace(/[\s_]+/g, '-')       // 空格与下划线转连字符
    .replace(/-+/g, '-')           // 折叠重复连字符
    .replace(/^-|-$/g, '');        // 移除首尾连字符

  // 过滤 AI 机械特征前缀/后缀
  slug = slug
    .replace(/^(best|top|cheap|ultimate|complete)-/g, '')
    .replace(/-(2025|2026|2027|guide|article|part-\d+)$/g, '');

  const words = slug.split('-').filter(w => w.length > 0);
  if (words.length < 3) {
    slug = `${slug}-architecture-handbook`;
  } else if (words.length > 6) {
    slug = words.slice(0, 6).join('-');
  }

  // 查重与语义化后缀回退
  let finalSlug = slug;
  let attempt = 1;
  const semanticFallbacks = ['architecture', 'blueprint', 'handbook', 'playbook', 'deep-dive', 'tuning-guide'];
  while (existingSlugs.has(finalSlug)) {
    const fallback = semanticFallbacks[(attempt - 1) % semanticFallbacks.length];
    finalSlug = `${slug}-${fallback}`;
    attempt++;
  }

  return finalSlug;
}

// 获取全站已存在的所有 Slug，建立全局查重集合
function getAllExistingSlugs() {
  const slugs = new Set();
  const scanDirs = [GUIDES_DIR, ARTICLES_DIR];
  for (const dir of scanDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          slugs.add(file.replace(/\.(md|mdx)$/, ''));
        }
      }
    }
  }
  return slugs;
}

// ============================================================================
// 2. 主线方向矩阵选题池 (Topic Matrix & Dynamic Synthesizer)
// ============================================================================

const TOPIC_MATRIX = [
  {
    slug: 'enterprise-remote-office-cross-border-network-solution',
    pillar: 'airport-selection',
    category: '企业出海',
    keyword: '跨国企业外贸远程办公专线组网方案',
    coreSubject: '跨国企业与外贸团队远程办公网络架构：IEPL专线组网、Zoom与Teams全天候零丢包及多分支故障容灾实战',
    targetIntent: 'commercial',
    difficulty: 'intermediate',
    focusModules: [
      '跨国远程办公网络核心痛点：公网晚高峰严重抖动、UDP丢包致会议音画脱节、海外SaaS频繁风控弹窗',
      '物理网络层拓扑剖析：传统商业VPN全局隧道 vs BGP多线+IEPL专线混合智能分流对比',
      '主流外贸协作工具（Zoom、Google Workspace、Slack、Teams）的分流策略与DNS防污染机制',
      '企业级双轨高可用容灾拓扑设计：主IEPL专线 + 备用商业专线自动探测与无缝切换',
      '硬件网关与多客户端集中管控部署：软路由Clash/Sing-box网关透明代理实战'
    ]
  },
  {
    slug: 'ai-tools-network-optimization-and-clean-ip-guide',
    pillar: 'protocols',
    category: '进阶指南',
    keyword: 'AI大模型网络优化与纯净住宅IP选型',
    coreSubject: 'ChatGPT 4o 与 Claude 3.5 全天候高频访问实战：纯净住宅双ISP链路架构、Cloudflare 1020拦截消解与风控对抗全书',
    targetIntent: 'informational',
    difficulty: 'advanced',
    focusModules: [
      '主流AI大模型（OpenAI、Anthropic、Midjourney）风控识别机制：ASN分类、欺诈分阈值、TLS指纹分析',
      '出口IP类型全景对比：数据中心Hosting IP vs 广播Anycast IP vs 纯净原生住宅双ISP',
      '避免触发Access Denied与验证码轰炸的客户端路由分流黑白名单工程配置',
      '低延迟专线与原生住宅IP的黄金组合：内网IEPL快速过境 + 落地端优质ISP二次转发',
      '全平台客户端（Clash Verge Rev、Shadowrocket、Sing-box）针对AI域名的精细化规则模板'
    ]
  },
  {
    slug: 'cross-border-ecommerce-store-network-isolation-strategy',
    pillar: 'airport-selection',
    category: '企业出海',
    keyword: '跨境电商多店铺运营网络环境隔离',
    coreSubject: '跨境电商独立站与多店铺防关联网络架构：静态纯净住宅IP配置、指纹浏览器协同与专线低延迟保障指南',
    targetIntent: 'commercial',
    difficulty: 'advanced',
    focusModules: [
      '跨境电商平台（Amazon、TikTok Shop、Shopee、eBay）多账号风控防关联核心指标解析',
      '传统VPS代理、指纹浏览器内建代理与自建专线节点的优劣势深度横向对比',
      '基于静态住宅原生IP的多店铺环境隔离实操：IP绑定、DNS防泄露与WebRTC物理地址伪装',
      '跨境直播（TikTok Live）推流带宽选型标准：独享上行下行速率、晚高峰抖动控制与码率保障',
      '多员工协同权限控制与出口节点异常实时报警机制'
    ]
  },
  {
    slug: 'cross-region-streaming-4k-unlock-and-cdn-routing-guide',
    pillar: 'protocols',
    category: '进阶指南',
    keyword: '流媒体跨区4K高清解锁与CDN路由调度',
    coreSubject: '4K/8K 跨区流媒体终极解锁与播放优化：Netflix、Disney+、YouTube Premium底层路由调度与CDN直连原理解析',
    targetIntent: 'informational',
    difficulty: 'intermediate',
    focusModules: [
      '流媒体平台区域版权过滤逻辑：IP纯净度校验、非自制剧封锁原理与DNS重定向拦截',
      'BGP路由与流媒体CDN边缘缓存节点的对接机理（香港HKIX、日本JPIX与新加坡SGIX）',
      '智能DNS分流与SNI Proxy反向代理在流媒体解锁中的实际工程实现',
      '晚高峰大码率（40Mbps+）4K HDR/杜比视界零缓冲的带宽调优与拥塞控制参数',
      '客户端常见流媒体分流规则集（ACL4SSR vs Loyalsoldier）深度调优与分流测试'
    ]
  },
  {
    slug: 'overseas-gaming-ultra-low-latency-and-jitter-tuning-guide',
    pillar: 'protocols',
    category: '排障实战',
    keyword: '外服游戏超低延迟与网络抖动优化',
    coreSubject: '外服电竞联机与网络加速工程指南：物理测地线直连、微秒级抖动压制与UDP全端口转发调优实战',
    targetIntent: 'troubleshooting',
    difficulty: 'advanced',
    focusModules: [
      '竞技类网游（Apex、Valorant、CS2、LoL韩服/日服）网络指标关键要求：RTT延迟、Jitter抖动与晚高峰丢包',
      '海底光缆物理测地线分析：广深港直连、沪日中日海底光缆与跨太平洋TPE海缆延迟极限',
      '传统商业游戏加速器 vs 机场IPLC纯物理裸光纤专线的底层传输机制差异',
      '客户端开启TUN虚拟网卡、UDP Full-Cone NAT与强制TCP/UDP代理的配置要点',
      '复杂网络环境下游戏报文排查诊断方法论（MTR测试、Wireshark抓包与PingPlotter分析）'
    ]
  },
  {
    slug: 'global-financial-trading-low-latency-line-architecture',
    pillar: 'airport-selection',
    category: '进阶指南',
    keyword: '跨国金融量化行情低延迟专线架构',
    coreSubject: '全球金融交易与高频量化行情网络方案：极低延迟专线直连、SLA 99.99%可用率与多路由冗余架构',
    targetIntent: 'commercial',
    difficulty: 'advanced',
    focusModules: [
      '金融交易行情（Bloomberg、币安、盈透证券、TradingView）对毫秒级连接稳定性的严苛要求',
      '专线物理冗余架构设计：沪日IPLC + 深港IEPL + 跨境BGP混合热备切换方案',
      '长连接（WebSocket / FIX协议）防中断优化：Keep-Alive心跳保活与TCP超时参数调优',
      '网络运营商SLA服务等级协议深度拆解：MTTR故障恢复时间与可用率核验标准',
      '本地交易终端硬件加速配置与专用分流规则隔离'
    ]
  },
  {
    slug: 'singbox-srs-binary-ruleset-and-routing-performance-optimization',
    pillar: 'protocols',
    category: '排障实战',
    keyword: 'Sing-box规则集编译与高性能路由实战',
    coreSubject: 'Sing-box 新一代通用核心深度实战：SRS二进制规则集编译、内存零拷贝与多出站分流架构设计',
    targetIntent: 'informational',
    difficulty: 'advanced',
    focusModules: [
      'Sing-box 核心设计哲学：与传统Clash生态的架构异同与性能优势',
      'SRS（Sing-box Rule Set）二进制规则集的编译、结构优势与瞬间内存加载原理',
      '多入站与多出站策略路由工程：Direct直连、Reject拦截、Proxy代理与DNS独立解析分流',
      '全平台配置模板（Windows、macOS、iOS、Android及Linux软路由）工业级规范结构',
      '常见配置报错分析与高效排错排查工作流'
    ]
  },
  {
    slug: 'airport-bgp-multi-ingress-and-transit-peering-deep-dive',
    pillar: 'airport-selection',
    category: '选择指南',
    keyword: '机场多线BGP入口与过境带宽物理架构',
    coreSubject: '现代机场底层基础设施全景剖析：国内多线BGP入口拓扑、跨境海底光缆对等互联与成本定价模型',
    targetIntent: 'informational',
    difficulty: 'intermediate',
    focusModules: [
      '国内接入层架构：单线机房 vs 双线机房 vs 真正三网BGP动态路由机房的物理造价与体验差异',
      '过境光缆传输链路：公网直连（CN2 GIA/AS9929/CMI） vs 物理专线（IEPL/IPLC）的真实带宽成本拆解',
      '境外落地机房与IXP互联网交换中心（HKIX、Equinix、Any2）对等互联（Peering）机理',
      '从成本模型看虚假宣传：为什么单月几元的百G“大流量纯专线”在物理上无法持续运营',
      '理性选型与风险隔离指南：双轨制组合策略与阶梯式付费原则'
    ]
  },
  {
    slug: 'vless-reality-handshake-and-tls-fingerprint-anatomy',
    pillar: 'protocols',
    category: '协议原理',
    keyword: 'VLESS Reality协议原理与TLS指纹对抗',
    coreSubject: 'VLESS-Reality 传输协议底层解构：无证书偷渡机制、TLS ClientHello 指纹模拟与中间人重放防御原理',
    targetIntent: 'informational',
    difficulty: 'advanced',
    focusModules: [
      '传统TLS代理（Trojan/VLESS-TLS）证书暴露风险与Active Probing主动探测机理',
      'Reality 核心机制深度拆解：Public Key椭圆曲线密钥交换、ShortId验证与Dest目标偷渡站点伪装',
      'uTLS 指纹伪装原理（模拟 Chrome、Firefox、iOS Safari）与消除特征码实战',
      '服务端配置参数安全性审查与目标域名伪装选型标准（挑选合规 SNI 真实站点技巧）',
      '客户端连接状态抓包分析与握手失败调试排查指引'
    ]
  },
  {
    slug: 'dns-leak-prevention-and-doh-dot-secure-routing',
    pillar: 'protocols',
    category: '排障实战',
    keyword: '跨国网络DNS泄露防范与加密分流',
    coreSubject: '防止网络追踪与精准分流：DNS泄露成因深度剖析、DoH/DoT加密递归解析与客户端防污染工程方案',
    targetIntent: 'troubleshooting',
    difficulty: 'intermediate',
    focusModules: [
      'DNS泄露的物理成因：操作系统双网卡抢答、IPv6协议栈默认路由回落与ISP透明代理劫持',
      'DNS over HTTPS (DoH) 与 DNS over TLS (DoT) 的传输开销、延迟影响与加密解析对比',
      'Clash Verge Rev 与 Sing-box 中的 fake-ip 模式 vs redir-host 模式优缺点横向评测',
      '国内外域名智能双栈分流配置方案：内网阿里/腾讯DNS直连 + 境外Cloudflare/Google DoH分流',
      '在线检测工具（dnsleaktest / browserleaks）实测验证与自查排错流程'
    ]
  },
  {
    slug: 'openwrt-istoreos-transparent-gateway-network-topology',
    pillar: 'protocols',
    category: '软路由实战',
    keyword: 'OpenWrt软路由透明网关与旁路由拓扑',
    coreSummary: '家庭与小型工作室全设备科学组网：OpenWrt / iStoreOS 旁路由透明代理拓扑、DNS防环回与ARP分流实战',
    targetIntent: 'informational',
    difficulty: 'advanced',
    focusModules: [
      '主路由 + 旁路由组网拓扑结构与报文转发路径全解析（单臂路由 vs 双网口硬件直通）',
      '旁路由网络故障第一大杀手：DNS循环解析（DNS Loop）成因与彻底根治方案',
      '客户端免修改网关的 DHCP Option 3 / Option 6 自动化分发下发实操',
      '区分设备智能分流：电视盒子/游戏主机/工作电脑/普通移动设备差异化策略组绑定',
      '常见性能瓶颈压测：CPU软中断消耗、NAT转发速率与硬件加速（Flow Offloading）开启条件'
    ]
  },
  {
    slug: 'quic-http3-congestion-control-and-bbrv3-tuning',
    pillar: 'protocols',
    category: '进阶指南',
    keyword: 'QUIC与BBRv3拥塞控制弱网传输优化',
    coreSubject: '跨洋高延迟弱网传输突破：QUIC/HTTP3协议架构、BBRv3拥塞控制算法及UDP QoS限速应对实战',
    targetIntent: 'informational',
    difficulty: 'advanced',
    focusModules: [
      'TCP传统拥塞控制（Cubic）在高延迟跨洋光纤下的吞吐量塌陷数学原理',
      'QUIC (UDP) 的核心技术优势：0-RTT连接建立、连接迁移与彻底消除队头阻塞（HOL Blocking）',
      '运营商晚高峰对UDP协议的恶性QoS限速表现形式与精准识别测试方法',
      'BBRv3 (Bottleneck Bandwidth and RTT) 算法在国际中继服务器上的编译与参数调优',
      'Hysteria 2 与 TUIC 协议的适用场景与防封限速实战经验'
    ]
  }
];

// 动态 AI 选题生成器（当预置选题全部写完时，自主挖掘高意图前沿长尾网络主题）
async function synthesizeDynamicTopic(existingSlugs) {
  console.log('💡 正在调用 DeepSeek-V3 动态挖掘全新前沿技术选题与自然语义 Slug...');
  
  const existingList = Array.from(existingSlugs).slice(-15).join(', ');
  const prompt = `
你是一名跨国网络架构师与技术专栏总编。
网站《机场手册》已有以下文章 Slug: [${existingList}]。
请为网站挖掘一个全新的、高搜索意图、尚未被写过的“跨国网络/网络协议/专线组网/流媒体或AI网络优化/排障工程”万字级主题。

【URL 防批量 AI 识别关键要求】：
1. slug 必须是 3-5 个有意义的英文单词连字符组合（如 submarine-cable-latency-routing-guide）。
2. 绝对不能使用带有机械编号、日期或套话（如 no-1, post-2, 2026, best-vpn）。
3. 必须符合真实网络工程师搜索习惯。

请以严格的 JSON 格式输出：
{
  "slug": "语义化长尾英文slug",
  "pillar": "airport-selection 或 protocols",
  "category": "进阶指南 或 排障实战 或 企业出海",
  "keyword": "核心中文关键词",
  "coreSubject": "深度文章全名与主题阐述",
  "targetIntent": "informational 或 commercial 或 troubleshooting",
  "difficulty": "intermediate 或 advanced",
  "focusModules": [
    "模块1核心技术细节",
    "模块2核心技术细节",
    "模块3核心技术细节",
    "模块4核心技术细节",
    "模块5核心技术细节"
  ]
}
`;

  const rawJson = await callDeepSeek([
    { role: 'system', content: 'You are a senior tech editor. Output raw JSON only.' },
    { role: 'user', content: prompt }
  ], 0.7);

  let clean = rawJson.trim();
  if (clean.startsWith('```json')) clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (clean.startsWith('```')) clean = clean.replace(/^```/, '').replace(/```$/, '').trim();

  const generated = JSON.parse(clean);
  generated.slug = normalizeAndValidateSlug(generated.slug, existingSlugs);
  return generated;
}

// 选择下一个最优候选选题
async function selectNextTopic() {
  const existingSlugs = getAllExistingSlugs();
  console.log(`📚 当前知识库中已检索到 ${existingSlugs.size} 篇现有文章。`);

  // 1. 优先扫描预置矩阵中尚未发布的条目
  for (const topic of TOPIC_MATRIX) {
    const cleanSlug = normalizeAndValidateSlug(topic.slug, new Set());
    if (!existingSlugs.has(cleanSlug)) {
      console.log(`🎯 命中预置选题矩阵: [${cleanSlug}] - ${topic.coreSubject}`);
      return {
        ...topic,
        slug: cleanSlug
      };
    }
  }

  // 2. 若全部预置矩阵均已发布，触发动态 AI 选题自愈引擎
  console.log(`✨ 预置选题池均已成功发布！正在启动 AI 动态长尾选题引擎...`);
  return await synthesizeDynamicTopic(existingSlugs);
}

// ============================================================================
// 3. 内链网状织网器 (Internal Topical Graph Mesh Weaver)
// ============================================================================

function getRelevantInternalLinks(count = 5) {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.md'));
  const links = [];

  for (const file of files) {
    const fullPath = path.join(GUIDES_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const slug = file.replace(/\.md$/, '');
    if (titleMatch) {
      links.push({
        title: titleMatch[1],
        slug,
        url: `/guides/${slug}/`
      });
    }
  }

  // 随机洗牌选取 3-5 篇，避免总是链接前几篇
  links.sort(() => 0.5 - Math.random());
  return links.slice(0, count);
}

// ============================================================================
// 4. 调用 DeepSeek API
// ============================================================================

async function callDeepSeek(messages, temperature = 0.5) {
  const url = 'https://api.deepseek.com/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API 请求失败 [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================================================
// 5. 万字级深度生成流水线 (Outline -> Deep Expansion -> Assembly)
// ============================================================================

async function generateArticle(topic) {
  console.log(`\n🤖 [Stage 1] 正在通过 DeepSeek-V3 规划万字级技术架构、Frontmatter 与 6~7 个核心章节...`);

  const todayStr = new Date().toISOString().split('T')[0];
  const internalLinks = getRelevantInternalLinks(5);
  const internalLinksContext = internalLinks.map(l => `- [${l.title}](${l.url}) (slug: "${l.slug}")`).join('\n');

  const stage1Prompt = `
你是一名资深网络工程师与中文技术专栏主笔（供职于专业网络工具与知识库平台《机场手册》）。
请为以下主题设计一篇结构详尽、技术硬核的万字级深度专栏文章的元数据与大纲：

主题：${topic.coreSubject}
Slug：${topic.slug}
所属主线：${topic.pillar}
核心关键词：${topic.keyword}
重点模块：
${topic.focusModules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

可供引用的站内已有文章：
${internalLinksContext}

【强制写作规范 - 彻底消除 AI 痕迹与套话】：
1. 严禁使用“在当今数字化浪潮下”、“毫无疑问”、“综上所述”、“总而言之”等一切空洞废话。
2. 语言必须具备技术一线的真实语感，多用具体参数（ms延迟、丢包率%、MTU、TLS版本、协议名）、实际命令行命令、网络拓扑术语。
3. 规划 6 到 7 个深度章节（sections），每个章节都具有明确的技术导向。
4. 提供 6 个针对真实网络运维与使用场景的高质量硬核 FAQ。
5. 提供面向 AI 搜索（GEO / Perplexity / Copilot）的 80-150 字精炼直接答案（answer 字段）。

请以 JSON 格式输出以下字段（不要包含 markdown 代码块包裹，直接输出纯 JSON 字符串）：
{
  "title": "具体且具吸引力的技术标题（包含关键词，不用书名号）",
  "description": "80-140字的高信息密度Meta描述",
  "category": "${topic.category}",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5", "标签6"],
  "author": "机场手册技术委员会",
  "pillar": "${topic.pillar}",
  "intent": "${topic.targetIntent}",
  "difficulty": "${topic.difficulty}",
  "relatedSlugs": ${JSON.stringify(internalLinks.slice(0, 3).map(l => l.slug))},
  "answer": "80-150字的核心结论提炼直答",
  "faq": [
    { "q": "硬核技术问题1", "a": "专业且详尽的回答" }
  ],
  "nextStep": {
    "title": "使用 30 秒智能选型决策器",
    "description": "根据你的预算、常用设备与核心需求，快速匹配经过客观核验的服务商",
    "link": "/recommend/#selector",
    "linkText": "启动智能选型 →"
  },
  "sections": [
    {
      "heading": "一级章节标题（以 ## 开头）",
      "guidance": "本章节的技术写作重点和包含的具体参数/拓扑/配置细节"
    }
  ]
}
`;

  const metaRaw = await callDeepSeek([
    { role: 'system', content: 'You are an enterprise network architect. Output JSON only.' },
    { role: 'user', content: stage1Prompt }
  ], 0.3);

  let cleanJsonStr = metaRaw.trim();
  if (cleanJsonStr.startsWith('```json')) cleanJsonStr = cleanJsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (cleanJsonStr.startsWith('```')) cleanJsonStr = cleanJsonStr.replace(/^```/, '').replace(/```$/, '').trim();

  let articleMeta;
  try {
    articleMeta = JSON.parse(cleanJsonStr);
  } catch (err) {
    console.error('JSON 解析失败，原始输出:', cleanJsonStr);
    throw err;
  }

  console.log(`✅ [Stage 1 完成] 标题: ${articleMeta.title}`);
  console.log(`📌 规划了 ${articleMeta.sections.length} 个核心技术章节。`);

  // 阶段 2：逐章节深度扩写，确保字数充沛（每章 1400 ~ 1800 字）
  console.log(`\n✍️ [Stage 2] 正在深度扩写各技术章节内容（注入 Mermaid 图表、对比表、实操配置与内链）...`);

  const sectionContents = [];

  for (let i = 0; i < articleMeta.sections.length; i++) {
    const sec = articleMeta.sections[i];
    console.log(`  ➔ 正在撰写第 ${i + 1}/${articleMeta.sections.length} 章: ${sec.heading}...`);

    const stage2Prompt = `
请作为一线资深网络架构师，深度撰写《${articleMeta.title}》的第 ${i + 1} 章节：
章节标题：${sec.heading}
写作要点：${sec.guidance}

【内容技术与质量要求】：
1. 深入浅出展开技术细节，单章撰写字数保持在 1400 ~ 1800 汉字。
2. ${i === 0 || i === 1 ? '必须包含一个标准 Mermaid 流程图或架构图（使用 ```mermaid 标记，语法为 graph TD 或 flowchart LR，节点文字勿用特殊符号）。' : ''}
3. ${i === 1 || i === 2 ? '必须包含一个详尽的多方案或多参数 Markdown 对比表格（不少于 4 列 5 行）。' : ''}
4. ${i >= 2 && i <= 4 ? '必须包含真实的配置文件片段（如 Clash YAML 或 Sing-box JSON 格式）或诊断排错终端命令（如 traceroute/mtr/ping/curl/openssl）。' : ''}
5. ${i === 2 || i === 4 ? `请在上下文自然逻辑中，合理引用并超链接以下已有站内文章之一（使用标准 Markdown 超链接语法）：\n${internalLinksContext}` : ''}
6. 严禁空洞废话与任何形式的 AI 总结腔，直面真实生产环境下的技术问题与解决路径。
7. 直接输出该章节的正文 Markdown 内容，不要重复输出文章总标题。
`;

    const secText = await callDeepSeek([
      { role: 'system', content: 'You are an expert network engineer writing a high-density, authoritative technical handbook chapter in natural, professional Chinese without any AI cliches.' },
      { role: 'user', content: stage2Prompt }
    ], 0.5);

    sectionContents.push(secText.trim());
  }

  // 阶段 3：组装完整的 Frontmatter 与 Markdown
  console.log(`\n📦 [Stage 3] 正在组装完整 Markdown 文件与技术门禁校验...`);

  const frontmatterYaml = `---
title: "${articleMeta.title.replace(/"/g, '\\"')}"
description: "${articleMeta.description.replace(/"/g, '\\"')}"
pubDate: ${todayStr}
updatedDate: ${todayStr}
category: "${articleMeta.category}"
tags: ${JSON.stringify(articleMeta.tags)}
author: "${articleMeta.author}"
pillar: "${articleMeta.pillar}"
intent: "${articleMeta.intent}"
difficulty: "${articleMeta.difficulty}"
relatedSlugs: ${JSON.stringify(articleMeta.relatedSlugs || [])}
answer: "${articleMeta.answer.replace(/"/g, '\\"')}"
nextStep:
  title: "${articleMeta.nextStep.title}"
  description: "${articleMeta.nextStep.description}"
  link: "${articleMeta.nextStep.link}"
  linkText: "${articleMeta.nextStep.linkText}"
faq:
${articleMeta.faq.map(f => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`).join('\n')}
---

${sectionContents.join('\n\n')}
`;

  const targetFile = path.join(GUIDES_DIR, `${topic.slug}.md`);
  fs.writeFileSync(targetFile, frontmatterYaml, 'utf-8');

  // 汉字字数统计
  const chineseCount = (frontmatterYaml.match(/[\u4e00-\u9fa5]/g) || []).length;
  console.log(`🎉 文章文件成功写入: ${targetFile}`);
  console.log(`📊 总字符数: ${frontmatterYaml.length}，正文核心汉字量: ${chineseCount} 字。`);

  return { targetFile, slug: topic.slug, title: articleMeta.title, chineseCount };
}

// ============================================================================
// 6. 主执行入口
// ============================================================================

async function main() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('🚀 机场手册 SEO / GEO 深度主线矩阵文章全自动自发布流水线');
  console.log('════════════════════════════════════════════════════════════════════\n');

  try {
    const topic = await selectNextTopic();
    const result = await generateArticle(topic);

    console.log('\n🔍 开始执行全站构建与 SEO 发布安全门禁复查...');
    execSync('pnpm run build', { stdio: 'inherit' });
    execSync('node scripts/seo-health-check.mjs', { stdio: 'inherit' });

    // 同步更新 baseline 中的 sitemap 数量
    if (fs.existsSync(BASELINE_PATH)) {
      try {
        const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
        baseline.lastSitemapUrlCount = (baseline.lastSitemapUrlCount || 105) + 1;
        baseline.lastUpdated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2), 'utf-8');
        console.log(`📈 已同步更新 SEO 基准计数: ${baseline.lastSitemapUrlCount}`);
      } catch (err) {
        console.warn('⚠️ 基准数据更新跳过:', err.message);
      }
    }

    console.log('\n📡 触发 IndexNow 全量生产推送...');
    execSync('node scripts/indexnow.mjs', { stdio: 'inherit' });

    // 如果处于 GitHub Actions 环境，将 slug 和 title 输出给步骤输出
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${result.slug}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `title=${result.title}\n`);
    }

    console.log('\n====================================================================');
    console.log(`✅ 自动发布流水线全部成功！文章 slug: [${result.slug}]`);
    console.log(`📝 文章标题: ${result.title} (${result.chineseCount} 汉字)`);
    console.log('====================================================================\n');
  } catch (error) {
    console.error('❌ 自动化发布流程遭遇错误:', error);
    process.exit(1);
  }
}

main();
