---
term: "Trojan"
slug: "trojan"
category: "传输协议"
shortDefinition: "将代理流量伪装成标准 HTTPS 网页流量的协议，严格遵循 TLS 标准握手，能够有效穿透严格的公网防火墙探测。"
relatedTerms: ["vless", "shadowsocks", "hysteria2"]
updatedDate: 2026-08-18
---

## 什么是 Trojan 协议？

**Trojan** 的设计哲学是“模仿标准 Web 流量”。它不试图自己创造任何私有加密格式，而是直接利用合法的 TLS 证书，将代理请求完全伪装成发往真实 Web 站点的 443 端口流量。

```mermaid
graph TD
    User[用户设备] --> Trojan[Trojan 协议封包]
    Trojan --> TLS[标准 TLS 1.3 证书握手]
    TLS --> Server{服务端验证密钥}
    Server -->|合法密码| Out[转发代理网络]
    Server -->|非法探测| Web[返回真实的正常 Web 网页]
```

### 核心特性

- **高度隐蔽**：外部防火墙探测时，看到的是标准且完全符合密码学规范的 HTTPS 流量。
- **免探测保护**：如果主动探测未携带正确密码，服务端会直接返回一个真实的正常网页，从而完美防御主动探测。
