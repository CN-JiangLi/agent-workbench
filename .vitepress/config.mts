import { defineConfig } from "vitepress";

/** Prefix paths for the `zh` locale (VPLink does not auto-inject `/zh/` for theme nav/sidebar). */
function zhRoute(path: string): string {
  if (path === "/zh" || path.startsWith("/zh/")) {
    return path === "/zh" ? "/zh/" : path;
  }
  const hashIdx = path.indexOf("#");
  const raw = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  if (raw === "" || raw === "/") {
    return hash ? `/zh/${hash}` : "/zh/";
  }
  const body = raw.startsWith("/") ? raw : `/${raw}`;
  return `/zh${body}${hash}`;
}

const sharedHead: [string, Record<string, string>][] = [
  ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
  [
    "link",
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
  ],
  [
    "link",
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap",
    },
  ],
  [
    "link",
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap",
    },
  ],
];

/** Default locale (English): plain paths */
const sidebarEn = [
  {
    text: "MCP docs",
    collapsed: false,
    items: [
      {
        text: "MCP handbook",
        link: "/mcp/mcp-handbook",
        collapsed: true,
        items: [
          { text: "Usage principles", link: "/mcp/mcp-handbook#usage-principles" },
          { text: "Superpowers", link: "/mcp/mcp-handbook#superpowers" },
          { text: "Prompt Optimizer", link: "/mcp/mcp-handbook#prompt-optimizer" },
          { text: "Apifox", link: "/mcp/mcp-handbook#apifox" },
          { text: "Memory", link: "/mcp/mcp-handbook#memory" },
          { text: "FileSystem", link: "/mcp/mcp-handbook#filesystem" },
        ],
      },
    ],
  },
  {
    text: "Agentic workflow",
    collapsed: false,
    items: [
      {
        text: "Full-Workflow",
        collapsed: true,
        items: [
          { text: "Overview", link: "/agentic-workflow/full-workflow" },
          {
            text: "Priority 0: conversation start",
            link: "/agentic-workflow/full-workflow#p0-start",
          },
          {
            text: "Priority 1: prompt optimization",
            link: "/agentic-workflow/full-workflow#p1-prompt",
          },
          {
            text: "Priority 2: auto-routing",
            link: "/agentic-workflow/full-workflow#p2-routing",
          },
          {
            text: "Priority 2.5: memory dedupe",
            link: "/agentic-workflow/full-workflow#p25-dedupe",
          },
          {
            text: "Priority 3: completion",
            link: "/agentic-workflow/full-workflow#p3-completion",
          },
          {
            text: "Clarification & fallback",
            link: "/agentic-workflow/full-workflow#fallback-rules",
          },
          {
            text: "Exception summary",
            link: "/agentic-workflow/full-workflow#exception-summary",
          },
        ],
      },
    ],
  },
  {
    text: "Examples",
    items: [{ text: "MCP Full-Workflow (fenced sample)", link: "/examples/mcp-workflow-raw" }],
  },
];

/** Secondary locale (简体中文): `/zh/` prefix on all theme links */
const sidebarZh = [
  {
    text: "MCP 文档",
    collapsed: false,
    items: [
      {
        text: "MCP 使用手册",
        link: zhRoute("/mcp/mcp-handbook"),
        collapsed: true,
        items: [
          { text: "使用原则", link: zhRoute("/mcp/mcp-handbook#使用原则") },
          {
            text: "Superpowers",
            link: zhRoute("/mcp/mcp-handbook#superpowers"),
          },
          {
            text: "Prompt Optimizer",
            link: zhRoute("/mcp/mcp-handbook#prompt-optimizer"),
          },
          {
            text: "Apifox",
            link: zhRoute("/mcp/mcp-handbook#apifox"),
          },
          {
            text: "Memory",
            link: zhRoute("/mcp/mcp-handbook#memory"),
          },
          {
            text: "FileSystem",
            link: zhRoute("/mcp/mcp-handbook#filesystem"),
          },
        ],
      },
    ],
  },
  {
    text: "Agentic 工作流",
    collapsed: false,
    items: [
      {
        text: "Full-Workflow",
        collapsed: true,
        items: [
          { text: "工作流首页", link: zhRoute("/agentic-workflow/full-workflow") },
          {
            text: "优先级 0：对话开始",
            link: zhRoute("/agentic-workflow/full-workflow#p0-start"),
          },
          {
            text: "优先级 1：Prompt 优化判断",
            link: zhRoute("/agentic-workflow/full-workflow#p1-prompt"),
          },
          {
            text: "优先级 2：场景自动路由",
            link: zhRoute("/agentic-workflow/full-workflow#p2-routing"),
          },
          {
            text: "优先级 2.5：记忆存储去重规则",
            link: zhRoute("/agentic-workflow/full-workflow#p25-dedupe"),
          },
          {
            text: "优先级 3：任务完成",
            link: zhRoute("/agentic-workflow/full-workflow#p3-completion"),
          },
          {
            text: "澄清与回退规则",
            link: zhRoute("/agentic-workflow/full-workflow#fallback-rules"),
          },
          {
            text: "异常处理汇总",
            link: zhRoute("/agentic-workflow/full-workflow#exception-summary"),
          },
        ],
      },
    ],
  },
  {
    text: "示例",
    items: [
      { text: "MCP Full-Workflow 原文渲染", link: zhRoute("/examples/mcp-workflow-raw") },
    ],
  },
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "pages",
  outDir: "dist",
  appearance: "dark",
  ignoreDeadLinks: true,
  cleanUrls: true,
  head: sharedHead,
  locales: {
    root: {
      label: "English",
      lang: "en-US",
      title: "Ai Workbench",
      description: "Internal MCP tooling and usage guidelines (English)",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "Home", link: "/" },
          { text: "MCP handbook", link: "/mcp/mcp-handbook" },
          { text: "Agentic workflow", link: "/agentic-workflow/full-workflow" },
          { text: "Examples", link: "/examples/mcp-workflow-raw" },
        ],
        sidebar: sidebarEn,
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/CN-JiangLi",
          },
        ],
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "Ai Workbench",
      description: "团队内部 MCP 工具与使用规范文档",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "首页", link: zhRoute("/") },
          { text: "MCP 使用手册", link: zhRoute("/mcp/mcp-handbook") },
          { text: "Agentic 工作流", link: zhRoute("/agentic-workflow/full-workflow") },
          { text: "示例", link: zhRoute("/examples/mcp-workflow-raw") },
        ],
        sidebar: sidebarZh,
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/CN-JiangLi",
          },
        ],
      },
    },
  },
});
