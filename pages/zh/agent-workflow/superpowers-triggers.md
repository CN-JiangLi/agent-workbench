# MCP 工作流 · Superpowers

认知流程本身（构思 / 计划 / TDD / 调试 / 验证 / 评审）**不依赖外部 MCP**，以**本节步骤为准**直接执行。唯一例外：**结论沉淀**可调用 LightRAG `insert_text`（正文含 `[tags: …]`，见 `mcp-core.mdc` 2.5「知识存储规范」）。

**与 SKILL.md 的关系**：

- 宿主已注入技能路径（如 Cursor `agent_skills`、其他环境的 skill 列表）时，**不必**再读文件；与本节冲突时以 SKILL 为准。
- 仅当本节要点不足以执行时，再按 `mcp-routing.mdc` 文件策略读取 `SKILL.md`；读失败则按本节降级继续，不卡住。

**不替代 Elements**：UI/表格/布局任务在 Elements **可用时**优先 P0.5；不可用时按 `mcp-core.mdc` 回退。

**不替代 LightRAG**：用户消息含「知识库」/ LightRAG / daniel_lightrag 时，**必须先** `query_text`（见 `mcp-core.mdc`「显式触发」），再进入本节 Superpowers 或实现；认知技能**不能**代替知识库检索。

## 显式触发

| Skill | 触发词示例 |
| ----- | ---------- |
| `brainstorming` | 「用 brainstorming 设计…」「先 brainstorm」 |
| `writing-plans` | 「先走 writing-plans」「帮我拆解任务」 |
| `test-driven-development` | 「按 TDD 实现」 |
| `systematic-debugging` | 「systematic-debugging」「定位根因」 |
| `verification-before-completion` | 「彻底验证后再结论」 |
| `requesting-code-review` | 「review 改动」「评审代码」 |
| `finishing-a-development-branch` | 「收尾分支」「功能完成收尾」 |

## 自动映射

| 场景 | Skill |
| ---- | ----- |
| 报错 / 测试失败 / 行为异常 | `systematic-debugging` |
| 声明「完成」「已修好」「可以了」 | `verification-before-completion`（**默认门闩**） |

## 各 Skill 要点

- **brainstorming**：边界 → 2～3 方案 → 推荐 → 可选 `insert_text([tags: brainstorming] …)`（可跳过 track，见 `mcp-core.mdc` tags 表）
- **writing-plans**：子任务 + 验收标准 → 清单 → 用户确认后实现 → `insert_text([tags: plan] …)`（必须 track）
- **test-driven-development**：红 → 绿 → 重构；无测试框架 → 说明阻塞 + 手测清单
- **systematic-debugging**：证据 → 假设 → 验证 → 根因 + 修复 → 回归
- **verification-before-completion**：影响范围 → 测试/typecheck/lint → 验证报告；**未全通过不说「任务完成」**
- **requesting-code-review**：diff 维度：严重 / 建议 / 疑问
- **finishing-a-development-branch**：测试 → PR/合并（git 须用户批准）→ 收尾报告

## 执行异常

无法继续（缺测试框架、Elements 不可用等）→ 阻塞原因 + 降级（如 typecheck + 手测清单）+ 假设。
