# Headroom MCP

> Server：`user-headroom_mcp` / `headroom_mcp`  
> 底层服务：[Serve · Headroom](../servers/headroom.md)

上下文压缩横切能力：压大输出省 token，可逆取回。不占 P 编号。

## 工具列表

| 工具 | 用途 |
| ---- | ---- |
| `headroom_compress(content)` | 压缩文本，返回压缩视图 + `hash` |
| `headroom_retrieve(hash, query?)` | 凭 hash 取回原文；可选局部过滤 |
| `headroom_stats()` | 压缩统计 — **仅用户问「省了多少 token」时** |

## 触发 / 不触发

| 触发 compress | 跳过 |
| ------------- | ---- |
| ≥400 行或 ≥8KB 且需多步复用 | 小输出、一次性消费 |
| 长日志、JSON、RAG 多 chunk | **将要精确编辑的代码** |
| 上下文接近窗口压力 | 凭证 / 密钥 / 敏感数据 |

## 消费规则

- 压缩结果是派生视图；权威：**用户指令 > 仓库代码 > 压缩摘要**
- 需精确行号 / API 契约 → 先 `headroom_retrieve`
- 不可用 / 失败 → 跳过压缩，用原文，**不阻塞**

## 使用示例

```text
分析这份 2000 行日志，找出异常模式
```

```text
这段大 JSON 我们后面还要用，先压缩一下
```

## 相关

- [工作流核心 · 上下文压缩](../agent-workflow/mcp-core#上下文压缩-headroom-横切能力非-p-阶段)
- [场景路由 · Headroom 速查](../agent-workflow/mcp-routing#上下文压缩-user-headroom_mcp)
