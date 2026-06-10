# MCP Workflow · Decision Tree

```
User message
  ├─ "skip knowledge base" → skip P0
  ├─ mentions "knowledge base" / LightRAG → P0 first
  ├─ P0  query_text (LightRAG retrieval)
  ├─ P0.5 get_project_guidance (Elements, optional)
  ├─ P1  promptenhancer (when vague)
  ├─ P2  scenario routing (Codegraph / Filesystem / …)
  ├─ ⟂   headroom_compress (cross-cutting)
  └─ verification-before-completion before done
```

**Configured MCP (6)**: LightRAG · Filesystem · Prompt Optimizer · Codegraph · Headroom · Browser
