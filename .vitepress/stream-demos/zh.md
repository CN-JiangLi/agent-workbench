# 模拟执行记录：Agent 按 Full-Workflow 跑一遍

> **用户原始需求**（偏短、缺约束）：「给 MCP 文档加一小段，说明工具调用要写清楚。」  
> 路由依据：[`/zh/agentic-workflow/full-workflow`](/zh/agentic-workflow/full-workflow) 中的 **P0 → P1 → P2 → P3** 与 **可观测性** 小节。

---

## P0 · 对话开始（记忆）

**意图**：在动手前检索是否已有「MCP / 工作流 / 可观测性」相关决策，避免重复劳动。  
**定位**：`user-memory` / `memory_search`  
**参数摘要**：`keywords = MCP, workflow, observability, 工具调用`  
**状态**：成功  
**结果摘要**：命中 **0** 条；按规则输出提示——*未找到相关历史记忆，将基于当前上下文继续。*

---

## P1 · Prompt 优化（需求偏模糊时）

**意图**：把「要写清楚」展开成可验收的文档结构，减少返工。  
**定位**：`promptenhancer`（或等价优化链路）  
**参数摘要**：原始需求 + 目标读者（内部 Agent）+ 篇幅上限（短段落）  
**状态**：成功  

**优化后提示（节选）**

- 在《MCP 自动工作流规则》中新增 **「工具调用可观测性」** 子节，与现有「调用前 / 调用后」对齐。  
- 每条示例必须包含：**意图一句**、**server/工具名**、**关键参数摘要**、**成功或失败 + 可操作的错误片段**。  
- 敏感信息仅写「已配置 / 已脱敏」，不写明文。

---

## P2 · 场景路由：文件 + 文档

**意图**：先确认目标文件存在且可改，再写入小节，避免覆盖误伤。  
**定位**：`filesystem` / `read_file` → `edit_file`（或等价）  
**参数摘要**：`path = pages/zh/agentic-workflow/full-workflow.md`  
**状态**：成功（文件存在，采用增量编辑而非整文件覆盖）

**写入策略（与规则对齐）**

1. `read_file` 检查当前 `# MCP 工具调用可观测性` 是否已足够。  
2. 若仅需补充，用 `edit_file` 在「调用前」列表下追加 2～3 条 **反例 → 正例** 对照。  
3. 目录存在性检查一律用 `list_directory`，不用 `read_file` 冒充目录探测。

---

## P2 旁路 · API 场景（本任务未触发，仅演示路由表）

若用户说的是「按 OpenAPI 生成接口代码」，则应走：

`refresh_project_oas_*` → `read_project_oas_*` → 生成代码；refresh 失败则读缓存并 **显式写出错误与回退**。

---

## P3 · 任务完成（记忆沉淀）

**意图**：把本次「文档结构 + 可观测性写法」固化为可复用记忆。  
**定位**：`user-memory` / `memory_store`  
**参数摘要**：`topic = mcp-docs-observability`，内容仅含 **决策与模板句式**（不含临时调试日志）  
**状态**：成功  
**结果摘要**：新建记忆 ID 由会话持有；同一会话同 topic 后续更新应走 `memory_update`，避免重复条。

---

## 产出物说明（给 markstream-vue 的 Markdown）

本文件为 **纯 Markdown**，包含标题、分隔线、表格、列表与行内代码，便于在首页用 [markstream-vue](https://markstream-vue.simonhe.me/) 做 **流式渲染** 演示；规则原文仍以站内 **Full-Workflow** 页面为准。

**自检清单**

- [x] 每次 MCP 调用前有 **意图 + 工具名 + 参数摘要**  
- [x] 调用后有 **状态 + 结果摘要**（或失败可操作片段）  
- [x] 回退路径与假设写清楚，便于复盘  

```text
# 伪代码：单轮工具调用骨架（文档中可照搬句式）

before_call:
  say(why, server_tool, redacted_params)

after_call:
  say(status, short_summary, next_step_or_fallback)
```
