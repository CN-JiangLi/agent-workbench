# MCP 工作流 · 核心

> 配套规则（同目录）：`mcp-routing.mdc`（场景路由、MCP 矩阵；**宿主配置详情见 LightRAG**）、`mcp-prompt-optimizer.mdc`（P1）、`superpowers-triggers.mdc`（认知技能）。

## MCP 配置现状（以宿主实际加载为准）

- **已配置（6）**：`user-daniel_lightrag_mcp`（LightRAG 知识库）、`user-filesystem`（文件读写）、`user-prompt-optimizer`（`promptenhancer`）、`cursor-ide-browser`（浏览器自动化，**仅用户明确要求时**用）、`project-0-ui-codegraph`（代码图谱，别名 `codegraph`；理解符号 / 调用链 / 影响面）、`user-headroom_mcp`（上下文压缩，别名 `headroom_mcp`；压大输出省 token，可逆，**横切能力非 P 阶段**，见下文「上下文压缩」）。能力矩阵见 `mcp-routing.mdc`。
- **可选 / 当前未配置**：**Elements**（`get_project_guidance`）。默认按「未配置 / 不可用」处理，**不阻塞**任务。
- 仅当宿主已启用 Elements MCP 且调用成功时，才执行 P0.5；否则直接：`agents-workflow` + 目标代码最小阅读 + 假设列表（与 `AGENTS.md` 意图一致）。

## 目标

- 通过 LightRAG 知识库保持上下文连续性。
- 在需求模糊时先优化提示，再进入实现（见 `mcp-prompt-optimizer.mdc`）。
- 按用户意图自动路由到合适的 MCP 工具链（见 `mcp-routing.mdc`）；文件读写**优先** `user-filesystem`，见 routing「跨环境」节。
- 在关键节点沉淀决策，便于后续复用。
- 对 MCP 与 Superpowers 执行保持可观测。

## 与 AGENTS.md 的分层

| 层级 | 来源 | 管什么 |
| ---- | ---- | ------ |
| 历史决策 / 跨会话记忆 | LightRAG `query_text`（`user-daniel_lightrag_mcp`） | 架构意图、过往决策、组件文档、checklist |
| 仓库结构与调用关系 | Codegraph `codegraph_explore` 等（`project-0-ui-codegraph`） | 符号在哪、谁调谁、改动影响面、流程路径 |
| 仓库实现规范 | Elements `get_project_guidance`（**可选**，当前未配置则跳过） | 表格、布局、i18n、组件模式 |
| 通用工程方法 | Superpowers（`superpowers-triggers.mdc`） | 构思、计划、TDD、调试、验证、评审 |
| 上下文压缩（横切） | Headroom `headroom_compress` / `headroom_retrieve`（`user-headroom_mcp`） | 压缩已获取的大输出省 token、可逆取回；**不产生内容**，见下文「上下文压缩」 |
| 流程编排 | 本目录规则 | 何时走哪条链路 |

**显式顺序（用户提知识库时）**：`P0 query_text` → `P0.5 Elements`（若可用）→ `P1 promptenhancer`（若需求模糊）→ 读代码 / 实现。

**Superpowers 不替代 Elements**：UI/表格/布局类任务，Elements（可用时）优先于 `brainstorming`。

## MCP 工具调用可观测性（全局）

约束**所有** MCP 调用及 Superpowers 流程。

### 调用前

- **意图**：一句话说明为何调用、期望产出。
- **定位**：**server / 工具名**（与 MCP 描述符一致）。
- **参数摘要**：路径、`query`、`mode`、`text` 等；凭证类仅写「已配置 / 已脱敏」。
- 同一任务内连续调用可用「步骤 1/2/…」编号。

### 调用后

- **状态**：成功 / 失败 / 部分成功。
- **结果摘要**：条数、关键字段；禁止堆砌超大正文。
- **失败**：保留可操作的 message/code，并走「异常处理汇总」回退。
- **回退**：显式写出分支名与 1～3 条假设。

### 噪声边界（硬性）

- 同一用户任务内 **≥2 次连续 MCP 调用**：对用户**只输出一条合并摘要**（状态 + 关键结果）；逐步意图与参数在内部执行，不逐步刷屏。
- 用户说「详细日志」「逐步说明」时，才可逐步展开。
- 低风险只读探测（如 `list_directory`）与后续写操作合并为一段。

**合并摘要示例（对用户）：**

> 步骤 1–3：知识库检索、检查目录、读取配置 → 均成功。开始实现。

**禁止：** 每个 MCP 各写一段「调用前计划 + 调用后报告」。

## 总决策树（按序判断）

```
用户消息
  ├─ 「跳过记忆」/「跳过知识库」→ 跳过 P0
  ├─ 含「知识库」/ LightRAG / daniel_lightrag → P0 强制优先（见下节，覆盖负向清单）
  ├─ 「直接干」/「别优化」→ 跳过 P1（不跳过 P0 若已命中知识库显式触发）
  ├─ P0 知识检索（条件触发）
  ├─ P0.5 Elements（UI/表格/布局/i18n，若 MCP 可用）
  ├─ P1 promptenhancer（见 mcp-prompt-optimizer.mdc）
  ├─ P2 场景路由（见 mcp-routing.mdc；代码理解优先 codegraph，不高于 P0）
  ├─ Superpowers（见 superpowers-triggers.mdc）
  ├─ ⟂ 上下文压缩（Headroom，横切；任何阶段获取到大输出时按需 compress，见下文）
  └─ 完成前：verification-before-completion（默认门闩）
```

> `⟂` 表示**横切能力**：不占 P 编号、不改变上述顺序；在任一阶段产生大段工具输出 / 文件 / 搜索结果时，按「上下文压缩」触发条件就地决定是否 `headroom_compress`。

## 上下文压缩（Headroom · 横切能力，非 P 阶段）

Headroom MCP（`user-headroom_mcp` / 别名 `headroom_mcp`）在内容进入推理前压缩大段文本以省上下文窗口；压缩**可逆**（原文本地留存，凭 hash 取回）。与 LightRAG / Codegraph / filesystem **互补**：它**不产生内容**，只压缩你已经获取到的大输出。

**工具**：

| 工具 | 作用 |
| ---- | ---- |
| `headroom_compress(content)` | 压缩任意文本，返回压缩文本 + `hash`（原文本地保存） |
| `headroom_retrieve(hash, query?)` | 凭 hash 取回原文；可选 `query` 做局部过滤 |
| `headroom_stats()` | 本会话压缩统计（次数、省 token、估算成本）——**仅用户问时**调 |

**触发（满足任一可考虑 `compress`；按需，非强制）**：

- 单个工具输出 / 文件 / 搜索结果体量大（约 **≥400 行**或 **≥8KB**）且需在**多步推理**中保留。
- 长日志、冗长 JSON、RAG 多 chunk、批量检索结果，需要边读边推理。
- 累积上下文接近窗口压力，需腾空间继续任务。

**不触发（满足任一即跳过，直接用原文）**：

- 小输出 / 一次性消费即丢弃的内容。
- **将要据此精确编辑的代码**：编辑需精确行号与原文，**编辑前不压缩**（必要时记录 hash，编辑前再 `retrieve` 还原）。
- 凭证 / 密钥 / 敏感数据：**不送入压缩**，避免多一份副本。
- 内容已足够精炼。

**消费与回取（硬约束）**：

- 压缩结果是**派生视图**；权威优先级不变：**用户当次指令 > 仓库代码事实 > 检索 / 压缩派生内容**。需要精确字段、行号、API 契约时，先 `headroom_retrieve` 取原文核对，**禁止**用压缩摘要替代代码事实或用户当次指令。
- 看到压缩标记 `[N items compressed... hash=abc123]` 而需细节时，用该 `hash` 调 `headroom_retrieve`。

**可观测性**：`compress` / `retrieve` 计入「噪声边界」——连续多次只输出**一条合并摘要**，不为压缩单独逐步刷屏。

## P0：知识检索（条件触发）

### 显式触发（最高优先级，硬门闩）

用户消息出现下列**任一**表述时，**必须作为本任务第一步**调用 LightRAG MCP `query_text`，**优先于**读代码、P0.5、P1、实现：

| 触发词 / 表述 | 示例 |
| ------------- | ---- |
| 知识库 | 「按知识库开发」「遵循知识库标准」「调用知识库」 |
| LightRAG | 「查 LightRAG」「用 LightRAG 检索」 |
| daniel_lightrag | 「daniel_lightrag_mcp」「按 daniel_lightrag 规范」 |

**硬门闩**：

1. **先调用、后推断**：必须实际调用 `query_text`；**禁止**因 `mcps/` 目录无描述符、工具列表未展示、或尚未调用过，就判定 LightRAG「未配置」并跳过。
2. **覆盖负向清单**：命中本节时，**不**因「单点改动」「事实已在仓库」等负向项跳过 P0；仅用户明确说「跳过知识库 / 跳过记忆」时可跳过。
3. **先于实现**：在写代码、改规则、给方案前完成检索；检索结果按「P0 检索消费规范」裁决后再继续。
4. **Server 名**：以宿主 MCP 列表为准；常见为 `user-daniel_lightrag_mcp`，亦可能显示为 `daniel_lightrag_mcp`（见 `mcp-routing.mdc` 别名表）。二者择可用者调用，**禁止**因名称前缀差异放弃调用。

**调用失败**：同任务内重试 1 次；仍失败则 `get_health`（见 routing「故障诊断」）→ 向用户说明失败原因与回退假设，**不得**假装已检索。

### 常规触发（满足任一即执行 `query_text`）

- 新功能 / 跨模块重构 / 跨会话（「上次」「记住」「之前说过」）
- 涉及 page-structure、架构选型、MSP/tenant 视图差异、共享 UI 约定
- 用户问「还记得吗」

### 不触发（负向清单，满足任一即跳过 P0）

**例外**：若已命中上文「显式触发」，仅「跳过知识库 / 跳过记忆」可豁免，其余负向项**一律不**使其跳过 P0。

- 「**跳过知识库 / 跳过记忆**」→ 可跳过 P0（**含**显式触发场景）。
- 「**直接干 / 别优化**」→ 仅跳过 **P1**（提示优化），**不**跳过 P0。
- 纯咨询、规则评审、概念解释、代码 review 只读。
- **单点改动**：单文件、单函数、重命名、改一个字段、执行一条命令。
- **已有充分上下文**：用户给了 stack trace + 文件路径、或明确 repro 步骤。
- **事实已在仓库**：答案可通过读指定文件或 grep 唯一确定，无需历史决策。

**推荐参数**（`query_text` 真实 schema：`query` 必填，`mode` 枚举默认 `hybrid`，`only_need_context` **工具默认 `false`**）：

- `query`：从用户输入提取关键词组成自然语言问句。
- `mode`：`hybrid`（默认；实体局部用 `local`，全局概览用 `global`，简单匹配用 `naive`）。
- `only_need_context`：**本规则策略默认显式传 `true`**（只取上下文、不生成回答，省 token；注意工具自身默认是 `false`，故必须显式传参）。例外：用户明确要求「根据记忆回答 / 总结一下记得什么 / 还记得吗请直接回答」→ 传 `false`。

**无结果时**：输出「未找到相关知识，将基于当前上下文继续。」

### P0 检索消费规范（硬门闩）

**权威优先级（硬）**：**用户当次指令 > 仓库当前代码/类型/接口事实 > LightRAG 检索结果**。记忆仅承载历史决策、偏好、架构意图；**不得**用记忆覆盖已读到的代码行为、字段名、API 契约。典型：MSP/tenant 视图差异以代码与当次需求为准；记忆若描述旧默认筛选/旧列配置，**忽略**。

`query_text` 返回后、用于决策前，Agent **必须**在内部完成下列裁决（**不**为此额外调用 MCP；遵守「噪声边界」）：

1. **时效**：解析正文首部 `[date: YYYY-MM-DD]`；无法解析则视为低优先级参考。
2. **冲突**：同 `tags` / 同主题多条且结论矛盾 → **以 date 最新为准**；正文含 `supersedes:` 的条目优先于被取代主题。
3. **去重（语义重复）**：两条记录描述**同一技术决策、同一配置项或同一架构选型**，且**结论一致** → 仅保留最新一条（按 `[date:]` 或 `supersedes:`）。`tags` 高度重叠且正文要点相同，视为语义重复。
4. **对外摘要**：对用户仅说明采用的 **1～2 条**关键结论；禁止堆砌检索原文。若弃用过时记忆，可一句注明「已忽略较早的 X 决策」。

**禁止**：在无 `supersedes` 且无更新 date 的情况下，用更旧记忆覆盖当前代码事实或用户当次指令。

## P0.5：Elements 项目指导（可选，不阻塞）

**触发**：表格、筛选、列表页、标准布局、`UIStandardLayout`、对话框、下拉、动态字段、i18n、共享 UI（与 `AGENTS.md` 一致）。

**前置**：确认 Elements MCP 在工具列表中可用；不可用或超时 → **跳过本步**，不等待、不虚构调用。

**动作**：`get_project_guidance`（用户原始需求）。

- `matched=true` → 按 `guidance` 执行；YAML intake 须用户确认后再写代码。
- `matched=false` / 不可用 / 超时 → `agents-workflow` + 最小代码阅读 + 假设列表，继续任务。

## P2.5：知识存储规范

LightRAG 无 `content_hash` / `memory_update` 式增量更新；存储与更新按下列约定。

**单条存储**：`insert_text`，正文首部嵌入结构化前缀：

```
[tags: decision,api] [type: decision] [date: YYYY-MM-DD]
<决策正文>
```

**批量 / 带元数据**：`insert_texts`，每项含 `title`（主题）、`content`、`metadata`（如 `{ "tags": ["decision","api"], "type": "decision" }`）。

**更新策略**：

- **改正文** → 新 `insert_text` / `insert_texts`（可在正文注明 supersedes / 关联主题）
- **改图谱实体属性** → `update_entity`（需已知 `entity_id`）
- **改关系** → `update_relation`

**默认策略（推荐）**：里程碑用 `insert_text`；同会话多篇用 `title` + `metadata.tags` 区分，不依赖去重更新。

**入库前可选检查**（见 `mcp-routing.mdc`「入库前检查」）：用户出现「记住 / 记录 / 更新之前的决策 / 更新偏好」等**明确写入意图**时，先 `check_entity_exists`；默认新条 `supersedes:` 补充更新，**不**用 `update_entity` 改正文。仅当新旧结论**明显矛盾**且用户未说明取舍时，**只问 1 题**（覆盖 / 并存 / 跳过）。

**只存**：技术决策、架构选择、问题解法、用户偏好。

### 里程碑 tags 与 track 门闩

正文 `[tags: …]` 中**任一** tag 命中下表 **必须 track** 列 → 执行「入库确认」；**仅**命中「可跳过 track」列 → 可不 track。

| 必须 track（里程碑） | 可跳过 track（草稿/中间） |
| -------------------- | ------------------------- |
| `decision` | `brainstorming` |
| `api` | `debug` |
| `preference` | `note` |
| `plan` | `wip` |
| `ui` | |
| `architecture` | |

未在上表出现的 tag：**默认按里程碑**（必须 track）。`upload_document` 一律必须 track。

### 入库确认（硬门闩）

正文 tags **命中「必须 track」**（或 `upload_document`）的 `insert_text` / `insert_texts` 写入时：

1. 记录返回的 `track_id`（若无则视为无法确认，走异常表「入库未完成」）。
2. **必须**调用 `get_track_status(track_id)`，按下列策略处理：
   - **success** → 可宣称已入库，继续交付。
   - **processing** / **pending** → 等待约 **2 秒**后重试，**最多 3 次**；仍为 processing → 输出「入库仍在处理中，可稍后手动验证」，**不阻塞**当前任务，**不**宣称已入库。
   - **failed** → 输出错误摘要；**只问 1 次**是否重试 `insert_text`；用户否或未答 → 走「入库未完成」。
3. **success 前**：不得向用户宣称「已记住 / 已入库 / 已沉淀」。

**可跳过 track**：正文 tags **仅**含「可跳过 track」列且无「必须 track」列时；P3 若写入必须 track 的 tags，**仍不可**跳过。

## P3：任务完成

里程碑 `insert_text`（或 `insert_texts`），并执行上文 **入库确认**。若 P2 末尾已写入且 track 已 success，不重复。

## 澄清与回退

- 缺上下文时 **只提 1 个聚焦问题**。
- MCP 不可用 → 最接近替代 + 说明 + 假设。
- 文件权限/路径失败 → 明确错误与建议。

## 异常处理汇总

| 异常场景 | 行为 |
| -------- | ---- |
| `query_text` 无相关知识 | 输出提示，继续 |
| P0 检索与代码/指令冲突 | **用户指令 + 仓库代码 > 记忆**；弃用记忆并一句说明 |
| P0 检索多条冲突 | 按「P0 检索消费规范」取最新 / supersedes；对外一句摘要 |
| 入库仍在 processing（3 次 track 后） | 不宣称已入库；提示可稍后验证；任务继续 |
| 入库未完成（track failed / 无 track_id） | 不宣称已入库；继续任务 + 说明；用户同意时可重试一次 `insert_text` |
| `get_track_status` 失败 | 同「入库未完成」 |
| LightRAG 连续失败 | 再 `get_health`（见 routing「故障诊断」）；仍失败则跳过知识库步骤 |
| 用户提知识库但未调用 `query_text` | **违规**；补调检索后再实现或交付；向用户说明曾跳过原因 |
| 因 `mcps/` 无描述符跳过 LightRAG | **禁止**；须先 `CallMcpTool` / 等价调用，失败再回退 |
| 需改正文 | 新 `insert_text` / `insert_texts`，不用 `update_entity` |
| `update_entity` 失败 / 无 `entity_id` | 退化为新 `insert_text` |
| Elements 未配置 / 不可用 / 超时 | 跳过 P0.5，`agents-workflow` + 最小阅读 + 假设，不阻塞 |
| Codegraph 项目未初始化（无 `.codegraph/`） | 提示可运行 `codegraph init -i`；本次回退 Grep + Read |
| `codegraph_explore` 标 stale / 待同步文件 | 仅 stale 文件用 Read 校对；其余仍信 codegraph |
| `codegraph_explore` 结果明显不完整 | 调 `codegraph_status` 诊断；提示 `codegraph init -i` 或重建索引；回退 Grep + Read |
| Headroom MCP 不可用 / 超时 | 跳过压缩，直接用原文，**不阻塞**任务 |
| `headroom_compress` 失败 | 用原文继续；同任务**不**反复重试压缩 |
| `headroom_retrieve` 失败 / hash 失效 | 回退原获取途径（重新 Read / `query_text` / 搜索）取原文 |
| 误压缩了将编辑的代码 | 先 `headroom_retrieve` 还原，以原文行号为准再编辑 |
| 向 Headroom 送入敏感数据 | **禁止**；凭证 / 密钥不压缩 |
| 无 OAS MCP | 读现有代码与本地 spec，列假设 |
| 文件已存在（非覆盖） | MCP `edit_file` 或提示用户 |
| 写文件前未检查 | **禁止** MCP 直接覆盖 |
| filesystem MCP 不可用 / 路径不在白名单 | 回退宿主原生读写，并说明原因 |
| MCP 读失败一次 | 可回退宿主原生读；写入仍须先读再写 |
| P2 已 insert | P3 不重复 |
| MCP 失败/超时 | 工具名 + 错误 + 是否回退 |
| Superpowers 阻塞 | 原因 + 降级 + 假设 |
| 澄清过多 | 只 1 问 |

## 示例

- 「按知识库实现 Workflow」→ **第一步** `query_text`（显式触发）→ 消费规范 → 实现 → `insert_text` → `get_track_status` success 后交付
- 「用户登录 API」→ `query_text` → 按 P0 消费规范取舍 → 读现有 auth → 实现 → `insert_text` → `get_track_status` success 后交付
- 「记住用 PostgreSQL」→ 可选 `check_entity_exists` → `insert_text`（`supersedes: PostgreSQL`）→ `get_track_status`
- 「创建 src/utils」→ `list_directory` → `create_directory`
- 「brainstorm 文件上传」→ 见 `superpowers-triggers.mdc`
- 「app-center 筛选 bug」→ 跳过 P1 → `codegraph_callers` / `codegraph_impact` 追调用链 → `systematic-debugging` → `verification-before-completion`
- 「XX 组件用在哪 / 谁调用」→ `codegraph_search` → `codegraph_callers` / `codegraph_impact`（**禁止**已得源码后再 Grep+Read 同文件）
- 「分析这份 2000 行日志 / 超大 JSON 找异常」→ `headroom_compress`（存 hash）→ 在压缩视图上定位 → 需精确行时 `headroom_retrieve(hash)` → 给结论
- 「这段大输出我们后面还要用」→ `headroom_compress` 省窗口 → 后续步骤需细节时按 hash `headroom_retrieve`
