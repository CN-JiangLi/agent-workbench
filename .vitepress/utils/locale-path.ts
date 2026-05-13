import { computed } from "vue";
import { useData, withBase } from "vitepress";

/** Resolve a site path for the active locale (root = English, `/zh/` = 简体中文). */
export function useLocalePath() {
  const { lang } = useData();
  const isZh = computed(() => lang.value.toLowerCase().startsWith("zh"));

  function localePath(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (isZh.value) {
      return withBase(`/zh${normalized}`);
    }
    return withBase(normalized);
  }

  return { isZh, localePath };
}
