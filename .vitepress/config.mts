import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MCP Docs",
  description: "团队内部 MCP 工具与使用规范文档",
  srcDir: 'pages',
  outDir: 'dist',
  lang: 'zh-CN',
  appearance: 'dark',
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [1, 3],    // 显示 h1 到 h3 级别的标题
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/quick-start/quick-start' },
      { text: 'MCP 使用手册', link: '/mcp/mcp-handbook' },
      { text: 'MCP 工作流', link: '/mcp/mcp-workflow' },
      { text: '示例', link: '/examples/markdown-examples' }
    ],

    sidebar: [
      {
        text: '快速开始',
        collapsed: true,
        items: [
          { text: '概览', link: '/quick-start/quick-start' },
          { text: '安装', link: '/quick-start/quick-start#installation' },
          { text: '基础配置', link: '/quick-start/quick-start#basic-setup' },
          { text: '详细配置', link: '/quick-start/quick-start#configuration' }
        ]
      },
      {
        text: 'MCP 文档',
        collapsed: false,
        items: [
          { text: 'MCP 使用手册（团队内部）', link: '/mcp/mcp-handbook' },
          { text: 'MCP 自动工作流规则', link: '/mcp/mcp-workflow' },
          { text: '使用原则', link: '/mcp/mcp-handbook#使用原则' },
          { text: 'Superpowers Skill 使用指南', link: '/mcp/mcp-handbook#superpowers-skill-使用指南' },
          { text: 'Prompt Optimizer（promptenhancer）使用流程', link: '/mcp/mcp-handbook#prompt-optimizer-promptenhancer-使用流程' },
          { text: 'Apifox MCP 使用', link: '/mcp/mcp-handbook#apifox-mcp-使用' },
          { text: 'Memory MCP 使用', link: '/mcp/mcp-handbook#memory-mcp-使用' },
          { text: 'FileSystem MCP 使用', link: '/mcp/mcp-handbook#filesystem-mcp-使用' },
          { text: '优先级 0：对话开始', link: '/mcp/mcp-workflow#优先级-0对话开始' },
          { text: '优先级 1：Prompt 优化判断', link: '/mcp/mcp-workflow#优先级-1prompt-优化判断' },
          { text: '优先级 2：场景自动路由', link: '/mcp/mcp-workflow#优先级-2场景自动路由' },
          { text: '优先级 2.5：记忆存储去重规则', link: '/mcp/mcp-workflow#优先级-25记忆存储去重规则' },
          { text: '优先级 3：任务完成', link: '/mcp/mcp-workflow#优先级-3任务完成' },
          { text: '澄清与回退规则', link: '/mcp/mcp-workflow#澄清与回退规则' },
          { text: '异常处理汇总', link: '/mcp/mcp-workflow#异常处理汇总' }
        ]
      },
      {
        text: '进阶',
        collapsed: true,
        items: [
          { text: '自定义主题', link: '/advanced/custom-theme' },
          { text: 'Markdown 扩展', link: '/advanced/markdown-extensions' },
          { text: '代码高亮', link: '/advanced/code-highlighting' }
        ]
      },
      {
        text: '部署',
        collapsed: true,
        items: [
          { text: '生产构建', link: '/quick-start/quick-start#build-for-production' },
          { text: 'GitHub Pages', link: '/quick-start/quick-start#deploy-to-github-pages' },
          { text: 'Netlify', link: '/quick-start/quick-start#netlify-deployment' }
        ]
      },
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/examples/markdown-examples' },
          { text: 'Runtime API 示例', link: '/examples/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/vitepress-template' }
    ]
  }
})
