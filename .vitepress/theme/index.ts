// https://vitepress.dev/guide/custom-theme
import { defineComponent, h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import AgenticWorkflowHomeDemo from "../components/AgenticWorkflowHomeDemo.vue";
import StitchHomePage from "../components/StitchHomePage.vue";
import "./style.css";

const Layout = defineComponent({
  name: "McpDocsLayout",
  setup() {
    const { frontmatter } = useData();
    return () =>
      frontmatter.value.stitchHome ? h(StitchHomePage) : h(DefaultTheme.Layout);
  },
});

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("AgenticWorkflowHomeDemo", AgenticWorkflowHomeDemo);
  },
} satisfies Theme;
