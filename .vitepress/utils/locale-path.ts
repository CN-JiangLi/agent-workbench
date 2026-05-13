import { computed } from "vue";
import { useData, withBase } from "vitepress";

/** Resolve a site path for the active locale (root = zh-CN, `/en/` = English). */
export function useLocalePath() {
  const { lang } = useData();
  const isEn = computed(() => lang.value.toLowerCase().startsWith("en"));

  function localePath(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (isEn.value) {
      return withBase(`/en${normalized}`);
    }
    return withBase(normalized);
  }

  return { isEn, localePath };
}
