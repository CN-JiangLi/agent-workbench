# Browser MCP

> Server: `cursor-ide-browser`

Browser automation. **Only when the user explicitly requests it.**

## When to Use

- "Open/operate the browser", "screenshot the page"
- "Click/fill on the page", "verify in browser"

## When Not to Use

- Do **not** substitute for missing Elements MCP
- Do not use proactively for routine dev tasks

## Workflow

```
browser_tabs(list)
  → browser_navigate
  → browser_lock(lock)     # when interacting
  → browser_click / browser_type / browser_snapshot / browser_take_screenshot
  → browser_lock(unlock)
```

## Main Tools

| Tool | Purpose |
| ---- | ------- |
| `browser_tabs` | List/manage tabs |
| `browser_navigate` | Navigate to URL |
| `browser_lock` / unlock | Lock/release browser |
| `browser_snapshot` | Accessibility snapshot |
| `browser_click` / `browser_type` | Interact |
| `browser_take_screenshot` | Screenshot |
| `browser_cdp` | Chrome DevTools Protocol |

## Constraints

- Stop after **4** failures; report status + blocker
- Login, CAPTCHA, destructive ops → hand back to user

## Related

- [Routing · Browser automation](../agent-workflow/mcp-routing#browser-automation-cursor-ide-browser)
