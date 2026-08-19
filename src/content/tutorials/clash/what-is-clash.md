---
title: "Clash 是什么？内核与客户端关系、YAML 配置文件与新手入门概念全景拆解"
description: "专为初学者打造的 Clash 核心原理解析指南。深度拆解开源 Clash 内核 (Mihomo/Meta) 与图形客户端 (Clash Verge Rev) 的分工协作、YAML 配置文件结构、策略组与分流规则机制。"
pubDate: 2026-08-19
updatedDate: 2026-08-19
category: "客户端教程"
tags: ["Clash是什么", "Clash原理", "Mihomo", "YAML配置", "策略组", "规则分流"]
author: "机场手册编辑部"
pillar: "clash"
intent: "informational"
difficulty: "beginner"
client: "clash"
os: ["windows", "macos", "linux"]
stepsCount: 4
answer: "Clash 是一套基于 Go 语言开发的规则分流代理内核。其核心架构分为两层：1. 底层核心 (Core)：如现代的 Mihomo (Clash.Meta)，负责协议加解密、流量拦截与网络路由；2. 图形客户端 (GUI)：如 Clash Verge Rev，为用户提供美观的可视化界面以导入订阅、切换节点和开启 TUN 模式。两者配合实现国内直连、海外代理的智能分流。"
nextStep:
  title: "阅读 Clash Verge Rev 完整安装与配置实战"
  description: "从零开始下载安装并完成订阅导入的 5 步图文指南"
  link: "/tutorials/clash/clash-verge-starter-guide/"
  linkText: "查看实战教程 →"
faq:
  - q: "原版 Clash 停更了，现在的 Clash 还能用吗？"
    a: "可以。原版 Clash Core 停更后，开源社区建立了目前由全球开发者共同维护的「Mihomo (原 Clash.Meta)」内核，不仅完全继承原有生态，还增加了对 VLESS、Hysteria2、TUIC 等新协议的完整支持。"
  - q: "Clash 的 YAML 配置文件是什么？"
    a: "YAML 是一种人类可读的数据标记语言。Clash 的配置文件包含 4 大模块：基础网络端口（Port）、服务器节点池（Proxies）、代理策略组（Proxy Groups）以及域名/IP 分流规则（Rules）。"
  - q: "策略组 (Proxy Group) 是什么意思？"
    a: "策略组是节点的集合容器。例如「PROXY 策略组」让你手动点击切换节点，「AUTO 策略组」会定期自动测速并切换到延迟最低的节点，「FALLBACK 策略组」会在当前节点故障时自动故障转移。"
  - q: "为什么使用 Clash 比传统 VPN 更快？"
    a: "因为 Clash 具备精细的规则分流（Rule-based Routing）能力。只有海外被阻断的请求才会经过代理服务器，国内流量（百度、微信、B站）100% 走本地物理光纤直连，零延迟损耗。"
---

## 引言：为什么 Clash 会成为跨境网络访问的标杆？

在代理技术的发展史上，Clash 的出现彻底改变了过去“全局代理导致国内网站变慢、不同应用频繁切换节点”的落后局面。

很多新手听到“Clash”时，往往误以为它只是一个单一的软件。实际上，**Clash 代表了一套由开源核心、规则引擎、策略组和现代图形界面共同构成的完整技术生态**。

本指南帮助初学者理清 Clash 的底层架构与运行机理。

```mermaid
graph TD
    User[用户网络请求] --> GUI[图形客户端 (Clash Verge Rev)]
    GUI --> Core[底层内核 (Mihomo / Clash.Meta)]
    Core --> Rules{规则引擎 (Rules Engine)}
    Rules -->|国内域名 (Baidu / WeChat / Bilibili)| Direct[直连通道 (DIRECT ➔ 0 流量消耗)]
    Rules -->|海外服务 (Google / OpenAI / YouTube)| ProxyGroup[策略组 (PROXY ➔ 选定专线节点)]
    ProxyGroup --> Out[境外落地机房 ➔ 目标网站]
```

---

## 一、内核 (Core) 与图形客户端 (GUI) 的分工解密

初学者最容易混淆“内核”与“客户端”的区别：

| 组成部分 | 代表组件 | 核心职责 | 形象比喻 |
| :--- | :--- | :--- | :--- |
| **底层内核 (Core)** | **Mihomo (Clash.Meta)** | 运行在后台的无界面引擎，负责建立虚拟网卡、监听本地端口、加解密数据流及执行路由分流。 | 汽车的高性能发动机 |
| **图形客户端 (GUI)** | **Clash Verge Rev** / Clash Nyanpasu | 运行在前台的可视化窗口，提供美观的按钮、测速面板、订阅管理与一键系统代理开关。 | 汽车的方向盘与仪表盘 |

---

## 二、Clash YAML 配置文件的四大核心模块

当你从机场导入一条订阅时，客户端下载的本质上是一个 `.yaml` 文本文件，其内部结构极为严谨：

```text
1. 基础参数 (General) ➔ 定义本地 Socks5/HTTP 端口 (如 7890)、外部控制接口与 DNS 模式
2. 节点列表 (Proxies) ➔ 列出所有香港、日本、美国等专线节点的 IP、端口、UUID 与加密方式
3. 策略组 (Proxy Groups) ➔ 将节点组合为「节点选择」、「自动测速」、「故障转移」等逻辑组
4. 分流规则 (Rules) ➔ 数万条规则清单 (如 DOMAIN-SUFFIX,google.com,PROXY)
```

---

## 三、策略组的三大经典工作机制

1. **手动选择 (Select)**：由用户在界面中自行点击指定某个节点（如指定香港 01）。
2. **自动测速优选 (URL-Test)**：客户端每隔一段时间对组内所有节点发送轻量探测，**自动无感切换至延迟最低的可用节点**。
3. **故障转移 (Fallback)**：优先使用排在第一位的节点；当第一位节点断线超时时，瞬时平滑切换至第二位备用节点。

---

## 四、总结与后续上手实操

理解了 Clash 的核心设计理念后，你可以直接进入实操环节：
- 查阅 [Clash Verge Rev 完整实战教程](/tutorials/clash/clash-verge-starter-guide/) 体验最新一代客户端；
- 深入学习分流机制：[Clash 规则模式与全局模式全解](/tutorials/clash/clash-rules-and-modes-guide/)；
- 遇到故障排查：[Clash 有节点但无法上网深度指南](/answers/clash-connected-no-internet/)。
