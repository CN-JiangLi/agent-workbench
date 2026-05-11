<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import AgenticWorkflowHomeDemo from "./AgenticWorkflowHomeDemo.vue";

const { isDark, theme } = useData();

const githubHref = computed(() => {
  const links = theme.value.socialLinks ?? [];
  const gh = links.find((l) => l.icon === "github");
  return typeof gh?.link === "string" ? gh.link : "https://github.com/CN-JiangLi";
});

function toggleDark() {
  if (typeof isDark.value === "boolean") {
    isDark.value = !isDark.value;
  }
}
</script>

<template>
  <div class="stitch-home">
    <nav class="stitch-nav" aria-label="Primary">
      <div class="stitch-nav__inner">
        <div class="stitch-nav__left">
          <span class="stitch-nav__brand">
            <span class="stitch-text-gradient">Ai Workbench.Agent</span>
          </span>
          <div class="stitch-nav__links">
            <a class="stitch-nav__link" :href="withBase('/mcp/mcp-handbook')">Documentation</a>
            <a class="stitch-nav__link" :href="withBase('/mcp/mcp-handbook')">MCP Handbook</a>
            <a class="stitch-nav__link" :href="withBase('/agentic-workflow/full-workflow')"
              >Agentic Workflow</a
            >
            <a class="stitch-nav__link" :href="withBase('/examples/mcp-workflow-raw')">Examples</a>
          </div>
        </div>
        <div class="stitch-nav__actions">
          <button
            type="button"
            class="stitch-icon-btn"
            aria-label="Toggle color mode"
            @click="toggleDark"
          >
            <span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>
          </button>
          <a class="stitch-icon-btn" :href="githubHref" rel="noreferrer noopener" target="_blank" aria-label="Source code on GitHub">
            <span class="material-symbols-outlined" aria-hidden="true">code</span>
          </a>
          <a class="stitch-btn stitch-btn--primary stitch-nav__cta" :href="withBase('/quick-start/quick-start')"
            >Quick Start</a
          >
        </div>
      </div>
    </nav>

    <main class="stitch-main">
      <section class="stitch-hero">
        <h1 class="stitch-hero__subtitle">MCP 使用文档中心</h1>
        <p class="stitch-hero__tagline">
          面向 Agent 的本地 AI 工程化增强体系 ( RAG + Tool Use + Agentic Workflow )。
        </p>
        <div class="stitch-hero__actions">
          <a class="stitch-btn stitch-btn--primary stitch-btn--lg" :href="withBase('/quick-start/quick-start')">
            快速开始
          </a>
          <a class="stitch-btn stitch-btn--glass stitch-btn--lg" :href="withBase('/mcp/mcp-handbook')">
            查看 MCP 手册
          </a>
        </div>
      </section>

      <section class="stitch-features" aria-label="Highlights">
        <div class="stitch-feature-card">
          <div class="stitch-feature-card__icon">
            <span class="material-symbols-outlined" aria-hidden="true">account_tree</span>
          </div>
          <h3 class="stitch-feature-card__title">标准化流程</h3>
          <p class="stitch-feature-card__text">构建稳定、可预测的 Agent 运行管线。</p>
        </div>
        <div class="stitch-feature-card">
          <div class="stitch-feature-card__icon">
            <span class="material-symbols-outlined" aria-hidden="true">extension</span>
          </div>
          <h3 class="stitch-feature-card__title">场景化范例</h3>
          <p class="stitch-feature-card__text">提供多种实际业务场景的最佳实践与实现参考。</p>
        </div>
        <div class="stitch-feature-card">
          <div class="stitch-feature-card__icon">
            <span class="material-symbols-outlined" aria-hidden="true">library_books</span>
          </div>
          <h3 class="stitch-feature-card__title">可维护文档体系</h3>
          <p class="stitch-feature-card__text">基于 Markdown 的流式渲染，保证文档时效与互动性。</p>
        </div>
      </section>

      <section class="stitch-workflow" aria-labelledby="stitch-workflow-heading">
        <div class="stitch-workflow__intro">
          <h2 id="stitch-workflow-heading" class="stitch-workflow__title">Agentic 工作流 · 流式演示</h2>
          <p class="stitch-workflow__desc">
            下方由 <span class="stitch-workflow__kbd">markstream-vue</span> 打字机渲染
            <code class="stitch-code">pages/home/agentic-workflow-stream-demo.md</code> ( 规则见
            <a class="stitch-link" :href="withBase('/agentic-workflow/full-workflow')">Full-Workflow</a> )。
          </p>
        </div>

        <div class="stitch-workflow__glass">
          <div class="stitch-workflow__accent" aria-hidden="true" />
          <AgenticWorkflowHomeDemo />
        </div>
      </section>
    </main>

    <footer class="stitch-footer">
      <div class="stitch-footer__inner">
        <span class="stitch-footer__copy">© 2024 Ai Workbench Agent. Built for the agentic future.</span>
        <div class="stitch-footer__links">
          <a class="stitch-footer__link" href="#">Privacy</a>
          <a class="stitch-footer__link" href="#">Terms</a>
          <a class="stitch-footer__link" :href="githubHref" rel="noreferrer noopener" target="_blank">GitHub</a>
          <a class="stitch-footer__link" href="#">Discord</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.stitch-home {
  --stitch-bg: #131313;
  --stitch-on-surface: #e5e2e1;
  --stitch-on-surface-variant: #cfc2d6;
  --stitch-surface: #131313;
  --stitch-surface-low: #1c1b1b;
  --stitch-surface-lowest: #0e0e0e;
  --stitch-surface-variant: #353534;
  --stitch-outline-variant: #4d4354;
  --stitch-secondary: #adc6ff;
  --stitch-primary: #ddb7ff;
  --stitch-primary-container: #b76dff;
  --stitch-secondary-container: #0566d9;
  --stitch-on-primary: #490080;
  --stitch-font: "Inter", system-ui, sans-serif;
  --stitch-mono: "JetBrains Mono", ui-monospace, monospace;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--stitch-bg);
  color: var(--stitch-on-surface);
  font-family: var(--stitch-font);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.stitch-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 64px;
  border-bottom: 1px solid rgba(77, 67, 84, 0.1);
  background: rgba(19, 19, 19, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
}

.stitch-nav__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stitch-nav__left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stitch-nav__brand {
  display: inline-block;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.stitch-nav__links {
  display: none;
  gap: 12px;
  margin-left: 24px;
}

@media (min-width: 768px) {
  .stitch-nav__links {
    display: flex;
  }
}

.stitch-nav__link {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 15px;
  color: var(--stitch-on-surface-variant);
  text-decoration: none;
  transition:
    color 0.3s ease,
    background 0.3s ease;
}

.stitch-nav__link:hover {
  color: var(--stitch-on-surface);
  background: rgba(53, 53, 52, 0.5);
}

.stitch-nav__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stitch-icon-btn :is(.material-symbols-outlined) {
  font-size: 20px;
}

.stitch-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--stitch-on-surface-variant);
  cursor: pointer;
  text-decoration: none;
  transition:
    color 0.3s ease,
    background 0.3s ease;
}

.stitch-icon-btn:hover {
  color: var(--stitch-on-surface);
  background: rgba(53, 53, 52, 0.5);
}

.stitch-nav__cta {
  display: none;
  margin-left: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-family: var(--stitch-mono);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  border-radius: 8px;
}

@media (min-width: 640px) {
  .stitch-nav__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.stitch-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 72px 24px 16px;
  min-height: 0;
  overflow-x: clip;
  box-sizing: border-box;
}

.stitch-hero {
  flex-shrink: 0;
  max-width: 48rem;
}

.stitch-text-gradient {
  display: inline-block;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to right, #adc6ff, #ddb7ff);
}

.stitch-hero__subtitle {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--stitch-on-surface);
}

.stitch-hero__tagline {
  margin: 0 0 16px;
  max-width: 42rem;
  font-size: 16px;
  color: var(--stitch-on-surface-variant);
  line-height: 1.65;
}

.stitch-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.stitch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-family: var(--stitch-mono);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stitch-btn--lg {
  padding: 8px 16px;
}

.stitch-btn--primary {
  background-image: linear-gradient(to right, #0566d9, #842bd2);
  color: #fff;
}

.stitch-btn--primary:hover {
  box-shadow: 0 0 16px rgba(183, 109, 255, 0.4);
}

.stitch-btn--glass {
  background: rgba(27, 27, 31, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  color: var(--stitch-on-surface);
}

.stitch-btn--glass:hover {
  color: var(--stitch-primary);
}

.stitch-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .stitch-features {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stitch-feature-card {
  border-radius: 12px;
  padding: 16px;
  background: rgba(27, 27, 31, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;
}

.stitch-feature-card:hover {
  border-color: var(--stitch-outline-variant);
}

.stitch-feature-card__icon {
  display: inline-flex;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(53, 53, 52, 0.5);
  color: var(--stitch-secondary);
  transition: color 0.3s ease;
}

.stitch-feature-card:hover .stitch-feature-card__icon {
  color: var(--stitch-primary);
}

.stitch-feature-card__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
}

.stitch-feature-card__text {
  margin: 0;
  font-size: 13px;
  color: var(--stitch-on-surface-variant);
  line-height: 1.5;
}

.stitch-workflow {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.stitch-workflow__intro {
  flex-shrink: 0;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(77, 67, 84, 0.2);
}

.stitch-workflow__title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 700;
}

.stitch-workflow__desc {
  margin: 0;
  font-size: 14px;
  color: var(--stitch-on-surface-variant);
  line-height: 1.6;
}

.stitch-workflow__kbd {
  font-family: var(--stitch-mono);
  font-weight: 500;
  color: var(--stitch-secondary);
}

.stitch-code {
  font-family: var(--stitch-mono);
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--stitch-surface-variant);
}

.stitch-link {
  color: var(--stitch-primary);
  text-decoration: none;
  text-underline-offset: 4px;
}

.stitch-link:hover {
  text-decoration: underline;
}

.stitch-workflow__glass {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;
  background: rgba(27, 27, 31, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
}

.stitch-workflow__accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--stitch-primary), transparent);
  opacity: 0.5;
  pointer-events: none;
  border-radius: 12px 0 0 12px;
}

.stitch-footer {
  flex-shrink: 0;
  margin-top: auto;
  width: 100%;
  padding: 12px 0;
  border-top: 1px solid rgba(77, 67, 84, 0.05);
  background: var(--stitch-surface-lowest);
}

.stitch-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

@media (min-width: 768px) {
  .stitch-footer__inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

.stitch-footer__copy {
  font-size: 13px;
  color: var(--stitch-on-surface);
}

.stitch-footer__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.stitch-footer__link {
  font-family: var(--stitch-mono);
  font-size: 13px;
  color: var(--stitch-on-surface-variant);
  text-decoration: none;
  transition: color 0.2s ease;
}

.stitch-footer__link:hover {
  color: var(--stitch-primary);
}
</style>

<style scoped>
/* Demo 嵌入玻璃卡片后的布局与配色 */
.stitch-workflow__glass :deep(.aw-home-demo) {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: none;
  padding: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.stitch-workflow__glass :deep(.aw-home-demo__toolbar) {
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 1px solid rgba(77, 67, 84, 0.3);
}

.stitch-workflow__glass :deep(.aw-home-demo__intro) {
  color: var(--stitch-on-surface-variant, #cfc2d6);
  font-size: 14px;
  margin-bottom: 12px;
}

.stitch-workflow__glass :deep(.aw-home-demo__intro strong) {
  color: var(--stitch-on-surface, #e5e2e1);
}

.stitch-workflow__glass :deep(.aw-home-demo__intro a) {
  color: var(--stitch-primary, #ddb7ff);
  font-weight: 500;
}

.stitch-workflow__glass :deep(.aw-home-demo__intro code) {
  font-family: var(--stitch-mono, "JetBrains Mono", monospace);
  font-size: 13px;
  background: rgba(53, 53, 52, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--stitch-on-surface, #e5e2e1);
}

.stitch-workflow__glass :deep(.aw-home-demo__replay) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--stitch-mono, "JetBrains Mono", monospace);
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(77, 67, 84, 0.3);
  background: rgba(53, 53, 52, 0.4);
  color: var(--stitch-on-surface, #e5e2e1);
}

.stitch-workflow__glass :deep(.aw-home-demo__replay:hover) {
  background: var(--stitch-surface-variant, #353534);
  border-color: rgba(77, 67, 84, 0.45);
  color: var(--stitch-on-surface, #e5e2e1);
}

.stitch-workflow__glass :deep(.aw-home-demo__panel) {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
  border: 1px solid rgba(77, 67, 84, 0.1);
  border-radius: 8px;
  background: var(--stitch-surface-low, #1c1b1b);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
  padding-top: 1.25rem;
}

.stitch-workflow__glass :deep(.aw-home-demo__panel::before) {
  content: "";
  position: absolute;
  top: 16px;
  left: 16px;
  width: 2px;
  height: 16px;
  background: var(--stitch-primary, #ddb7ff);
  border-radius: 1px;
  animation: stitch-pulse 1.2s ease-in-out infinite;
  pointer-events: none;
}

.stitch-workflow__glass :deep(.aw-home-demo__stream-body) {
  padding-left: 16px;
}

.stitch-workflow__glass :deep(.aw-home-demo__caret) {
  background: var(--stitch-primary, #ddb7ff);
}

.stitch-workflow__glass :deep(.aw-home-demo__done) {
  color: rgba(207, 194, 214, 0.75);
}

@keyframes stitch-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>
