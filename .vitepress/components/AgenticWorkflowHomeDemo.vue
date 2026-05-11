<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import MarkdownRender from "markstream-vue";
import "markstream-vue/index.css";
import demoSource from "../../pages/home/agentic-workflow-stream-demo.md?raw";

const { isDark } = useData();

const content = ref("");
const streamingDone = ref(false);
const panelRef = ref<HTMLElement | null>(null);
let typewriterHandle: ReturnType<typeof setTimeout> | null = null;

/** Keep streamed text in view inside the scrollable panel (first screen). */
watch(content, async () => {
  await nextTick();
  const el = panelRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
});

function clearTypewriter() {
  if (typewriterHandle !== null) {
    clearTimeout(typewriterHandle);
    typewriterHandle = null;
  }
}

/** Pause after each shown character (typewriter rhythm). */
function delayAfterChar(ch: string): number {
  const base = 11;
  if (ch === "\n") return base + 55;
  if ("。.！？!?".includes(ch)) return base + 85;
  if ("，、；：,;:)]}>".includes(ch) || ch === "'" || ch === '"') return base + 38;
  if (ch === " ") return base + 6;
  return base;
}

/** Unicode-safe one-grapheme-at-a-time typing into markstream-vue */
function startStream() {
  clearTypewriter();
  content.value = "";
  streamingDone.value = false;
  const chars = Array.from(demoSource);
  let i = 0;

  function step() {
    typewriterHandle = null;
    if (i >= chars.length) {
      streamingDone.value = true;
      return;
    }
    i += 1;
    content.value = chars.slice(0, i).join("");
    const last = chars[i - 1] ?? "";
    typewriterHandle = window.setTimeout(step, delayAfterChar(last));
  }

  typewriterHandle = window.setTimeout(step, 380);
}

onMounted(() => {
  startStream();
});

onUnmounted(() => {
  clearTypewriter();
});

function replay() {
  clearTypewriter();
  startStream();
}
</script>

<template>
  <div class="aw-home-demo">
    <div class="aw-home-demo__toolbar">
      <p class="aw-home-demo__intro">
        下面是一段<strong>模拟 AI 执行 Full-Workflow</strong> 时「边想边写」生成的 Markdown（独立文件
        <code>pages/home/agentic-workflow-stream-demo.md</code>），由
        <a href="https://markstream-vue.simonhe.me/" rel="noreferrer noopener" target="_blank"
          >markstream-vue</a
        >
        在首页流式渲染。规则原文见
        <a href="/agentic-workflow/full-workflow">Agentic Full-Workflow</a>。
      </p>
      <button type="button" class="aw-home-demo__replay" @click="replay">重新播放打字机</button>
      <span v-if="streamingDone" class="aw-home-demo__done">（已完成）</span>
    </div>
    <div ref="panelRef" class="aw-home-demo__panel markstream-vue">
      <div class="aw-home-demo__stream-body">
        <MarkdownRender
          :content="content"
          custom-id="mcp-docs-home-workflow-stream"
          :is-dark="isDark"
        />
        <span
          v-show="!streamingDone"
          class="aw-home-demo__caret"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.aw-home-demo {
  margin: 1rem auto 0;
  max-width: 1100px;
  padding: 0 24px 1.25rem;
  text-align: left;
}

.aw-home-demo__toolbar {
  margin-bottom: 1rem;
}

.aw-home-demo__intro {
  margin: 0 0 0.75rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.aw-home-demo__intro a {
  font-weight: 600;
}

.aw-home-demo__replay {
  cursor: pointer;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  font-size: 0.875rem;
}

.aw-home-demo__replay:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.aw-home-demo__done {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.aw-home-demo__panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.25rem 1.25rem;
  background: var(--vp-c-bg-soft);
  /* 首屏内固定可视高度；仅内容溢出时出现滚动条（不用 stable 避免常驻占位） */
  max-height: clamp(220px, 36vh, 480px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}

.aw-home-demo__panel::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.aw-home-demo__panel::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 999px;
}

.aw-home-demo__panel::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.aw-home-demo__stream-body {
  display: block;
}

.aw-home-demo__caret {
  display: inline-block;
  width: 2px;
  height: 1.15em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: var(--vp-c-brand-1);
  border-radius: 1px;
  animation: aw-typewriter-caret 0.95s steps(1, end) infinite;
}

@keyframes aw-typewriter-caret {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
</style>
