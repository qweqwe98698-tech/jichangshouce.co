---
term: "Hysteria 2"
slug: "hysteria2"
category: "传输协议"
shortDefinition: "基于魔改 QUIC/UDP 的下一代高性能代理传输协议，具备自研拥塞控制算法，专为恶劣高丢包公网网络暴力加速设计。"
relatedTerms: ["vless", "trojan", "shadowsocks", "tuic"]
updatedDate: 2026-08-18
---

## 什么是 Hysteria 2 协议？

**Hysteria 2** 是网络代理领域针对传统 TCP 协议在恶劣网络环境下性能骤降而研发的革命性 UDP 协议。

```mermaid
graph TD
    Data[用户数据流] --> QUIC[魔改 QUIC / UDP 封包]
    QUIC --> Congest[自研 Brutal 拥塞控制算法 ➔ 强行跑满带宽]
    Congest --> TLS[标准 TLS 1.3 证书伪装]
    TLS --> Server[服务端极速解包]
```

### 核心技术亮点

1. **暴力抗丢包 (Brutal 算法)**：传统 TCP 在遭遇 10% 丢包时会主动将传输速率减半；Hysteria 2 忽略常规退避，即使在丢包率 25% 的严重拥堵链路上仍能强行拉满带宽。
2. **标准 TLS 1.3 伪装**：采用正规 HTTPS 握手与端口混淆技术，具备优异的抗探测能力。
3. **UDP 限速提示**：在部分对 UDP 流量有严格 QoS 限速的地区运营商下，专线仍是更稳健的选择。
