# Headroom MCP

> Server: `user-headroom_mcp` / `headroom_mcp`  
> Underlying service: [Serve · Headroom](../servers/headroom.md)

Cross-cutting context compression: shrink large outputs, reversible retrieval. Not a P-stage.

## Tools

| Tool | Purpose |
| ---- | ------- |
| `headroom_compress(content)` | Compress text; returns view + `hash` |
| `headroom_retrieve(hash, query?)` | Retrieve original by hash; optional filter |
| `headroom_stats()` | Session stats — **only when user asks about token savings** |

## When to Compress / Skip

| Compress | Skip |
| -------- | ---- |
| ≥400 lines or ≥8KB, needed across steps | Small one-shot output |
| Long logs, JSON, RAG chunks | **Code about to be edited** |
| Context window pressure | Credentials / secrets |

## Consumption Rules

- Compressed view is derivative; authority: **user instruction > repo code > compressed summary**
- Need exact line numbers / API contracts → `headroom_retrieve` first
- Unavailable / failed → skip compression, use original; **do not block**

## Examples

```text
Analyze this 2000-line log for anomalies
```

## Related

- [Workflow Core · Context compression](../agent-workflow/mcp-core#context-compression-headroom)
- [Routing · Headroom](../agent-workflow/mcp-routing#context-compression-user-headroom_mcp)
