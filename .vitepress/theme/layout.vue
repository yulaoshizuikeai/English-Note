<script setup>
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { nextTick, onMounted, onBeforeUnmount, watch } from "vue";

import CCBackToTop from "./components/CCBackToTop.vue";
import Breadcrumb from "./components/CCBreadCrumb.vue";
import CCDailyQuote from "./components/CCDailyQuote.vue";
import CCErrata from "./components/CCErrata.vue";
import CCFooter from "./components/CCFooter.vue";
import CCHeroLogo from "./components/CCHeroLogo.vue";
import { CCPageviews, CCWaline } from "./components/waline";
import { bootstrapSiteSettings } from "./composables/useSiteSettings";

const { Layout } = DefaultTheme;
const route = useRoute();
const contentImageSelector = ".vp-doc img:not([data-no-zoom])";
let imageZoom;

const normalizePath = (p) => p.replace(/\/$/, "");
let rafId = 0;
const runOnClientFrame = (cb) => {
  if (typeof window === "undefined") return;
  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = window.requestAnimationFrame(cb);
};

const expandCurrentSidebarGroup = () => {
  if (typeof window === "undefined") return;
  const currentPath = normalizePath(window.location.pathname);
  const groups = document.querySelectorAll(".VPSidebarItem.level-0.collapsible.is-link");

  groups.forEach((group) => {
    const link = group.querySelector(":scope > .item > a.VPLink");
    const caret = group.querySelector(":scope > .item > .caret");
    if (!(link instanceof HTMLAnchorElement) || !(caret instanceof HTMLElement)) return;

    const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
    if (linkPath === currentPath && group.classList.contains("collapsed")) {
      caret.click();
    }
  });
};

const setupImageZoom = async () => {
  if (typeof window === "undefined") return;
  // 无正文图片时直接跳过，连库都不下载（知识库列表页常见）
  if (!document.querySelector(contentImageSelector)) return;
  try {
    if (!imageZoom) {
      const { default: mediumZoom } = await import("medium-zoom");
      imageZoom = mediumZoom({ background: "transparent" });
    }
  } catch {
    return;
  }
  imageZoom.detach();
  document.querySelectorAll(`${contentImageSelector}[data-esa-optimized]`).forEach((image) => {
    if (!(image instanceof HTMLImageElement)) return;
    const originalUrl = new URL(image.currentSrc || image.src, window.location.href);
    originalUrl.searchParams.delete("image_process");
    image.dataset.zoomSrc = originalUrl.href;
  });
  imageZoom.attach(contentImageSelector);
};

// Track table horizontal scroll to toggle the right-edge fade class
let tableScrollHandlers = null;

const setupTableScrollFade = () => {
  if (typeof window === "undefined") return;
  // Clean up previous listeners
  if (tableScrollHandlers) {
    tableScrollHandlers.forEach((handler, table) => {
      table.removeEventListener("scroll", handler);
    });
  }
  tableScrollHandlers = new Map();
  const tables = document.querySelectorAll(".vp-doc table");
  tables.forEach((table) => {
    const update = () => {
      const atEnd = table.scrollLeft + table.clientWidth >= table.scrollWidth - 4;
      table.classList.toggle("cc-scroll-end", atEnd);
    };
    update(); // initial state
    table.addEventListener("scroll", update, { passive: true });
    tableScrollHandlers.set(table, update);
  });
};

const refreshPageEnhancements = () => {
  expandCurrentSidebarGroup();
  setupImageZoom();
  setupTableScrollFade();
};

const onSectionTitleClick = (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const titleLink = target.closest(".VPSidebarItem.level-0.collapsible.is-link > .item > a.VPLink");
  if (!(titleLink instanceof HTMLAnchorElement)) return;

  const group = titleLink.closest(".VPSidebarItem.level-0.collapsible.is-link");
  const caret = group?.querySelector(":scope > .item > .caret");
  if (group?.classList.contains("collapsed") && caret instanceof HTMLElement) {
    caret.click();
  }
};

onMounted(() => {
  bootstrapSiteSettings();
  document.addEventListener("click", onSectionTitleClick, true);
});

onBeforeUnmount(() => {
  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = 0;
  imageZoom?.detach();
  imageZoom = undefined;
  document.removeEventListener("click", onSectionTitleClick, true);
  if (tableScrollHandlers) {
    tableScrollHandlers.forEach((handler, table) => {
      table.removeEventListener("scroll", handler);
    });
    tableScrollHandlers = null;
  }
});

watch(
  () => route.path,
  async () => {
    await nextTick();
    runOnClientFrame(refreshPageEnhancements);
  },
  { immediate: true },
);
</script>

<template>
  <Layout>
    <!-- 首页动态交互 Logo -->
    <template #home-hero-image>
      <CCHeroLogo />
    </template>

    <!-- 首页高中物理微速记 (每次刷新随机一条，几秒读完，点击可切换) -->
    <template #home-hero-info-after>
      <ClientOnly>
        <CCDailyQuote />
      </ClientOnly>
    </template>

    <!-- 面包屑 -->
    <template #doc-before>
      <Breadcrumb />
    </template>

    <!-- 评论区 -->
    <template #doc-after>
      <div class="cc-comments-region">
        <ClientOnly>
          <CCWaline />
        </ClientOnly>
      </div>
    </template>

    <!-- 浏览量 -->
    <template #aside-bottom>
      <ClientOnly>
        <CCPageviews />
      </ClientOnly>
    </template>

    <!-- 读者勘误反馈卡片 -->
    <template #doc-footer-before>
      <ClientOnly>
        <CCErrata />
      </ClientOnly>
    </template>

    <!-- 页脚信息 -->
    <template #doc-bottom>
      <CCFooter />
    </template>

    <!-- 全局平滑返回顶部悬浮按钮 -->
    <template #layout-bottom>
      <ClientOnly>
        <CCBackToTop />
      </ClientOnly>
    </template>
  </Layout>
</template>
