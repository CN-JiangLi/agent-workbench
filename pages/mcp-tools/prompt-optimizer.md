# Prompt Optimizer MCP

> Server: `user-prompt-optimizer`  
> Workflow stage: **P1**

Two-round prompt optimization: turn vague requirements into executable specs.

## Tool

| Tool | Param | Round |
| ---- | ----- | ----- |
| `promptenhancer` | `originalPrompt` | 1: raw requirement → optimization guide |
| `promptenhancer` | `optimizedPrompt` | 2: revised prompt → executable final |

## Order vs P0

- P0 **before** P1
- Never use P1 instead of P0 when user mentions "knowledge base"

## Trigger / Skip

| Trigger | Skip |
| ------- | ---- |
| Vague, short, missing constraints | "Just do it" / "don't optimize" |
| | Single-step task, bug with stack trace, full spec |
| | Read-only tasks |

## vs brainstorming

**Pick one**: vague requirement → `promptenhancer`; multi-option comparison → `brainstorming`

## Install

```bash
npm install -g prompt-ops-mcp
```

```json
{
  "user-prompt-optimizer": {
    "command": "npx",
    "args": ["prompt-ops-mcp"]
  }
}
```

## Examples

```text
Call promptenhancer with originalPrompt="build a user login feature"
```

## Related

- [Workflow · P1](../agent-workflow/mcp-prompt-optimizer)
