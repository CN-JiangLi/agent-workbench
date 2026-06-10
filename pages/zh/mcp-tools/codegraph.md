# Codegraph MCP

> Server：`project-0-ui-codegraph` / `codegraph`  
> 底层服务：[Serve · Codegraph](../servers/codegraph.md)

仓库代码图谱：符号位置、调用链、影响面。位于 P0/P0.5/P1 之后、大范围 Grep 之前。

## 工具列表

| 工具 | 用途 |
| ---- | ---- |
| `codegraph_explore` | 理解逻辑/流程/架构（**首选，通常 1 次**） |
| `codegraph_search` | 查找符号位置（可加 `kind`） |
| `codegraph_callers` | 谁调用了这个符号 |
| `codegraph_callees` | 这个符号调用了谁 |
| `codegraph_impact` | 修改前的波及范围 |
| `codegraph_node` | 单符号完整实现（`includeCode: true`） |
| `codegraph_files` | 已索引目录结构 |
| `codegraph_status` | 索引健康（**故障时**，非每会话） |

## 触发条件

**触发**（满足任一）：

- 新功能 / 重构 / API，需理解调用关系
- Bug 需追调用链
- 「在哪被调用」「修改会影响哪些」「XX 用在哪」
- 用户说「用 codegraph 查」

**不触发**：

- 纯新建文件、无既有依赖
- 简单单文件修改（用户已给 `file:line`）
- 纯字符串替换、改配置
- 未初始化（无 `.codegraph/`）→ 提示 `codegraph init -i`
- 用户说「跳过 codegraph」

## 硬约束

- **禁止**：`explore` 已返回源码后，再对同一文件 Grep + Read
- **禁止**：循环 `codegraph_node`；改用一次 `explore`
- stale 文件才用 Read 校对，其余信 codegraph
- **不用** codegraph 替代写文件、跑测试、lint

## codegraph_status 何时调

**不**在会话开始或每次 explore 前调用。仅在：

- explore 结果明显不完整
- 响应含 stale/索引错误
- 连续 explore 失败

## 使用示例

```text
app-center 筛选功能的调用链是怎样的？
```

```text
修改 UserService.login 会影响哪些地方？
```

```text
WorkflowList 组件在哪些地方被引用？
```

## 相关

- [场景路由 · 代码理解](../agent-workflow/mcp-routing#代码理解-project-0-ui-codegraph)
- [Serve · Codegraph 安装](../servers/codegraph.md)
