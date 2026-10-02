---
term: "Trojan"
slug: "trojan"
category: "传输协议"
shortDefinition: "将代理流量伪装成标准 HTTPS 网页流量的协议，严格遵循 TLS 标准握手，能够有效穿透严格的公网防火墙探测。"
relatedTerms: ["vless", "shadowsocks", "hysteria2"]
updatedDate: 2026-08-18
---

## 什么是 Trojan 协议？

**Trojan** 的设计哲学是“伪装为互联网最通用、最合规的标准流量”。与试图自研私有加密特征的传统协议不同，Trojan 不对自身进行私有特征编码，而是直接借助合法的域名 TLS 证书，将自身伪装成标准浏览器发往互联网 HTTPS 服务器的 443 端口合法访问。

```mermaid
graph TD
    User[用户客户端] --> Trojan[Trojan 协议封包 (内置校验密码)]
    Trojan --> TLS[标准 TLS 1.3 证书握手 (443端口)]
    TLS --> Server{服务端 SNI 与密码校验}
    Server -->|密码正确| Out[解包转发到代理网络]
    Server -->|嗅探扫描 / 证书探测| Web[反向代理至真实 Nginx / Apache 正常网页]
```

### 核心工作机制与防御主动探测

1. **绝对标准 TLS 握手**：Trojan 的握手数据流在字节层面上与 Chrome/Firefox 访问一个正常的电商或博客网站没有任何区别。网络中间防火墙无法通过特征规则将其与数以亿计的普通 HTTPS 网站流量区分开。
2. **防主动嗅探与回落保护 (Fallback)**：当外部防火墙或未授权扫描器向 Trojan 服务端端口发送非法探测包时，服务端并不会报错或中断连接，而是自动将其直接回落（Forward）转发到后端真实搭建的 Web 网站（如一个静态博客或官网）。探测者收到的响应是一个标准且正常的 HTML 页面，因此能完美挫败各种主动探测行为。
3. **极简协议头部**：在完成 TLS 握手后，Trojan 内部仅增加极短的密码哈希与请求目标地址，没有其他多余的混淆包装层，因此其单连接传输性能明显优于早期的 VMess。

### Trojan 与 VLESS、Shadowsocks 的对比分析

| 评估维度 | Trojan | VLESS (with Reality) | Shadowsocks |
| :--- | :--- | :--- | :--- |
| **伪装形态** | 标准合法 HTTPS 流量 | 借用大厂证书的 TLS 流量 | 对称加密二进制流 |
| **公网抗封锁** | 极高（需自备合规域名与证书） | 极高（无需自备域名证书） | 较低（公网易被封） |
| **专线网络效率** | 中等（存在 TLS 加密开销） | 中等偏高（XTLS 零拷贝） | 极高（无 TLS 开销，CPU 极低） |
| **客户端支持** | 几乎全平台通用 | 需支持 Xray/Sing-box 核心 | 全平台硬件级支持 |

### 最佳应用场景与避坑建议

- **公网中转与直连场景**：若您使用的节点没有专线光纤，需要通过公网直连香港、日本或美国服务器，Trojan 是极佳的抗阻断防御方案。
- **域名证书过期排查**：由于 Trojan 严格依赖合法 TLS 证书，若发现节点突然无法连接且报错 `certificate expired` 或 `SSL handshake failed`，通常为服务商证书续期出现故障。

