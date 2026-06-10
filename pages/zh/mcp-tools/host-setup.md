# MCP 宿主配置检查清单

> 从 `ui/.cursor/rules/mcp-routing.mdc` 拆出的完整参考。按需通过 LightRAG `query_text` 检索；routing 规则内仅保留最小要点表。
>
> **检索关键词**：MCP 宿主配置、filesystem 白名单、mcp.json、list_allowed_directories、AOPS ui、Cursor MCP 配置

---

## 1. 必备 Server（与本仓库工作流）

| Server 标识（示例） | 用途 | 未启用时 |
| ------------------- | ---- | -------- |
| `user-daniel_lightrag_mcp` | P0 / P2.5 / P3 知识库 | 跳过知识库步骤，仅当前会话上下文 |
| `user-prompt-optimizer` | P1 `promptenhancer` | 跳过提示优化，直接实现 |
| `user-filesystem` | 默认文件读写 | 全部回退宿主原生读写 |
| Elements（可选） | P0.5 UI 规范 | 跳过 P0.5，`agents-workflow` + 代码阅读 |

**暂不路由**：`user-memory-service`、`user-ads-mcp`、`user-forge`、`user-mcp-code-gen-kd`。

**勿引用未安装工具**：`refresh_project_oas_*` / `read_project_oas_*`；`memory_*` 系列（已迁移至 LightRAG）。

---

## 2. filesystem 白名单（关键）

**原则**：`list_allowed_directories` 返回的根路径必须**覆盖**当前工作区根目录。

本仓库推荐：

| 场景 | 白名单根路径 |
| ---- | ------------ |
| 仅前端仓 | `…/AOPS/ui` |
| Monorepo 协作 | `…/AOPS`（含 `ui`、`agents-workflow` 等） |

**不推荐**：只配 `…/ui/src` 子目录——会导致读 `.cursor/rules`、`package.json`、locales 等失败并频繁回退。

**首次操作或 path 失败**：先 `list_allowed_directories` 核对。

---

## 3. 配置示例

### 3.1 Cursor（用户或项目 `mcp.json`）

路径通常为：

- `%USERPROFILE%\.cursor\mcp.json`
- 或项目 `.cursor/mcp.json`

将 `YOUR_WORKSPACE_ROOT` 换为绝对路径（Windows 建议正斜杠或转义反斜杠）。

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

**注意**：

- 若 Cursor 里 server 显示名由插件/企业模板注入，**保留宿主已有 command/args**，仅确认 `args` 末项为工作区根。
- LightRAG MCP 的 `command` / `args` / 环境变量以团队实际部署为准；规则中 `{}` 表示「宿主已配置」。

### 3.2 通用 / CLI Agent

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

规则中的 `user-filesystem` 指**宿主 MCP 列表里 filesystem 类 server 的实际名称**。若 CLI 注册名为 `filesystem`，Agent 应调用该名，与能力矩阵一致即可。

### 3.3 多根目录（可选）

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

## 4. 启用后验证（建议人工或 Agent 执行一次）

| 步骤 | 操作 | 期望 |
| ---- | ---- | ---- |
| 1 | `list_allowed_directories` | 列出含 `ui` 或 `AOPS` 的绝对路径 |
| 2 | `read_text_file` 读 `package.json`（工作区根） | 成功 |
| 3 | `read_text_file` 读 `.cursor/rules/mcp-core.mdc` | 成功 |
| 4 | `get_health` | LightRAG 服务正常 |
| 5 | `query_text` query=`test` mode=`hybrid` | 成功或空结果（非工具不存在） |

任一步 **工具不存在 / path not allowed** → 修正白名单或 server 名称后重试，勿长期依赖回退。

**非每会话必跑**：会话开始**不**默认 `get_health`；仅 LightRAG 连续失败时诊断（见 `mcp-routing.mdc`「LightRAG 故障诊断」）。

---

## 5. 安全与仓库

- **勿**在规则或示例中写入 API Key、token、私钥；MCP 配置里的密钥用宿主「已配置」表述。
- `mcp.json` 若含本机绝对路径，通常**不入库**；团队可提交 `mcp.json.example` 作模板。
- 白名单宜 **最小够用**；不必开放整个用户主目录。

---

## 6. 常见问题（FAQ）

| 现象 | 可能原因 | 处理 |
| ---- | -------- | ---- |
| 总是回退 Cursor Read | filesystem 未启用或白名单不含工作区根 | 按 §2–3 扩大白名单 |
| 能读 `src` 不能读 `.cursor` | 白名单只配了子目录 | 扩大到 `ui` 根 |
| LightRAG / `query_text` 报错 | daniel_lightrag_mcp 未启动或网络 | 连续 2 次失败后 `get_health`；仍失败则「跳过知识库」 |
| 宣称已入库但检索不到 | 未 `get_track_status` 或 track 失败 | 按 `mcp-core.mdc` 入库确认 |
| server 名不一致 | 宿主叫 `filesystem`，规则写 `user-filesystem` | 以宿主名为准，能力对齐即可 |
| Elements 从不调用 | 未安装 | 预期；走 P0.5 回退 |
| `insert_text` 返回 duplicated | 服务端对 `text_input.txt` 去重 | 改用 `insert_texts` 或 `upload_document` 独立文件 |

---

## 7. 复制到其他项目

1. 复制 `ui/.cursor/rules/mcp-*.mdc` 与 `superpowers-triggers.mdc`。
2. 在新仓库重复 §2–4，把 filesystem `args` 末项改为**新仓库根**。
3. 按需启用 `user-daniel_lightrag_mcp`、`user-prompt-optimizer`。
4. 保留 `AGENTS.md`（或等价）中与 Elements / `agents-workflow` 的约定。
5. 将本附录 `upload_document` 到新项目 LightRAG，或 `query_text` 检索后按新项目路径改写白名单。

---

## 8. 与 alwaysApply 规则的关系

| 文件 | 职责 |
| ---- | ---- |
| `mcp-core.mdc` | P0/P2.5/P3、检索消费、入库 track |
| `mcp-routing.mdc` | 场景路由、工具矩阵、故障诊断、运维；**不含**本节全文 |
| 本附录（LightRAG） | 宿主配置、JSON 示例、验证、FAQ |

Agent 仅在 **MCP 配置 / 白名单 / 新环境接入** 类问题时检索本附录，勿在每条 coding 任务加载全文。
