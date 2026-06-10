# MCP Documentation Site

VitePress site for team MCP docs. Content synced from `Markdown[MCP]/docs/`.

## Structure

```
pages/
├── index.md                 # English home
├── agent-workflow/          # Agent workflow rules (EN)
├── servers/                 # LightRAG, Codegraph, Headroom (EN)
├── mcp-tools/               # MCP tool reference (EN)
└── zh/                      # Chinese mirror (same structure)
```

## Development

```bash
npm install
npm run dev      # http://localhost:5173 (EN), /zh/ (中文)
npm run build
npm run preview
```

## Locales

| Locale | Path | Label |
| ------ | ---- | ----- |
| English | `/` | Default |
| 简体中文 | `/zh/` | Chinese |
