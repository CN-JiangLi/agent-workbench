# Filesystem MCP

> Server：`user-filesystem` / `filesystem`

**默认**文件读写通道。跨环境优先 MCP，不可用时回退宿主原生工具（Cursor Read/Write/StrReplace 等）。

## 工具列表

| 工具 | 用途 |
| ---- | ---- |
| `read_text_file` | 读文本文件（**优先**） |
| `read_file` | 读文件（支持 head/tail） |
| `read_multiple_files` | 批量读取 |
| `read_media_file` | 读媒体文件 |
| `write_file` | 写文件（**必须先读检查是否存在**） |
| `edit_file` | 精确编辑已存在文件 |
| `move_file` | 移动/重命名 |
| `list_directory` | 列出目录 |
| `list_directory_with_sizes` | 列出目录（含大小） |
| `list_allowed_directories` | 查看白名单根路径 |
| `directory_tree` | 目录树 |
| `search_files` | 按文件名/路径模式搜索 |
| `get_file_info` | 文件元信息 |
| `create_directory` | 创建目录 |

## 读写策略

### 读

1. `read_text_file`（优先）或 `read_file`
2. 路径不确定时先 `list_allowed_directories`
3. MCP 失败一次 → 回退宿主 Read，一句话说明原因

### 写

1. **必须先** `read_text_file` 检查是否存在
2. 不存在 → `write_file` 创建
3. 已存在且非覆盖 → `edit_file`
4. **禁止**未检查存在性直接 `write_file` 覆盖

### 搜索

| 需求 | 优先 |
| ---- | ---- |
| 符号 / 调用链 / 影响面 | Codegraph |
| 精确字符串 / i18n key | 宿主 Grep |
| 文件名 / 路径模式 | `search_files` |
| 目录结构 | `directory_tree` |

## 白名单配置

`list_allowed_directories` 返回的根路径必须**覆盖**工作区根目录。

| 场景 | 推荐根路径 |
| ---- | ---------- |
| 仅前端仓 | `…/AOPS/ui` |
| Monorepo | `…/AOPS` |

**不推荐**只配 `…/ui/src` — 会导致读 `.cursor/rules`、`package.json` 失败。

配置示例见 [宿主配置检查清单](./host-setup.md)。

## 使用示例

```text
读取项目根目录 package.json
```

```text
将 hello.py 中的 "Hello, World!" 改为 "Hello, MCP!"
```

```text
在 src/utils 下创建 helpers 目录（先检查是否存在）
```

## 相关

- [场景路由 · 文件 I/O](../agent-workflow/mcp-routing#文件-io-策略跨环境优先-mcp)
- [宿主配置 · 白名单](./host-setup.md#2-filesystem-白名单关键)
