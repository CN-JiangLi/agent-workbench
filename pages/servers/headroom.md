# Headroom

> Serve layer · [chopratejas/headroom](https://github.com/chopratejas/headroom)

Compresses tool outputs, logs, files, and RAG chunks **before** they reach the LLM — typically **60–95% fewer tokens**, **reversible** (original kept locally, retrieve by hash).

## Workflow Role

Cross-cutting capability, not a P-stage:

- Does **not** replace LightRAG / Codegraph / Grep — compresses their large outputs
- Does **not** produce content
- Consider `headroom_compress` at ≥400 lines or ≥8KB when reused across steps
- **Do not compress** code about to be edited
- **Never** send credentials / secrets

See [Workflow Core · Context compression](../agent-workflow/mcp-core#context-compression-headroom).

## Integration Modes

| Mode | Description |
| ---- | ----------- |
| Library | Python library |
| Proxy | OpenAI-compatible proxy |
| **MCP Server** | `headroom_compress` / `headroom_retrieve` / `headroom_stats` |

This workflow uses **MCP Server**.

## Install

```bash
pip install "headroom-ai[all]"
pipx install --python python3.13 "headroom-ai[all]"
```

## MCP Tools

| Tool | Purpose |
| ---- | ------- |
| `headroom_compress(content)` | Compress; returns view + `hash` |
| `headroom_retrieve(hash, query?)` | Retrieve original |
| `headroom_stats()` | Stats — user asks only |

## Team Deployment

| Component | Notes |
| --------- | ----- |
| Script | `StartScript/MCP_Headroom_start.sh` |
| Port | `9624` |
| Backend | `headroom mcp serve` |

Server names: `user-headroom_mcp` or `headroom_mcp` — equivalent. Unconfigured → skip compression, no block.

## When to Use / Skip

| Use | Skip |
| --- | ---- |
| Large logs, JSON, RAG chunks | Small one-shot output |
| Context window pressure | Code to be edited |
| | Secrets |

## Related

- [GitHub](https://github.com/chopratejas/headroom)
- [MCP docs](https://headroom-docs.vercel.app/docs/mcp)
- [MCP Tools](../mcp-tools/headroom.md)
