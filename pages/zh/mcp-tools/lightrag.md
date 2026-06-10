# LightRAG MCP

> Server：`user-daniel_lightrag_mcp` / `daniel_lightrag_mcp`  
> 底层服务：[Serve · LightRAG](../servers/lightrag.md)

跨会话知识库，承担工作流 **P0 检索**、**P2.5 存储**、**P3 里程碑入库**。

## 日常工具

| 工具 | 阶段 | 说明 |
| ---- | ---- | ---- |
| `query_text` | P0 | `mode: hybrid`；**默认** `only_need_context: true` |
| `insert_text` | P2.5/P3 | 正文首部 `[tags: …] [type: …] [date: …]` |
| `insert_texts` | P2.5 | 批量；每项 `title` + `content` + 可选 `metadata` |
| `get_track_status` | P2.5/P3 | 里程碑入库**必须** track 确认 |
| `check_entity_exists` | P2.5 | 「记住 / 更新决策」时可选检查 |

### query_text 参数

| 参数 | 推荐值 | 说明 |
| ---- | ------ | ---- |
| `query` | 从用户输入提取关键词 | 自然语言问句 |
| `mode` | `hybrid` | 实体局部 `local`，全局 `global`，简单 `naive` |
| `only_need_context` | **`true`（必须显式传）** | 只取上下文；用户要求直接回答时传 `false` |

### insert_text 正文格式

```
[tags: decision,api] [type: decision] [date: 2026-06-10]
<决策正文>
```

### 里程碑 tags

| 必须 track | 可跳过 track |
| ---------- | ------------ |
| `decision`, `api`, `preference`, `plan`, `ui`, `architecture` | `brainstorming`, `debug`, `note`, `wip` |

`upload_document` 一律必须 track。

## 按需工具

| 工具 | 何时用 |
| ---- | ------ |
| `upload_document` | 文件入库 |
| `get_documents` / `get_documents_paginated` | 浏览文档列表 |
| `get_document_status_counts` | 运维统计 |
| `get_knowledge_graph` / `get_graph_labels` | 结构审查 |
| `scan_documents` | 触发扫描 |
| `get_health` | **连续 2 次失败后**诊断；非每会话 |
| `get_pipeline_status` | 流水线状态 |
| `update_entity` / `update_relation` | 改图谱（需 ID）；**改正文用新 insert_text** |
| `delete_document` / `delete_entity` / `delete_relation` | 运维清理（须用户确认） |
| `query_text_stream` | 长回答场景 |

## 显式触发（硬门闩）

用户消息含 **知识库** / **LightRAG** / **daniel_lightrag** → **第一步** `query_text`，先于读代码、P1、实现。

## 故障诊断

同任务内 `query_text` / `insert_text` **连续 2 次失败** → `get_health` → 仍失败则跳过知识库步骤。

## 使用示例

```text
按知识库实现用户登录 API
```

```text
记住：项目数据库使用 PostgreSQL，端口 5432
```

```text
查一下我们之前关于 page-structure 的决策
```

## 相关

- [工作流核心 · P0](../agent-workflow/mcp-core#p0知识检索条件触发)
- [工作流核心 · P2.5 入库](../agent-workflow/mcp-core#p25知识存储规范)
- [场景路由 · 知识库](../agent-workflow/mcp-routing#知识库相关-user-daniel_lightrag_mcp)
