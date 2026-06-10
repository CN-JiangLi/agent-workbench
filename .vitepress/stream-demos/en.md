# Simulated Task: Implement Workflow List Filter per Knowledge Base

> User input: `Per knowledge base standards, add status filter to app-center Workflow list`

---

## Step 0 · Decision Tree

```
Message mentions "knowledge base" → P0 mandatory first (hard gate)
  → P0.5 Elements (check availability)
  → P1 promptenhancer (requirement clear enough — skip)
  → P2 scenario routing
  → ⟂ Headroom (cross-cutting on large output)
  → verification-before-completion before done
  → P3 milestone ingestion
```

---

## Steps 1–2 · P0 Knowledge Retrieval

**Intent**: Retrieve cross-session architecture decisions before reading code.

| Field | Value |
| ----- | ----- |
| MCP Server | `user-daniel_lightrag_mcp` |
| Underlying service | LightRAG API `http://127.0.0.1:9621` (via `MCP_LightRAG_start.sh` bridge) |
| Tool | `query_text` |
| Params | `query="app-center Workflow list filter UI standards"`, `mode=hybrid`, `only_need_context=true` |

**Result summary**: 3 hits; adopted 2 key conclusions:
1. `[date: 2026-05-20]` List pages must use `UIStandardLayout` + standard filter bar
2. `[date: 2026-06-01]` MSP/tenant view differences follow **current code** (ignored older column-default memory)

---

## Step 3 · P0.5 Elements (Optional)

| Field | Value |
| ----- | ----- |
| MCP Server | `Elements` |
| Tool | `get_project_guidance` |
| Result | **Not configured** → skip P0.5 |

**Fallback**: `agents-workflow` + minimal code read + assumption list; task continues.

---

## Steps 4–5 · P2 Code Understanding (Codegraph)

**Intent**: Understand app-center call graph and filter-related module boundaries.

| Field | Value |
| ----- | ----- |
| MCP Server | `project-0-ui-codegraph` |
| Underlying service | Codegraph (local `.codegraph/` SQLite graph, via `MCP_Codegraph_serve.sh` :9623) |
| Tool | `codegraph_explore` |
| Params | `query="app-center Workflow list filter"` |

**Result summary**: Returns `WorkflowList.vue`, `useWorkflowFilter.ts`, `workflowApi.getList` call chain; includes 2 file snippets (not stale).

**Follow-up**: No Grep+Read on same files (anti-pattern forbidden).

---

## Step 6 · P2 File Read (Filesystem)

| Field | Value |
| ----- | ----- |
| MCP Server | `user-filesystem` |
| Tool | `read_text_file` |
| Path | `src/pages/app-center/WorkflowList.vue` (type check outside stale set) |

**Result**: Success, 128 lines.

---

## Steps 7–9 · Implementation (MCP edit_file)

| Step | Tool | Notes |
| ---- | ---- | ----- |
| 7 | `list_directory` | Confirm `src/components/workflow/` exists |
| 8 | `read_text_file` | Read `useWorkflowFilter.ts` (required before write) |
| 9 | `edit_file` | Add `status` filter field and API param |

**Merged summary (to user)**: Steps 1–9: KB retrieval, Codegraph explore, config read, filter implementation → all succeeded.

---

## Step 10 · ⟂ Headroom Cross-Cutting (large tsc output)

**Trigger**: `tsc --noEmit` output 420 lines, needed across multiple reasoning steps.

| Field | Value |
| ----- | ----- |
| MCP Server | `user-headroom_mcp` |
| Underlying service | Headroom (`headroom mcp serve`, via `MCP_Headroom_start.sh` :9624) |
| Tool | `headroom_compress` |
| Returns | Compressed view + `hash=a7f3c2` |

For exact line numbers → `headroom_retrieve(hash=a7f3c2, query="WorkflowList")`.

---

## Step 11 · Superpowers · verification-before-completion

**Default gate**: Full verification before claiming done.

- `pnpm typecheck` → pass
- `pnpm lint` → pass
- Manual: MSP / tenant view filter toggle → pass

---

## Steps 12–13 · P2.5 / P3 Milestone Ingestion

| Field | Value |
| ----- | ----- |
| MCP Server | `user-daniel_lightrag_mcp` |
| Tool | `insert_text` |
| Body prefix | `[tags: decision,ui] [type: decision] [date: 2026-06-10]` |
| Track | `get_track_status(track_id)` → **success** |

---

## MCP / Service Map for This Task

| Stage | MCP Server | Tools | Underlying Serve |
| ----- | ---------- | ----- | ---------------- |
| P0 | `user-daniel_lightrag_mcp` | `query_text` | LightRAG |
| P0.5 | Elements (skipped) | — | — |
| P1 | — (skipped) | — | — |
| P2 code | `project-0-ui-codegraph` | `codegraph_explore` | Codegraph |
| P2 files | `user-filesystem` | `read_text_file`, `edit_file`, `list_directory` | filesystem MCP |
| ⟂ compress | `user-headroom_mcp` | `headroom_compress`, `headroom_retrieve` | Headroom |
| Verify | Superpowers | `verification-before-completion` | — |
| P3 | `user-daniel_lightrag_mcp` | `insert_text`, `get_track_status` | LightRAG |

**Not used**: `cursor-ide-browser` (user did not ask), `user-prompt-optimizer` (clear requirement), `memory_*` / OAS MCP (deprecated routes).

---

## Configured MCP Matrix (6)

| Server | Representative tools |
| ------ | -------------------- |
| `user-daniel_lightrag_mcp` | `query_text`, `insert_text`, `get_track_status` |
| `user-filesystem` | `read_text_file`, `edit_file`, `list_directory` |
| `user-prompt-optimizer` | `promptenhancer` |
| `project-0-ui-codegraph` | `codegraph_explore`, `codegraph_impact` |
| `user-headroom_mcp` | `headroom_compress`, `headroom_retrieve` |
| `cursor-ide-browser` | `browser_navigate`, `browser_snapshot` (explicit user request only) |

**Task complete** ✓
