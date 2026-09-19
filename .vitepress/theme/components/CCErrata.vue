<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { computed, onBeforeUnmount, ref } from "vue";

const { page } = useData();
const route = useRoute();

const copySuccess = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | null = null;

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = null;
});

const pageTitle = computed(() => {
  return page.value.title || "物理专题考点";
});

const pageUrl = computed(() => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return `https://physics.yunet.cfd${route.path}`;
});

const mailtoUrl = computed(() => {
  const title = pageTitle.value;
  const url = pageUrl.value;
  const subject = encodeURIComponent(`【高考物理知识库勘误反馈】《${title}》`);
  const body = encodeURIComponent(
    `Hi Yulaoshizuikeai:\n\n我在阅读《${title}》时发现以下错漏或疑问，特此提交勘误反馈：\n\n` +
      `【勘误页面】：${title}\n` +
      `【页面链接】：${url}\n` +
      `【问题类型】：[公式推导错误 / 概念歧义 / 错别字 / 图解错误 / 遗漏补充 / 其他]\n` +
      `【所在位置】：（例如：第X节、某公式附近或某题解处）\n` +
      `【原文内容】：\n\n` +
      `【建议修改】：\n\n` +
      `【推导依据 / 参考资料】：\n\n` +
      `---\n（感谢您对高考物理知识库的指正与支持！）`,
  );
  return `mailto:imharlanyu@gmail.com?subject=${subject}&body=${body}`;
});

const copyTemplate = async () => {
  const title = pageTitle.value;
  const url = pageUrl.value;
  const text =
    `收件人：imharlanyu@gmail.com\n` +
    `邮件主题：【高考物理知识库勘误反馈】《${title}》\n\n` +
    `【勘误页面】：${title}\n` +
    `【页面链接】：${url}\n` +
    `【问题类型】：[公式推导错误 / 概念歧义 / 错别字 / 图解错误 / 遗漏补充 / 其他]\n` +
    `【所在位置】：（例如：第X节、某公式附近或某题解处）\n` +
    `【原文内容】：\n\n` +
    `【建议修改】：\n\n` +
    `【推导依据 / 参考资料】：\n`;

  const flashSuccess = () => {
    copySuccess.value = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copySuccess.value = false;
      copyTimer = null;
    }, 2500);
  };
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      flashSuccess();
    } else if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      flashSuccess();
    }
  } catch {
    // 降级方案
    copySuccess.value = false;
  }
};
</script>

<template>
  <div class="cc-errata">
    <div class="cc-errata__main">
      <div class="cc-errata__icon-wrap">
        <svg
          class="cc-errata__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          <path d="m15 5 3 3" />
        </svg>
      </div>

      <div class="cc-errata__info">
        <div class="cc-errata__title-line">
          <h4 class="cc-errata__title">发现公式错漏或内容瑕疵？</h4>
          <span class="cc-errata__badge">读者勘误</span>
        </div>
        <p class="cc-errata__desc">
          高考物理知识库持续校对更新中。若您在公式推导、物理图解或文字中发现笔误，欢迎通过邮件直接反馈，我们将第一时间核实并修订。
        </p>
      </div>
    </div>

    <div class="cc-errata__actions">
      <a
        class="cc-errata__btn cc-errata__btn--primary"
        :href="mailtoUrl"
        target="_blank"
        rel="noopener noreferrer"
        title="直接唤起本地邮件客户端发送勘误"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span>邮件一键勘误</span>
      </a>

      <button
        class="cc-errata__btn cc-errata__btn--secondary"
        type="button"
        title="复制包含邮箱与页面的勘误格式文本"
        @click="copyTemplate"
      >
        <svg
          v-if="!copySuccess"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{{ copySuccess ? "已复制勘误模板与邮箱" : "复制模板与邮箱" }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cc-errata {
  margin: 2rem 0 1.5rem;
  padding: 1.25rem 1.4rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-card, 0 2px 8px rgba(0, 0, 0, 0.03));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.cc-errata:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-border));
  box-shadow: var(--vp-shadow-2);
}

.cc-errata__main {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1 1 auto;
  min-width: 0;
}

.cc-errata__icon-wrap {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.cc-errata__info {
  flex: 1 1 auto;
  min-width: 0;
}

.cc-errata__title-line {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
}

.cc-errata__title {
  font-size: 1rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.35;
}

.cc-errata__badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15em 0.55em;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  color: var(--vp-c-brand-1);
  letter-spacing: 0.02em;
}

.cc-errata__desc {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cc-errata__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cc-errata__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 40px;
  padding: 0 1.1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none !important;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-tap-highlight-color: transparent;
}

.cc-errata__btn--primary {
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-1);
}

.cc-errata__btn--primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: var(--vp-shadow-2);
}

.dark .cc-errata__btn--primary {
  color: #121415 !important;
}

.cc-errata__btn--secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.cc-errata__btn--secondary:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-alt));
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-border));
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .cc-errata {
    flex-direction: column;
    align-items: stretch;
    gap: 1.1rem;
    padding: 1.15rem;
  }

  .cc-errata__actions {
    flex-direction: row;
    width: 100%;
  }

  .cc-errata__btn {
    flex: 1 1 50%;
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .cc-errata__actions {
    flex-direction: column;
  }

  .cc-errata__btn {
    width: 100%;
    flex: 1 1 auto;
    min-height: 44px;
  }
}
</style>
