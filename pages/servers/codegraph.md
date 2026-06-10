# Codegraph

> Serve layer · [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)

**Pre-indexed code knowledge graph** for Claude Code, Cursor, Codex, Gemini, and other agents: fewer tokens, fewer tool calls, 100% local.

## Division of Labor

| Source | Answers |
| ------ | ------- |
| LightRAG | Why it was designed this way (cross-session decisions) |
| **Codegraph** | Where it's used, who calls whom, blast radius |
| Grep | Exact strings / i18n keys / error messages |

## Quick Start

### 1. Install CLI

```bash
npm install -g @colbymchenry/codegraph
# or one-shot
npx @colbymchenry/codegraph
```

### 2. Wire Agents

```bash
codegraph install
```

Auto-configures Cursor, Claude Code, Codex CLI, OpenCode, Gemini, etc.

### 3. Initialize Project

```bash
cd your-project && codegraph init -i
```

Creates `.codegraph/`. **Without it, MCP tools are unavailable** — workflow falls back to Grep + Read.

### 4. Restart Agent

Restart Cursor (or other host) to load the MCP server.

## How It Works

```
Source files → tree-sitter index → .codegraph/ SQLite graph → MCP tools
```

- **Auto-sync**: OS file events, 2s debounce, incremental
- **Stale banner**: Lagging files flagged; Agent Read only those
- **Connect-time catch-up**: Reconcile on MCP reconnect

## CLI Commands

```bash
codegraph init -i
codegraph index --force
codegraph sync
codegraph status
codegraph serve --mcp
codegraph uninit
codegraph uninstall
```

## Team Deployment

| Component | Notes |
| --------- | ----- |
| Script | `StartScript/MCP_Codegraph_serve.sh` |
| Port | `9623` (HTTP bridge) |
| Project dir | Set `PROJECT_DIR` in script |

Server names: `project-0-ui-codegraph` or `codegraph` — equivalent.

## MCP Tools

See [MCP Tools · Codegraph](../mcp-tools/codegraph.md).

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| Not initialized | `codegraph init -i` |
| MCP won't connect | Verify index; test `codegraph serve --mcp` |
| Missing symbols | Wait 2s or `codegraph sync` |
| `database is locked` | Restart MCP; check duplicate instances |

## Related

- [GitHub](https://github.com/colbymchenry/codegraph)
- [MCP Tools](../mcp-tools/codegraph.md)
- [Routing · Code understanding](../agent-workflow/mcp-routing#code-understanding-project-0-ui-codegraph)
