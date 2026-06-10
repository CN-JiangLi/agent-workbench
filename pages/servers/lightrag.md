# LightRAG

> Serve layer · [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG) · [README (zh)](https://github.com/HKUDS/LightRAG/blob/main/README-zh.md)

LightRAG is a simple, fast Retrieval-Augmented Generation framework with a **dual-layer architecture** managing both knowledge graphs (KG) and vector embeddings. Suited for legal, medical, financial document analysis; an efficient alternative to GraphRAG.

## Key Features

| Capability | Description |
| ---------- | ----------- |
| Deep context | Graph indexing captures semantic dependencies between entities |
| Dual-level retrieval | Combines detailed facts and abstract concepts |
| Efficient & low-cost | Fewer LLM calls during index and query |
| Incremental updates | New data merges into existing graph without full rebuild |
| Multimodal (v1.5+) | MinerU / Docling for PDF, images, tables, formulas |

## Query Modes

| Mode | Use |
| ---- | --- |
| `local` | Local entities and direct attributes |
| `global` | Macro topics, cross-document relations |
| `hybrid` | local + global (**workflow P0 default**) |
| `naive` | Vector chunks only, no KG |
| `mix` | Full fusion (**LightRAG server default**) |

::: tip Workflow
P0 `query_text` uses `mode: hybrid`, `only_need_context: true`. See [MCP Tools · LightRAG](../mcp-tools/lightrag.md).
:::

## Installation

### uv (recommended)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install "lightrag-hku[api]"
```

### From source

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG && make dev && source .venv/bin/activate
cd lightrag_webui && bun install --frozen-lockfile && bun run build && cd ..
make env-base
lightrag-server
```

### Docker Compose

```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG && cp env.example .env && docker compose up
```

## Key Configuration

- **Four LLM roles**: EXTRACT, QUERY, KEYWORDS, VLM — configure per role
- **Embedding**: Must be fixed before indexing; cannot change at query time; recommend `BAAI/bge-m3` locally
- **Rerank**: Improves quality; adds ~1–2s; deploy locally when possible

## Team Deployment

| Component | Path | Notes |
| --------- | ---- | ----- |
| LightRAG API | `Project/LightRAG` | `lightrag-server`, default `http://127.0.0.1:9621` |
| daniel-lightrag-mcp | `Project/daniel-lightrag-mcp` | MCP bridge, 22 tools |
| Start script | `StartScript/MCP_LightRAG_start.sh` | HTTP bridge, port `9622` |

```bash
cd Project/LightRAG && lightrag-server
bash StartScript/MCP_LightRAG_start.sh
```

```json
{ "daniel-lightrag": { "url": "http://127.0.0.1:9622/mcp/" } }
```

## Related

- [GitHub](https://github.com/HKUDS/LightRAG) · [arXiv](https://arxiv.org/abs/2410.05779)
- [MCP Tools](../mcp-tools/lightrag.md) · [Host setup](../mcp-tools/host-setup.md)
