# MCP Tools Overview

> Quick reference for MCP servers and tools used in workflow rules. Always follow the host's actually loaded MCP descriptors.

## Configured Servers (6)

| Server | Alias | Purpose | Doc |
| ------ | ----- | ------- | --- |
| `user-daniel_lightrag_mcp` | `daniel_lightrag_mcp` | Cross-session knowledge base (P0/P2.5/P3) | [LightRAG](./lightrag.md) |
| `user-filesystem` | `filesystem` | Default file I/O | [Filesystem](./filesystem.md) |
| `user-prompt-optimizer` | `prompt-optimizer` | P1 prompt optimization | [Prompt Optimizer](./prompt-optimizer.md) |
| `project-0-ui-codegraph` | `codegraph` | Code knowledge graph | [Codegraph](./codegraph.md) |
| `user-headroom_mcp` | `headroom_mcp` | Context compression (cross-cutting) | [Headroom](./headroom.md) |
| `cursor-ide-browser` | — | Browser automation | [Browser](./browser.md) |

**Alias rule**: Never skip a call because of `user-` prefix differences. Use the name shown in the host MCP list; capability alignment is what matters.

## Optional / Not Configured

| Server | Notes |
| ------ | ----- |
| `Elements` | P0.5 UI guidance (`get_project_guidance`); skip if unavailable |
| `user-memory-service` | Migrated to LightRAG — **do not** use `memory_*` |
| `user-ads-mcp` / `user-forge` / `user-mcp-code-gen-kd` | Not routed |
| Apifox OAS | **Do not** use `refresh_project_oas_*` / `read_project_oas_*` |

## Workflow Stage → Tool Mapping

```
P0   query_text                          → LightRAG
P0.5 get_project_guidance               → Elements (optional)
P1   promptenhancer                      → Prompt Optimizer
P2   codegraph_* / filesystem / browser  → Scenario routing
⟂    headroom_compress / retrieve        → Headroom (cross-cutting)
P2.5 insert_text / get_track_status     → LightRAG
P3   insert_text + track                 → LightRAG
```

## Host Setup

New environment onboarding, whitelist, and `mcp.json` → [Host Setup Checklist](./host-setup.md).

## Underlying Services

| Service | Doc |
| ------- | --- |
| LightRAG RAG engine | [Serve · LightRAG](../servers/lightrag.md) |
| Codegraph code graph | [Serve · Codegraph](../servers/codegraph.md) |
| Headroom compression | [Serve · Headroom](../servers/headroom.md) |
