# 模拟任务：按知识库实现 Workflow 列表筛选功能

> 用户输入：`按知识库标准，在 app-center 增加按状态筛选 Workflow 列表`

---

## 步骤 0 · 决策树预判

```
用户消息含「知识库」→ P0 强制第一步（硬门闩）
  → P0.5 Elements（检查可用性）
  → P1 promptenhancer（需求已较明确，跳过）
  → P2 场景路由
  → ⟂ Headroom（大输出时横切）
  → 完成前 verification-before-completion
  → P3 里程碑入库
```

---

## 步骤 1–2 · P0 知识检索

**意图**：检索跨会话架构决策与 UI 规范，先于读代码。

| 项 | 值 |
| -- | -- |
| MCP Server | `user-daniel_lightrag_mcp` |
| 底层服务 | LightRAG API `http://127.0.0.1:9621`（经 `MCP_LightRAG_start.sh` 桥接） |
| 工具 | `query_text` |
| 参数 | `query="app-center Workflow 列表筛选 UI 规范"`, `mode=hybrid`, `only_need_context=true` |

**结果摘要**：命中 3 条；采用 2 条关键结论：
1. `[date: 2026-05-20]` 列表页须用 `UIStandardLayout` + 标准筛选栏模式
2. `[date: 2026-06-01]` MSP/tenant 视图差异以**当前代码**为准（已忽略较早默认列配置记忆）

---

## 步骤 3 · P0.5 Elements（可选）

| 项 | 值 |
| -- | -- |
| MCP Server | `Elements` |
| 工具 | `get_project_guidance` |
| 结果 | **未配置** → 跳过 P0.5 |

**回退**：`agents-workflow` + 最小代码阅读 + 假设列表，任务继续。

---

## 步骤 4–5 · P2 代码理解（Codegraph）

**意图**：理解 app-center 现有调用关系与筛选相关模块边界。

| 项 | 值 |
| -- | -- |
| MCP Server | `project-0-ui-codegraph` |
| 底层服务 | Codegraph（`.codegraph/` 本地 SQLite 图谱，经 `MCP_Codegraph_serve.sh` :9623） |
| 工具 | `codegraph_explore` |
| 参数 | `query="app-center Workflow list filter"` |

**结果摘要**：返回 `WorkflowList.vue`、`useWorkflowFilter.ts`、`workflowApi.getList` 调用链；含 2 个文件源码片段（非 stale）。

**跟进**：无需对同一文件再 Grep+Read（反模式禁止）。

---

## 步骤 6 · P2 文件读取（Filesystem）

| 项 | 值 |
| -- | -- |
| MCP Server | `user-filesystem` |
| 工具 | `read_text_file` |
| 路径 | `src/pages/app-center/WorkflowList.vue`（stale 标记外校对类型定义） |

**结果**：成功，128 行。

---

## 步骤 7–9 · 实现（宿主 Write / MCP edit_file）

| 步骤 | 工具 | 说明 |
| ---- | ---- | ---- |
| 7 | `list_directory` | 确认 `src/components/workflow/` 存在 |
| 8 | `read_text_file` | 读 `useWorkflowFilter.ts`（写前必读） |
| 9 | `edit_file` | 增加 `status` 筛选字段与 API 参数 |

**合并摘要（对用户）**：步骤 1–9：知识库检索、Codegraph 探索、读取配置、实现筛选逻辑 → 均成功。

---

## 步骤 10 · ⟂ Headroom 横切（示例：大段类型检查输出）

**触发**：`tsc --noEmit` 输出 420 行，需多步推理。

| 项 | 值 |
| -- | -- |
| MCP Server | `user-headroom_mcp` |
| 底层服务 | Headroom（`headroom mcp serve`，经 `MCP_Headroom_start.sh` :9624） |
| 工具 | `headroom_compress` |
| 返回 | 压缩视图 + `hash=a7f3c2` |

需精确行号时 → `headroom_retrieve(hash=a7f3c2, query="WorkflowList")`。

---

## 步骤 11 · Superpowers · verification-before-completion

**默认门闩**：声明完成前全量验证。

- `pnpm typecheck` → 通过
- `pnpm lint` → 通过
- 手测：MSP / tenant 视图切换筛选 → 通过

---

## 步骤 12–13 · P2.5 / P3 里程碑入库

| 项 | 值 |
| -- | -- |
| MCP Server | `user-daniel_lightrag_mcp` |
| 工具 | `insert_text` |
| 正文前缀 | `[tags: decision,ui] [type: decision] [date: 2026-06-10]` |
| track | `get_track_status(track_id)` → **success** |

---

## 本任务 MCP / 服务一览

| 阶段 | MCP Server | 工具 | 底层 Serve |
| ---- | ---------- | ---- | ---------- |
| P0 | `user-daniel_lightrag_mcp` | `query_text` | LightRAG |
| P0.5 | Elements（跳过） | — | — |
| P1 | —（跳过） | — | — |
| P2 代码 | `project-0-ui-codegraph` | `codegraph_explore` | Codegraph |
| P2 文件 | `user-filesystem` | `read_text_file`, `edit_file`, `list_directory` | filesystem MCP |
| ⟂ 压缩 | `user-headroom_mcp` | `headroom_compress`, `headroom_retrieve` | Headroom |
| 验证 | Superpowers | `verification-before-completion` | — |
| P3 | `user-daniel_lightrag_mcp` | `insert_text`, `get_track_status` | LightRAG |

**未使用**：`cursor-ide-browser`（用户未要求）、`user-prompt-optimizer`（需求明确）、`memory_*` / OAS MCP（已废弃路由）。

---

## 已配置 MCP 能力矩阵（6）

| Server | 代表工具 |
| ------ | -------- |
| `user-daniel_lightrag_mcp` | `query_text`, `insert_text`, `get_track_status` |
| `user-filesystem` | `read_text_file`, `edit_file`, `list_directory` |
| `user-prompt-optimizer` | `promptenhancer` |
| `project-0-ui-codegraph` | `codegraph_explore`, `codegraph_impact` |
| `user-headroom_mcp` | `headroom_compress`, `headroom_retrieve` |
| `cursor-ide-browser` | `browser_navigate`, `browser_snapshot`（仅用户明确要求） |

**任务完成** ✓
