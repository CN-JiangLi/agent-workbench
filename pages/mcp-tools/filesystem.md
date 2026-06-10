# Filesystem MCP

> Server: `user-filesystem` / `filesystem`

**Default** file I/O channel. Prefer MCP across environments; fall back to host-native tools (Cursor Read/Write/StrReplace) when unavailable.

## Tools

| Tool | Purpose |
| ---- | ------- |
| `read_text_file` | Read text (**preferred**) |
| `read_file` | Read file (supports head/tail) |
| `read_multiple_files` | Batch read |
| `read_media_file` | Read media |
| `write_file` | Write (**must read first to check existence**) |
| `edit_file` | Precise edit on existing file |
| `move_file` | Move/rename |
| `list_directory` | List directory |
| `list_directory_with_sizes` | List with sizes |
| `list_allowed_directories` | View whitelist roots |
| `directory_tree` | Directory tree |
| `search_files` | Search by filename/path pattern |
| `get_file_info` | File metadata |
| `create_directory` | Create directory |

## Read/Write Policy

### Read

1. `read_text_file` (preferred) or `read_file`
2. If path uncertain → `list_allowed_directories` first
3. One MCP failure → fall back to host Read with one-line reason

### Write

1. **Must** `read_text_file` to check existence first
2. Not exists → `write_file` to create
3. Exists and not full overwrite → `edit_file`
4. **Forbidden**: `write_file` overwrite without existence check

### Search

| Need | Prefer |
| ---- | ------ |
| Symbols / call chains / impact | Codegraph |
| Exact string / i18n key | Host Grep |
| Filename / path pattern | `search_files` |
| Directory structure | `directory_tree` |

## Whitelist

`list_allowed_directories` roots must **cover** the workspace root.

| Scenario | Recommended root |
| -------- | ---------------- |
| Frontend repo only | `…/AOPS/ui` |
| Monorepo | `…/AOPS` |

**Not recommended**: only `…/ui/src` — breaks reads of `.cursor/rules`, `package.json`, etc.

See [Host Setup](./host-setup.md).

## Examples

```text
Read package.json at project root
```

```text
Change "Hello, World!" to "Hello, MCP!" in hello.py
```

## Related

- [Routing · File I/O](../agent-workflow/mcp-routing#file-io-strategy)
- [Host Setup · Whitelist](./host-setup#2-filesystem-whitelist)
