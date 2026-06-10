# Codegraph

> 底层服务 · [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)

Codegraph 是**预索引的代码知识图谱**，为 Claude Code、Cursor、Codex、Gemini 等 Agent 提供语义代码智能：更少 token、更少工具调用、100% 本地运行。

## 与工作流的分工

| 来源 | 回答什么 |
| ---- | -------- |
| LightRAG | 为什么这样设计（跨会话决策） |
| **Codegraph** | 在哪用、谁调谁、改它波及谁 |
| Grep | 精确字符串 / i18n key / 错误文案 |

## 快速开始

### 1. 安装 CLI

```bash
npm install -g @colbymchenry/codegraph
# 或一次性运行
npx @colbymchenry/codegraph
```

### 2. 接入 Agent

```bash
codegraph install
```

自动检测并配置 Claude Code、Cursor、Codex CLI、OpenCode、Gemini 等，将 Codegraph MCP server 写入各 Agent 配置。

### 3. 初始化项目

```bash
cd your-project
codegraph init -i
```

生成 `.codegraph/` 索引目录。**未初始化时 MCP 工具不可用**，工作流回退 Grep + Read。

### 4. 重启 Agent

重启 Cursor 等宿主，使 MCP server 加载。

## 工作原理

```
源代码文件
    ↓ 索引（tree-sitter 解析）
.codegraph/ 本地 SQLite 图谱
    ↓ MCP serve
codegraph_explore / search / callers / impact …
```

- **Auto-Sync**：MCP server 监听 OS 文件事件，2 秒防抖后增量同步
- **Stale 标记**：索引滞后时，响应标注待同步文件，Agent 仅对这些文件用 Read 校对
- **Connect-time catch-up**：MCP 重连时自动对 working tree 做增量同步

## CLI 常用命令

```bash
codegraph init -i          # 交互式初始化并索引
codegraph index --force    # 强制重建索引
codegraph sync             # 手动同步变更
codegraph status           # 索引健康检查
codegraph serve --mcp      # 启动 MCP server（stdio）
codegraph uninit           # 移除项目索引
codegraph uninstall        # 从 Agent 移除 MCP 配置
```

## 团队部署

| 组件 | 说明 |
| ---- | ---- |
| 启动脚本 | `StartScript/MCP_Codegraph_serve.sh` |
| 默认端口 | `9623`（HTTP 桥接） |
| 项目目录 | 按脚本内 `PROJECT_DIR` 配置 |

```bash
bash StartScript/MCP_Codegraph_serve.sh
```

Cursor 中 server 名可能显示为 `project-0-ui-codegraph` 或 `codegraph`，二者等价。

## MCP 工具一览

| 工具 | 用途 |
| ---- | ---- |
| `codegraph_explore` | 理解逻辑/流程/架构（**首选，通常 1 次**） |
| `codegraph_search` | 查找符号位置 |
| `codegraph_callers` / `codegraph_callees` | 调用链 |
| `codegraph_impact` | 重构影响面 |
| `codegraph_node` | 单符号完整实现 |
| `codegraph_files` | 已索引目录结构 |
| `codegraph_status` | 索引健康（故障时） |

详见 [MCP Tools · Codegraph](../mcp-tools/codegraph.md)。

## 支持的语言与 Agent

- **语言**：TypeScript/JavaScript、Python、Go、Rust、Java、C/C++、Swift、Kotlin 等
- **Agent**：Claude Code、Cursor、Codex CLI、OpenCode、Gemini CLI、Antigravity、Kiro、Hermes Agent

## 故障排查

| 现象 | 处理 |
| ---- | ---- |
| 「项目未初始化（无 `.codegraph/`）」 | 运行 `codegraph init -i` |
| MCP 连接失败 | 确认项目已索引；命令行测试 `codegraph serve --mcp` |
| 符号缺失 | 等待 2 秒自动同步，或 `codegraph sync` |
| `database is locked` | 重启 MCP server；检查是否有多个实例 |

## 相关链接

- [GitHub 仓库](https://github.com/colbymchenry/codegraph)
- [MCP Tools 参考](../mcp-tools/codegraph.md)
- [工作流 · 代码理解](../agent-workflow/mcp-routing#代码理解)
