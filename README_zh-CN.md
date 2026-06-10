# MCP 文档站点

基于 VitePress 的团队 MCP 文档，内容同步自 `Markdown[MCP]/docs/`。

## 文档结构

```
pages/zh/
├── agent-workflow/     # Agent 工作流（rules/*.mdc）
│   ├── mcp-core.md
│   ├── mcp-routing.md
│   ├── mcp-prompt-optimizer.md
│   └── superpowers-triggers.md
├── servers/            # Serve 服务类底层
│   ├── lightrag.md
│   ├── codegraph.md
│   └── headroom.md
└── mcp-tools/          # MCP Tools 参考
    ├── index.md
    ├── host-setup.md
    ├── lightrag.md
    ├── filesystem.md
    ├── codegraph.md
    ├── headroom.md
    ├── prompt-optimizer.md
    └── browser.md
```

## 开发

```bash
npm install
npm run dev      # 本地预览
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 源文档

- 工作流规则：`Markdown[MCP]/docs/rules/`
- 宿主配置：`Markdown[MCP]/docs/docs/mcp-routing-host-setup.md`
