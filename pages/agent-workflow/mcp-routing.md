# MCP Workflow · Scenario Routing

## Enabled MCP Capability Matrix {#capability-matrix}

> Use the MCP descriptors actually loaded by the host as the source of truth; the table below reflects the **currently configured** 6 servers in this workspace.

| Server | Tools / Resources | Purpose |
| ------ | ----------------- | ------- |
| `user-daniel_lightrag_mcp` (aliases in table below) | `query_text`, `query_text_stream`, `insert_text`, `insert_texts`, `upload_document`, `get_documents`, `get_documents_paginated`, `get_document_status_counts`, `get_knowledge_graph`, `get_graph_labels`, `scan_documents`, `get_health`, `get_pipeline_status`, `get_track_status`, `update_entity`, `update_relation`, `delete_document`, `delete_entity`, `delete_relation`, `check_entity_exists` | Cross-session knowledge base (LightRAG) |
| `user-filesystem` | `read_text_file`, `read_file`, `read_multiple_files`, `read_media_file`, `write_file`, `edit_file`, `move_file`, `list_directory`, `list_directory_with_sizes`, `list_allowed_directories`, `directory_tree`, `search_files`, `get_file_info`, `create_directory` | **Default** file read/write (see next section) |
| `user-prompt-optimizer` | `promptenhancer` (`originalPrompt` / `optimizedPrompt`) | Two-round prompt optimization (see `mcp-prompt-optimizer.mdc`) |
| `cursor-ide-browser` | `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_click`, `browser_type`, `browser_cdp`, `browser_tabs`, `browser_lock`, … | Browser automation (**only when the user explicitly requests it**; see [Browser Automation](#browser-automation) below) |
| `project-0-ui-codegraph` (aliases in table below) | `codegraph_explore`, `codegraph_search`, `codegraph_callers`, `codegraph_callees`, `codegraph_impact`, `codegraph_node`, `codegraph_files`, `codegraph_status` | Repository code graph (symbols / call chains / impact; see [Code Understanding](#code-understanding-project-0-ui-codegraph) below) |
| `user-headroom_mcp` (aliases in table below) | `headroom_compress`, `headroom_retrieve`, `headroom_stats` | Context compression (Headroom; compress large output to save tokens, reversible retrieval; **cross-cutting capability**; see [Context Compression](#context-compression-user-headroom-mcp) below and `mcp-core.mdc`) |

**Not currently configured** (treat as optional if the host enables them later):

- `Elements` (`get_project_guidance`) — UI/table/layout project guidance; see `mcp-core.mdc` P0.5; skip that step if not configured.
- `user-memory-service`, `user-ads-mcp`, `user-forge`, `user-mcp-code-gen-kd` — not routed for now.

**Do not reference uninstalled tools**: `refresh_project_oas_*` / `read_project_oas_*`; `memory_*` series (memory capability is handled by LightRAG).

**LightRAG on-demand tools**: `get_track_status` (milestone ingestion confirmation; see `mcp-core.mdc`), `check_entity_exists` (optional before ingestion), `get_health` (**on failure only**, not every session), `get_pipeline_status`, `scan_documents`, `delete_document`, `upload_document`, `get_documents_paginated`, `get_knowledge_graph` (for review).

### LightRAG Server Aliases {#lightrag-server-aliases}

Use whichever name is available; **do not skip calls because of naming differences**.

| Host display name | Notes |
| ----------------- | ----- |
| `user-daniel_lightrag_mcp` | Canonical name in Cursor / rules |
| `daniel_lightrag_mcp` | Short name in user speech or some host configs |

Both point to the same LightRAG service. **Do not** skip calls due to prefix differences (`user-` or not).

### Codegraph Server Aliases {#codegraph-server-aliases}

Use whichever name is available; **do not skip calls because of naming differences**.

| Host display name | Notes |
| ----------------- | ----- |
| `project-0-ui-codegraph` | Current canonical name in this workspace |
| `codegraph` | `serverName` in `SERVER_METADATA.json`; short name on some hosts |

Both point to the same Codegraph service. **Do not** skip calls due to naming differences.

### Headroom Server Aliases {#headroom-server-aliases}

Use whichever name is available; **do not skip calls because of naming differences**.

| Host display name | Notes |
| ----------------- | ----- |
| `user-headroom_mcp` | Canonical name in Cursor / rules |
| `headroom_mcp` | `serverName` in `SERVER_METADATA.json`; short name on some hosts |

Both point to the same Headroom service. **Do not** skip calls due to prefix differences (`user-` or not).

## Knowledge Base Keyword Priority Routing {#kb-keyword-routing}

**Full hard gate: see `mcp-core.mdc` "P0 · Explicit Trigger"** (canonical; do not repeat here). This section is a routing quick reference only:

When the user message contains **知识库** / **LightRAG** / **daniel_lightrag** → **first step** `query_text` (`mode: hybrid`, `only_need_context: true`), **before** reading code, P0.5, P1, or implementation; only "skip knowledge base / skip memory" exempts this. When editing `.cursor/rules` itself and asked to "optimize per knowledge base," retrieve first as well.

## File I/O Strategy (Cross-Environment, MCP First) {#file-io-strategy}

Goal: the same rules run in Cursor, CLI Agent, and other MCP-capable hosts, **without binding** to any single IDE's built-in tool names.

### Priority (Read / Write / Edit)

1. **`user-filesystem` MCP** (if the host has it enabled and the path is within allowed directories)
   - Read: `read_text_file` (preferred) or `read_file`; large files may use `head` / `tail`
   - Write: **must** `read_text_file` / `read_file` first to check existence before `write_file`
   - Edit: file exists and is not a full overwrite → `edit_file`
   - Directories: existence → `list_directory`; tree → `directory_tree`; search by name → `search_files`
   - First operation or uncertain path: call `list_allowed_directories` first

2. **Host-native file tools** (only when filesystem MCP is unavailable, path is not whitelisted, or MCP fails once and you fall back)
   - e.g. Cursor Read / Write / StrReplace, or equivalent read / write / patch on other agents
   - On fallback, **one sentence** explaining why (MCP not configured / path denied / call failed)

3. **Forbidden**: overwriting with MCP `write_file` without checking existence; inventing uninstalled MCP tool names.

### Code / Text Search {#code-text-search}

| Capability | Preferred | Fallback |
| ---------- | --------- | -------- |
| Understand a block of logic / flow / "where is it used" | `codegraph_explore` (see [Code Understanding](#code-understanding-project-0-ui-codegraph)) | Host Grep + Read |
| Where is a symbol / who calls / call chain | `codegraph_search` → `codegraph_callers` / `codegraph_callees` | Host Grep + Read |
| Refactoring impact | `codegraph_impact` | Manual callers tracing |
| Full implementation of one symbol (incl. overloads) | `codegraph_node` (`includeCode: true`) | Read specific lines |
| By filename / path pattern | `search_files` | Host Glob / equivalent |
| Indexed directory structure | `codegraph_files` | `directory_tree` / host file tree |
| Content regex / exact string / i18n key | Host Grep / ripgrep-class tools | `search_files` (when capability is limited) |
| Directory structure overview | `directory_tree` | `list_directory` recursive or host file tree |

**Selection priority** (use with the table above to avoid misuse):

- Need "who calls this function / what does this function call / impact scope / module flow" → `codegraph_explore` or `codegraph_search` + callers/callees/impact
- Need "find a specific string" (i18n key, constant, error message, config key) → host Grep
- When the above is insufficient, or Codegraph is not initialized / indexing failed → fall back to `search_files` + `read_file` / Read

## P2: Scenario Auto-Routing {#p2-scenario-routing}

### New Feature / Complex Task

`query_text` (**mandatory first step when user mentions knowledge base**; otherwise if P0) → `promptenhancer` (if P1) → `get_project_guidance` (if P0.5) → **`codegraph_explore` (only when existing call relationships must be understood; see [Code Understanding](#code-understanding-project-0-ui-codegraph))** → plan / implement → `insert_text` (see `mcp-core.mdc` 2.5)

Optional: "brainstorm first" → `superpowers-triggers.mdc`.

### API / Interface Development

1. `codegraph_explore` (target service + callers) to understand existing structure; then read type definitions as needed.
2. If OpenAPI/Swagger exists in the repo, use MCP to read files + content search; do not invent OAS MCP tools.
3. After completion, `insert_text` (body includes `[tags: api,decision]`).

### UI Implementation

`query_text` (**mandatory first step when user mentions knowledge base**) → P0.5 `get_project_guidance` (**only when Elements MCP is available**; otherwise `agents-workflow` + minimal reading) → implement → `verification-before-completion`.

### File Operations

Always follow [File I/O Strategy (Cross-Environment, MCP First)](#file-io-strategy) above.  
Editing project code, `.cursor/rules`, config, and business source code **uses the same flow** — no separate exceptions.

### Code or File Lookup

Follow the [Code / Text Search](#code-text-search) table above.

### Directory Browsing

Prefer `directory_tree`; if unavailable, `list_directory` (or `list_directory_with_sizes` when sizes are needed) or host equivalent.

### Code Understanding (`project-0-ui-codegraph`) {#code-understanding-project-0-ui-codegraph}

Complements "in-repo symbols / call relationships / impact" — **does not duplicate** LightRAG (cross-session decisions), Grep (text matching), or Read (single file): LightRAG answers "why designed this way," Codegraph answers "where used, who calls whom, what breaks if changed," Grep answers "exact string / error message / i18n key."

**Priority**: **not above P0 knowledge base**; after P0/P0.5/P1, before broad `Grep + Read`, as the default path for code understanding.

**Trigger strategy**: **on demand**, not every task. `codegraph_explore` in P2 means call **only when** you truly need existing call relationships, module boundaries, or impact scope.

**Trigger** (any one applies):

- New feature / refactor / API work needing existing call relationships or module boundaries
- Bug fix needing call-chain tracing or impact scope
- User asks "where is this function called," "what breaks if I change here," "where is XX used"
- "How to use / architecture / flow" exploration where single-file Read is insufficient
- User explicitly says "look it up with codegraph"

**Do not trigger** (any one applies — skip and use Read / Grep directly):

- Pure new file with no existing dependencies to understand
- Simple single-file edit (user gave `file:line`, or Read one file is enough)
- Pure string replace, config change, run command, rename local variable
- Codegraph not initialized or indexing failed (fall back to Grep + Read; see [Exceptions](#codegraph-exceptions))
- User says "skip codegraph"

**Tool selection** (aligned with that server's usage docs):

| Intent | Tool |
| ------ | ---- |
| Understand a block of logic / flow / architecture (**preferred; usually one call is enough**) | `codegraph_explore` (natural language or symbol name) |
| Find symbol location only | `codegraph_search` (optional `kind`) |
| Who calls / who is called | `codegraph_callers` / `codegraph_callees` |
| Impact before changing | `codegraph_impact` |
| Single symbol / overload full implementation | `codegraph_node` (`includeCode: true`; `file`+`line` for disambiguation) |
| Indexed directory structure | `codegraph_files` |
| Index health (**not every session**; see below) | `codegraph_status` |

**When to call `codegraph_status`**: **Do not** call at session start or before every explore. Only when `codegraph_explore` results are clearly incomplete (e.g. expected call relationships return empty), response mentions stale/index errors, or consecutive explore failures — then call `codegraph_status` to diagnose; if index is missing or severely stale, prompt user to run `codegraph init -i` or rebuild the index.

**Hard constraints (anti-patterns)**:

- **Forbidden**: after `codegraph_explore` returned source for a file (and not marked stale), Grep + Read the same file again for exploration.
- **Forbidden**: looping `codegraph_node` over many symbols; use one `codegraph_explore` instead.
- When response lists "stale / files pending sync," **only** those files get Read verification; trust codegraph for the rest.
- **Do not** use codegraph instead of writing files, running tests, or lint.
- **Do not** force explore in "do not trigger" scenarios (above).

**Exceptions** {#codegraph-exceptions}: Error "project not initialized (no `.codegraph/`)" → suggest running `codegraph init -i`, fall back to Grep + Read for this session; index may lag writes by ~1 second.

### Context Compression (`user-headroom_mcp`) {#context-compression-user-headroom-mcp}

Cross-cutting capability; **no P number**. Compress on demand when any stage produces large output. **Full strategy (trigger / do not trigger / consume retrieval / safety) in `mcp-core.mdc` "Context Compression"** (canonical; do not repeat here). Quick reference:

| Intent | Tool | Notes |
| ------ | ---- | ----- |
| Compress large output to save context window | `headroom_compress` | Pass large text as `content`; record returned `hash`; ~≥400 lines / ≥8KB when multi-step reuse is needed |
| Retrieve original text | `headroom_retrieve` | By `hash`; when exact line numbers / fields / API contracts are needed; optional `query` for partial filter |
| Compression stats | `headroom_stats` | **Only when user asks "how many tokens saved"** |

**Relationship to other chains**:

- Does not replace LightRAG / Codegraph / Grep; it compresses **large output from those sources** without changing retrieval or code-understanding priority.
- **Do not compress code you are about to edit** (needs exact line numbers); **do not send** credentials / secrets to compression.
- `compress` / `retrieve` count toward "noise boundary"; consecutive calls produce one merged summary only.
- Unavailable / timeout / failure → skip compression, use original text, **do not block** the task.

### Browser Automation (`cursor-ide-browser`) {#browser-automation}

**Only when the user explicitly requests** "open/operate browser," "screenshot page," "click/fill on page," "verify with browser," etc.; **do not** proactively use it to bypass missing MCP (e.g. **must not** use browser when Elements is not configured).

- Workflow: `browser_tabs`(list) → `browser_navigate` → `browser_lock`(lock) when needed → interact (`browser_click` / `browser_type` / `browser_snapshot` / `browser_take_screenshot`) → `browser_lock`(unlock) when done.
- Stop within 4 failures; report status + blocker + next step (see that server's usage docs).
- Login, CAPTCHA, destructive ops needing human confirmation → stop and hand back to user; do not retry repeatedly.

### Knowledge Base Operations (`user-daniel_lightrag_mcp`) {#lightrag-operations}

| Operation | Tool | Notes |
| --------- | ---- | ----- |
| Retrieve / recall | `query_text` | `mode: hybrid`; **default** `only_need_context: true` (see `mcp-core.mdc` P0); consumption per P0 spec |
| Single insert | `insert_text` | Header `[tags: …] [type: …] [date: …]`; after milestone **must** `get_track_status` |
| Batch insert | `insert_texts` | Each item `title` + `content` + optional `metadata`; same track confirmation |
| File ingestion | `upload_document` | `file_path` to local file; milestone ingestion needs track confirmation |
| Ingestion tracking | `get_track_status` | `track_id`; on success continue; on processing wait 2s up to 3 times; on failed see core ingestion confirmation |
| Pre-ingestion check | `check_entity_exists` | Trigger: "remember / record / update prior decision / update preference"; default `supersedes:` supplement; on clear conflict ask one question only |
| List | `get_documents` / `get_documents_paginated` | Paginated: `page_size` 10–100 |
| Stats | `get_document_status_counts` | Document status counts |
| Graph | `get_knowledge_graph` / `get_graph_labels` | **On-demand** review; not daily task flow |
| Scan new documents | `scan_documents` | Trigger LightRAG scan |
| Health check | `get_health` | **When LightRAG fails repeatedly**; env onboarding self-check see §4; **not** every session |
| Update entity / relation | `update_entity` / `update_relation` | Requires known ID; fix body text with new `insert_text` |
| Delete | `delete_document` / `delete_entity` / `delete_relation` | Delete by ID; see [LightRAG KB Maintenance](#lightrag-kb-maintenance) |
| Streaming query | `query_text_stream` | On demand for long answers |

### LightRAG Failure Diagnosis (Non-Routine) {#lightrag-failure-diagnosis}

**Do not** call `get_health` on every user message or at session start.

**Trigger** (any one):

- Same task: `query_text` / `insert_text` / `get_track_status` **fails twice in a row**
- User reports "knowledge base unavailable / retrieval always fails"

**Action**: `get_health` → if still failing, skip P0/P2.5/P3, explain reason + assumptions, continue current task.

### LightRAG Knowledge Base Maintenance (Non-Routine Task Flow) {#lightrag-kb-maintenance}

**Not** part of the alwaysApply main chain; run before release / monthly / when user explicitly requests cleanup:

| Step | Tool | Notes |
| ---- | ---- | ----- |
| 1 | `get_document_status_counts` | Understand processing / failed / completed scale |
| 2 | `get_documents_paginated` | `page_size` 20 to browse candidates |
| 3 | `delete_document` | **Requires human or user confirmation**; no automatic bulk delete |
| 4 | `get_knowledge_graph` / `get_graph_labels` | Optional: structure review, troubleshoot retrieval noise |

Retirement principles: failed indexes, duplicates superseded by `supersedes`, temporary debug ingestions.

**Human-assisted cleanup flow** (agent must not bulk-delete automatically):

1. `get_document_status_counts` → understand scale and failure count.
2. `get_documents_paginated` (`page` incrementing, `page_size` 20) → list candidates by time or tags, **present to user**.
3. After user confirms `document_id` list, `delete_document` one by one and report each result.
4. Optional: `get_knowledge_graph` to check for orphaned entities.

## MCP Host Setup (Retrieve on Demand, Not alwaysApply) {#host-setup-summary}

Detailed config, JSON examples, whitelist, enablement verification, and FAQ live in LightRAG — **do not** load full text on every task.

**Local full version (canonical)**: `.cursor/docs/mcp-routing-host-setup.md` — full JSON and FAQ; LightRAG side can ingest via `insert_texts` / `upload_document` on server-accessible paths.

**When to query the knowledge base** (`query_text`, `mode: hybrid`, `only_need_context: true`):

- **User message contains「知识库」/ LightRAG / daniel_lightrag** (highest priority; see [Knowledge Base Keyword Priority Routing](#kb-keyword-routing))
- New environment onboarding, MCP always falling back, filesystem path not allowed
- User asks about mcp.json / whitelist / server name mismatch
- Copying rules to another project

**Recommended query example**: `MCP 宿主配置检查清单 filesystem 白名单 mcp.json AOPS ui`

**Minimal points retained in routing**:

| Point | Conclusion |
| ----- | ---------- |
| filesystem whitelist | Must cover workspace root (this repo `…/AOPS/ui` or monorepo `…/AOPS`); do not whitelist only `src` |
| server names | Per host MCP list (`user-filesystem` vs `filesystem`); align capabilities |
| LightRAG failure | After 2 consecutive failures, `get_health`; if still failing skip KB (see [LightRAG Failure Diagnosis](#lightrag-failure-diagnosis)) |
| session start | **Do not** default `get_health` |
| security | Rules and examples omit API keys; `mcp.json` local paths usually not committed |

Copying to other projects: copy `ui/.cursor/rules/mcp-*.mdc` + `superpowers-triggers.mdc`, and adjust whitelist root per KB checklist. Target project must run `codegraph init -i` first (or `npx codegraph index --force` at project root) to generate `.codegraph/` index, or Codegraph MCP tools are unavailable (rules fall back to Grep + Read). Headroom is **host-level (user-) optional**; if target host has no `user-headroom_mcp`, rules degrade automatically (skip compression, use original text) with no extra init.
