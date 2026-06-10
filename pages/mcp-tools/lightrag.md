# LightRAG MCP

> Server: `user-daniel_lightrag_mcp` / `daniel_lightrag_mcp`  
> Underlying service: [Serve · LightRAG](../servers/lightrag.md)

Cross-session knowledge base for **P0 retrieval**, **P2.5 storage**, and **P3 milestone ingestion**.

## Daily Tools

| Tool | Stage | Notes |
| ---- | ----- | ----- |
| `query_text` | P0 | `mode: hybrid`; **default** `only_need_context: true` |
| `insert_text` | P2.5/P3 | Prefix: `[tags: …] [type: …] [date: …]` |
| `insert_texts` | P2.5 | Batch; each item: `title` + `content` + optional `metadata` |
| `get_track_status` | P2.5/P3 | **Required** for milestone ingestion confirmation |
| `check_entity_exists` | P2.5 | Optional before "remember / update decision" |

### query_text Parameters

| Param | Recommended | Notes |
| ----- | ----------- | ----- |
| `query` | Keywords from user input | Natural-language question |
| `mode` | `hybrid` | Entity-local: `local`; global: `global`; simple: `naive` |
| `only_need_context` | **`true` (must pass explicitly)** | Context only; pass `false` when user wants a direct answer |

### insert_text Body Format

```
[tags: decision,api] [type: decision] [date: 2026-06-10]
<decision body>
```

### Milestone Tags

| Must track | May skip track |
| ---------- | -------------- |
| `decision`, `api`, `preference`, `plan`, `ui`, `architecture` | `brainstorming`, `debug`, `note`, `wip` |

`upload_document` always requires track.

## On-Demand Tools

| Tool | When |
| ---- | ---- |
| `upload_document` | File ingestion |
| `get_documents` / `get_documents_paginated` | Browse documents |
| `get_document_status_counts` | Ops statistics |
| `get_knowledge_graph` / `get_graph_labels` | Structure review |
| `scan_documents` | Trigger scan |
| `get_health` | After **2 consecutive failures**; not every session |
| `update_entity` / `update_relation` | Graph edits (need ID); **use new insert_text for body changes** |
| `delete_*` | Ops cleanup (user confirmation required) |
| `query_text_stream` | Long-answer scenarios |

## Explicit Trigger (Hard Gate)

User message contains **knowledge base** / **LightRAG** / **daniel_lightrag** → **first step** `query_text`, before reading code, P1, or implementation.

## Failure Diagnosis

`query_text` / `insert_text` **fails twice in a row** → `get_health` → if still failing, skip knowledge-base steps.

## Examples

```text
Implement user login API per knowledge base standards
```

```text
Remember: project uses PostgreSQL on port 5432
```

## Related

- [Workflow Core · P0](../agent-workflow/mcp-core#p0-knowledge-retrieval)
- [Workflow Core · P2.5](../agent-workflow/mcp-core#p25-knowledge-storage)
- [Routing · Knowledge base](../agent-workflow/mcp-routing#knowledge-base-user-daniel_lightrag_mcp)
