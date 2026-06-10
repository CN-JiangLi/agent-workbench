# MCP Workflow · Core

> Companion rules (same directory): `mcp-routing.mdc` (scenario routing, MCP matrix; **host config details see LightRAG**), `mcp-prompt-optimizer.mdc` (P1), `superpowers-triggers.mdc` (cognitive skills).

## MCP Configuration Status (Based on What the Host Actually Loads) {#mcp-config-status}

- **Configured (6)**: `user-daniel_lightrag_mcp` (LightRAG knowledge base), `user-filesystem` (file read/write), `user-prompt-optimizer` (`promptenhancer`), `cursor-ide-browser` (browser automation, **only when the user explicitly requests it**), `project-0-ui-codegraph` (code graph, alias `codegraph`; understand symbols / call chains / impact), `user-headroom_mcp` (context compression, alias `headroom_mcp`; compress large outputs to save tokens, reversible, **cross-cutting capability not a P phase**, see "Context Compression" below). See capability matrix in `mcp-routing.mdc`.
- **Optional / currently not configured**: **Elements** (`get_project_guidance`). Treat as "not configured / unavailable" by default; **does not block** tasks.
- P0.5 runs only when the host has Elements MCP enabled and the call succeeds; otherwise go directly to: `agents-workflow` + minimal target-code reading + hypothesis list (aligned with `AGENTS.md` intent).

## Goals {#goals}

- Maintain context continuity through the LightRAG knowledge base.
- When requirements are vague, optimize the prompt first, then implement (see `mcp-prompt-optimizer.mdc`).
- Route automatically to the appropriate MCP tool chain based on user intent (see `mcp-routing.mdc`); for file read/write **prefer** `user-filesystem`, see routing "Cross-environment" section.
- Capture decisions at key milestones for later reuse.
- Keep MCP and Superpowers execution observable.

## Layering with AGENTS.md {#agents-md-layering}

| Layer | Source | Governs |
| ----- | ------ | ------- |
| Historical decisions / cross-session memory | LightRAG `query_text` (`user-daniel_lightrag_mcp`) | Architecture intent, past decisions, component docs, checklists |
| Repository structure and call relationships | Codegraph `codegraph_explore` etc. (`project-0-ui-codegraph`) | Where symbols live, who calls whom, change impact, flow paths |
| Repository implementation conventions | Elements `get_project_guidance` (**optional**, skip if not configured) | Tables, layout, i18n, component patterns |
| General engineering methods | Superpowers (`superpowers-triggers.mdc`) | Brainstorming, planning, TDD, debugging, verification, review |
| Context compression (cross-cutting) | Headroom `headroom_compress` / `headroom_retrieve` (`user-headroom_mcp`) | Compress already-fetched large outputs to save tokens, reversible retrieval; **does not produce content**, see "Context Compression" below |
| Flow orchestration | Rules in this directory | When to take which path |

**Explicit order (when user mentions knowledge base)**: `P0 query_text` → `P0.5 Elements` (if available) → `P1 promptenhancer` (if requirements are vague) → read code / implement.

**Superpowers do not replace Elements**: For UI/table/layout tasks, Elements (when available) takes priority over `brainstorming`.

## MCP Tool Call Observability (Global) {#mcp-observability}

Applies to **all** MCP calls and Superpowers flows.

### Before the call

- **Intent**: One sentence on why you are calling and what you expect.
- **Location**: **server / tool name** (consistent with MCP descriptors).
- **Parameter summary**: paths, `query`, `mode`, `text`, etc.; for credentials write only "configured / redacted".
- For consecutive calls within the same task, use "Step 1/2/…" numbering.

### After the call

- **Status**: success / failure / partial success.
- **Result summary**: count, key fields; do not dump huge bodies of text.
- **Failure**: keep actionable message/code and follow "Exception Handling Summary" fallback.
- **Fallback**: explicitly state branch name and 1–3 hypotheses.

### Noise boundary (hard rule)

- **≥2 consecutive MCP calls** within the same user task: output **only one merged summary** to the user (status + key results); step-by-step intent and parameters stay internal, no step-by-step spam.
- Step-by-step detail is allowed only when the user says "detailed log" or "step by step".
- Low-risk read-only probes (e.g. `list_directory`) merge with subsequent write operations into one block.

**Merged summary example (for the user):**

> Steps 1–3: knowledge base retrieval, directory check, read config → all succeeded. Starting implementation.

**Forbidden:** a separate "pre-call plan + post-call report" block for every MCP call.

## Master Decision Tree (Judge in Order) {#decision-tree}

```
User message
  ├─ "skip memory" / "skip knowledge base" → skip P0
  ├─ contains "knowledge base" / LightRAG / daniel_lightrag → P0 mandatory first (see below, overrides negative list)
  ├─ "just do it" / "don't optimize" → skip P1 (do not skip P0 if knowledge-base explicit trigger already hit)
  ├─ P0 knowledge retrieval (conditional trigger)
  ├─ P0.5 Elements (UI/tables/layout/i18n, if MCP available)
  ├─ P1 promptenhancer (see mcp-prompt-optimizer.mdc)
  ├─ P2 scenario routing (see mcp-routing.mdc; code understanding prefers codegraph, not above P0)
  ├─ Superpowers (see superpowers-triggers.mdc)
  ├─ ⟂ Context compression (Headroom, cross-cutting; compress on demand when large output appears at any stage, see below)
  └─ Before completion: verification-before-completion (default gate)
```

> `⟂` means **cross-cutting capability**: no P number, does not change the order above; when any stage produces large tool output / files / search results, decide on the spot whether to `headroom_compress` per "Context Compression" trigger conditions.

## Context Compression (Headroom · Cross-Cutting, Not a P Phase) {#context-compression-headroom}

Headroom MCP (`user-headroom_mcp` / alias `headroom_mcp`) compresses large text before it enters reasoning to save context window; compression is **reversible** (original kept locally, retrieve by hash). **Complements** LightRAG / Codegraph / filesystem: it **does not produce content**, only compresses large outputs you have already fetched.

**Tools**:

| Tool | Purpose |
| ---- | ------- |
| `headroom_compress(content)` | Compress arbitrary text; returns compressed text + `hash` (original saved locally) |
| `headroom_retrieve(hash, query?)` | Retrieve original by hash; optional `query` for partial filtering |
| `headroom_stats()` | Session compression stats (count, tokens saved, estimated cost) — **only when user asks** |

**Trigger (any one may warrant `compress`; on demand, not mandatory)**:

- Single tool output / file / search result is large (roughly **≥400 lines** or **≥8KB**) and must be kept for **multi-step reasoning**.
- Long logs, verbose JSON, many RAG chunks, batch retrieval results — need to read while reasoning.
- Accumulated context is near window pressure; need space to continue the task.

**Do not trigger (any one → skip, use original)**:

- Small output / one-time consume-and-discard content.
- **Code you will edit precisely**: editing needs exact line numbers and original text; **do not compress before edit** (optionally record hash, `retrieve` before editing).
- Credentials / secrets / sensitive data: **do not send to compression**, avoid an extra copy.
- Content is already concise enough.

**Consumption and retrieval (hard constraints)**:

- Compressed output is a **derived view**; authority priority unchanged: **user's current instruction > repository code facts > retrieval / compressed derived content**. When exact fields, line numbers, or API contracts are needed, `headroom_retrieve` first to verify original; **forbidden** to use compressed summary instead of code facts or the user's current instruction.
- When you see compression marker `[N items compressed... hash=abc123]` and need detail, call `headroom_retrieve` with that `hash`.

**Observability**: `compress` / `retrieve` count toward "noise boundary" — multiple consecutive calls output **one merged summary** only; do not spam step-by-step for compression alone.

## P0: Knowledge Retrieval (Conditional Trigger) {#p0-knowledge-retrieval}

### Explicit trigger (highest priority, hard gate)

When the user message contains **any** of the following, **must call** LightRAG MCP `query_text` **as the first step of this task**, **before** reading code, P0.5, P1, or implementation:

| Trigger word / phrase | Examples |
| --------------------- | -------- |
| knowledge base | "develop per knowledge base", "follow knowledge base standards", "call knowledge base" |
| LightRAG | "query LightRAG", "retrieve with LightRAG" |
| daniel_lightrag | "daniel_lightrag_mcp", "per daniel_lightrag conventions" |

**Hard gates**:

1. **Call first, infer later**: must actually call `query_text`; **forbidden** to decide LightRAG is "not configured" and skip because `mcps/` has no descriptor, tool list does not show it, or you have not called it yet.
2. **Overrides negative list**: when this section hits, **do not** skip P0 for "single-point change", "facts already in repo", etc.; skip only when user explicitly says "skip knowledge base / skip memory".
3. **Before implementation**: complete retrieval before writing code, changing rules, or proposing solutions; continue only after adjudicating results per "P0 Retrieval Consumption Rules".
4. **Server name**: follow host MCP list; commonly `user-daniel_lightrag_mcp`, may also show as `daniel_lightrag_mcp` (see alias table in `mcp-routing.mdc`). Use whichever is available; **forbidden** to abandon the call due to name prefix differences.

**Call failure**: retry once within the same task; if still failing then `get_health` (see routing "Fault diagnosis") → explain failure and fallback hypotheses to user; **must not** pretend retrieval happened.

### Regular trigger (any one → run `query_text`)

- New feature / cross-module refactor / cross-session ("last time", "remember", "said before")
- Involves page-structure, architecture choices, MSP/tenant view differences, shared UI conventions
- User asks "do you still remember?"

### Do not trigger (negative list, any one → skip P0)

**Exception**: if "explicit trigger" above already hit, only "skip knowledge base / skip memory" can exempt; all other negative items **must not** cause skipping P0.

- "**Skip knowledge base / skip memory**" → may skip P0 (**including** explicit-trigger scenarios).
- "**Just do it / don't optimize**" → skips **P1** (prompt optimization) only, **not** P0.
- Pure consultation, rule review, concept explanation, read-only code review.
- **Single-point change**: single file, single function, rename, one field, one command.
- **Already sufficient context**: user gave stack trace + file path, or clear repro steps.
- **Facts already in repository**: answer uniquely determined by reading specified file or grep, no historical decision needed.

**Recommended parameters** (`query_text` actual schema: `query` required, `mode` enum default `hybrid`, `only_need_context` **tool default `false`**):

- `query`: extract keywords from user input into a natural-language question.
- `mode`: `hybrid` (default; entity-local use `local`, global overview use `global`, simple match use `naive`).
- `only_need_context`: **this rule's strategy defaults to explicitly passing `true`** (context only, no generated answer, saves tokens; note tool default is `false`, so must pass explicitly). Exception: user explicitly asks "answer from memory / summarize what you remember / do you remember — please answer directly" → pass `false`.

**When no results**: output "No relevant knowledge found; continuing based on current context."

### P0 retrieval consumption rules (hard gate)

**Authority priority (hard)**: **user's current instruction > current repository code/types/interface facts > LightRAG retrieval results**. Memory carries historical decisions, preferences, architecture intent only; **must not** use memory to override observed code behavior, field names, API contracts. Typical: MSP/tenant view differences follow code and current requirement; if memory describes old default filters/old column config, **ignore**.

After `query_text` returns, before using results for decisions, Agent **must** internally complete the following adjudication (**no** extra MCP calls for this; obey "noise boundary"):

1. **Recency**: parse leading `[date: YYYY-MM-DD]` in body; if unparseable treat as low-priority reference.
2. **Conflict**: same `tags` / same topic multiple entries with contradictory conclusions → **latest date wins**; entries with `supersedes:` in body take priority over superseded topics.
3. **Dedup (semantic duplicate)**: two records describe **the same technical decision, same config item, or same architecture choice** with **consistent conclusions** → keep only the latest (by `[date:]` or `supersedes:`). Highly overlapping `tags` and same body points count as semantic duplicate.
4. **External summary**: tell user only **1–2** key conclusions adopted; do not dump full retrieval text. If discarding stale memory, one line noting "ignored earlier X decision" is fine.

**Forbidden**: without `supersedes` and without a newer date, use older memory to override current code facts or user's current instruction.

## P0.5: Elements Project Guidance (Optional, Non-Blocking) {#p05-elements}

**Trigger**: tables, filters, list pages, standard layout, `UIStandardLayout`, dialogs, dropdowns, dynamic fields, i18n, shared UI (aligned with `AGENTS.md`).

**Prerequisite**: confirm Elements MCP is available in tool list; unavailable or timeout → **skip this step**, do not wait, do not fabricate calls.

**Action**: `get_project_guidance` (user's original requirement).

- `matched=true` → follow `guidance`; YAML intake requires user confirmation before writing code.
- `matched=false` / unavailable / timeout → `agents-workflow` + minimal code reading + hypothesis list, continue task.

## P2.5: Knowledge Storage Rules {#p25-knowledge-storage}

LightRAG has no `content_hash` / `memory_update` style incremental update; storage and updates follow these conventions.

**Single insert**: `insert_text`, embed structured prefix at start of body:

```
[tags: decision,api] [type: decision] [date: YYYY-MM-DD]
<decision body>
```

**Batch / with metadata**: `insert_texts`, each item has `title` (topic), `content`, `metadata` (e.g. `{ "tags": ["decision","api"], "type": "decision" }`).

**Update strategy**:

- **Change body text** → new `insert_text` / `insert_texts` (may note supersedes / related topic in body)
- **Change graph entity attributes** → `update_entity` (requires known `entity_id`)
- **Change relations** → `update_relation`

**Default strategy (recommended)**: milestones use `insert_text`; multiple items in same session distinguished by `title` + `metadata.tags`, do not rely on dedup update.

**Optional pre-insert check** (see `mcp-routing.mdc` "Pre-insert check"): when user shows **explicit write intent** like "remember / record / update previous decision / update preference", call `check_entity_exists` first; default new entry with `supersedes:` supplements update, **do not** use `update_entity` to change body. Only when old and new conclusions **clearly contradict** and user did not state preference, **ask exactly 1 question** (overwrite / coexist / skip).

**Store only**: technical decisions, architecture choices, problem solutions, user preferences.

### Milestone tags and track gate

If **any** tag in body `[tags: …]` hits **must track** column below → run "Insert confirmation"; if **only** hits "may skip track" column → may skip track.

| Must track (milestone) | May skip track (draft/intermediate) |
| ---------------------- | ----------------------------------- |
| `decision` | `brainstorming` |
| `api` | `debug` |
| `preference` | `note` |
| `plan` | `wip` |
| `ui` | |
| `architecture` | |

Tags not in table: **default to milestone** (must track). `upload_document` always must track.

### Insert confirmation (hard gate)

When `insert_text` / `insert_texts` body tags **hit "must track"** (or `upload_document`):

1. Record returned `track_id` (if none, treat as unconfirmable, follow exception table "Insert incomplete").
2. **Must** call `get_track_status(track_id)`, handle per strategy:
   - **success** → may claim stored, continue delivery.
   - **processing** / **pending** → wait ~**2 seconds** then retry, **max 3 times**; still processing → output "Insert still processing, can verify manually later", **do not block** current task, **do not** claim stored.
   - **failed** → output error summary; **ask once** whether to retry `insert_text`; if user says no or no answer → follow "Insert incomplete".
3. **Before success**: must not tell user "remembered / stored / captured".

**May skip track**: body tags contain **only** "may skip track" column and none from "must track"; if P3 writes must-track tags, **still cannot** skip.

## P3: Task Completion {#p3-task-completion}

Milestone `insert_text` (or `insert_texts`), and run **Insert confirmation** above. If P2 end already wrote and track succeeded, do not repeat.

## Clarification and Fallback {#clarification-and-fallback}

- When context is missing, **ask exactly 1 focused question**.
- MCP unavailable → closest substitute + explanation + hypotheses.
- File permission/path failure → clear error and suggestion.

## Exception Handling Summary {#exception-handling}

| Exception scenario | Behavior |
| ------------------ | -------- |
| `query_text` no relevant knowledge | Output notice, continue |
| P0 retrieval conflicts with code/instruction | **User instruction + repo code > memory**; discard memory with one-line explanation |
| P0 retrieval multiple conflicts | Per "P0 Retrieval Consumption Rules" take latest / supersedes; one-line external summary |
| Insert still processing (after 3 track attempts) | Do not claim stored; note can verify later; task continues |
| Insert incomplete (track failed / no track_id) | Do not claim stored; continue task + explanation; retry `insert_text` once if user agrees |
| `get_track_status` failure | Same as "Insert incomplete" |
| LightRAG consecutive failures | Call `get_health` again (see routing "Fault diagnosis"); if still failing skip knowledge-base steps |
| User mentioned knowledge base but `query_text` not called | **Violation**; call retrieval before implement or deliver; explain to user why it was skipped |
| Skipped LightRAG because `mcps/` has no descriptor | **Forbidden**; must try `CallMcpTool` / equivalent first, fallback only on failure |
| Need to change body text | New `insert_text` / `insert_texts`, not `update_entity` |
| `update_entity` failure / no `entity_id` | Degrade to new `insert_text` |
| Elements not configured / unavailable / timeout | Skip P0.5, `agents-workflow` + minimal reading + hypotheses, non-blocking |
| Codegraph project not initialized (no `.codegraph/`) | Suggest running `codegraph init -i`; this time fallback Grep + Read |
| `codegraph_explore` marks stale / pending sync files | Only stale files verified with Read; trust codegraph for rest |
| `codegraph_explore` result clearly incomplete | Call `codegraph_status` to diagnose; suggest `codegraph init -i` or rebuild index; fallback Grep + Read |
| Headroom MCP unavailable / timeout | Skip compression, use original, **non-blocking** |
| `headroom_compress` failure | Continue with original; **do not** repeatedly retry compression in same task |
| `headroom_retrieve` failure / invalid hash | Fallback to original fetch path (re-Read / `query_text` / search) |
| Accidentally compressed code to be edited | `headroom_retrieve` first to restore, edit by original line numbers |
| Sent sensitive data to Headroom | **Forbidden**; credentials / secrets not compressed |
| No OAS MCP | Read existing code and local spec, list hypotheses |
| File already exists (non-overwrite) | MCP `edit_file` or prompt user |
| Write without prior check | **Forbidden** MCP direct overwrite |
| filesystem MCP unavailable / path not in whitelist | Fallback to host native read/write, explain why |
| MCP read fails once | May fallback host native read; writes still require read-before-write |
| P2 already inserted | P3 do not repeat |
| MCP failure/timeout | Tool name + error + whether fallback |
| Superpowers blocked | Reason + downgrade + hypotheses |
| Too much clarification | Only 1 question |

## Examples {#examples}

- "Implement Workflow per knowledge base" → **first step** `query_text` (explicit trigger) → consumption rules → implement → `insert_text` → deliver after `get_track_status` success
- "User login API" → `query_text` → adjudicate per P0 consumption rules → read existing auth → implement → `insert_text` → deliver after `get_track_status` success
- "Remember to use PostgreSQL" → optional `check_entity_exists` → `insert_text` (`supersedes: PostgreSQL`) → `get_track_status`
- "Create src/utils" → `list_directory` → `create_directory`
- "brainstorm file upload" → see `superpowers-triggers.mdc`
- "app-center filter bug" → skip P1 → `codegraph_callers` / `codegraph_impact` trace call chain → `systematic-debugging` → `verification-before-completion`
- "Where is XX component used / who calls it" → `codegraph_search` → `codegraph_callers` / `codegraph_impact` (**forbidden** to Grep+Read same file after already having source)
- "Analyze this 2000-line log / huge JSON for anomalies" → `headroom_compress` (save hash) → locate on compressed view → `headroom_retrieve(hash)` when exact lines needed → conclude
- "We'll need this large output later" → `headroom_compress` to save window → `headroom_retrieve` by hash when later steps need detail
