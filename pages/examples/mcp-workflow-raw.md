# MCP Full-Workflow sample (rendered from fenced Markdown)
::: info Model and scores
**Model**: `Opus4.6`  
**Scores**: `DeepSeek 10.0` | `Opus4.6 9.5`
:::
```md
---
description: MCP tool auto-routing rules (memory, prompt optimization, routing)
alwaysApply: true
---

# MCP automated workflow rules

## Goals
- Keep context continuous via memory.
- When requirements are vague, optimize the prompt before implementation.
- Auto-route to the right MCP tool chain from user intent.
- Capture decisions at key milestones for reuse later.

## Priority 0: conversation start
- At each conversation start, run `memory_search`.
- Keywords are extracted from the user message.
- Goal: coherent context and avoid re-asking known facts.
- If `memory_search` returns nothing, print: "No relevant historical memories found; continuing from the current context."
- If the user explicitly says "skip memory", skip.

## Priority 1: prompt optimization
- When the request is fuzzy, too short, or missing key constraints, invoke `promptenhancer`.
- Show the optimized prompt; continue after user confirmation.
- If the user says "just do it" or "skip optimization", skip.
- Do not trigger for clear single-step tasks (rename, one command, one field change).

## Priority 2: scenario auto-routing

### New features / complex tasks
- `memory_search` → `promptenhancer` (if needed) → design → implement → `memory_store` (this already satisfies priority 3; do not fire again)

### API / interface work
- `refresh_project_oas_{id}` → `read_project_oas_{id}` → generate code
- If refresh fails, print: "OAS refresh failed; trying cached local copy. Error: [reason]" → fall back to existing OAS
- If fallback also fails, continue from code context and list assumptions explicitly

### File operations
- Before `write_file`, `read_file` to see if the file exists
- If the file exists and this is not an overwrite scenario, prefer `edit_file` over blind overwrite
- Otherwise: `read_file` / `create_directory`
- To check whether a directory exists, use `list_directory`, not `read_file`

### Code or file search
- `search_files` or `list_directory`

### Directory browsing
- `directory_tree`

### Memory operations
- Store: `memory_store` (see priority 2.5 dedupe rules)
- Update: `memory_update` (reuse within the same session/topic)
- Recall: `memory_search`
- Stats: `memory_stats`
- Harvest: `memory_harvest`
- Graph: `memory_graph`
- Session learning: `learning_session`

## Priority 2.5: memory dedupe rules
- In one session, for the same `topic`, run `memory_store` once.
- First write: `memory_store`.
- Later updates: `memory_update` (using the memory id from the first store), not duplicate inserts.
- The id returned by the first `memory_store` is kept in the current session; later `memory_update` for the same topic uses that id. If the id is lost, fall back to a new `memory_store`.
- Suggested storage key: `topic + decision + date` (for dedupe heuristics).
- Do not store noise: temporary logs, debug values, ephemeral variables. Store only:
  - Technical decisions
  - Architecture choices
  - Problem resolutions
  - User preferences/constraints

## Priority 3: task completion
- At major milestones, `memory_store` should capture:
  - What was decided
  - Which technical approach was used
  - What broke and how it was fixed
- If priority 2 already ended with `memory_store`, do not trigger priority 3 again.

## Clarification and fallback rules
- If context is missing, ask one focused clarification—do not stack questions.
- If the target MCP tool is unavailable, pick the closest available tool and explain briefly.
- If file ops fail on permissions/path, return a clear error and suggested next steps.

## Other tools (on demand)
The following are not in the main flow but can be invoked manually when needed:
- Conflict handling: `memory_conflicts` / `memory_resolve`
- Quality and health: `memory_quality` / `memory_health`
- Cleanup and delete: `memory_cleanup` / `memory_delete`
- Export: `knowledge_export`
- Bulk import: `memory_ingest`
- List: `memory_list`
- Review/analysis: `memory_review` / `memory_analysis`
- Session store: `memory_store_session`

## Exception summary

| Scenario | Behavior |
|---------|----------|
| `memory_search` empty | Print hint, continue |
| Lost id for `memory_update` | Fall back to new `memory_store` |
| OAS refresh fails | Print error, read cache |
| OAS fallback also fails | Print assumptions, continue from code |
| File exists (non-overwrite) | Use `edit_file` or prompt user |
| `write_file` without prior read | Do not overwrite blindly |
| Check directory existence | Use `list_directory`, not `read_file` |
| Duplicate memory same topic | Use `memory_update`, not insert |
| Priority 2 already stored | Skip duplicate priority 3 |
| Too many clarifications | Send only 1 focused question |
| MCP tool unavailable | Pick closest tool and explain |
| File permission/path failure | Clear error + suggested action |

## Examples
- User: "Build a login API for me"
  - `memory_search(login, API, auth)` → if empty, print hint → `refresh_project_oas_5htfn2` (on failure print error and fallback) → implement → `memory_store`
- User: "Remember we use PostgreSQL"
  - First time: `memory_store(project uses PostgreSQL)`
  - Same session again: "Remember Postgres port is 5432" → `memory_update` (reuse memory id from first store)
- User: "Which database did we use?"
  - `memory_search(database)`
- User: "Create directory src/utils"
  - `list_directory` to check → `create_directory(src/utils)` (if exists, tell user and skip)
```
