<script setup lang="ts">
import { useRoute } from "vitepress";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const route = useRoute();
const isLoading = ref(true);
let observer: MutationObserver | null = null;
let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
let idleHandle: number | ReturnType<typeof setTimeout> | null = null;
let routeDebounce: ReturnType<typeof setTimeout> | null = null;
let hasLoadedOnce = false;

const BUSUANZI_SRC = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";

// 空闲时执行：优先 requestIdleCallback，大陆低端机兜底 setTimeout，避免阻塞首屏
const runWhenIdle = (cb: () => void, timeout = 2000) => {
  if (typeof window === "undefined") return;
  const w = window as unknown as Record<string, unknown>;
  const ric = w.requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => number)
    | undefined;
  if (typeof ric === "function") {
    idleHandle = ric.call(window, cb, { timeout });
    return;
  }
  idleHandle = setTimeout(cb, 1200);
};

const cancelIdle = () => {
  if (idleHandle == null) return;
  const w = window as unknown as Record<string, unknown>;
  const cic = w.cancelIdleCallback as ((h: number) => void) | undefined;
  if (typeof cic === "function" && typeof idleHandle === "number") {
    cic.call(window, idleHandle);
  } else {
    clearTimeout(idleHandle as ReturnType<typeof setTimeout>);
  }
  idleHandle = null;
};

const runBusuanzi = () => {
  if (typeof window === "undefined") return;
  const existing = document.getElementById("cc-busuanzi-script");
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = "cc-busuanzi-script";
  script.src = BUSUANZI_SRC;
  script.referrerPolicy = "no-referrer-when-downgrade";
  script.async = true;
  // 明确低优先级，不与正文/公式抢带宽
  script.setAttribute("fetchpriority", "low");
  document.head.appendChild(script);
};

const stopLoading = () => {
  isLoading.value = false;
  if (observer) observer.disconnect();
  if (fallbackTimer) clearTimeout(fallbackTimer);
  fallbackTimer = null;
};

const runPageview = (immediate = false) => {
  isLoading.value = true;
  cancelIdle();
  const load = () => {
    runBusuanzi();
    hasLoadedOnce = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    // 统计脚本被拦截/加载失败时的超时兜底，避免骨架永久 loading
    fallbackTimer = setTimeout(stopLoading, 3000);
  };
  // 首次进入页面：等浏览器空闲再加载，首屏公式/正文优先
  if (!hasLoadedOnce && !immediate) {
    runWhenIdle(load, 2500);
    // 兜底：空闲回调万一不触发，3s 后强制加载一次
    fallbackTimer = setTimeout(() => {
      if (!hasLoadedOnce) load();
    }, 3500);
    return;
  }
  if (fallbackTimer) clearTimeout(fallbackTimer);
  // 切页：防抖 + 空闲加载，避免快速连续切页时反复插 script 造成卡顿
  fallbackTimer = setTimeout(stopLoading, 3000);
};

const setupObserver = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (typeof MutationObserver === "undefined") return;
  const el = document.getElementById("busuanzi_value_page_pv");
  if (!el) return;

  if (observer) observer.disconnect();
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        if (el.textContent && el.textContent !== "--" && el.textContent.trim() !== "") {
          stopLoading();
        }
      }
    }
  });

  observer.observe(el, { childList: true, characterData: true, subtree: true });
};

onMounted(() => {
  setupObserver();
  runPageview();
});

watch(
  () => route.path,
  () => {
    if (typeof window === "undefined") return;
    if (routeDebounce) clearTimeout(routeDebounce);
    // 切页后等 800ms + 浏览器空闲再刷新统计，避免与切页渲染抢主线程
    routeDebounce = setTimeout(() => {
      runWhenIdle(() => {
        isLoading.value = true;
        runBusuanzi();
        // stopLoading 会 disconnect observer，切页后必须重连，
        // 否则 loading 骨架要等 3s 超时兜底才消失
        setupObserver();
      }, 1500);
    }, 800);
  },
);

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  observer = null;
  if (fallbackTimer) clearTimeout(fallbackTimer);
  fallbackTimer = null;
  if (routeDebounce) clearTimeout(routeDebounce);
  routeDebounce = null;
  cancelIdle();
});
</script>

<template>
  <span class="waline-pageview">
    <svg
      class="waline-pageview-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
    <span
      id="busuanzi_value_page_pv"
      class="waline-pageview-count"
      :class="{ 'is-loading': isLoading }"
      >--</span
    >
    views
  </span>
</template>

<style scoped>
.waline-pageview {
  display: inline-flex;
  gap: 0.35em;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
}

.waline-pageview-icon {
  flex-shrink: 0;
  opacity: 0.75;
}

.waline-pageview-count {
  display: inline-block;
  min-width: 1.2em;
  text-align: center;
  transition: opacity 0.3s ease;
}

.waline-pageview-count.is-loading {
  color: transparent !important;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--vp-c-text-3) 20%, transparent) 25%,
    color-mix(in srgb, var(--vp-c-text-3) 40%, transparent) 50%,
    color-mix(in srgb, var(--vp-c-text-3) 20%, transparent) 75%
  );
  background-size: 200% 100%;
  animation: cc-shimmer 1.5s infinite linear;
  border-radius: 4px;
}

@keyframes cc-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
