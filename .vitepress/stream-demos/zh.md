# MCP 工作流 · 决策树

```
用户消息
  ├─ 「跳过知识库」→ 跳过 P0
  ├─ 含「知识库」/ LightRAG → P0 强制优先
  ├─ P0  query_text（LightRAG 知识检索）
  ├─ P0.5 get_project_guidance（Elements，可选）
  ├─ P1  promptenhancer（需求模糊时）
  ├─ P2  场景路由（Codegraph / Filesystem / …）
  ├─ ⟂   headroom_compress（横切压缩）
  └─ 完成前 verification-before-completion
```

**已配置 MCP（6）**：LightRAG · Filesystem · Prompt Optimizer · Codegraph · Headroom · Browser
