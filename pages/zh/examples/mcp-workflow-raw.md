# MCP Full-Workflow 原文示例（代码渲染）
::: info 模型与评分
**生成模型**：`Opus4.6`  
**评分**：`DeepSeek 10.0` ｜ `Opus4.6 9.5`
:::
```md
---
description: MCP 工具自动调度规则（记忆、提示优化、任务路由）
alwaysApply: true
---

# MCP 自动工作流规则

## 目标
- 通过记忆机制保持上下文连续性。
- 在需求模糊时先优化提示，再进入实现。
- 按用户意图自动路由到合适的 MCP 工具链。
- 在关键节点沉淀决策，便于后续复用。

## 优先级 0：对话开始
- 每次对话开始自动执行 `memory_search`。
- 关键词从用户输入中提取。
- 目的：保持上下文连贯，避免重复问已知信息。
- 若 `memory_search` 无结果，输出：「未找到相关历史记忆，将基于当前上下文继续。」
- 若用户明确说「跳过记忆」，则跳过。

## 优先级 1：Prompt 优化判断
- 当用户需求模糊、过短、缺少关键约束时，触发 `promptenhancer`。
- 展示优化后的提示词，用户确认后继续执行。
- 若用户说「直接干」或「别优化」，则跳过。
- 对明确单步请求（如重命名、执行单条命令、改一个字段）不触发。

## 优先级 2：场景自动路由

### 新功能 / 复杂任务
- `memory_search` → `promptenhancer`（如需）→ 方案设计 → 代码实现 → `memory_store`（此处即为优先级 3 的执行，不再重复触发）

### API / 接口开发
- `refresh_project_oas_{动态}` → `read_project_oas_{动态}` → 生成代码
- 若 refresh 失败，输出：「刷新 OAS 失败，尝试读取本地缓存版本。错误信息：[具体原因]」→ 回退为读取已有 OAS
- 若回退也失败，基于现有代码上下文继续，并显式列出假设

### 文件操作
- `write_file` 前先 `read_file` 检查文件是否存在
- 若文件存在且非覆盖场景，使用 `edit_file` 而非覆盖
- 其他：`read_file` / `create_directory`
- 检查目录是否存在时，使用 `list_directory` 而非 `read_file`

### 代码或文件查找
- `search_files` 或 `list_directory`

### 目录浏览
- `directory_tree`

### 记忆相关操作
- 存储：`memory_store`（见优先级 2.5 去重规则）
- 更新：`memory_update`（同一会话相同 topic 复用）
- 回忆：`memory_search`
- 统计：`memory_stats`
- 整理：`memory_harvest`
- 图谱：`memory_graph`
- 会话学习：`learning_session`

## 优先级 2.5：记忆存储去重规则
- 同一会话中，相同 `topic` 的 `memory_store` 只执行一次。
- 首次存储：使用 `memory_store`。
- 后续更新：使用 `memory_update`（基于首次存储的记忆 ID），而非新增重复记忆。
- 首次 `memory_store` 返回的 ID 由模型在当前会话中维护；后续同 topic 的 `memory_update` 使用该 ID。若 ID 丢失，退化为新建 `memory_store`。
- 存储键建议：`topic + decision + date`（用于去重判断）。
- 避免写入临时日志、调试信息、临时变量值等噪音内容。只存储：
  - 技术决策
  - 架构选择
  - 问题解决方案
  - 用户偏好/约束

## 优先级 3：任务完成
- 在关键里程碑调用 `memory_store`，记录：
  - 做了什么决策
  - 采用了什么技术方案
  - 遇到什么问题、如何解决
- 若优先级 2 链路末尾已执行 `memory_store`，则优先级 3 不再重复触发。

## 澄清与回退规则
- 若缺少必要上下文，**只提一个聚焦的澄清问题**，不追问多条。
- 若目标 MCP 工具不可用，选择最接近的可用工具并简要说明。
- 若文件操作因权限/路径失败，输出明确错误信息和建议操作。

## 其他可用工具（按需使用）
以下工具未纳入主流程，但在特定场景下可手动或按需调用：
- 冲突检测与解决：`memory_conflicts` / `memory_resolve`
- 质量与健康检查：`memory_quality` / `memory_health`
- 清理与删除：`memory_cleanup` / `memory_delete`
- 导出知识：`knowledge_export`
- 批量导入：`memory_ingest`
- 记忆列表：`memory_list`
- 记忆审查：`memory_review` / `memory_analysis`
- 会话级存储：`memory_store_session`

## 异常处理汇总

| 异常场景 | 行为 |
|---------|------|
| `memory_search` 无结果 | 输出提示，继续执行 |
| `memory_update` 的 ID 丢失 | 退化为新建 `memory_store` |
| OAS refresh 失败 | 输出错误，回退读取缓存 |
| OAS 回退也失败 | 输出假设列表，基于代码上下文继续 |
| 文件已存在（非覆盖） | 使用 `edit_file` 或提示用户 |
| 写文件前无 read 检查 | **禁止**直接覆盖 |
| 检查目录是否存在 | 使用 `list_directory`，不用 `read_file` |
| 同一 topic 重复记忆 | 用 `memory_update` 而非新增 |
| 优先级 2 已执行 store | 优先级 3 不再重复触发 |
| 澄清问题过多 | 只发 1 个聚焦问题 |
| MCP 工具不可用 | 选最接近可用工具并说明 |
| 文件操作权限/路径失败 | 输出错误信息和建议操作 |

## 示例
- 用户：「帮我做一个用户登录 API」
  - `memory_search(登录, API, 认证)` → 无结果时输出提示 → `refresh_project_oas_5htfn2`（失败时输出错误并回退） → 实现 → `memory_store`
- 用户：「记住项目用 PostgreSQL」
  - 首次：`memory_store(项目使用 PostgreSQL)`
  - 同会话再次：「记住 Postgres 端口是 5432」→ 使用 `memory_update`（复用首次返回的记忆 ID）
- 用户：「我们之前用什么数据库？」
  - `memory_search(数据库)`
- 用户：「帮我创建 src/utils 目录」
  - `list_directory` 检查目录是否存在 → `create_directory(src/utils)`（若已存在，告知用户并跳过）
```
