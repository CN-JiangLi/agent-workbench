# MCP 使用手册（团队内部）

源文档：`Markdown[MCP]/MCP_use.md`

## 使用原则

- 优先说明业务目标，再指定工具与参数。
- 工具名、参数名、命令统一使用反引号。
- 占位符统一使用语义化格式，如 `<接口名>`、`<query>`。
- 示例默认可复制，按需替换占位符即可执行。

## Superpowers Skill 使用指南

### `brainstorming`（构思与设计）

在创建新功能前，先明确需求、约束和设计方案。  
触发词：`用 brainstorming 帮我设计这个功能`

```text
请先使用 brainstorming，帮我梳理这个需求并给出方案对比。
```

### `writing-plans`（任务拆解）

将复杂任务拆成可执行步骤，避免直接开写导致返工。  
触发词：`先走 writing-plans，不要直接写代码`

```text
请先走 writing-plans，把这个需求拆成可执行步骤和验收标准。
```

### `test-driven-development`（测试驱动）

按红-绿-重构流程开发，先写失败测试再写实现。  
触发词：`按 test-driven-development 来实现`

```text
请按 test-driven-development 实现这个功能，先补测试再写代码。
```

### `systematic-debugging`（根因定位）

遇到报错时进行结构化排查，避免猜测式修复。  
触发词：`用 systematic-debugging 看下这个报错`

```text
请使用 systematic-debugging 帮我定位这个报错的根因。
```

### `verification-before-completion`（完成前验证）

在声明“已完成”前，执行完整验证流程。  
触发词：`请在改动完成后进行彻底验证`

```text
请在完成后使用 verification-before-completion，验证通过再给我结论。
```

### `requesting-code-review`（代码评审）

在开发结束后发起系统性代码审查，检查质量与设计一致性。  
触发词：`完成任务后，请帮我评审我的代码`

```text
请使用 requesting-code-review 对本次改动做完整评审。
```

### `finishing-a-development-branch`（分支收尾）

在功能开发完成后，规范化执行分支收尾（合并/PR/清理）。  
触发词：`功能完成了，帮我收尾这个分支`

```text
请用 finishing-a-development-branch 帮我完成这个分支的收尾流程。
```

## Prompt Optimizer（`promptenhancer`）使用流程

### 第 1 轮：提交原始提示词

用途：输入原始需求，获取提示词优化指南。  
输入参数：`originalPrompt`

```text
请先使用 promptenhancer 工具，originalPrompt="<你的原始需求>"
```

### 第 2 轮：提交优化后提示词

用途：将你根据指南整理后的提示词再次提交，获得可直接使用的最终提示词。  
输入参数：`optimizedPrompt`

```text
请继续调用 promptenhancer，optimizedPrompt="<按第一轮指南优化后的提示词>"
```

## Apifox MCP 使用

### 刷新项目 OAS

用途：刷新 API 文档。  
调用：`refresh_project_oas_<project_id>`

```text
请刷新我们的 API 文档，调用 refresh_project_oas_v5npvj。
```

### 读取 OAS 生成接口代码

用途：基于项目 API 文档生成 `<接口名>` 的 Model 和 Service 层代码。  
调用：`read_project_oas_<project_id>`

```text
请根据项目 API 文档，生成 <接口名> 的 Model 和 Service 层代码。
```

### 读取 OAS 关联资源并分析联动修改

用途：基于现有模型评估字段变更影响范围。  
调用：`read_project_oas_ref_resources_<project_id>`

```text
我需要在用户信息返回中增加 avatar 字段，请根据现有数据模型告诉我需要同步修改哪些代码。
```

## Memory MCP 使用

### 常用能力

- 存储记忆：`memory-service.add_memory`
- 检索记忆：`memory-service.search_memory`

### 快速示例

```text
记住：<要保存的内容>
我之前 <某个主题> 是什么？
```

### 手动控制工具示例

```text
@memory-service add_memory content="记住：数据库连接字符串是 postgresql://user:pass@localhost/db"
@memory-service search_memory query="数据库连接字符串"
@memory-service get_all_memories
@memory-service delete_memory memory_id="<memory_id>"
```

## FileSystem MCP 使用

### `read_text_file`

用途：读取指定路径文本文件内容。

```text
帮我读取项目根目录下的 config.json 文件内容。
```

### `write_file`

用途：创建新文件或覆盖已有文件。

```text
在我的桌面 Script 文件夹里，创建一个名为 hello.py 的文件，内容是打印 "Hello, World!"。
```

### `edit_file`

用途：基于内容精确编辑（支持干运行预览）。

```text
将 hello.py 文件中的 "Hello, World!" 修改为 "Hello, MCP!"。
```

### `create_directory`

用途：在允许目录内创建文件夹。

```text
在 <目标路径> 下创建目录 <目录名>。
```

### `list_directory`

用途：列出指定目录中的文件与子目录。

```text
列出我桌面 AOSP 文件夹下所有文件和子文件夹的名字。
```

::: tip 说明
此页面由 `Markdown[MCP]/MCP_use.md` 内容整理生成，用于部署访问。
:::
