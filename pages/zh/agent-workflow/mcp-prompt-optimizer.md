# MCP 工作流 · Prompt 优化（P1）

**Server / 工具**：`user-prompt-optimizer` · `promptenhancer`（参数：`originalPrompt` / `optimizedPrompt`，二者均为可选 string，按轮次传其一）。

## 与 P0 的次序（硬约束）

- P0（知识检索）**先于** P1。若同时命中：先 `query_text`（见 `mcp-core.mdc`「显式触发 / 常规触发」），再 `promptenhancer`。
- 用户提「知识库 / LightRAG / daniel_lightrag」时，**不得**用 P1 替代或前置于 P0。

## 触发

需求模糊、过短、缺少关键约束。

## 不触发

- 「直接干」「别优化」
- 明确单步（改字段、重命名、单条命令）
- Bug（有堆栈/文件/复现）
- 用户已提供完整 spec / YAML / 接口说明
- 纯只读任务（规则评审、概念解释、代码 review、检查类）——与 `mcp-core.mdc` 负向清单对齐

## 与 brainstorming

**二选一，不叠用**：模糊需求优先 `promptenhancer`；多方案对比用 `brainstorming`（见 `superpowers-triggers.mdc`）。

## 两轮流程

1. **第一轮**：`originalPrompt="<用户原始需求>"` → 优化指南（勿把指南当终稿结束任务）。
2. **第二轮**：`optimizedPrompt="<按指南整理后的提示>"` → 可执行终稿。

## 快速路径（默认）

同一轮内完成两轮后**直接实现**；仅当产品取舍、安全、多方案需拍板时，暂停展示终稿待确认。

## 跳过第一轮

用户已提供优化后提示词时，直接第二轮。
