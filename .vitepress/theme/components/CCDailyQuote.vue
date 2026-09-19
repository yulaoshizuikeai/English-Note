<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface GrammarFlash {
  text: string;
  tag: string;
}

// 精选高中英语核心语法速记与解题模型（每条控制在十几字，2~3 秒读完）
const ENGLISH_FLASHES: GrammarFlash[] = [
  {
    text: "判断谓语还是非谓语：句中有连词，谓语等于连词数+1；无连词则只能有一个谓语。",
    tag: "谓语判定",
  },
  { text: "非谓语动词三步法：找逻辑主语 -> 定主动被动 -> 看时间先后。", tag: "非谓语动词" },
  { text: "定语从句关系代词指代先行词在从句中作主语、宾语或表语；副词作状语。", tag: "定语从句" },
  { text: "介词提前定语从句：介词后指人只能用 whom，指物只能用 which。", tag: "介词提前" },
  {
    text: "名词性从句缺成分或意思用 what（表示‘所...的’），不缺成分且无意义用 that。",
    tag: "名词性从句",
  },
  { text: "that 引导同位语从句解释抽象名词内容，在从句中不作任何句子成分。", tag: "同位语从句" },
  {
    text: "状语从句省略条件：从句主语与主句一致，且含有 be 动词时，主语和 be 动词可一同省略。",
    tag: "从句省略",
  },
  { text: "现在分词表主动和进行，过去分词表被动和完成。", tag: "分词用法" },
  { text: "动词不定式多表目的、将要发生的动作或具体某一次的行为。", tag: "不定式" },
  {
    text: "with 复合结构：with + 宾语 + 宾补（doing 表主动进行，done 表被动完成，to do 表将来）。",
    tag: "with复合结构",
  },
  {
    text: "时态时间轴：过去完成时表示‘过去的过去’，必须以一个过去的动作为参照基准。",
    tag: "过去完成时",
  },
  {
    text: "现在完成时表示过去动作对现在造成的影响或结果，常与 already, yet, so far, since 连用。",
    tag: "现在完成时",
  },
  {
    text: "if 虚拟语气条件句：对现在虚拟从句用过去式（be 动词用 were），主句用 would/could/should/might + do。",
    tag: "虚拟语气",
  },
  {
    text: "if 虚拟语气条件句：对过去虚拟从句用 had done，主句用 would/could/should/might + have done。",
    tag: "虚拟语气",
  },
  {
    text: "一坚持、二命令、三建议、四要求：名词性从句中谓语动词用 (should) + 动词原形。",
    tag: "虚拟从句",
  },
  {
    text: "it is + 被强调部分 + that/who + 其余部分，去掉 it is 和 that 后句子结构依然完整。",
    tag: "强调句型",
  },
  {
    text: "否定词（never, seldom, hardly, scarcely, little）置于句首时，句子用部分倒装。",
    tag: "部分倒装",
  },
  { text: "only + 状语（副词/介词短语/状语从句）置于句首时，主句采用部分倒装。", tag: "部分倒装" },
  { text: "there be 句型遵循就近原则：be 动词单复数与离它最近的主语保持一致。", tag: "就近原则" },
  {
    text: "as well as, together with, along with 连接两主语时，谓语动词与前面的主语保持一致。",
    tag: "就远原则",
  },
  {
    text: "either...or..., neither...nor..., not only...but also... 连接两主语时遵循就近原则。",
    tag: "就近原则",
  },
  {
    text: "the number of + 复数名词，谓语用单数；a number of + 复数名词，谓语用复数。",
    tag: "主谓一致",
  },
  {
    text: "each, every, either, neither 单独作主语或修饰单数名词时，谓语动词一律用单数。",
    tag: "代词一致",
  },
  { text: "动名词/不定式短语或从句作主语时，谓语动词通常视作单数概念。", tag: "主语单复数" },
  {
    text: "find / consider / think / make + it + adj./n. + to do sth.，it 为形式宾语，真正的宾语是不定式。",
    tag: "形式宾语",
  },
  {
    text: "look forward to, pay attention to, be used to, devote...to 中的 to 都是介词，后接动名词 -ing。",
    tag: "介词 to",
  },
  {
    text: "suggest, enjoy, finish, avoid, mind, practice 后接动词一律用动名词 -ing。",
    tag: "接动名词",
  },
  {
    text: "need / require / want 表示‘需要被...’时，用主动形式表被动含义：need doing = need to be done。",
    tag: "被动含义",
  },
  {
    text: "be said to have done sth. 表示据说已经完成了某事，不定式完成式表示动作先于谓语发生。",
    tag: "不定式完成式",
  },
  {
    text: "independent of 与 depend on 构成反义词块，写作与填空中注意词性与搭配转换。",
    tag: "核心词块",
  },
  {
    text: "读后续写动作链描写：利用分词作伴随状语（-ing/-ed）使长句节奏紧凑流畅。",
    tag: "写作句式",
  },
];

// 每次刷新随机抽取一条（SSR 保底第一条）
const currentIndex = ref<number>(0);
const isChanging = ref<boolean>(false);
const copied = ref<boolean>(false);
let nextTimer: ReturnType<typeof setTimeout> | null = null;
let copyTimer: ReturnType<typeof setTimeout> | null = null;

onBeforeUnmount(() => {
  if (nextTimer) clearTimeout(nextTimer);
  if (copyTimer) clearTimeout(copyTimer);
  nextTimer = copyTimer = null;
});

onMounted(() => {
  // 每次页面刷新或载入时随机选择一条
  currentIndex.value = Math.floor(Math.random() * ENGLISH_FLASHES.length);
});

const currentItem = computed<GrammarFlash>(() => {
  return ENGLISH_FLASHES[currentIndex.value] || ENGLISH_FLASHES[0];
});

// 点击换一条
const handleNext = () => {
  if (isChanging.value) return;
  isChanging.value = true;
  if (nextTimer) clearTimeout(nextTimer);
  nextTimer = setTimeout(() => {
    let nextIdx = Math.floor(Math.random() * ENGLISH_FLASHES.length);
    if (nextIdx === currentIndex.value) {
      nextIdx = (nextIdx + 1) % ENGLISH_FLASHES.length;
    }
    currentIndex.value = nextIdx;
    isChanging.value = false;
    nextTimer = null;
  }, 160);
};

// 复制速记
const handleCopy = async (event: MouseEvent) => {
  event.stopPropagation();
  const text = `【高中英语语法速记】${currentItem.value.text}（#${currentItem.value.tag}）`;
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
    } else if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    copied.value = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
      copyTimer = null;
    }, 1800);
  } catch (e) {
    console.warn("Copy failed:", e);
  }
};
</script>

<template>
  <div class="cc-flash-wrap">
    <div
      class="cc-flash-card"
      role="button"
      tabindex="0"
      title="点击换一条高中英语语法速记"
      @click="handleNext"
      @keydown.enter="handleNext"
      @keydown.space.prevent="handleNext"
    >
      <!-- 左侧极简徽章 -->
      <div class="flash-badge">
        <span class="flash-badge-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </span>
        <span class="flash-badge-text">每日速记</span>
        <span class="flash-tag">{{ currentItem.tag }}</span>
      </div>

      <!-- 中间核心简短金句 -->
      <div class="flash-text-box" :class="{ 'is-swapping': isChanging }">
        <span class="flash-quote-mark">“</span
        ><span class="flash-content">{{ currentItem.text }}</span
        ><span class="flash-quote-mark">”</span>
      </div>

      <!-- 右侧轻量操作：换一条 & 复制 -->
      <div class="flash-actions" @click.stop>
        <button
          type="button"
          class="flash-action-icon-btn"
          title="换一条"
          :disabled="isChanging"
          @click="handleNext"
        >
          <svg
            class="action-svg"
            :class="{ 'is-spinning': isChanging }"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>

        <button
          type="button"
          class="flash-action-icon-btn"
          :title="copied ? '已复制' : '复制速记'"
          @click="handleCopy"
        >
          <svg
            v-if="!copied"
            class="action-svg"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg
            v-else
            class="action-svg is-check"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-flash-wrap {
  margin-top: 22px;
  width: 100%;
}

.cc-flash-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 680px;
  width: 100%;
  padding: 8px 14px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #4f46e5) 5%, var(--vp-c-bg-soft));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1, #4f46e5) 18%, transparent);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--vp-shadow-1);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cc-flash-card:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1, #4f46e5) 9%, var(--vp-c-bg-soft));
  border-color: color-mix(in srgb, var(--vp-c-brand-1, #4f46e5) 35%, transparent);
  box-shadow: var(--vp-shadow-2);
  transform: translateY(-1px);
}

.cc-flash-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* 左侧徽章 */
.flash-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 2.5px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 22%, transparent);
}

.flash-badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand-1, #5672cd);
}

.flash-badge-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-brand-1, #5672cd);
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.flash-tag {
  font-size: 10.5px;
  color: var(--vp-c-text-2);
  padding-left: 5px;
  border-left: 1px solid color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 24%, transparent);
  white-space: nowrap;
}

/* 中间速记正文 */
.flash-text-box {
  flex: 1;
  min-width: 0;
  display: block;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  font-weight: 500;
  word-break: break-word;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.flash-text-box.is-swapping {
  opacity: 0;
  transform: translateY(3px);
}

.flash-quote-mark {
  color: var(--vp-c-brand-1, #5672cd);
  font-weight: 700;
  font-size: 14px;
}

.flash-content {
  letter-spacing: 0.15px;
}

/* 右侧按钮 */
.flash-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.flash-action-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.flash-action-icon-btn:hover {
  color: var(--vp-c-brand-1, #5672cd);
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 10%, transparent);
  border-color: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 20%, transparent);
}

.action-svg.is-spinning {
  animation: spin-once 0.4s linear infinite;
}

.action-svg.is-check {
  color: #10b981;
}

@keyframes spin-once {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .cc-flash-card {
    align-items: flex-start;
    padding: 10px 12px;
  }

  .flash-badge {
    margin-top: 2px;
  }

  .flash-text-box {
    font-size: 13px;
    line-height: 1.5;
  }
}
</style>
