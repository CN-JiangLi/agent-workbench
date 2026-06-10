# Browser MCP

> Server：`cursor-ide-browser`

浏览器自动化。**仅当用户明确要求**时使用。

## 适用场景

- 「打开/操作浏览器」「截图页面」
- 「在页面上点击/填写」「用浏览器验证」

## 不适用

- Elements 未配置时**不得**用浏览器替代 UI 规范 MCP
- 不主动用于日常开发任务

## 工作流

```
browser_tabs(list)
  → browser_navigate
  → browser_lock(lock)        # 需要交互时
  → browser_click / browser_type / browser_snapshot / browser_take_screenshot
  → browser_lock(unlock)
```

## 主要工具

| 工具 | 用途 |
| ---- | ---- |
| `browser_tabs` | 列出/管理标签页 |
| `browser_navigate` | 导航到 URL |
| `browser_lock` / unlock | 锁定/释放浏览器 |
| `browser_snapshot` | 获取页面可访问性快照 |
| `browser_click` | 点击元素 |
| `browser_type` | 输入文本 |
| `browser_take_screenshot` | 截图 |
| `browser_cdp` | Chrome DevTools Protocol |

## 约束

- 失败/卡住 **4 次内**停止，报告现状 + 阻塞点
- 登录、验证码、破坏性操作 → 停下交回用户

## 相关

- [场景路由 · 浏览器自动化](../agent-workflow/mcp-routing#浏览器自动化-cursor-ide-browser)
