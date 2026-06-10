# MCP Host Setup Checklist

> Full reference split from `mcp-routing.mdc`. Retrieve via LightRAG `query_text` when needed; routing rules keep only a minimal summary table.
>
> **Search keywords**: MCP host setup, filesystem whitelist, mcp.json, list_allowed_directories, AOPS ui, Cursor MCP config

---

## 1. Required Servers (This Workflow)

| Server (example) | Purpose | If disabled |
| ---------------- | ------- | ----------- |
| `user-daniel_lightrag_mcp` | P0 / P2.5 / P3 knowledge base | Skip KB steps; session context only |
| `user-prompt-optimizer` | P1 `promptenhancer` | Skip prompt optimization |
| `user-filesystem` | Default file I/O | Fall back to host-native read/write |
| Elements (optional) | P0.5 UI guidance | Skip P0.5; use `agents-workflow` + code read |

**Not routed**: `user-memory-service`, `user-ads-mcp`, `user-forge`, `user-mcp-code-gen-kd`.

**Do not reference uninstalled tools**: `refresh_project_oas_*` / `read_project_oas_*`; `memory_*` (migrated to LightRAG).

---

## 2. Filesystem Whitelist (Critical) {#2-filesystem-whitelist}

**Rule**: `list_allowed_directories` roots must **cover** the workspace root.

Recommended for this repo:

| Scenario | Whitelist root |
| -------- | -------------- |
| Frontend repo only | `…/AOPS/ui` |
| Monorepo | `…/AOPS` (includes `ui`, `agents-workflow`, etc.) |

**Not recommended**: only `…/ui/src` — breaks reads of `.cursor/rules`, `package.json`, locales, etc.

**First operation or path failure**: run `list_allowed_directories` first.

---

## 3. Configuration Examples

### 3.1 Cursor (user or project `mcp.json`)

Typical paths:

- `%USERPROFILE%\.cursor\mcp.json`
- or project `.cursor/mcp.json`

Replace `YOUR_WORKSPACE_ROOT` with an absolute path (Windows: forward slashes or escaped backslashes).

```json
{
  "mcpServers": {
    "user-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "YOUR_WORKSPACE_ROOT/AOPS/ui"
      ]
    },
    "user-daniel_lightrag_mcp": {},
    "user-prompt-optimizer": {}
  }
}
```

**Notes**:

- If Cursor injects server names via plugin/enterprise template, **keep existing command/args**; only verify the last `args` entry is the workspace root.
- LightRAG MCP `command` / `args` / env follow team deployment; `{}` in rules means "already configured on host".

### 3.2 Generic / CLI Agent

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/absolute/path/to/AOPS/ui"
      ]
    }
  }
}
```

`user-filesystem` in rules means the **actual filesystem server name** in the host MCP list. If CLI registers `filesystem`, call that name.

### 3.3 Multiple Roots (Optional)

```json
{
  "mcpServers": {
    "user-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "YOUR_WORKSPACE_ROOT/AOPS/ui",
        "YOUR_WORKSPACE_ROOT/AOPS"
      ]
    }
  }
}
```

---

## 4. Post-Enable Verification (Run Once)

| Step | Action | Expected |
| ---- | ------ | -------- |
| 1 | `list_allowed_directories` | Lists absolute paths containing `ui` or `AOPS` |
| 2 | `read_text_file` → `package.json` (workspace root) | Success |
| 3 | `read_text_file` → `.cursor/rules/mcp-core.mdc` | Success |
| 4 | `get_health` | LightRAG healthy |
| 5 | `query_text` query=`test` mode=`hybrid` | Success or empty (not "tool not found") |

Any **tool not found / path not allowed** → fix whitelist or server name; do not rely on fallback long-term.

**Not every session**: do **not** call `get_health` at session start; only after consecutive LightRAG failures.

---

## 5. Security & Repository

- **Never** put API keys, tokens, or private keys in rules or examples.
- `mcp.json` with machine-specific paths usually **not committed**; use `mcp.json.example` as template.
- Whitelist should be **minimal sufficient**; do not expose entire home directory.

---

## 6. FAQ

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| Always falls back to Cursor Read | filesystem off or whitelist missing root | Expand whitelist per §2–3 |
| Can read `src` but not `.cursor` | Whitelist is subdirectory only | Expand to `ui` root |
| LightRAG / `query_text` errors | MCP not started or network | After 2 failures → `get_health`; still fail → skip KB |
| Claimed ingested but not retrievable | No `get_track_status` or track failed | Follow `mcp-core` ingestion confirmation |
| Server name mismatch | Host says `filesystem`, rules say `user-filesystem` | Use host name; align capabilities |
| Elements never called | Not installed | Expected; P0.5 fallback |
| `insert_text` returns duplicated | Server dedupes `text_input.txt` | Use `insert_texts` or `upload_document` |

---

## 7. Copy to Other Projects

1. Copy `mcp-*.mdc` and `superpowers-triggers.mdc` to `.cursor/rules/`.
2. Repeat §2–4 with new repo root in filesystem `args`.
3. Enable `user-daniel_lightrag_mcp`, `user-prompt-optimizer` as needed.
4. Keep `AGENTS.md` conventions for Elements / `agents-workflow`.
5. `upload_document` this checklist to new project LightRAG, or `query_text` and adapt paths.

---

## 8. Relation to alwaysApply Rules

| File | Responsibility |
| ---- | -------------- |
| `mcp-core.mdc` | P0/P2.5/P3, retrieval consumption, ingestion track |
| `mcp-routing.mdc` | Routing, tool matrix, diagnostics; **not** this full doc |
| This appendix | Host setup, JSON examples, verification, FAQ |

Load this appendix only for **MCP config / whitelist / new environment** questions — not on every coding task.
