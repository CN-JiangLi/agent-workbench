<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import MarkdownRender from "markstream-vue";
import "markstream-vue/index.css";
import demoZh from "../stream-demos/zh.md?raw";
import demoEn from "../stream-demos/en.md?raw";
import { useLocalePath } from "../utils/locale-path";

const { isDark, lang } = useData();
const { localePath } = useLocalePath();

const demoSource = computed(() =>
  lang.value.toLowerCase().startsWith("en") ? demoEn : demoZh,
);

const labels = computed(() =>
  lang.value.toLowerCase().startsWith("en")
    ? {
        replay: "Replay stream",
        done: "(complete)",
      }
    : {
        replay: "重新播放流",
        done: "（已完成）",
      },
);

const content = ref("");
const streamingDone = ref(false);
const panelRef = ref<HTMLElement | null>(null);
let typewriterHandle: ReturnType<typeof setTimeout> | null = null;

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

function delayAfterChar(ch: string): number {
  const base = 8;
  if (ch === "\n") return base + 28;
  if ("。.！？!?".includes(ch)) return base + 42;
  if ("，、；：,;:)]}>".includes(ch) || ch === "'" || ch === '"') return base + 18;
  if (ch === " ") return base + 4;
  if (ch === "|" || ch === "`") return base + 2;
  return base;
}

function startStream() {
  clearTypewriter();
  content.value = "";
  streamingDone.value = false;
  const text = String(demoSource.value);
  const chars = Array.from(text);
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

watch(demoSource, () => {
  if (typeof window === "undefined") return;
  startStream();
});

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
        <template v-if="lang.toLowerCase().startsWith('en')">
          Below is <strong>simulated AI output for Full-Workflow</strong> as Markdown (file
          <code>.vitepress/stream-demos/en.md</code>), streamed on the home page with
          <a href="https://markstream-vue.simonhe.me/" rel="noreferrer noopener" target="_blank"
            >markstream-vue</a
          >.           Canonical rules:
          <a :href="localePath('/agent-workflow/mcp-core')">Agent Workflow</a>.
        </template>
        <template v-else>
          下面是一段<strong>模拟 AI 执行 Full-Workflow</strong> 时「边想边写」生成的 Markdown（独立文件
          <code>.vitepress/stream-demos/zh.md</code>），由
          <a href="https://markstream-vue.simonhe.me/" rel="noreferrer noopener" target="_blank"
            >markstream-vue</a
          >
          在首页流式渲染。          规则原文见
          <a :href="localePath('/agent-workflow/mcp-core')">Agent 工作流</a>。
        </template>
      </p>
      <button type="button" class="aw-home-demo__replay" @click="replay">
        <span class="aw-home-demo__replay-icon material-symbols-outlined" aria-hidden="true">replay</span>
        {{ labels.replay }}
      </button>
      <span v-if="streamingDone" class="aw-home-demo__done">{{ labels.done }}</span>
    </div>
    <div ref="panelRef" class="aw-home-demo__panel markstream-vue">
      <div class="aw-home-demo__stream-body">
        <MarkdownRender
          :content="content"
          custom-id="mcp-docs-home-workflow-stream"
          :is-dark="isDark"
        />
        <span v-show="!streamingDone" class="aw-home-demo__caret" aria-hidden="true" />
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

.aw-home-demo__replay-icon {
  font-size: 16px;
  line-height: 1;
  vertical-align: middle;
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
  max-height: min(72vh, 640px);
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
