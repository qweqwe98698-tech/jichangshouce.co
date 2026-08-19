---
term: "IEPL"
slug: "iepl"
category: "线路架构"
shortDefinition: "国际以太网专线 (International Ethernet Private Line)，基于电信运营商内网光纤构建的二层专网，完全绕过公网 GFW 审查，全天候零丢包且性价比高。"
relatedTerms: ["iplc", "bgp", "vless", "shadowsocks"]
updatedDate: 2026-08-18
---

## 什么是 IEPL 专线？

**IEPL**（International Ethernet Private Line，国际以太网专线）是指跨越国家或地区的点对点二层专用以太网连接。它利用电信运营商的骨干传送网（如 SDH/OTN 光纤网络），为企业提供完全隔离于公网互联网的专用数据通道。

### IEPL 专线的核心工作原理

```mermaid
graph LR
    User[用户设备] --> In[境内 BGP 机房入口]
    In -->|电信内网二层光纤专用隧道| Out[境外落地机房]
    Out --> Target[目标海外网站]
```

1. **不过公网 GFW 审查**：数据在境内机房直接封装进入电信运营商的内部传输专网，在境外机房（如香港、东京）解包落地，物理上完全不经过民用公网国际出口和审查机制。
2. **晚高峰零丢包与超低延迟**：由于独占专用内网光缆，完全免疫公网骨干网在每晚 20:00–23:00 的物理级拥塞，丢包率稳定在 0.5% 以下。
3. **综合性价比之王**：相比极为昂贵的 IPLC 裸光纤，IEPL 在集约化运营下成本更加亲民，月付 15–20 元即可享用百兆专线。
