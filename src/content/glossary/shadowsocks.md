---
term: "Shadowsocks"
slug: "shadowsocks"
category: "传输协议"
shortDefinition: "轻量级加密代理协议（简称 SS），现代采用 AEAD 强加密算法（如 2022-blake3 / aes-256-gcm），在专线内网传输中具备极低的 CPU 开销与超高转发效率。"
relatedTerms: ["vless", "trojan", "iepl", "iplc"]
updatedDate: 2026-08-18
---

## 什么是 Shadowsocks (SS) 协议？

**Shadowsocks** 是跨境网络加速领域历史最悠久、客户端兼容性最广泛的工业级代理协议。

```mermaid
graph LR
    App[应用数据] --> SS[Shadowsocks 2022 AEAD 加密]
    SS --> Leased[IEPL 专线专用通道 (无需复杂公网伪装)]
    Leased --> Target[高并发千兆转发]
```

### 为什么在专线机场中 SS 依然是首选？

1. **协议头部极小，转发性能无敌**：相比繁重的 TLS 多次握手，Shadowsocks 的数据包极为轻巧，单核吞吐量在全协议中位列第一。
2. **专线天然免疫公网审查**：由于 IEPL/IPLC 走的是内网专用光纤，完全不需要应对公网的 DPI 探测，SS 的高能效优势被 100% 释放。
3. **全生态硬解支持**：无论是 iOS、Android、软路由还是游戏主机，均支持硬件级 AES 加密加速。
