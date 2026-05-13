# MCP Handbook (Internal)

Source: `Markdown[MCP]/MCP_use.md`

## Usage principles {#usage-principles}

- State the business goal first, then specify tools and parameters.
- Use backticks consistently for tool names, parameter names, and commands.
- Use semantic placeholders such as `<operationId>` and `<query>`.
- Examples should be copy-paste ready; replace placeholders as needed.

## Superpowers {#superpowers}

### `brainstorming` (ideation and design)

Before building a new feature, clarify requirements, constraints, and design options.  
Trigger phrase: `use brainstorming to help me design this feature`

```text
Please use brainstorming first to clarify this requirement and compare options.
```

### `writing-plans` (task breakdown)

Split complex work into executable steps to avoid rework from jumping straight to code.  
Trigger phrase: `run writing-plans first, do not write code yet`

```text
Please run writing-plans first and break this requirement into executable steps with acceptance criteria.
```

### `test-driven-development` (TDD)

Follow red–green–refactor: write a failing test first, then implement.  
Trigger phrase: `implement this using test-driven-development`

```text
Please implement this feature using test-driven-development: add tests first, then code.
```

### `systematic-debugging` (root cause)

When errors occur, troubleshoot in a structured way instead of guessing.  
Trigger phrase: `use systematic-debugging on this error`

```text
Please use systematic-debugging to find the root cause of this error.
```

### `verification-before-completion` (verify before done)

Before claiming “done”, run a full verification pass.  
Trigger phrase: `after changes, verify thoroughly before concluding`

```text
After finishing, please use verification-before-completion and only conclude once verification passes.
```

### `requesting-code-review` (code review)

After development, run a structured review for quality and design alignment.  
Trigger phrase: `when done, review my code`

```text
Please use requesting-code-review to review all changes from this task.
```

### `finishing-a-development-branch` (branch wrap-up)

After a feature is complete, normalize merge/PR/cleanup.  
Trigger phrase: `feature is done, help me close out this branch`

```text
Please use finishing-a-development-branch to complete the wrap-up for this branch.
```

## Prompt Optimizer {#prompt-optimizer}

### Round 1: submit the raw prompt

Purpose: send the raw requirement and get optimization guidance.  
Input: `originalPrompt`

```text
Please call the promptenhancer tool first with originalPrompt="<your raw requirement>"
```

### Round 2: submit the optimized prompt

Purpose: send your revised prompt and receive a final prompt ready to use.  
Input: `optimizedPrompt`

```text
Please call promptenhancer again with optimizedPrompt="<prompt revised per round-1 guidance>"
```

## Apifox {#apifox}

### Refresh project OAS

Purpose: refresh API documentation.  
Call: `refresh_project_oas_<project_id>`

```text
Please refresh our API docs by calling refresh_project_oas_v5npvj.
```

### Read OAS to generate client code

Purpose: from the project API spec, generate Model and Service layers for `<operationId>`.  
Call: `read_project_oas_<project_id>`

```text
Based on the project API spec, generate Model and Service code for <operationId>.
```

### Read OAS referenced resources for impact analysis

Purpose: assess blast radius of schema changes from existing models.  
Call: `read_project_oas_ref_resources_<project_id>`

```text
I need to add an avatar field to the user profile response. Based on the current data model, tell me which code must change together.
```

## Memory {#memory}

### Common capabilities

- Store: `memory_store`, `memory_store_session`
- Search: `memory_search`, `memory_list`
- Update/delete: `memory_update`, `memory_delete`
- Health/stats: `memory_health`, `memory_stats`

### Tool list (aligned with local `user-memory` config)

- Write and retrieve:
  - `memory_store`: store one memory (supports `conversation_id`, `tags`).
  - `memory_store_session`: store a full session (`turns` array).
  - `memory_search`: semantic/exact/hybrid search (time, tags, quality weighting).
  - `memory_list`: paginated listing (`tags`, `memory_type` filters).
- Maintenance:
  - `memory_update`: update metadata by `content_hash` (`tags`, `memory_type`, etc.).
  - `memory_delete`: delete by hash, tags, time range (supports `dry_run`).
  - `memory_cleanup`: dedupe / cleanup noisy memories.
- Conflicts and quality:
  - `memory_conflicts`: list conflicting memories.
  - `memory_resolve`: resolve conflicts (`winner_hash` / `loser_hash`).
  - `memory_quality`: scoring and analysis (`rate/get/analyze`).
- Graph and ingestion:
  - `memory_graph`: graph queries (`connected/path/subgraph`).
  - `memory_harvest`: extract decisions, bugs, conventions from sessions.
  - `memory_ingest`: import files/dirs into the store (PDF/TXT/MD/JSON).
- System:
  - `memory_health`: database health.
  - `memory_stats`: cache and performance stats.

### Quick examples

```text
Remember: <content to save>
What did we decide earlier about <topic>?
```

### Manual tool invocation examples

```text
@user-memory memory_store content="Remember: DB connection string is postgresql://user:pass@localhost/db" metadata={"tags":"database,connection"}
@user-memory memory_search query="database connection string" mode="semantic"
@user-memory memory_list page=1 page_size=20
@user-memory memory_update content_hash="<content_hash>" updates={"tags":"database,connection,important"}
@user-memory memory_delete content_hash="<content_hash>" dry_run=true
@user-memory memory_health
@user-memory memory_stats
```

## FileSystem {#filesystem}

### `read_text_file`

Purpose: read a text file at the given path.

```text
Read the contents of config.json at the project root.
```

### `write_file`

Purpose: create a new file or overwrite an existing one.

```text
On my Desktop Script folder, create hello.py that prints "Hello, World!".
```

### `edit_file`

Purpose: precise content edits (supports dry-run preview).

```text
Change "Hello, World!" in hello.py to "Hello, MCP!".
```

### `create_directory`

Purpose: create a folder under allowed paths.

```text
Under <target path>, create directory <dir name>.
```

### `list_directory`

Purpose: list files and subdirectories.

```text
List all file and subdirectory names under my Desktop AOSP folder.
```

::: tip Note
This page is generated from `Markdown[MCP]/MCP_use.md` for deployment.
:::
