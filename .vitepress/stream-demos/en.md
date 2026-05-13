# Simulated run: agent executes Full-Workflow once

> **User request** (short, under-specified): “Add a short note to MCP docs: tool calls must be written clearly.”  
> Routing per [`/en/agentic-workflow/full-workflow`](/en/agentic-workflow/full-workflow): **P0 → P1 → P2 → P3** and **observability**.

---

## P0 · Conversation start (memory)

**Intent**: Before editing, search for prior decisions on “MCP / workflow / observability” to avoid rework.  
**Location**: `user-memory` / `memory_search`  
**Parameter summary**: `keywords = MCP, workflow, observability, tool calls`  
**Status**: success  
**Result summary**: **0** hits; per rules print—*No relevant historical memories found; continuing from the current context.*

---

## P1 · Prompt optimization (when vague)

**Intent**: Turn “write clearly” into an acceptance-ready doc outline to reduce churn.  
**Location**: `promptenhancer` (or equivalent)  
**Parameter summary**: raw ask + audience (internal agents) + length cap (short section)  
**Status**: success  

**Optimized prompt (excerpt)**

- Add **“Tool-call observability”** under *MCP automated workflow rules*, aligned with existing before/after call guidance.  
- Each example must include: **one-line intent**, **server/tool name**, **key parameter summary**, **success or failure + actionable error snippet**.  
- Secrets only as “configured / redacted”, never plaintext.

---

## P2 · Routing: files + docs

**Intent**: Confirm the target file exists and is safe to edit before patching—avoid destructive overwrite.  
**Location**: `filesystem` / `read_file` → `edit_file` (or equivalent)  
**Parameter summary**: `path = pages/en/agentic-workflow/full-workflow.md`  
**Status**: success (file exists; incremental edit, not full replace)

**Write strategy (per rules)**

1. `read_file` to see if `# MCP tool-call observability` is already sufficient.  
2. If only a small addendum is needed, use `edit_file` to append 2–3 **bad vs good** pairs under the “before call” list.  
3. Always use `list_directory` for directory existence—never `read_file` as a directory probe.

---

## P2 side path · API scenario (not triggered here; routing table demo)

If the user asked to “generate client code from OpenAPI”, the chain would be:

`refresh_project_oas_*` → `read_project_oas_*` → codegen; on refresh failure read cache and **state error + fallback explicitly**.

---

## P3 · Completion (memory)

**Intent**: Persist this doc structure + observability wording as reusable memory.  
**Location**: `user-memory` / `memory_store`  
**Parameter summary**: `topic = mcp-docs-observability`, content is **decisions and template phrases** only (no debug noise)  
**Status**: success  
**Result summary**: new memory id held in session; same session/topic updates should use `memory_update` to avoid duplicates.

---

## Deliverable note (Markdown for markstream-vue)

This file is **plain Markdown** (headings, rules, tables, lists, inline code) for **streaming demo** on the home page with [markstream-vue](https://markstream-vue.simonhe.me/); the canonical rules remain the on-site **Full-Workflow** page.

**Self-check**

- [x] Before each MCP call: **intent + tool name + parameter summary**  
- [x] After each call: **status + result summary** (or actionable failure)  
- [x] Fallbacks and assumptions explicit for review  

```text
# Pseudocode: single-call skeleton (copy phrasing into docs)

before_call:
  say(why, server_tool, redacted_params)

after_call:
  say(status, short_summary, next_step_or_fallback)
```
