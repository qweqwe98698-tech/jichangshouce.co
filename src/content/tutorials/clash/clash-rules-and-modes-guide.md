---
title: "Clash 规则模式、全局模式与直连模式有什么区别？分流规则与策略组深度实战指南"
description: "全面拆解 Clash 的三大路由模式：Rule (规则模式)、Global (全局模式) 与 Direct (直连模式)。详解 DOMAIN-SUFFIX、IP-CIDR 分流匹配顺序及如何自定义独立代理规则。"
pubDate: 2026-08-19
updatedDate: 2026-08-19
category: "客户端教程"
tags: ["Clash规则", "规则模式", "全局模式", "直连模式", "策略组", "分流设置"]
author: "机场手册编辑部"
pillar: "clash"
intent: "informational"
difficulty: "intermediate"
client: "clash"
os: ["windows", "macos", "linux"]
stepsCount: 3
answer: "Clash 三大模式的核心区别：1. 规则模式 (Rule，日常默认推荐)：按域名/IP 规则智能分流，国内服务直连（0 耗流量），国外被阻断服务自动走代理；2. 全局模式 (Global)：电脑所有网络请求强制走选定节点，会导致国内访问变慢并浪费流量；3. 直连模式 (Direct)：跳过所有代理，全部直通公网。日常使用请务必保持在「规则模式」。"
nextStep:
  title: "学习 Clash TUN 虚拟网卡与 DNS 配置"
  description: "掌握全系统透明代理与防 DNS 污染进阶调优"
  link: "/tutorials/clash/clash-tun-mode-and-dns-guide/"
  linkText: "查看 TUN 与 DNS 教程 →"
faq:
  - q: "为什么开了规则模式后，偶尔有国外网站打不开？"
    a: "因为该冷门网站未被包含在机场默认的规则列表（Rule-Set）中，被默认规则判定为了直连（DIRECT）。解决方法：在自定义扩展配置中加入 `DOMAIN-SUFFIX,目标域名,PROXY`，或临时切换为全局模式。"
  - q: "国内网站（如淘宝、网易云）开启代理后提示异地登录怎么办？"
    a: "这说明误开启了「全局模式 (Global)」。切换回「规则模式 (Rule)」，国内网站将重新识别你的真实本地宽带 IP。"
  - q: "Clash 规则匹配的优先级是怎样的？"
    a: "自上而下逐行匹配。一旦某条规则（如 DOMAIN 完整匹配）命中了当前请求，内核便会立即执行对应的出站动作并终止后续匹配；如果全表未命中，则落入最底部的 `MATCH` 兜底规则。"
---

## 引言：为什么“规则分流”是 Clash 的灵魂？

在日常上网时，我们经常需要同时进行多项网络活动：
- 一边在钉钉/企业微信接收国内办公文件；
- 一边在 Chrome 里查阅 Google 文档与 GitHub 仓库；
- 另一边在播放网易云音乐或观看 YouTube 视频。

如果使用全流量走代理的旧式 VPN，国内应用会因为 IP 漂移被频繁要求验证码，且国内视频下载会疯狂消耗宝贵的机场套餐配额。

**Clash 的规则引擎通过精准的域名与 IP 匹配，完美实现了“国内直连、海外加速”的无感分流**。

```mermaid
graph TD
    Req[客户端发起网络请求] --> Match1{1. 匹配到国内域名 / GEOIP CN?}
    Match1 -->|是| Direct[走 DIRECT 直连 ➔ 本地宽带 / 0 耗配额]
    Match1 -->|否| Match2{2. 匹配到 AI / 媒体 / 代理规则?}
    Match2 -->|是| Proxy[走 PROXY 策略组 ➔ 境外专线加速]
    Match2 -->|否| Match3{3. 底部兜底规则 MATCH}
    Match3 --> Fallback[按机场默认规则转发]
```

---

## 一、三大路由模式全方位深度对比

| 模式名称 | 流量转发机制 | 优点 | 缺点 | 推荐场景 |
| :--- | :--- | :--- | :--- | :--- |
| **规则模式 (Rule)** | **按预设规则智能分流** | 国内网络 100% 满速，不扣除国内流量 | 冷门网站若规则遗漏可能无法出海 | **全天候日常使用默认首选** |
| **全局模式 (Global)**| **所有流量无条件走代理** | 彻底规避规则遗漏问题，单点测试方便 | 国内软件变慢、可能触发国内 App 异地风控 | 排查特定境外网站无法加载故障时 |
| **直连模式 (Direct)**| **彻底绕过代理内核** | 本地宽带裸连，零系统开销 | 无法访问任何海外受限网站 | 进行国内几十 GB 大文件下载时 |

---

## 二、Clash 核心规则类型解析

在配置文件的 `rules` 段中，常见的规则语法包括：

- `DOMAIN-SUFFIX,google.com,PROXY`：只要访问以 `google.com` 结尾的域名，全部走代理。
- `DOMAIN-KEYWORD,github,PROXY`：域名只要包含 `github` 关键字，全部走代理。
- `GEOIP,CN,DIRECT`：只要解析出的目标 IP 归属于中国大陆，一律走本地直连。
- `MATCH,PROXY`：以上所有规则均未命中时的最终兜底动作。

---

## 三、总结

坚持在日常保持 **「规则模式 (Rule)」**，即可享受最极致且无感的出海体验！

继续学习进阶 TUN 配置：[Clash TUN 模式与本地 DNS 防污染设置](/tutorials/clash/clash-tun-mode-and-dns-guide/)
