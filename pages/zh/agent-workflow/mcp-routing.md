# MCP 工作流 · 场景路由

## 已启用 MCP 能力矩阵（维护时以此为准）

> 以宿主实际加载的 MCP 描述符为准；下表为本工作区当前**已配置**的 6 个 server。

| Server | 工具 / 资源 | 用途 |
| ------ | ----------- | ---- |
| `user-daniel_lightrag_mcp`（别名见下表） | `query_text`, `query_text_stream`, `insert_text`, `insert_texts`, `upload_document`, `get_documents`, `get_documents_paginated`, `get_document_status_counts`, `get_knowledge_graph`, `get_graph_labels`, `scan_documents`, `get_health`, `get_pipeline_status`, `get_track_status`, `update_entity`, `update_relation`, `delete_document`, `delete_entity`, `delete_relation`, `check_entity_exists` | 跨会话知识库（LightRAG） |
| `user-filesystem` | `read_text_file`, `read_file`, `read_multiple_files`, `read_media_file`, `write_file`, `edit_file`, `move_file`, `list_directory`, `list_directory_with_sizes`, `list_allowed_directories`, `directory_tree`, `search_files`, `get_file_info`, `create_directory` | **默认**文件读写（见下节） |
| `user-prompt-optimizer` | `promptenhancer`（`originalPrompt` / `optimizedPrompt`） | 两轮提示优化（见 `mcp-prompt-optimizer.mdc`） |
| `cursor-ide-browser` | `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_click`, `browser_type`, `browser_cdp`, `browser_tabs`, `browser_lock`, … | 浏览器自动化（**仅用户明确要求时**，见下文「浏览器自动化」） |
| `project-0-ui-codegraph`（别名见下表） | `codegraph_explore`, `codegraph_search`, `codegraph_callers`, `codegraph_callees`, `codegraph_impact`, `codegraph_node`, `codegraph_files`, `codegraph_status` | 仓库代码图谱（符号 / 调用链 / 影响面，见下文「代码理解」） |
| `user-headroom_mcp`（别名见下表） | `headroom_compress`, `headroom_retrieve`, `headroom_stats` | 上下文压缩（Headroom；压大输出省 token、可逆取回，**横切能力**，见下文「上下文压缩」与 `mcp-core.mdc`） |

**当前未配置（如宿主后续启用，再按可选处理）**：

- `Elements`（`get_project_guidance`）— UI/表格/布局项目指导，见 `mcp-core.mdc` P0.5；未配置则跳过该步。
- `user-memory-service`、`user-ads-mcp`、`user-forge`、`user-mcp-code-gen-kd` — 暂不路由。

**勿引用未安装工具**：`refresh_project_oas_*` / `read_project_oas_*`；`memory_*` 系列（记忆能力已由 LightRAG 承担）。

**LightRAG 按需工具**：`get_track_status`（里程碑入库确认，见 `mcp-core.mdc`）、`check_entity_exists`（入库前可选）、`get_health`（**故障时**，非每会话）、`get_pipeline_status`、`scan_documents`、`delete_document`、`upload_document`、`get_documents_paginated`、`get_knowledge_graph`（审查用）。

### LightRAG Server 别名（择可用者，禁止因名称放弃调用）

| 宿主显示名 | 说明 |
| ---------- | ---- |
| `user-daniel_lightrag_mcp` | Cursor / 规则中的 canonical 名 |
| `daniel_lightrag_mcp` | 用户口语或部分宿主配置中的简称 |

二者指向同一 LightRAG 服务。**禁止**因名称前缀差异（`user-` 与否）放弃调用。

### Codegraph Server 别名（择可用者，禁止因名称放弃调用）

| 宿主显示名 | 说明 |
| ---------- | ---- |
| `project-0-ui-codegraph` | 本工作区当前 canonical 名 |
| `codegraph` | `SERVER_METADATA.json` 中 `serverName`，部分宿主简称 |

二者指向同一 Codegraph 服务。**禁止**因名称差异放弃调用。

### Headroom Server 别名（择可用者，禁止因名称放弃调用）

| 宿主显示名 | 说明 |
| ---------- | ---- |
| `user-headroom_mcp` | Cursor / 规则中的 canonical 名 |
| `headroom_mcp` | `SERVER_METADATA.json` 中 `serverName`，部分宿主简称 |

二者指向同一 Headroom 服务。**禁止**因名称前缀差异（`user-` 与否）放弃调用。

## 知识库关键词优先路由

**完整硬门闩见 `mcp-core.mdc`「P0 · 显式触发」**（canonical，勿在此重复展开）。本节仅作路由速查：

用户消息含 **知识库** / **LightRAG** / **daniel_lightrag** 时 → **第一步** `query_text`（`mode: hybrid`，`only_need_context: true`），**先于**读代码、P0.5、P1、实现；仅「跳过知识库 / 跳过记忆」可豁免。改 `.cursor/rules` 本身被要求「按知识库优化」时同样先检索。

## 文件 I/O 策略（跨环境，优先 MCP）

目标：同一套规则在 Cursor、CLI Agent、其他支持 MCP 的宿主中均可执行，**不绑定**某一 IDE 内置工具名。

### 优先级（读 / 写 / 改）

1. **`user-filesystem` MCP**（若宿主已启用且路径在允许目录内）
   - 读：`read_text_file`（优先）或 `read_file`；大文件可用 `head` / `tail`
   - 写：`write_file` 前**必须先** `read_text_file` / `read_file` 检查是否存在
   - 改：已存在且非整文件覆盖 → `edit_file`
   - 目录：存在性 → `list_directory`；树 → `directory_tree`；按名搜 → `search_files`
   - 首次操作或路径不确定：先 `list_allowed_directories`

2. **宿主原生文件工具**（仅当 filesystem MCP 不可用、路径不在白名单、或 MCP 失败一次后回退）
   - 例如 Cursor 的 Read / Write / StrReplace，或其他 Agent 的等价 read / write / patch
   - 回退时**一句话说明**原因（MCP 未配置 / 路径拒绝 / 调用失败）

3. **禁止**：未检查存在性即用 MCP `write_file` 覆盖；虚构未安装的 MCP 工具名。

### 代码 / 文本搜索

| 能力 | 优先 | 回退 |
| ---- | ---- | ---- |
| 理解一块逻辑 / 流程 / 「用在哪」 | `codegraph_explore`（见「代码理解」） | 宿主 Grep + Read |
| 符号在哪 / 谁调用 / 调用链 | `codegraph_search` → `codegraph_callers` / `codegraph_callees` | 宿主 Grep + Read |
| 重构影响面 | `codegraph_impact` | 手动 callers 追踪 |
| 单符号完整实现（含重载） | `codegraph_node`（`includeCode: true`） | Read 指定行 |
| 按文件名 / 路径模式 | `search_files` | 宿主 Glob / 等价工具 |
| 已索引目录结构 | `codegraph_files` | `directory_tree` / 宿主文件树 |
| 按内容正则 / 精确字符串 / i18n key | 宿主 Grep / ripgrep 类工具 | `search_files`（能力有限时） |
| 目录结构概览 | `directory_tree` | `list_directory` 递归或宿主文件树 |

**选择优先级**（与上表配合，避免误用）：

- 需要「谁调用了这个函数 / 这个函数调用了谁 / 影响范围 / 模块流程」→ `codegraph_explore` 或 `codegraph_search` + callers/callees/impact
- 需要「查找某个字符串」（i18n key、常量、错误文案、配置项名）→ 宿主 Grep
- 以上无法满足，或 Codegraph 未初始化 / 索引失败 → 回退 `search_files` + `read_file` / Read

## P2：场景自动路由

### 新功能 / 复杂任务

`query_text`（**用户提知识库时强制第一步**；否则若 P0）→ `promptenhancer`（若 P1）→ `get_project_guidance`（若 P0.5）→ **`codegraph_explore`（仅当需理解现有调用关系时，见「代码理解」）** → 方案 / 实现 → `insert_text`（见 `mcp-core.mdc` 2.5）

可选：「先 brainstorm」→ `superpowers-triggers.mdc`。

### API / 接口开发

1. `codegraph_explore`（目标 service + 调用方）理解现有结构；再按需读类型定义。
2. 若有仓库内 OpenAPI/Swagger，用 MCP 读文件 + 内容搜索；勿虚构 OAS MCP。
3. 完成后 `insert_text`（正文含 `[tags: api,decision]`）。

### UI 实现

`query_text`（**用户提知识库时强制第一步**）→ P0.5 `get_project_guidance`（**仅当 Elements MCP 可用**；否则 `agents-workflow` + 最小阅读）→ 实现 → `verification-before-completion`。

### 文件操作

一律遵循上文 **「文件 I/O 策略（跨环境，优先 MCP）」**。  
改项目代码、改 `.cursor/rules`、改配置与改业务源码**同一套流程**，不单独例外。

### 代码或文件查找

遵循上文 **「代码 / 文本搜索」** 表。

### 目录浏览

优先 `directory_tree`；不可用则 `list_directory`（或 `list_directory_with_sizes` 需大小时）或宿主等价能力。

### 代码理解（`project-0-ui-codegraph`）

补「仓库内符号 / 调用关系 / 影响面」，与 LightRAG（跨会话决策）、Grep（文本匹配）、Read（单文件）**不重复**：LightRAG 答「为什么这样设计」，Codegraph 答「在哪用、谁调谁、改它波及谁」，Grep 答「精确字符串 / 错误信息 / i18n key」。

**优先级**：**不高于 P0 知识库**；位于 P0/P0.5/P1 之后、大范围 `Grep + Read` 之前，作为代码理解默认路径。

**触发策略**：**按需**，非每任务必调。P2 中的 `codegraph_explore` 指**确实需要**理解现有调用关系、模块边界或影响面时才调用。

**触发**（满足任一）：

- 新功能 / 重构 / API 开发，需理解现有调用关系或模块边界
- Bug 修复需追调用链或定位波及范围
- 用户问「这个函数在哪被调用」「修改这里会影响哪些地方」「XX 用在哪」
- 「怎么用 / 架构 / 流程」类探索，且单文件 Read 不足以回答
- 用户明确说「用 codegraph 查」

**不触发**（满足任一即跳过，直接 Read / Grep）：

- 纯新建文件，且无既有依赖需理解
- 简单单文件修改（用户已给 `file:line`、或 Read 单文件即可理解）
- 纯字符串替换、改配置、跑命令、重命名局部变量
- Codegraph 未初始化或索引失败（回退 Grep + Read，见「异常」）
- 用户说「跳过 codegraph」

**工具选择**（与该 server 使用说明对齐）：

| 意图 | 工具 |
| ---- | ---- |
| 理解一块逻辑 / 流程 / 架构（**首选，通常 1 次即够**） | `codegraph_explore`（自然语言或符号名） |
| 只找符号位置 | `codegraph_search`（可加 `kind`） |
| 谁调用 / 调用了谁 | `codegraph_callers` / `codegraph_callees` |
| 改之前看波及 | `codegraph_impact` |
| 单个符号 / 重载完整实现 | `codegraph_node`（`includeCode: true`；`file`+`line` 消歧） |
| 已索引目录结构 | `codegraph_files` |
| 索引健康（**非每会话**；见下） | `codegraph_status` |

**`codegraph_status` 何时调**：**不**在会话开始或每次 explore 前调用。仅在 `codegraph_explore` 结果明显不完整（例如应有调用关系却返回空）、响应含 stale/索引错误、或连续 explore 失败时，再调 `codegraph_status` 诊断；若索引缺失或严重滞后，提示用户运行 `codegraph init -i` 或重建索引。

**硬约束（反模式）**：

- **禁止**：`codegraph_explore` 已返回某文件源码（且未标 stale）后，再对同一文件 Grep + Read 重复探索。
- **禁止**：对多个符号循环 `codegraph_node`；改用一次 `codegraph_explore`。
- 响应含「stale / 待同步文件列表」时，**仅** those 文件用 Read 校对，其余仍信 codegraph。
- **不**用 codegraph 替代写文件、跑测试、lint。
- **不**在「不触发」场景（见上）强行调用 explore。

**异常**：报「项目未初始化（无 `.codegraph/`）」→ 提示可运行 `codegraph init -i`，本次回退 Grep + Read；索引约滞后写入 1 秒。

### 上下文压缩（`user-headroom_mcp`）

横切能力，**不占 P 编号**；任一阶段获取到大输出时按需压缩。**完整策略（触发 / 不触发 / 消费回取 / 安全）见 `mcp-core.mdc`「上下文压缩」**（canonical，勿在此重复展开）。本节仅速查：

| 意图 | 工具 | 说明 |
| ---- | ---- | ---- |
| 压缩大输出省窗口 | `headroom_compress` | content 传大段文本；记下返回的 `hash`；约 ≥400 行 / ≥8KB 且需多步复用时 |
| 取回原文 | `headroom_retrieve` | 凭 `hash`；需精确行号 / 字段 / API 契约时；可选 `query` 局部过滤 |
| 压缩统计 | `headroom_stats` | **仅用户问「省了多少 token」时**调 |

**与其他链路的关系**：

- 不替代 LightRAG / Codegraph / Grep；它压缩**这些来源产出的**大输出，不改变检索与代码理解的优先级。
- **将要编辑的代码不压缩**（需精确行号）；凭证 / 密钥**不送入**压缩。
- `compress` / `retrieve` 计入「噪声边界」，连续调用只出一条合并摘要。
- 不可用 / 超时 / 失败 → 跳过压缩，直接用原文，**不阻塞**任务。

### 浏览器自动化（`cursor-ide-browser`）

**仅当用户明确要求**「打开/操作浏览器」「截图页面」「在页面上点击/填写」「用浏览器验证」等时使用；**不**主动用于绕过缺失的 MCP（如 Elements 未配置时**不得**用浏览器替代）。

- 工作流：`browser_tabs`(list) → `browser_navigate` → 需要时 `browser_lock`(lock) → 交互（`browser_click` / `browser_type` / `browser_snapshot` / `browser_take_screenshot`）→ 完成后 `browser_lock`(unlock)。
- 失败/卡住 4 次内停止，报告现状 + 阻塞点 + 下一步（详见该 server 使用说明）。
- 登录、验证码、需人工确认的破坏性操作 → 停下交回用户，不反复重试。

### 知识库相关（`user-daniel_lightrag_mcp`）

| 操作 | 工具 | 说明 |
| ---- | ---- | ---- |
| 检索 / 回忆 | `query_text` | `mode: hybrid`；**默认** `only_need_context: true`（见 `mcp-core.mdc` P0）；消费见 P0 规范 |
| 单条存储 | `insert_text` | 正文首部 `[tags: …] [type: …] [date: …]`；里程碑后 **必须** `get_track_status` |
| 批量存储 | `insert_texts` | 每项 `title` + `content` + 可选 `metadata`；同上 track 确认 |
| 文件入库 | `upload_document` | `file_path` 指向本地文件；里程碑入库需 track 确认 |
| 入库跟踪 | `get_track_status` | `track_id`；success 继续；processing 等 2s 最多 3 次；failed 见 core 入库确认 |
| 入库前检查 | `check_entity_exists` | 触发：「记住 / 记录 / 更新之前的决策 / 更新偏好」；默认 `supersedes:` 补充；明显矛盾时只问 1 题 |
| 列表 | `get_documents` / `get_documents_paginated` | 分页时 `page_size` 10–100 |
| 统计 | `get_document_status_counts` | 文档状态计数 |
| 图谱 | `get_knowledge_graph` / `get_graph_labels` | **按需**审查；非日常任务流 |
| 扫描新文档 | `scan_documents` | 触发 LightRAG 扫描 |
| 健康检查 | `get_health` | **LightRAG 连续失败时**诊断；环境接入自检见 §4；**非**每会话必调 |
| 更新实体 / 关系 | `update_entity` / `update_relation` | 需已知 ID；改正文用新 `insert_text` |
| 删除 | `delete_document` / `delete_entity` / `delete_relation` | 按 ID 删除；见「知识库运维」 |
| 流式查询 | `query_text_stream` | 长回答场景按需 |

### LightRAG 故障诊断（非日常）

**不**在每条用户消息或会话开始时调用 `get_health`。

**触发**（满足任一）：

- 同任务内 `query_text` / `insert_text` / `get_track_status` **连续 2 次失败**
- 用户报告「知识库不可用 / 检索总失败」

**动作**：`get_health` → 仍失败则跳过 P0/P2.5/P3，说明原因 + 假设，继续当前任务。

### LightRAG 知识库运维（非日常任务流）

**不**写入 alwaysApply 主链路；发版前 / 月度 / 用户明确要求清理时执行：

| 步骤 | 工具 | 说明 |
| ---- | ---- | ---- |
| 1 | `get_document_status_counts` | 了解处理中 / 失败 / 完成规模 |
| 2 | `get_documents_paginated` | `page_size` 20 浏览候选 |
| 3 | `delete_document` | **须人工或用户确认**；不自动批量删 |
| 4 | `get_knowledge_graph` / `get_graph_labels` | 可选：结构审查、排查检索噪声 |

淘汰原则：失败索引、重复且已被 `supersedes` 的旧决策、临时调试入库。

**人工辅助清理流程**（禁止 Agent 自动批量删）：

1. `get_document_status_counts` → 了解规模与失败数。
2. `get_documents_paginated`（`page` 递增，`page_size` 20）→ 按时间或 tags 列出候选，**呈现给用户**。
3. 用户确认 `document_id` 列表后，逐条 `delete_document` 并汇报每条结果。
4. 可选：`get_knowledge_graph` 检查是否仍有孤立实体。

## MCP 宿主配置（按需检索，非 alwaysApply）

详细配置、JSON 示例、白名单、启用验证步骤、FAQ 已写入 LightRAG，**勿**在每条任务中加载全文。

**本地完整版（canonical）**：`.cursor/docs/mcp-routing-host-setup.md` — 含完整 JSON 与 FAQ；LightRAG 侧可用 `insert_texts` / 服务端可访问路径下的 `upload_document` 入库。

**何时查知识库**（`query_text`，`mode: hybrid`，`only_need_context: true`）：

- **用户消息含「知识库」/ LightRAG / daniel_lightrag**（最高优先级，见上文「知识库关键词优先路由」）
- 新环境接入、MCP 总走回退、filesystem path not allowed
- 用户问 mcp.json / 白名单 / server 名称不一致
- 复制规则到其他项目

**推荐 query 示例**：`MCP 宿主配置检查清单 filesystem 白名单 mcp.json AOPS ui`

**routing 内保留的最小要点**：

| 要点 | 结论 |
| ---- | ---- |
| filesystem 白名单 | 必须覆盖工作区根（本仓 `…/AOPS/ui` 或 monorepo `…/AOPS`），勿只配 `src` |
| server 名称 | 以宿主 MCP 列表为准（`user-filesystem` vs `filesystem`），能力对齐即可 |
| LightRAG 故障 | 连续 2 次失败后 `get_health`；仍失败则跳过知识库（见「LightRAG 故障诊断」） |
| 会话开始 | **不**默认 `get_health` |
| 安全 | 规则与示例不写 API Key；`mcp.json` 本机路径通常不入库 |

复制到其他项目：复制 `ui/.cursor/rules/mcp-*.mdc` + `superpowers-triggers.mdc`，并按知识库清单调整白名单根路径。目标项目需先运行 `codegraph init -i`（或在项目根执行 `npx codegraph index --force`）生成 `.codegraph/` 索引目录，否则 Codegraph MCP 工具不可用（规则内回退 Grep + Read）。Headroom 为**宿主级（user-）可选**能力，目标宿主未配置 `user-headroom_mcp` 时规则自动降级（跳过压缩，直接用原文），无需额外初始化。

