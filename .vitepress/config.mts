import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MCP Docs",
  description: "团队内部 MCP 工具与使用规范文档",
  srcDir: "pages",
  outDir: "dist",
  lang: "zh-CN",
  appearance: "dark",
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [1, 3], // 显示 h1 到 h3 级别的标题
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/quick-start/quick-start" },
      { text: "MCP 使用手册", link: "/mcp/mcp-handbook" },
      { text: "MCP 工作流", link: "/mcp-workflow/full-workflow" },
      { text: "示例", link: "/examples/markdown-examples" },
    ],

    sidebar: [
      {
        text: "快速开始",
        collapsed: true,
        items: [
          { text: "概览", link: "/quick-start/quick-start" },
          { text: "安装", link: "/quick-start/quick-start#installation" },
          { text: "基础配置", link: "/quick-start/quick-start#basic-setup" },
          { text: "详细配置", link: "/quick-start/quick-start#configuration" },
        ],
      },
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
        text: "MCP 工作流",
        collapsed: false,
        items: [
          {
            text: "Full-Workflow",
            collapsed: true,
            items: [
              { text: "工作流首页", link: "/mcp-workflow/full-workflow" },
              {
                text: "优先级 0：对话开始",
                link: "/mcp-workflow/full-workflow#p0-start",
              },
              {
                text: "优先级 1：Prompt 优化判断",
                link: "/mcp-workflow/full-workflow#p1-prompt",
              },
              {
                text: "优先级 2：场景自动路由",
                link: "/mcp-workflow/full-workflow#p2-routing",
              },
              {
                text: "优先级 2.5：记忆存储去重规则",
                link: "/mcp-workflow/full-workflow#p25-dedupe",
              },
              {
                text: "优先级 3：任务完成",
                link: "/mcp-workflow/full-workflow#p3-completion",
              },
              {
                text: "澄清与回退规则",
                link: "/mcp-workflow/full-workflow#fallback-rules",
              },
              {
                text: "异常处理汇总",
                link: "/mcp-workflow/full-workflow#exception-summary",
              },
            ],
          },
        ],
      },
      {
        text: "进阶",
        collapsed: true,
        items: [
          { text: "自定义主题", link: "/advanced/custom-theme" },
          { text: "Markdown 扩展", link: "/advanced/markdown-extensions" },
          { text: "代码高亮", link: "/advanced/code-highlighting" },
        ],
      },
      {
        text: "部署",
        collapsed: true,
        items: [
          {
            text: "生产构建",
            link: "/quick-start/quick-start#build-for-production",
          },
          {
            text: "GitHub Pages",
            link: "/quick-start/quick-start#deploy-to-github-pages",
          },
          {
            text: "Netlify",
            link: "/quick-start/quick-start#netlify-deployment",
          },
        ],
      },
      {
        text: "示例",
        items: [
          { text: "Markdown 示例", link: "/examples/markdown-examples" },
          { text: "Runtime API 示例", link: "/examples/api-examples" },
          { text: "MCP Full-Workflow 原文渲染", link: "/examples/mcp-workflow-raw" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/CN-JiangLi",
      },
    ],
  },
});
