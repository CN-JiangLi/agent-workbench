# Headroom

> 底层服务 · [chopratejas/headroom](https://github.com/chopratejas/headroom)

Headroom 在内容进入 LLM 推理前**压缩**工具输出、日志、文件和 RAG chunk，通常可减少 **60–95% token**，且压缩**可逆**（原文本地留存，凭 hash 取回）。

## 与工作流的关系

Headroom 是**横切能力**，不占 P 编号：

- **不替代** LightRAG / Codegraph / Grep — 只压缩这些来源产出的大输出
- **不产生内容** — 仅压缩已获取的文本
- 约 ≥400 行或 ≥8KB 且需多步复用时考虑 `headroom_compress`
- **编辑前不压缩**将要精确编辑的代码
- 凭证 / 密钥**不送入**压缩

详见 [工作流核心 · 上下文压缩](../agent-workflow/mcp-core#上下文压缩-headroom-横切能力非-p-阶段)。

## 三种接入方式

| 方式 | 说明 |
| ---- | ---- |
| **Library** | Python 库，嵌入自定义流水线 |
| **Proxy** | OpenAI 兼容代理，透明压缩请求/响应 |
| **MCP Server** | `headroom_compress` / `headroom_retrieve` / `headroom_stats` |

本工作流使用 **MCP Server** 方式。

## 安装

```bash
pip install "headroom-ai[all]"
# 或使用 pipx（推荐指定 Python 版本）
pipx install --python python3.13 "headroom-ai[all]"
```

## MCP 工具

| 工具 | 作用 |
| ---- | ---- |
| `headroom_compress(content)` | 压缩文本，返回压缩视图 + `hash` |
| `headroom_retrieve(hash, query?)` | 凭 hash 取回原文；可选 `query` 局部过滤 |
| `headroom_stats()` | 会话压缩统计 — **仅用户询问时**调用 |

### 消费与回取

- 压缩结果是**派生视图**；权威优先级：**用户指令 > 仓库代码 > 压缩摘要**
- 需精确行号 / API 契约时，先 `headroom_retrieve` 核对
- 看到 `[N items compressed... hash=abc123]` 标记时，用 hash 取回细节

## 团队部署

| 组件 | 说明 |
| ---- | ---- |
| 启动脚本 | `StartScript/MCP_Headroom_start.sh` |
| 默认端口 | `9624`（HTTP 桥接） |
| 后端命令 | `headroom mcp serve`（stdio） |

```bash
bash StartScript/MCP_Headroom_start.sh
```

Cursor 中 server 名可能显示为 `user-headroom_mcp` 或 `headroom_mcp`，二者等价。

未配置时工作流自动降级：跳过压缩，直接用原文，**不阻塞**任务。

## 何时使用 / 何时跳过

| 使用 | 跳过 |
| ---- | ---- |
| 大段日志、JSON、RAG 多 chunk 需多步推理 | 小输出、一次性消费 |
| 上下文接近窗口压力 | 将要精确编辑的代码 |
| 批量检索结果需边读边推理 | 凭证 / 密钥 / 敏感数据 |

## 相关链接

- [GitHub 仓库](https://github.com/chopratejas/headroom)
- [官方 MCP 文档](https://headroom-docs.vercel.app/docs/mcp)
- [MCP Tools 参考](../mcp-tools/headroom.md)
