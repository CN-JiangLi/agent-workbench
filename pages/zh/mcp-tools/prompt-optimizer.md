# Prompt Optimizer MCP

> Server：`user-prompt-optimizer`  
> 工作流阶段：**P1**

两轮提示优化，将模糊需求转化为可执行终稿。

## 工具

| 工具 | 参数 | 说明 |
| ---- | ---- | ---- |
| `promptenhancer` | `originalPrompt` | 第一轮：提交原始需求 → 优化指南 |
| `promptenhancer` | `optimizedPrompt` | 第二轮：提交整理后提示 → 可执行终稿 |

## 与 P0 的次序

- P0 **先于** P1
- 用户提「知识库」时，**不得**用 P1 替代 P0

## 触发 / 不触发

| 触发 | 不触发 |
| ---- | ------ |
| 需求模糊、过短、缺约束 | 「直接干」「别优化」 |
| | 明确单步、Bug（有堆栈）、完整 spec |
| | 纯只读任务 |

## 与 brainstorming

**二选一**：模糊需求 → `promptenhancer`；多方案对比 → `brainstorming`

## 两轮流程

1. `originalPrompt="<用户原始需求>"` → 优化指南
2. `optimizedPrompt="<按指南整理后的提示>"` → 终稿 → **直接实现**

默认同一轮完成两轮后直接实现；仅产品取舍需拍板时暂停确认。

## 安装

```bash
npm install -g prompt-ops-mcp
```

`mcp.json`：

```json
{
  "user-prompt-optimizer": {
    "command": "npx",
    "args": ["prompt-ops-mcp"]
  }
}
```

## 使用示例

```text
请先使用 promptenhancer，originalPrompt="帮我做一个用户登录功能"
```

```text
请继续调用 promptenhancer，optimizedPrompt="实现用户登录 API：邮箱+密码、JWT、错误码规范…"
```

## 相关

- [工作流 · P1](../agent-workflow/mcp-prompt-optimizer)
