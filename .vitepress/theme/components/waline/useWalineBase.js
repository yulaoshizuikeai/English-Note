import { useRoute } from "vitepress";
import { computed } from "vue";

// 评论服务默认关闭：配置环境变量 VITE_WALINE_SERVER_URL 后自动启用
// （CCWaline.vue 仅在 serverURL 非空时渲染，避免空容器闪烁）
const serverURL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_WALINE_SERVER_URL) ||
  "";

export const useWalineBase = () => {
  const route = useRoute();
  const path = computed(() => route.path);

  return {
    serverURL,
    route,
    path,
  };
};
