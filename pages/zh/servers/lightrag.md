# LightRAG

> 底层服务 · [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG) · [中文 README](https://github.com/HKUDS/LightRAG/blob/main/README-zh.md)

LightRAG 是简单且快速的检索增强生成（RAG）框架，采用**双层架构**同时管理知识图谱（KG）和向量嵌入，适合法律、医疗、金融等复杂文档分析，也是 GraphRAG 的高效替代方案。

## 核心特点

| 能力 | 说明 |
| ---- | ---- |
| 深度上下文理解 | 图结构索引捕捉实体间语义依赖，克服传统分块检索上下文割裂 |
| 双层检索 | 同时整合详细事实与抽象概念，查询全面性与多样性更好 |
| 高效低成本 | 减少索引与查询阶段 LLM 调用，降低延迟与算力成本 |
| 增量更新 | 新数据经局部图谱合并融入现有图谱，无需重建全局索引 |
| 多模态（v1.5+） | 支持 MinerU / Docling 解析 PDF、图片、表格、公式 |

## 查询模式

| 模式 | 用途 |
| ---- | ---- |
| `local` | 局部实体与直接关联属性 |
| `global` | 宏观主题、跨文档关系链 |
| `hybrid` | 融合 local + global（**工作流 P0 默认**） |
| `naive` | 纯向量块检索，不用知识图谱 |
| `mix` | 全功能，融合三种模式（LightRAG 服务端默认） |

::: tip 与工作流的关系
Agent 工作流 P0 调用 `query_text` 时默认 `mode: hybrid`、`only_need_context: true`。详见 [MCP Tools · LightRAG](../mcp-tools/lightrag.md)。
:::

## 安装

### 使用 uv（推荐）

```bash
# 安装 uv（macOS/Linux）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装 LightRAG 服务器（含 API）
uv tool install "lightrag-hku[api]"
```

### 从源码安装

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
make dev
source .venv/bin/activate
cd lightrag_webui && bun install --frozen-lockfile && bun run build && cd ..
make env-base   # 或 cp env.example .env 后手动配置
lightrag-server
```

### Docker Compose

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
cp env.example .env
docker compose up
```

## 关键配置

### LLM 四角色

LightRAG 需要 4 种角色的 LLM/VLM：**EXTRACT**、**QUERY**、**KEYWORDS**、**VLM**。建议为不同角色配置不同能力/速度的模型。详见官方 [RoleSpecificLLMConfiguration-zh.md](https://github.com/HKUDS/LightRAG/blob/main/docs/RoleSpecificLLMConfiguration-zh.md)。

### Embedding 模型

- 索引前必须确定 Embedding 模型，查询阶段**不可更换**
- 推荐本地部署，如 `BAAI/bge-m3`
- 更换模型需重建向量表

### Rerank

查询阶段开启 Rerank 可显著提高质量，通常增加 1～2 秒延迟。建议本地部署 Rerank 模型。

## 团队部署

本仓库通过以下组件接入 LightRAG：

| 组件 | 路径 | 说明 |
| ---- | ---- | ---- |
| LightRAG API | `Project/LightRAG` | `lightrag-server`，默认 `http://127.0.0.1:9621` |
| daniel-lightrag-mcp | `Project/daniel-lightrag-mcp` | MCP 桥接，22 个工具 |
| 启动脚本 | `StartScript/MCP_LightRAG_start.sh` | HTTP 桥接，默认端口 `9622` |

### 启动 MCP 桥接

```bash
# 1. 先启动 LightRAG API
cd Project/LightRAG && lightrag-server

# 2. 启动 MCP HTTP 桥接
bash StartScript/MCP_LightRAG_start.sh
```

Cursor `mcp.json` 示例：

```json
{
  "daniel-lightrag": {
    "url": "http://127.0.0.1:9622/mcp/"
  }
}
```

## API 与 WebUI

LightRAG 服务器提供 Web UI 和完整 REST API。详见官方 [LightRAG-API-Server-zh.md](https://github.com/HKUDS/LightRAG/blob/main/docs/LightRAG-API-Server-zh.md)。

## 相关链接

- [GitHub 仓库](https://github.com/HKUDS/LightRAG)
- [arXiv 论文](https://arxiv.org/abs/2410.05779)
- [MCP Tools 参考](../mcp-tools/lightrag.md)
- [宿主配置](../mcp-tools/host-setup.md)
