import { defineConfig } from "vitepress";

/** Prefix paths for the `zh` locale */
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

const sidebarEn = [
  {
    text: "Agent Workflow",
    collapsed: false,
    items: [
      { text: "Workflow Core", link: "/agent-workflow/mcp-core" },
      { text: "Scenario Routing", link: "/agent-workflow/mcp-routing" },
      { text: "Prompt Optimization (P1)", link: "/agent-workflow/mcp-prompt-optimizer" },
      { text: "Superpowers", link: "/agent-workflow/superpowers-triggers" },
    ],
  },
  {
    text: "Serve Layer",
    collapsed: false,
    items: [
      { text: "LightRAG", link: "/servers/lightrag" },
      { text: "Codegraph", link: "/servers/codegraph" },
      { text: "Headroom", link: "/servers/headroom" },
    ],
  },
  {
    text: "MCP Tools",
    collapsed: false,
    items: [
      { text: "Overview", link: "/mcp-tools/" },
      { text: "Host Setup", link: "/mcp-tools/host-setup" },
      { text: "LightRAG MCP", link: "/mcp-tools/lightrag" },
      { text: "Filesystem", link: "/mcp-tools/filesystem" },
      { text: "Codegraph MCP", link: "/mcp-tools/codegraph" },
      { text: "Headroom MCP", link: "/mcp-tools/headroom" },
      { text: "Prompt Optimizer", link: "/mcp-tools/prompt-optimizer" },
      { text: "Browser", link: "/mcp-tools/browser" },
    ],
  },
];

const sidebarZh = [
  {
    text: "Agent 工作流",
    collapsed: false,
    items: [
      { text: "工作流核心", link: zhRoute("/agent-workflow/mcp-core") },
      { text: "场景路由", link: zhRoute("/agent-workflow/mcp-routing") },
      { text: "Prompt 优化（P1）", link: zhRoute("/agent-workflow/mcp-prompt-optimizer") },
      { text: "Superpowers", link: zhRoute("/agent-workflow/superpowers-triggers") },
    ],
  },
  {
    text: "Serve 服务类底层",
    collapsed: false,
    items: [
      { text: "LightRAG", link: zhRoute("/servers/lightrag") },
      { text: "Codegraph", link: zhRoute("/servers/codegraph") },
      { text: "Headroom", link: zhRoute("/servers/headroom") },
    ],
  },
  {
    text: "MCP Tools",
    collapsed: false,
    items: [
      { text: "总览", link: zhRoute("/mcp-tools/") },
      { text: "宿主配置", link: zhRoute("/mcp-tools/host-setup") },
      { text: "LightRAG MCP", link: zhRoute("/mcp-tools/lightrag") },
      { text: "Filesystem", link: zhRoute("/mcp-tools/filesystem") },
      { text: "Codegraph MCP", link: zhRoute("/mcp-tools/codegraph") },
      { text: "Headroom MCP", link: zhRoute("/mcp-tools/headroom") },
      { text: "Prompt Optimizer", link: zhRoute("/mcp-tools/prompt-optimizer") },
      { text: "Browser", link: zhRoute("/mcp-tools/browser") },
    ],
  },
];

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
      description: "MCP agent workflow, services, and tools documentation",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "Home", link: "/" },
          { text: "Agent Workflow", link: "/agent-workflow/mcp-core" },
          { text: "Serve Layer", link: "/servers/lightrag" },
          { text: "MCP Tools", link: "/mcp-tools/" },
          { text: "简体中文", link: "/zh/" },
        ],
        sidebar: sidebarEn,
        socialLinks: [
          { icon: "github", link: "https://github.com/CN-JiangLi" },
        ],
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "Ai Workbench",
      description: "团队 Agent 工作流、底层服务与 MCP 工具文档",
      themeConfig: {
        outline: { level: [1, 3] },
        nav: [
          { text: "首页", link: zhRoute("/") },
          { text: "Agent 工作流", link: zhRoute("/agent-workflow/mcp-core") },
          { text: "Serve 服务", link: zhRoute("/servers/lightrag") },
          { text: "MCP Tools", link: zhRoute("/mcp-tools/") },
        ],
        sidebar: sidebarZh,
        socialLinks: [
          { icon: "github", link: "https://github.com/CN-JiangLi" },
        ],
      },
    },
  },
});
