# Codegraph MCP

> Server: `project-0-ui-codegraph` / `codegraph`  
> Underlying service: [Serve · Codegraph](../servers/codegraph.md)

Repository code graph: symbol locations, call chains, blast radius. Runs after P0/P0.5/P1, before broad Grep.

## Tools

| Tool | Purpose |
| ---- | ------- |
| `codegraph_explore` | Understand logic/flow/architecture (**preferred, usually once**) |
| `codegraph_search` | Find symbol location (optional `kind`) |
| `codegraph_callers` | Who calls this symbol |
| `codegraph_callees` | What this symbol calls |
| `codegraph_impact` | Blast radius before changes |
| `codegraph_node` | Full implementation (`includeCode: true`) |
| `codegraph_files` | Indexed directory structure |
| `codegraph_status` | Index health (**on failure only**) |

## When to Trigger

**Trigger** (any):

- New feature / refactor / API needing call relationships
- Bug needing call-chain tracing
- "Where is this called?" / "What breaks if I change this?"
- User says "use codegraph"

**Skip**:

- New file with no existing dependencies
- Simple single-file edit (user gave `file:line`)
- String replace, config change only
- Not initialized (no `.codegraph/`) → suggest `codegraph init -i`
- User says "skip codegraph"

## Hard Constraints

- **Forbidden**: Grep + Read same file after `explore` already returned source
- **Forbidden**: Loop `codegraph_node`; use one `explore` instead
- Only **stale** files need Read verification
- Do not replace writing files, tests, or lint with codegraph

## Examples

```text
What is the call chain for app-center filter logic?
```

```text
What breaks if I change UserService.login?
```

## Related

- [Routing · Code understanding](../agent-workflow/mcp-routing#code-understanding-project-0-ui-codegraph)
- [Serve · Codegraph](../servers/codegraph.md)
