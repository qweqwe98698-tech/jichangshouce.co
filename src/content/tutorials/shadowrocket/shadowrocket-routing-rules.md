---
title: "Shadowrocket 配置模式、全局路由与远程分流规则集深度实战指南"
description: "全面掌握 iOS Shadowrocket (小火箭) 的高级分流策略。详解「配置 (Config)」、「代理 (Proxy)」与「直连 (Direct)」的区别，手把手教你导入第三方开源规则集 (ACL4SSR) 实现国内直连与精准广告拦截。"
pubDate: 2026-08-19
updatedDate: 2026-08-19
category: "客户端教程"
tags: ["Shadowrocket规则", "小火箭配置模式", "全局路由", "ACL4SSR", "广告拦截", "分流规则"]
author: "机场手册编辑部"
pillar: "shadowrocket"
intent: "informational"
difficulty: "intermediate"
client: "shadowrocket"
os: ["ios", "ipados"]
stepsCount: 3
answer: "小火箭分流配置黄金法则：1. 全局路由务必保持为「配置 (Config)」；2. 导入第三方远程规则集：进入底部「配置」➔ 点击右上角「+」➔ 粘贴开源规则 URL（如 ACL4SSR_Online.ini）➔ 下载后点击「使用配置」；3. 效果：自动实现国内应用直连、国外服务代理、广告追踪域名静默拦截。"
nextStep:
  title: "阅读小火箭订阅更新失败排障指南"
  description: "学习当规则或订阅无法下载时的快速排查方法"
  link: "/answers/shadowrocket-subscription-error/"
  linkText: "查看排障手册 →"
faq:
  - q: "为什么必须选「配置」模式而不是「代理」模式？"
    a: "「代理 (Proxy)」是全局代理，会导致微信发图片变慢、淘宝经常提示异地验证并疯狂扣除你的机场流量；而「配置 (Config)」会自动根据域名识别，国内流量直连本地宽带，国外流量才走专线。"
  - q: "导入远程规则集会不会影响手机网速？"
    a: "不会。小火箭内部采用优化的二叉树规则匹配，即使加载包含数万条规则的 ACL4SSR 规则集，单次匹配耗时依然在微秒级，完全无感知。"
  - q: "小火箭如何对特定 App（如 TikTok 或 ChatGPT）单独指定专属节点？"
    a: "在使用的 `.conf` 配置文件中，找到对应策略组（如 `ChatGPT` 或 `TikTok`），点击将其出站策略单独绑定为你收藏的美国或日本原生节点即可。"
---

## 引言：让 iPhone 变得更聪明的秘密

很多新手在 iPhone 上使用小火箭时，只停留在“打开总开关 ➔ 选个节点”的基础操作。
如果不理解**全局路由三大模式**与**规则集配置**，往往会遭遇国内应用加载慢、流量跑得飞快等问题。

通过为小火箭配置一套优质的**远程分流规则集**，你可以让 iPhone 自动做到：
- 访问百度、微信、网易云音乐走本地直连；
- 访问 Google、YouTube、ChatGPT 自动走专线代理；
- 静默拦截常见的网页弹窗与广告追踪。

```mermaid
graph TD
    UserApp[iPhone 各应用发起请求] --> Route{全局路由: 配置 (Config) 模式}
    Route -->|规则 1: 广告/追踪域名| Reject[REJECT ➔ 静默拦截广告]
    Route -->|规则 2: 国内 IP / 域名 (CN)| Direct[DIRECT ➔ 直连本地 4G/Wi-Fi]
    Route -->|规则 3: 海外服务 (Google/OpenAI)| Proxy[PROXY ➔ 加密送往专线节点]
```

---

## 一、全局路由三大模式深度解析

| 路由模式 | 工作机制 | 优点 | 缺点 | 推荐场景 |
| :--- | :--- | :--- | :--- | :--- |
| **配置 (Config)** | **按规则文件智能分流** | 国内网络 100% 满速，不扣除国内流量 | 需正确加载规则文件 | **日常 100% 默认首选** |
| **代理 (Proxy)** | **所有网络请求强制走代理** | 彻底绕过规则遗漏 | 严重消耗流量，国内 App 变慢 | 临时进行全流量跨境测试 |
| **直连 (Direct)** | **彻底跳过代理核心** | 本地宽带直通 | 无法访问任何海外网站 | 暂时不需要使用外网时 |

---

## 二、导入开源规则集（如 ACL4SSR）标准 3 步

1. **复制开源规则集链接**：
   复制主流规则源 URL（如 `https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini`）。
2. **在小火箭中下载规则**：
   - 打开 Shadowrocket，点击底部导航栏的 **「配置 (Config)」**；
   - 点击右上角的 **「+」** 加号；
   - 粘贴该 URL 并点击 **「下载 (Download)」**。
3. **激活并应用**：
   - 在配置列表中找到刚下载的规则卡片；
   - 鼠标点击卡片，在弹出菜单中选择 **「使用配置」**，卡片右侧出现黄色勾选即代表生效！

---

## 三、总结

正确配置了规则集的小火箭，不仅能为你提供飞快的出海速度，还能让你的 iPhone 获得更纯净的无广告上网环境！
