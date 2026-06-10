# MCP Workflow · Prompt Optimization (P1)

**Server / tool**: `user-prompt-optimizer` · `promptenhancer` (params: `originalPrompt` / `optimizedPrompt`, optional strings, one per round).

## Order vs P0 (Hard Constraint)

- P0 (knowledge retrieval) **before** P1. If both hit: `query_text` first, then `promptenhancer`.
- When user mentions knowledge base / LightRAG / daniel_lightrag, **never** use P1 instead of or before P0.

## Trigger

Requirement is vague, too short, or missing key constraints.

## Do Not Trigger

- "Just do it" / "don't optimize"
- Clear single-step (rename field, one command)
- Bug with stack trace / file / repro
- User provided full spec / YAML / API doc
- Read-only tasks (rule review, concept explanation, code review) — aligned with `mcp-core` negative list

## vs brainstorming

**Pick one, not both**: vague requirement → `promptenhancer`; multi-option comparison → `brainstorming` (see `superpowers-triggers`).

## Two-Round Flow

1. **Round 1**: `originalPrompt="<user raw requirement>"` → optimization guide (do not end task with guide alone).
2. **Round 2**: `optimizedPrompt="<prompt revised per guide>"` → executable final spec.

## Fast Path (Default)

Complete both rounds in one turn then **implement directly**; pause for confirmation only when product tradeoffs, security, or multi-option decisions need user input.

## Skip Round 1

When user already provides an optimized prompt, go straight to round 2.
