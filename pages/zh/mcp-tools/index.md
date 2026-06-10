# MCP Tools 总览

> 工作流规则中使用的 MCP Server 与工具速查。以宿主实际加载的 MCP 描述符为准。

## 已配置 Server（6 个）

| Server | 别名 | 用途 | 文档 |
| ------ | ---- | ---- | ---- |
| `user-daniel_lightrag_mcp` | `daniel_lightrag_mcp` | 跨会话知识库（P0/P2.5/P3） | [LightRAG](./lightrag.md) |
| `user-filesystem` | `filesystem` | 默认文件读写 | [Filesystem](./filesystem.md) |
| `user-prompt-optimizer` | `prompt-optimizer` | P1 提示优化 | [Prompt Optimizer](./prompt-optimizer.md) |
| `project-0-ui-codegraph` | `codegraph` | 代码图谱 | [Codegraph](./codegraph.md) |
| `user-headroom_mcp` | `headroom_mcp` | 上下文压缩（横切） | [Headroom](./headroom.md) |
| `cursor-ide-browser` | — | 浏览器自动化 | [Browser](./browser.md) |

**别名规则**：禁止因 `user-` 前缀差异放弃调用；以宿主 MCP 列表实际名称为准，能力对齐即可。

## 可选 / 未配置

| Server | 说明 |
| ------ | ---- |
| `Elements` | P0.5 UI 规范（`get_project_guidance`）；未配置则跳过 |
| `user-memory-service` | 已迁移至 LightRAG，**勿引用** `memory_*` |
| `user-ads-mcp` / `user-forge` / `user-mcp-code-gen-kd` | 暂不路由 |
| Apifox OAS | **勿引用** `refresh_project_oas_*` / `read_project_oas_*` |

## 工作流阶段与工具映射

```
P0  query_text                          → LightRAG
P0.5 get_project_guidance               → Elements（可选）
P1  promptenhancer                      → Prompt Optimizer
P2  codegraph_* / filesystem / browser  → 场景路由
⟂   headroom_compress / retrieve        → Headroom（横切）
P2.5 insert_text / get_track_status     → LightRAG
P3  insert_text + track                 → LightRAG
```

## 宿主配置

新环境接入、白名单、`mcp.json` 配置详见 [宿主配置检查清单](./host-setup.md)。

## 底层服务

| 服务 | 文档 |
| ---- | ---- |
| LightRAG RAG 引擎 | [Serve · LightRAG](../servers/lightrag.md) |
| Codegraph 代码图谱 | [Serve · Codegraph](../servers/codegraph.md) |
| Headroom 上下文压缩 | [Serve · Headroom](../servers/headroom.md) |
