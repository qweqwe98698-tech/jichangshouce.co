---
term: "Shadowsocks"
slug: "shadowsocks"
category: "传输协议"
shortDefinition: "轻量级加密代理协议（简称 SS），现代采用 AEAD 强加密算法（如 2022-blake3 / aes-256-gcm），在专线内网传输中具备极低的 CPU 开销与超高转发效率。"
relatedTerms: ["vless", "trojan", "iepl", "iplc"]
updatedDate: 2026-08-18
---

## 什么是 Shadowsocks (SS) 协议？

**Shadowsocks**（简称 SS）是跨境网络加速领域历史最悠久、客户端生态最完善、性能开销最低的对称加密代理协议。现代 Shadowsocks 已全面弃用早期的易被识别的流密码，进化为以 **AEAD 强加密** 和 **Shadowsocks 2022 规范** 为核心的工业级高效传输方案。

```mermaid
graph LR
    App[应用数据] --> SS[Shadowsocks 2022 AEAD 加密]
    SS --> Leased[IEPL / IPLC 专线内网通道 (无需繁重 TLS 开销)]
    Leased --> Target[高并发超千兆线速转发]
```

### 协议演进：从旧版流密码到 Shadowsocks 2022

Shadowsocks 的发展经历了三个关键技术阶段：
1. **传统流密码时代 (已淘汰)**：早期采用 RC4-MD5、AES-CFB 等流密码，由于缺乏报文完整性校验机制，极易被公网深度包检测（DPI）通过主动重放攻击精准探测与封锁。
2. **AEAD 时代 (主流过渡)**：引入 `aes-256-gcm` 与 `chacha20-ietf-poly1305` 算法，提供了身份验证与加密一体化（Authenticated Encryption with Associated Data），彻底杜绝了数据篡改与重放。
3. **Shadowsocks 2022 新标准 (新一代)**：由社区全新制定的协议规范，引入了基于 Blake3 的单向会话认证头、固定的握手长度和时间戳防重放机制，对高并发和大规模转发做出了系统级性能调优。

### 为什么在专线网络中 Shadowsocks 依然是首选？

| 特性 | Shadowsocks 表现 | 与 TLS 类协议 (VLESS/Trojan) 对比 |
| :--- | :--- | :--- |
| **握手往返延迟 (RTT)** | 0-RTT 或 1-RTT，极低握手耗时 | TLS 需多轮证书握手，初次建立稍慢 |
| **数据包头体积 (Overhead)** | 协议头极小（通常仅十数字节） | TLS 存在几十字节至上百字节证书封装开销 |
| **CPU 计算与电量开销** | 极低（现代 CPU 具备硬件 AES-NI 加速） | 中等（需维护完整 TLS 会话状态机） |
| **公网直连抗审查能力** | 较弱（缺乏正规 Web 网站证书伪装） | 极强（伪装为正规 HTTPS 网站流量） |

### 选型建议与适用场景

- **专线网络环境（强烈推荐）**：在 IEPL/IPLC 等不过公网审查的内网专线节点中，Shadowsocks 是性能最优的选择，尤其能最大化发挥软路由、老旧电视盒子及手机移动端的转发效能。
- **公网直连环境（慎用）**：若在纯国际公网环境下单机部署，原生 Shadowsocks 易被特征识别阻断，此时建议优先选择具备 TLS 伪装的 VLESS Reality、Trojan 或 Hysteria 2。

