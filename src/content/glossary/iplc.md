---
term: "IPLC"
slug: "iplc"
category: "线路架构"
shortDefinition: "国际私有租用线路 (International Private Leased Circuit)，点对点物理裸光缆，物理上完全不经过公网 GFW 审查，延迟接近物理极限且零丢包。"
relatedTerms: ["iepl", "bgp", "vless", "shadowsocks"]
updatedDate: 2026-08-18
---

## 什么是 IPLC 专线？

**IPLC**（International Private Leased Circuit，国际私有租用线路）是电信网络中规格最高、成本最昂贵的点对点物理光缆互联服务。

### IPLC 的核心物理架构

```mermaid
graph LR
    User[用户设备] --> In[境内专线机房 (如深圳/上海)]
    In -->|跨国物理裸光缆点对点直连 (不经公网)| Out[境外落地机房 (如香港/东京)]
    Out --> Target[外服游戏/金融交易]
```

1. **绝对不过 GFW 审查**：物理点对点直达光纤，数据在境内机房直接进入光路，在境外机房落地，从物理链路上完全隔离公网审查。
2. **极限物理超低延迟**：由于物理光缆直接按最短地理测地线铺设，深港直达延迟仅 3–6ms，沪日直达仅 25–30ms。
3. **零抖动与零丢包**：全天候任何时段保持 0.0% 丢包率，是外服电竞、高频跨国量化交易的终极解决方案。
