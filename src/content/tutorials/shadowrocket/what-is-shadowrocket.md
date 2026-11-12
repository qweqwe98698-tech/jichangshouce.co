---
title: "Shadowrocket 是什么？iOS 苹果小火箭正版辨别、节点购买说明与新手入门全景解析"
description: "专为 iPhone 与 iPad 苹果用户打造的 Shadowrocket (苹果小火箭) 全景入门指南。深度解析正版辨别防骗要点、节点购买须知、底层 Network Extension 架构与新手必备核心常识。"
pubDate: 2026-08-19
updatedDate: 2026-08-19
category: "客户端教程"
tags: ["Shadowrocket", "小火箭是什么", "苹果小火箭", "shadowrocket节点购买", "正版小火箭", "iOS代理", "新手入门"]
author: "机场手册编辑部"
pillar: "shadowrocket"
intent: "informational"
difficulty: "beginner"
client: "shadowrocket"
os: ["ios", "ipados"]
stepsCount: 3
answer: "Shadowrocket（中文俗称「苹果小火箭」）是一款运行于 iOS/iPadOS 系统的知名规则分流网络代理客户端。核心特点：1. 仅需约 $2.99 一次性在海外区 App Store 买断，无后续强制订阅；2. 纯客户端工具，本身不内置任何节点与服务器，需配合第三方机场订阅使用；3. 完美支持 Shadowsocks、VLESS、Hysteria2、TUIC 等全套现代协议；4. 基于苹果官方 Network Extension 框架，待机功耗极低且支持一键智能分流。"
nextStep:
  title: "阅读 Shadowrocket 订阅导入与实战配置"
  description: "从零开始导入机场订阅与开启智能分流的保姆级教程"
  link: "/tutorials/shadowrocket/import-subscription/"
  linkText: "查看小火箭实战教程 →"
faq:
  - q: "为什么中国大陆 App Store 搜索不到苹果小火箭？"
    a: "因政策合规限制，网络代理类工具仅在海外区（美区/港区/日区等）App Store 上架。只需注册或租用一个外区 Apple ID 即可在 App Store 搜索并下载。"
  - q: "如何辨别正版 Shadowrocket，防止下载到盗版山寨软件？"
    a: "认准两大标志：1. 开发者名称必须为「Pan」或「Shadow Launch Technology Group」；2. 图标为蓝色渐变背景搭配一枚斜向飞行的白色火箭；3. 价格为一次性买断约 $2.99。市面上名为「Shadowrocket Pro」、「小火箭极速版」且包含高额月付内购的均为山寨软件。"
  - q: "购买下载小火箭后可以直接上网吗？节点怎么买？"
    a: "不能直接上网。Shadowrocket 是纯代理客户端工具，内部没有任何节点服务器。用户需要在专业的第三方专线机场购买节点订阅，然后将订阅链接一键导入小火箭中才能正常出海。"
  - q: "购买一次 Shadowrocket 后，换新手机需要重新付费吗？"
    a: "不需要。只要在新手机上登录曾经购买过该软件的 Apple ID，即可在 App Store 的「已购项目」中免费直接下载。"
---

## 引言：为什么几乎每个 iPhone 用户出海都选“小火箭”？

如果你向任何资深苹果用户请教“iPhone 怎么出海”，得到的第一个答案几乎 100% 都是 **“去美区 App Store 买个苹果小火箭 (Shadowrocket)”**。

小火箭之所以能统治 iOS 代理工具生态近十年，凭借的是其**极致的易用性、对新协议的闪电适配以及低至 $2.99 的超高性价比**。

本指南帮助苹果新手全面认识这款神器，避开下载到盗版山寨软件的陷阱，并彻底搞清节点购买与配置逻辑。

```mermaid
graph TD
    User[iPhone / iPad 用户] --> Buy[外区 App Store 搜索正版 Shadowrocket]
    Buy --> Auth[首次开启 ➔ 授权 iOS 官方 VPN 描述文件]
    Auth --> Import[一键添加第三方机场 Subscribe 节点订阅]
    Import --> Engine{小火箭规则分流引擎}
    Engine -->|国内 App (微信/淘宝)| Direct[直连本地宽带 ➔ 0 耗电/0 耗流量]
    Engine -->|海外服务 (Google/ChatGPT)| Proxy[加密送往专线节点加速]
```

---

## 一、正版小火箭辨别防骗指南

在 App Store 中经常有不良开发者上架山寨应用诱导新手付费，请务必严格核对以下 3 项信息：

| 核对项 | 正版官方正品标识 | 盗版山寨应用常见特征 |
| :--- | :--- | :--- |
| **应用全称** | **Shadowrocket** (单一名词) | 故意添加后缀：Shadowrocket Pro / Accelerator / 极速版 |
| **官方开发者** | **Pan** / Shadow Launch Technology | 个人陌生名字或拼音企业名 |
| **应用图标** | 经典蓝白斜向小火箭图案 | 红色、黄色或模糊变形的图标 |
| **付费模式** | 一次性买断约 $2.99 (无内购) | 强制每周/每月扣取数十元高额内购订阅 |

---

## 二、Shadowrocket 的三大核心技术优势

1. **调用苹果官方 Network Extension 框架**：
   在系统底层建立虚拟网络管道，相比传统 VPN 能够根据应用发起域名的 IP 地址实现毫秒级分流。
2. **极致的待机功耗控制**：
   在息屏待机状态下，小火箭会进入深度休眠，后台电量消耗低于 1%，不产生发热。
3. **全协议现代代理支持**：
   无论服务商提供的是传统的 Shadowsocks，还是最新的 VLESS+Reality、Hysteria 2、TUIC，小火箭均能原生硬解加速。

---

## 三、小火箭自带节点吗？Shadowrocket 节点购买须知

很多新手首次花 $2.99 购买小火箭后，打开软件点击开关却发现无法上网，甚至误以为买到了假软件。这里必须厘清一个核心概念：

> **Shadowrocket 是“播放器”，机场节点是“唱片”。**
> 小火箭仅提供底层的分流内核与网络连接功能，软件本身不内置任何节点服务器。要正常使用，必须配置第三方节点。

### 如何选购兼容小火箭的优质节点？
1. **优先选择支持通用订阅或小火箭一键导入的服务商**：主流机场均提供直接针对 Shadowrocket 优化的一键订阅链接；
2. **避开公网廉价中继，首选全专线（IEPL）机场**：在手机移动网络环境下，专线节点丢包率低、省电、抗弱网抖动能力极强；
3. **按需选择套餐类型**：高频影音和日常主力建议选择 15–20 元/月的月付套餐；低频备用建议购买不限时按量流量包。

详细的客观核验节点与测速对比可参考 [高性价比专线机场推荐中心](/recommend/)。

---

## 四、总结与后续上手实操

确认下载正版小火箭并获取可用节点后，请继续阅读后续实操指南：
- 完整使用教程：[Shadowrocket 订阅导入与使用教程实战](/tutorials/shadowrocket/import-subscription/)；
- 路由模式选择：[小火箭全局路由选什么？「配置」「代理」「直连」深度解析](/tutorials/shadowrocket/shadowrocket-routing-rules/)；
- 遇到报错排障：[小火箭订阅更新失败 404 排障手册](/answers/shadowrocket-subscription-error/)。
