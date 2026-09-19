<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

const { page } = useData();

// GitHub Actions 每次构建自动发布的最新版本 PDF 下载永久直链
const RELEASE_BASE = "https://github.com/yulaoshizuikeai/Physics-Note/releases/download/latest-pdf";

const completePdfUrl = `${RELEASE_BASE}/Physics-Note-Complete.pdf`;
const allZippedPdfUrl = `${RELEASE_BASE}/Physics-Note-All-PDFs.zip`;

// 只有在文档页面才显示打印/导出按钮
const isDocPage = computed(() => (page.value.frontmatter?.layout ?? "doc") === "doc");

const handlePrint = () => {
  if (typeof window !== "undefined") {
    window.print();
  }
};
</script>

<template>
  <div class="CCPdfDownloadButton">
    <!-- 下载新版本完整版单文件 PDF -->
    <a
      class="CCPdfDownloadButtonBtn is-primary"
      :href="completePdfUrl"
      target="_blank"
      rel="noopener noreferrer"
      title="下载 GitHub Actions 自动编译生成的高中物理全套笔记完整版 PDF"
    >
      <span class="CCPdfDownloadButtonBtnLabel">下载完整版</span>
      <span class="CCPdfDownloadButtonBtnHint">PDF</span>
    </a>

    <!-- 打包下载全套章节 ZIP -->
    <a
      class="CCPdfDownloadButtonBtn"
      :href="allZippedPdfUrl"
      target="_blank"
      rel="noopener noreferrer"
      title="打包下载全套 19 大专题与考点独立 PDF 压缩包 (.zip)"
    >
      <span class="CCPdfDownloadButtonBtnLabel">全套分册打包</span>
      <span class="CCPdfDownloadButtonBtnHint">ZIP</span>
    </a>

    <!-- 浏览器原生矢量打印当前页 -->
    <button
      v-if="isDocPage"
      type="button"
      class="CCPdfDownloadButtonBtn"
      title="通过浏览器原生打印功能另存当前页为 A4 矢量 PDF"
      @click="handlePrint"
    >
      <span class="CCPdfDownloadButtonBtnLabel">打印 / 导出本页</span>
      <span class="CCPdfDownloadButtonBtnHint">A4</span>
    </button>
  </div>
</template>

<style scoped>
.CCPdfDownloadButton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 170px;
  padding: 4px;
}

.CCPdfDownloadButtonBtn {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  font-family: inherit;
}

.CCPdfDownloadButtonBtn:hover {
  border-color: var(--vp-c-brand-1, #5672cd);
  background: var(--vp-c-bg-soft-hover);
  color: var(--vp-c-brand-1, #5672cd);
  transform: translateY(-1px);
}

.CCPdfDownloadButtonBtn.is-primary {
  border-color: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 35%, transparent);
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 10%, var(--vp-c-bg-alt));
  color: var(--vp-c-brand-1, #5672cd);
}

.CCPdfDownloadButtonBtn.is-primary:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 18%, var(--vp-c-bg-alt));
  border-color: var(--vp-c-brand-1, #5672cd);
}

.CCPdfDownloadButtonBtnLabel {
  font-weight: 600;
}

.CCPdfDownloadButtonBtnHint {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: color-mix(in srgb, var(--vp-c-bg-elv) 80%, transparent);
}

@media (max-width: 640px) {
  .CCPdfDownloadButton {
    width: 100%;
  }

  .CCPdfDownloadButtonBtn {
    flex: 1 1 100%;
    min-width: 0;
  }
}
</style>
