import { defineConfig } from "vitepress";

/** Prefix paths for the `en` locale (VPLink does not auto-inject `/en/` for theme nav/sidebar). */
function enRoute(path: string): string {
  if (path === "/en" || path.startsWith("/en/")) {
    return path === "/en" ? "/en/" : path;
  }
  const hashIdx = path.indexOf("#");
  const raw = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  if (raw === "" || raw === "/") {
    return hash ? `/en/${hash}` : "/en/";
  }
  const body = raw.startsWith("/") ? raw : `/${raw}`;
  return `/en${body}${hash}`;
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

const zhSidebar = [
  {
    text: "MCP 文档",
    collapsed: false,
    items: [
      {
        text: "MCP 使用手册",
        link: "/mcp/mcp-handbook",
        collapsed: true,
        items: [
          { text: "使用原则", link: "/mcp/mcp-handbook#使用原则" },
          {
            text: "Superpowers",
            link: "/mcp/mcp-handbook#superpowers",
          },
          {
            text: "Prompt Optimizer",
            link: "/mcp/mcp-handbook#prompt-optimizer",
          },
          {
            text: "Apifox",
            link: "/mcp/mcp-handbook#apifox",
          },
          {
            text: "Memory",
            link: "/mcp/mcp-handbook#memory",
          },
          {
            text: "FileSystem",
            link: "/mcp/mcp-handbook#filesystem",
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
          { text: "工作流首页", link: "/agentic-workflow/full-workflow" },
          {
            text: "优先级 0：对话开始",
            link: "/agentic-workflow/full-workflow#p0-start",
          },
          {
            text: "优先级 1：Prompt 优化判断",
            link: "/agentic-workflow/full-workflow#p1-prompt",
          },
          {
            text: "优先级 2：场景自动路由",
            link: "/agentic-workflow/full-workflow#p2-routing",
          },
          {
            text: "优先级 2.5：记忆存储去重规则",
            link: "/agentic-workflow/full-workflow#p25-dedupe",
          },
          {
            text: "优先级 3：任务完成",
            link: "/agentic-workflow/full-workflow#p3-completion",
          },
          {
            text: "澄清与回退规则",
            link: "/agentic-workflow/full-workflow#fallback-rules",
          },
          {
            text: "异常处理汇总",
            link: "/agentic-workflow/full-workflow#exception-summary",
          },
        ],
      },
    ],
  },
  {
    text: "示例",
    items: [
      { text: "MCP Full-Workflow 原文渲染", link: "/examples/mcp-workflow-raw" },
    ],
  },
];

const enSidebar = [
  {
    text: "MCP docs",
    collapsed: false,
    items: [
      {
        text: "MCP handbook",
        link: enRoute("/mcp/mcp-handbook"),
        collapsed: true,
        items: [
          { text: "Usage principles", link: enRoute("/mcp/mcp-handbook#usage-principles") },
          { text: "Superpowers", link: enRoute("/mcp/mcp-handbook#superpowers") },
          { text: "Prompt Optimizer", link: enRoute("/mcp/mcp-handbook#prompt-optimizer") },
          { text: "Apifox", link: enRoute("/mcp/mcp-handbook#apifox") },
          { text: "Memory", link: enRoute("/mcp/mcp-handbook#memory") },
          { text: "FileSystem", link: enRoute("/mcp/mcp-handbook#filesystem") },
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
          { text: "Overview", link: enRoute("/agentic-workflow/full-workflow") },
          {
            text: "Priority 0: conversation start",
            link: enRoute("/agentic-workflow/full-workflow#p0-start"),
          },
          {
            text: "Priority 1: prompt optimization",
            link: enRoute("/agentic-workflow/full-workflow#p1-prompt"),
          },
          {
            text: "Priority 2: auto-routing",
            link: enRoute("/agentic-workflow/full-workflow#p2-routing"),
          },
          {
            text: "Priority 2.5: memory dedupe",
            link: enRoute("/agentic-workflow/full-workflow#p25-dedupe"),
          },
          {
            text: "Priority 3: completion",
            link: enRoute("/agentic-workflow/full-workflow#p3-completion"),
          },
          {
            text: "Clarification & fallback",
            link: enRoute("/agentic-workflow/full-workflow#fallback-rules"),
          },
          {
            text: "Exception summary",
            link: enRoute("/agentic-workflow/full-workflow#exception-summary"),
          },
        ],
      },
    ],
  },
  {
    text: "Examples",
    items: [{ text: "MCP Full-Workflow (fenced sample)", link: enRoute("/examples/mcp-workflow-raw") }],
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
  vite: {
    server: {
      proxy: {
        "/api/visits": {
          target: "http://127.0.0.1:3948",
          changeOrigin: true,
        },
      },
    },
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "Ai Workbench",
      description: "团队内部 MCP 工具与使用规范文档",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "首页", link: "/" },
          { text: "MCP 使用手册", link: "/mcp/mcp-handbook" },
          { text: "Agentic 工作流", link: "/agentic-workflow/full-workflow" },
          { text: "示例", link: "/examples/mcp-workflow-raw" },
        ],
        sidebar: zhSidebar,
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/CN-JiangLi",
          },
        ],
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      title: "Ai Workbench",
      description: "Internal MCP tooling and usage guidelines (English)",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "Home", link: enRoute("/") },
          { text: "MCP handbook", link: enRoute("/mcp/mcp-handbook") },
          { text: "Agentic workflow", link: enRoute("/agentic-workflow/full-workflow") },
          { text: "Examples", link: enRoute("/examples/mcp-workflow-raw") },
        ],
        sidebar: enSidebar,
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
