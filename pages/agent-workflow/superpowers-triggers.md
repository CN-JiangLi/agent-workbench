# MCP Workflow · Superpowers

Cognitive flows (ideation / planning / TDD / debugging / verification / review) **do not depend on external MCP** — execute per this section. Exception: conclusions may be stored via LightRAG `insert_text` (with `[tags: …]`, see `mcp-core` §2.5).

## Relation to SKILL.md

- When host injects skill paths (Cursor `agent_skills`, etc.), **no need** to read files; on conflict, SKILL wins.
- Read `SKILL.md` only when this section is insufficient; on read failure, degrade and continue.

## Does Not Replace Elements or LightRAG

- **LightRAG**: User mentions knowledge base → **must** `query_text` first (see `mcp-core` explicit trigger).
- **Elements**: UI/table/layout tasks → P0.5 when Elements available; else `mcp-core` fallback.

## Explicit Triggers

| Skill | Trigger examples |
| ----- | ---------------- |
| `brainstorming` | "use brainstorming to design…", "brainstorm first" |
| `writing-plans` | "run writing-plans", "break down this task" |
| `test-driven-development` | "implement with TDD" |
| `systematic-debugging` | "systematic-debugging", "find root cause" |
| `verification-before-completion` | "verify thoroughly before concluding" |
| `requesting-code-review` | "review my changes", "code review" |
| `finishing-a-development-branch` | "wrap up this branch", "finish the feature" |

## Auto Mapping

| Scenario | Skill |
| -------- | ----- |
| Errors / test failures / unexpected behavior | `systematic-debugging` |
| Claims "done" / "fixed" / "ready" | `verification-before-completion` (**default gate**) |

## Skill Essentials

- **brainstorming**: boundaries → 2–3 options → recommendation → optional `insert_text([tags: brainstorming] …)` (may skip track)
- **writing-plans**: subtasks + acceptance criteria → checklist → user confirm → implement → `insert_text([tags: plan] …)` (must track)
- **test-driven-development**: red → green → refactor; no test framework → explain blocker + manual checklist
- **systematic-debugging**: evidence → hypothesis → verify → root cause + fix → regression
- **verification-before-completion**: impact → test/typecheck/lint → report; **do not say "task complete" until all pass**
- **requesting-code-review**: diff by severity / suggestion / question
- **finishing-a-development-branch**: tests → PR/merge (git needs user approval) → wrap-up report

## Execution Exceptions

Cannot proceed (no test framework, Elements unavailable, etc.) → blocker reason + degradation + assumptions.
