---
title: "Sing-box SRS 二进制规则集与 JSON 配置文件深度解析指南"
description: "深度剖析下一代通用代理平台 Sing-box 的底层架构。详解 JSON 结构化配置规范、Inbounds 入站与 Outbounds 出站机制、SRS 二进制规则集预编译原理及高性能分流实战。"
pubDate: 2026-08-19
updatedDate: 2026-08-19
category: "客户端教程"
tags: ["Sing-box规则", "SRS规则集", "JSON配置", "二进制预编译", "Sing-box进阶", "下一代代理"]
author: "机场手册编辑部"
pillar: "singbox"
intent: "informational"
difficulty: "advanced"
client: "sing-box"
os: ["windows", "macos", "ios", "android", "linux"]
stepsCount: 3
answer: "Sing-box 配置与 SRS 核心解析：1. 结构化 JSON：配置分为 log、dns、inbounds (入站网卡)、outbounds (专线节点)、route (路由分流) 5 大核心对象；2. SRS (Sing-box Rule Set) 机制：将云端数十万条规则预编译为二进制哈希文件（.srs），客户端匹配时内存占用降低 80%、速度提升 10 倍；3. 支持动态拉取远程规则集并自动后台热更新。"
nextStep:
  title: "阅读 Sing-box 全平台客户端上手教程"
  description: "学习如何在 iOS、Android、Windows 与 Mac 上配置 Sing-box"
  link: "/tutorials/singbox/singbox-starter-guide/"
  linkText: "查看 Sing-box 基础教程 →"
faq:
  - q: "为什么 Sing-box 放弃了 YAML 而全面采用 JSON？"
    a: "JSON 是全球互联网最通用的结构化数据标准，具备严格的机器校验语法与极高的高并发解析效率，能有效规避 YAML 容易因缩进空格错误导致配置崩溃的问题。"
  - q: "如何在 Sing-box 配置中引用远程 SRS 规则集？"
    a: "在 `route.rule_set` 中定义规则集对象，指定 `type: remote`、`format: binary` 并填入远程 `.srs` 文件的下载 URL 与自动更新周期。"
  - q: "如何自己将文本规则编译为 .srs 二进制文件？"
    a: "使用 Sing-box 官方 CLI 工具，执行命令 `sing-box rule-set compile 规则文本.json`，即可在本地秒级编译出高性能的 `.srs` 二进制规则包。"
---

## 引言：下一代代理架构的性能飞跃

在传统的代理软件中，规则集大多以纯文本形式存在。每次发起网络请求，客户端都需要对成千上万行文本进行正则匹配，不仅消耗 CPU，还容易导致内存剧增。

**Sing-box 创新性地引入了 SRS (Sing-box Rule Set) 二进制规则集技术**，将规则匹配从“文本遍历”升级为“内存二分查找”，实现了性能的降维打击。

```mermaid
graph LR
    subgraph 云端预编译
        RulesText[数十万条域名/IP 规则文本] --> Compiler[Sing-box CLI 编译器]
        Compiler --> SRSFile[二进制哈希树规则包 (.srs 文件)]
    end
    
    subgraph 客户端极速加载
        SRSFile -->|下载并映射至内存| ClientMemory[微秒级二分查找匹配]
        ClientMemory --> HighPerf[内存 < 20MB / CPU 占用 0%]
    end
```

---

## 一、Sing-box JSON 配置文件的 5 大核心模块

一份标准的 Sing-box 配置文件采用高度标准化的 JSON 规范：

1. **`dns`**：定义本地 DoH / DoQ 防污染服务器与 DNS 路由规则。
2. **`inbounds`**：定义入站接口（如 `tun` 虚拟网卡或 `socks` 端口）。
3. **`outbounds`**：定义各个境外专线落地节点（VLESS、Hysteria2、Shadowsocks）及策略组（Selector、URL-Test）。
4. **`route`**：定义分流规则集与出站映射关系。
5. **`experimental`**：定义 Clashing API 仪表盘接口等实验性功能。

---

## 二、总结与进阶学习

掌握了 Sing-box 的 JSON 架构与 SRS 规则集，你已经站上了当前跨境代理技术的最前沿。

继续阅读全平台实操教程：[Sing-box 通用代理内核上手指南](/tutorials/singbox/singbox-starter-guide/)
