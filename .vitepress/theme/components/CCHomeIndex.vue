<script setup lang="ts">
import { withBase } from "vitepress";
import { computed, onMounted, onUnmounted, ref } from "vue";

import CCDailyQuote from "./CCDailyQuote.vue";

interface ChapterItem {
  num: string;
  title: string;
  group: "syntax" | "verb_system" | "advanced" | "practical" | "intro";
  volume: "导读说明" | "句法基础" | "三大从句" | "动词系统" | "句式拓展" | "综合实战" | "教材清单";
  volumeTag: "guide" | "syntax" | "clause" | "verb" | "special" | "exam" | "textbook";
  fileCount: number;
  desc: string;
  focusTitle: string;
  focusLink: string;
  keywords: string[];
  link: string;
}

interface SpecialItem {
  title: string;
  badge: string;
  tagClass: "blue" | "yellow" | "red";
  desc: string;
  link: string;
  actionText: string;
  iconSvg: string;
}

const chapters: ChapterItem[] = [
  {
    num: "00",
    title: "说明与学习方法",
    group: "intro",
    volume: "导读说明",
    volumeTag: "guide",
    fileCount: 3,
    desc: "知识库定位、高中英语语法全景图、自测与学习方法指导、错误反馈渠道",
    focusTitle: "高中英语语法全景图与高效研读指南",
    focusLink: "/00%20说明/高中英语语法全景图与学习方法",
    keywords: ["语法全景图", "学习方法", "课标依据", "知识体系", "错误反馈"],
    link: "/00%20说明/Readme",
  },
  {
    num: "01",
    title: "简单句结构与句子成分",
    group: "syntax",
    volume: "句法基础",
    volumeTag: "syntax",
    fileCount: 3,
    desc: "简单句 7 大基本句型、主谓宾定状补表 7 大成分拆解、长难句切分与分析技巧",
    focusTitle: "简单句在语法填空与写作中的应用",
    focusLink: "/01%20简单句结构与句子成分/考点%20简单句在语法填空与写作中的应用",
    keywords: ["7大基本句型", "句子核心成分", "长难句分析", "划括号法", "语法填空"],
    link: "/01%20简单句结构与句子成分/index",
  },
  {
    num: "02",
    title: "定语从句",
    group: "syntax",
    volume: "三大从句",
    volumeTag: "clause",
    fileCount: 4,
    desc: "关系代词与关系副词选用规则、介词+关系代词还原法、限制性与非限制性辨析",
    focusTitle: "as 与 which 引导定语从句辨析",
    focusLink: "/02%20定语从句/考点%20as与which引导定语从句辨析",
    keywords: ["关系代词", "关系副词", "介词提前", "先行词", "限制性定语从句", "as与which"],
    link: "/02%20定语从句/index",
  },
  {
    num: "03",
    title: "名词性从句",
    group: "syntax",
    volume: "三大从句",
    volumeTag: "clause",
    fileCount: 4,
    desc: "主语从句与 it 形式主语、表语从句与因果辨析、宾语从句与同位语从句",
    focusTitle: "that 与 what 在名词性从句中的判定算法",
    focusLink: "/03%20名词性从句/考点%20that与what在名词性从句中的判定算法",
    keywords: ["主语从句", "宾语从句", "表语从句", "同位语从句", "that与what", "形式主语it"],
    link: "/03%20名词性从句/index",
  },
  {
    num: "04",
    title: "状语从句",
    group: "syntax",
    volume: "三大从句",
    volumeTag: "clause",
    fileCount: 4,
    desc: "9 大状语从句分类、条件与让步状语从句、状语从句的省略与分词转换",
    focusTitle: "状语从句的省略与分词转换模型",
    focusLink: "/04%20状语从句/考点%20状语从句的省略与分词转换",
    keywords: [
      "时间地点状从",
      "让步状语从句",
      "条件状语从句",
      "从句省略",
      "分词转换",
      "虽然但是陷阱",
    ],
    link: "/04%20状语从句/index",
  },
  {
    num: "05",
    title: "非谓语动词",
    group: "verb_system",
    volume: "动词系统",
    volumeTag: "verb",
    fileCount: 5,
    desc: "不定式 to do、现在分词 -ing、过去分词 -ed 句法功能、分词作补足语与 with 复合结构",
    focusTitle: "非谓语动词解题四步判定算法",
    focusLink: "/05%20非谓语动词/考点%20非谓语动词解题四步判定算法",
    keywords: ["不定式todo", "现在分词ing", "过去分词ed", "with复合结构", "逻辑主语", "四步算法"],
    link: "/05%20非谓语动词/index",
  },
  {
    num: "06",
    title: "动词时态与语态",
    group: "verb_system",
    volume: "动词系统",
    volumeTag: "verb",
    fileCount: 5,
    desc: "高考核心 8 大时态时间轴、过去完成时、将来进行时与复杂进行/完成被动语态",
    focusTitle: "谓语动词时态语态双重判定法",
    focusLink: "/06%20动词时态与语态/考点%20谓语动词时态语态双重判定法",
    keywords: [
      "8大核心时态",
      "时间轴坐标",
      "过去完成时",
      "现在完成进行时",
      "被动语态",
      "双重判定法",
    ],
    link: "/06%20动词时态与语态/index",
  },
  {
    num: "07",
    title: "情态动词与虚拟语气",
    group: "verb_system",
    volume: "动词系统",
    volumeTag: "verb",
    fileCount: 5,
    desc: "情态动词推测用法、情态动词+have done、if 条件句虚拟时态倒退与名词性从句虚拟",
    focusTitle: "虚拟语气在高考与应用文中的应用",
    focusLink: "/07%20情态动词与虚拟语气/考点%20虚拟语气在高考与应用文中的应用",
    keywords: [
      "情态动词推测",
      "must have done",
      "if虚拟条件句",
      "时态倒退",
      "should省略",
      "建议要求命令",
    ],
    link: "/07%20情态动词与虚拟语气/index",
  },
  {
    num: "08",
    title: "特殊句式",
    group: "advanced",
    volume: "句式拓展",
    volumeTag: "special",
    fileCount: 5,
    desc: "形式主语与形式宾语 it、倒装句（完全/部分倒装）、强调句型判定、省略句与感叹句",
    focusTitle: "特殊句式在语法填空与写作中的识别",
    focusLink: "/08%20特殊句式/考点%20特殊句式在语法填空与写作中的识别",
    keywords: ["形式主宾语it", "部分倒装", "完全倒装", "强调句型", "it is that", "省略句"],
    link: "/08%20特殊句式/index",
  },
  {
    num: "09",
    title: "主谓一致与高考常考易错清单",
    group: "advanced",
    volume: "句式拓展",
    volumeTag: "special",
    fileCount: 4,
    desc: "语法/意义/就近一致三大原则、代词与数量短语一致、主谓一致四大高频易错陷阱",
    focusTitle: "主谓一致四大高频易错陷阱",
    focusLink: "/09%20主谓一致/考点%20主谓一致四大高频易错陷阱",
    keywords: ["语法一致", "意义一致", "就近原则", "就远原则", "the number of", "主谓陷阱"],
    link: "/09%20主谓一致/index",
  },
  {
    num: "10",
    title: "高考题型与语法运用",
    group: "practical",
    volume: "综合实战",
    volumeTag: "exam",
    fileCount: 4,
    desc: "语法填空解题通法与无提示词考点、读后续写高分句式升级策略、应用文写作核心句型模板",
    focusTitle: "读后续写高分句式升级策略",
    focusLink: "/10%20高考题型与语法运用/02%20读后续写高分句式升级策略",
    keywords: ["语法填空解题", "无提示词考点", "读后续写", "应用文模板", "句式升级", "分词伴随"],
    link: "/10%20高考题型与语法运用/index",
  },
  {
    num: "11",
    title: "外研版高中英语教材知识清单",
    group: "practical",
    volume: "教材清单",
    volumeTag: "textbook",
    fileCount: 5,
    desc: "外研版必修 3 册与选择性必修 4 册共 42 单元 Using language 清单、高频词块与考点迁移",
    focusTitle: "教材知识在高考读后续写与语法填空中的迁移",
    focusLink: "/11%20外研版高中英语教材知识清单/考点%20教材知识在高考读后续写与语法填空中的迁移",
    keywords: ["外研版全7册", "42单元Using language", "词块搭配", "考点迁移", "必修1-3", "选必1-4"],
    link: "/11%20外研版高中英语教材知识清单/index",
  },
];

const specialCards: SpecialItem[] = [
  {
    title: "50 大核心句法公式与速记",
    badge: "核心句法矩阵",
    tagClass: "yellow",
    desc: "聚合简单句、三大从句、非谓语动词、虚拟语气与高考高频语法判定法则，考前速查提分利器。",
    link: "/golden-conclusions",
    actionText: "速查公式",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    title: "全专题语法防踩坑排雷清单",
    badge: "考前避坑指南",
    tagClass: "red",
    desc: "系统梳理 12 大专题常考易错语法陷阱、时态混淆、从句连接词误用与短文改错避坑清单。",
    link: "/warning-cheatsheet",
    actionText: "查阅排雷",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    title: "外研版全七册 42 单元知识清单",
    badge: "教材核心归纳",
    tagClass: "blue",
    desc: "外研版必修 3 册与选择性必修 4 册共 42 单元 Using language 与语法核心例句全景汇总。",
    link: "/11%20外研版高中英语教材知识清单/01%20必修全三册Using%20language知识清单",
    actionText: "查看清单",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="16" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/></svg>`,
  },
];

// 高频热门搜索词推荐
const hotSearchKeywords = [
  "非谓语动词",
  "定语从句",
  "that与what判定",
  "虚拟语气",
  "强调句型",
  "倒装句",
  "主谓一致",
  "读后续写动作链",
  "Using language",
];

// 交互状态
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const activeGroup = ref<string>("all");
const activeVolume = ref<string>("all");

// 分组配置与计数值
const groupTabs = [
  { key: "all", label: "全部专题", count: 12 },
  { key: "syntax", label: "句法与三大从句", count: 4 },
  { key: "verb_system", label: "动词核心系统", count: 3 },
  { key: "advanced", label: "句式拓展与一致", count: 2 },
  { key: "practical", label: "教材清单与实战", count: 2 },
  { key: "intro", label: "导读说明", count: 1 },
];

const volumeTabs = [
  { key: "all", label: "全部模块" },
  { key: "syntax", label: "句法基础 (01)" },
  { key: "clause", label: "三大从句 (02-04)" },
  { key: "verb", label: "动词系统 (05-07)" },
  { key: "special", label: "句式拓展 (08-09)" },
  { key: "exam", label: "综合实战 (10)" },
  { key: "textbook", label: "教材清单 (11)" },
];

const setGroup = (key: string) => {
  activeGroup.value = key;
  activeVolume.value = "all";
};

const setVolume = (key: string) => {
  activeVolume.value = key;
  activeGroup.value = "all";
};

const applyKeyword = (kw: string) => {
  if (searchQuery.value === kw) {
    searchQuery.value = "";
  } else {
    searchQuery.value = kw;
  }
  activeGroup.value = "all";
  activeVolume.value = "all";
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  activeGroup.value = "all";
  activeVolume.value = "all";
};

// 键盘监听：按 / 聚焦搜索框，按 Esc 清空
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "/" && document.activeElement !== searchInputRef.value) {
    e.preventDefault();
    searchInputRef.value?.focus();
  } else if (e.key === "Escape" && document.activeElement === searchInputRef.value) {
    searchQuery.value = "";
    searchInputRef.value?.blur();
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
  }
});

// 智能多词检索与学科分类过滤计算属性
const filteredChapters = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return chapters.filter((item) => {
    if (activeGroup.value !== "all" && item.group !== activeGroup.value) {
      return false;
    }
    if (activeVolume.value !== "all" && item.volumeTag !== activeVolume.value) {
      return false;
    }
    if (query) {
      const tokens = query.split(/\s+/).filter(Boolean);
      const targetText = [
        item.num,
        item.title,
        item.desc,
        item.focusTitle,
        item.volume,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((tok) => {
        if (targetText.includes(tok)) return true;
        // 支持 4 字中文复合词拆分检索（如 "板块模型" 命中 "板块" + "模型"）
        if (tok.length === 4) {
          const part1 = tok.slice(0, 2);
          const part2 = tok.slice(2);
          if (targetText.includes(part1) && targetText.includes(part2)) return true;
        }
        return false;
      });
    }
    return true;
  });
});

const regularChapters = computed(() => {
  return filteredChapters.value.filter((ch) => ch.num !== "11");
});

const textbookChapter = computed(() => {
  return filteredChapters.value.find((ch) => ch.num === "11");
});
</script>

<template>
  <div class="ci-master-container">
    <!-- ============================================================
         1. Master Index Hero Header (英语语法总索引巨幕)
         ============================================================ -->
    <header class="ci-hero-section">
      <div class="ci-hero-aura" aria-hidden="true" />

      <!-- 顶部发布胶囊 -->
      <div class="ci-pill-badge">
        <span class="ci-pill-dot" aria-hidden="true" />
        <span class="ci-pill-text"
          >外研版全七册 42 单元 Using language 重构 · 2026 高考英语知识库</span
        >
        <span class="ci-pill-arrow">→</span>
      </div>

      <!-- 宏大主标题 -->
      <h1 class="ci-hero-title">
        <span class="ci-hero-title-main">高考英语语法知识库</span>
        <span class="ci-hero-title-tag">Yulaoshizuikeai's English Note</span>
      </h1>

      <!-- 核心定位导言 -->
      <p class="ci-hero-tagline">
        基于中国普通高中英语教科书（外研版必修 1-3 与选择性必修 1-4 全套 7
        册及人教版新课标教材）与高考英语评价体系。 涵盖 <strong>12 大体系专题</strong>、<strong
          >42 单元 Using language 知识清单</strong
        >
        与
        <strong>50 大核心句法判定公式</strong>，助你建立清晰的英语句法结构认知，告别题海死记硬背。
      </p>

      <!-- 核心快捷入口按钮组 -->
      <div class="ci-actions-group">
        <a :href="withBase('/00%20说明/Readme')" class="ci-btn ci-btn-primary">
          <svg
            class="ci-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>立即开始研读</span>
          <span class="ci-btn-arrow">→</span>
        </a>

        <a :href="withBase('/golden-conclusions')" class="ci-btn ci-btn-secondary">
          <svg
            class="ci-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          <span>50 大核心句法公式</span>
        </a>

        <a :href="withBase('/warning-cheatsheet')" class="ci-btn ci-btn-ghost">
          <svg
            class="ci-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>语法避坑清单</span>
        </a>

        <a
          :href="
            withBase('/11%20外研版高中英语教材知识清单/01%20必修全三册Using%20language知识清单')
          "
          class="ci-btn ci-btn-ghost"
        >
          <svg
            class="ci-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="9" y1="7" x2="16" y2="7" />
            <line x1="9" y1="11" x2="14" y2="11" />
          </svg>
          <span>教材知识清单</span>
        </a>
      </div>

      <!-- 极简通透数据指标条 -->
      <div class="ci-stats-strip">
        <div class="ci-stat-col">
          <div class="ci-stat-number">12</div>
          <div class="ci-stat-title">大体系专题板块</div>
        </div>
        <div class="ci-stat-divider" aria-hidden="true" />
        <div class="ci-stat-col">
          <div class="ci-stat-number">42</div>
          <div class="ci-stat-title">单元教材清单归纳</div>
        </div>
        <div class="ci-stat-divider" aria-hidden="true" />
        <div class="ci-stat-col">
          <div class="ci-stat-number">50</div>
          <div class="ci-stat-title">大核心句法公式</div>
        </div>
        <div class="ci-stat-divider" aria-hidden="true" />
        <div class="ci-stat-col">
          <div class="ci-stat-number">100%</div>
          <div class="ci-stat-title">离线自托管可用</div>
        </div>
      </div>

      <!-- 考点微速记播报栏 -->
      <div class="ci-flash-bar">
        <ClientOnly>
          <CCDailyQuote />
        </ClientOnly>
      </div>
    </header>

    <!-- ============================================================
         2. Quick Chapter Directory (快捷章节索引系统)
         ============================================================ -->
    <section id="chapter-directory" class="ci-directory-section">
      <!-- 索引区域标题与说明 -->
      <div class="ci-directory-head">
        <div class="ci-head-left">
          <div class="ci-directory-tag-group">
            <span class="ci-directory-tag">CHAPTER DIRECTORY</span>
            <span class="ci-shortcut-tip">按 <kbd class="ci-kbd">/</kbd> 快速检索</span>
          </div>
          <h2 class="ci-directory-title">快捷章节索引</h2>
          <p class="ci-directory-sub">
            点击章节标题进入全景概览，或点击卡片内
            <strong>【🔥 核心考点直达】</strong> 快速攻克典型题型规则。
          </p>
        </div>
        <div class="ci-head-count">
          <span
            >匹配 <strong class="ci-highlight">{{ filteredChapters.length }}</strong> / 12
            个专题</span
          >
          <button
            v-if="searchQuery || activeGroup !== 'all' || activeVolume !== 'all'"
            type="button"
            class="ci-reset-pill"
            title="还原为展示全部 12 个专题"
            @click="clearFilters"
          >
            重置筛选
          </button>
        </div>
      </div>

      <!-- 现代化控制台中枢：搜索框 + 热门考点快速检索 + 多维筛选 -->
      <div class="ci-control-panel">
        <!-- 搜索框 -->
        <div class="ci-search-box">
          <svg class="ci-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="8.5" cy="8.5" r="5.5" stroke-width="1.8" />
            <path d="M12.5 12.5L16.5 16.5" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="ci-search-input"
            placeholder="检索章节、从句或语法关键词（按 / 激活，按 Esc 清空）..."
            aria-label="快速检索章节"
          />
          <div class="ci-search-actions">
            <span v-if="!searchQuery" class="ci-search-hint">快捷键 /</span>
            <button
              v-else
              type="button"
              class="ci-search-clear"
              title="清除搜索 (Esc)"
              @click="searchQuery = ''"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- 热门高频考点点击直搜推荐条 -->
        <div class="ci-hot-row">
          <span class="ci-hot-label">🔥 热门考点:</span>
          <div class="ci-hot-chips">
            <button
              v-for="kw in hotSearchKeywords"
              :key="kw"
              type="button"
              class="ci-hot-chip"
              :class="{ 'is-active': searchQuery === kw }"
              @click="applyKeyword(kw)"
            >
              {{ kw }}
            </button>
          </div>
        </div>

        <!-- 体系与教材分类控制器 -->
        <div class="ci-filters-container">
          <!-- 知识板块主标签 -->
          <div class="ci-filter-row">
            <div class="ci-filter-label">知识板块:</div>
            <div class="ci-filter-tabs">
              <button
                v-for="tab in groupTabs"
                :key="tab.key"
                type="button"
                class="ci-tab-btn"
                :class="{ 'is-active': activeGroup === tab.key && activeVolume === 'all' }"
                @click="setGroup(tab.key)"
              >
                <span>{{ tab.label }}</span>
                <span class="ci-tab-count">{{ tab.count }}</span>
              </button>
            </div>
          </div>

          <!-- 分类细筛标签 -->
          <div class="ci-filter-row ci-filter-row--sub">
            <div class="ci-filter-label">分类筛选:</div>
            <div class="ci-filter-pills">
              <button
                v-for="v in volumeTabs"
                :key="v.key"
                type="button"
                class="ci-pill-btn"
                :class="{ 'is-active': activeVolume === v.key }"
                @click="setVolume(v.key)"
              >
                {{ v.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 章节网格区域 (前 18 章节为标准网格，第 19 实验专题为专属全景大卡片) -->
      <div v-if="filteredChapters.length > 0" class="ci-chapters-wrapper">
        <!-- 1~18 章节 3 列网格 -->
        <div v-if="regularChapters.length > 0" class="ci-chapter-grid">
          <div v-for="ch in regularChapters" :key="ch.num" class="ci-chapter-card">
            <!-- 顶部序号、教材徽章与文章篇数 -->
            <div class="ci-card-header">
              <div class="ci-card-header-left">
                <span class="ci-card-num">{{ ch.num }}</span>
                <span class="ci-card-vol-badge" :class="`vol-${ch.volumeTag}`">{{
                  ch.volume
                }}</span>
              </div>
              <span class="ci-card-meta">共 {{ ch.fileCount }} 篇</span>
            </div>

            <!-- 章节标题 (点击进入概览) -->
            <h3 class="ci-card-title">
              <a :href="withBase(ch.link)" class="ci-title-link">
                {{ ch.title }}
              </a>
            </h3>

            <!-- 章节概述 -->
            <p class="ci-card-desc">{{ ch.desc }}</p>

            <!-- 核心考点直达通道 (Highlight Focus Link) -->
            <a
              :href="withBase(ch.focusLink)"
              class="ci-focus-jump"
              title="直接研读本章压轴题型模型"
            >
              <span class="ci-focus-tag">🔥 核心模型</span>
              <span class="ci-focus-title">{{ ch.focusTitle }}</span>
              <span class="ci-focus-arrow">→</span>
            </a>

            <!-- 核心关键词标签提炼 (点击即可快速二次检索) -->
            <div class="ci-card-keywords">
              <button
                v-for="(kw, idx) in ch.keywords.slice(0, 4)"
                :key="idx"
                type="button"
                class="ci-keyword-tag"
                :class="{ 'is-active': searchQuery === kw }"
                :title="`快速按「${kw}」过滤章节`"
                @click.prevent.stop="applyKeyword(kw)"
              >
                {{ kw }}
              </button>
            </div>

            <!-- 底部全景导读直达链接 -->
            <div class="ci-card-footer">
              <a :href="withBase(ch.link)" class="ci-card-action">
                <span>进入本章全景目录</span>
                <svg class="ci-card-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path
                    d="M6 12l4-4-4-4"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- 11 外研版高中英语教材知识清单：全景通栏核心卡片 (提供 4 大知识清单直接导航) -->
        <div v-if="textbookChapter" class="ci-pano-wrap">
          <div class="ci-chapter-card ci-chapter-card--pano">
            <div class="ci-pano-grid">
              <!-- 左侧主信息 -->
              <div class="ci-pano-main">
                <div class="ci-card-header">
                  <div class="ci-pano-header-left">
                    <span class="ci-card-num ci-card-num--pano">{{ textbookChapter.num }}</span>
                    <span class="ci-card-vol-badge vol-textbook">全七册教材知识清单</span>
                  </div>
                  <span class="ci-pano-indicator">外研版 42 单元 Using language 完整覆盖</span>
                </div>

                <h3 class="ci-card-title ci-card-title--pano">
                  <a :href="withBase(textbookChapter.link)" class="ci-title-link">
                    {{ textbookChapter.title }}与考点迁移
                  </a>
                </h3>

                <p class="ci-card-desc ci-card-desc--pano">
                  提取外研版必修 1-3 与选择性必修 1-4 全套 7 册 42 单元 Using language
                  重点句式、语法清单与高频词块，全景拆解在高考读后续写与语法填空中的迁移要领。
                </p>

                <!-- 考点直达 -->
                <a
                  :href="withBase(textbookChapter.focusLink)"
                  class="ci-focus-jump ci-focus-jump--pano"
                  title="直接研读教材考点迁移"
                >
                  <span class="ci-focus-tag">🔥 考点迁移</span>
                  <span class="ci-focus-title">{{ textbookChapter.focusTitle }}</span>
                  <span class="ci-focus-arrow">→</span>
                </a>

                <div class="ci-card-footer ci-card-footer--pano">
                  <a :href="withBase(textbookChapter.link)" class="ci-card-action">
                    <span>研读外研版全套 42 单元教材清单 →</span>
                  </a>
                </div>
              </div>

              <!-- 右侧教材清单板块直达导航 -->
              <div class="ci-pano-subtopics">
                <a
                  :href="
                    withBase(
                      '/11%20外研版高中英语教材知识清单/01%20必修全三册Using%20language知识清单',
                    )
                  "
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-blue" />
                    必修全三册 Using language 清单
                  </div>
                  <p class="ci-subcard-desc">
                    必修 1-3 共 18 单元，涵盖基本句型、现在完成时、动名词与从句初阶
                  </p>
                </a>

                <a
                  :href="
                    withBase(
                      '/11%20外研版高中英语教材知识清单/02%20选择性必修全四册Using%20language知识清单',
                    )
                  "
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-green" />
                    选择性必修全四册清单
                  </div>
                  <p class="ci-subcard-desc">
                    选必 1-4 共 24 单元，涵盖非谓语进阶、虚拟语气、倒装与复杂句式
                  </p>
                </a>

                <a
                  :href="withBase('/11%20外研版高中英语教材知识清单/03%20高频词块与固定搭配清单')"
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-purple" />
                    高频词块与固定搭配清单
                  </div>
                  <p class="ci-subcard-desc">动词搭配、介词短语、读后续写情绪与动作高频词块汇总</p>
                </a>

                <a
                  :href="
                    withBase(
                      '/11%20外研版高中英语教材知识清单/考点%20教材知识在高考读后续写与语法填空中的迁移',
                    )
                  "
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-orange" />
                    教材知识高考迁移通法
                  </div>
                  <p class="ci-subcard-desc">
                    教材原句提炼为写作亮眼句式，语法填空高频无提示词考点解密
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无搜索结果时友好回退 -->
      <div v-else class="ci-empty-state">
        <div class="ci-empty-icon">🔍</div>
        <h4 class="ci-empty-title">未找到匹配的语法章节</h4>
        <p class="ci-empty-desc">
          没有与 “{{ searchQuery }}” 相关的知识板块，请尝试换一个关键词或重置筛选。
        </p>
        <button type="button" class="ci-empty-reset" @click="clearFilters">重置所有筛选条件</button>
      </div>
    </section>

    <!-- ============================================================
         3. Special Highlights Section (考前必看三大特刊)
         ============================================================ -->
    <section class="ci-specials-section">
      <div class="ci-specials-head">
        <span class="ci-specials-tag">SPECIAL ARCHIVES</span>
        <h2 class="ci-specials-title">考前专项突破特刊</h2>
      </div>

      <div class="ci-specials-grid">
        <a
          v-for="item in specialCards"
          :key="item.title"
          :href="withBase(item.link)"
          class="ci-special-card"
          :class="`is-${item.tagClass}`"
        >
          <div class="ci-special-top">
            <span class="ci-special-badge" :class="`badge-${item.tagClass}`">{{ item.badge }}</span>
            <div class="ci-special-icon" v-html="item.iconSvg" />
          </div>
          <h3 class="ci-special-name">{{ item.title }}</h3>
          <p class="ci-special-desc">{{ item.desc }}</p>
          <div class="ci-special-action">
            <span>{{ item.actionText }}</span>
            <svg class="ci-special-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M6 12l4-4-4-4"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
   Master Container & Global Spacing
   ============================================================ */
.ci-master-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 4rem;
  box-sizing: border-box;
}

/* ============================================================
   1. Master Index Hero Header
   ============================================================ */
.ci-hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 0 3.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 3.2rem;
  overflow: visible;
}

/* 柔和背景光晕 */
.ci-hero-aura {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 380px;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent) 0%,
    color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent) 45%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  filter: blur(40px);
}

/* 顶部发布胶囊 */
.ci-pill-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-elv));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-border));
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 550;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.ci-pill-badge:hover {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-bg-elv));
  transform: translateY(-1px);
}

.ci-pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
}

.ci-pill-arrow {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* 宏伟主标题 */
.ci-hero-title {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 1.25rem 0;
  border: none !important;
  padding: 0 !important;
}

.ci-hero-title-main {
  font-family: var(--vp-font-family-serif);
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--vp-c-text-1);
  background: var(
    --vp-home-hero-name-background,
    linear-gradient(135deg, #374ea3 0%, #5672cd 50%, #758ee6 100%)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ci-hero-title-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
}

/* 核心导言 */
.ci-hero-tagline {
  position: relative;
  z-index: 1;
  max-width: 820px;
  font-size: 1.06rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin: 0 0 2rem 0;
}

.ci-hero-tagline strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

/* 快捷行动按钮组 */
.ci-actions-group {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2.2rem;
}

.ci-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.ci-btn-primary {
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1);
  box-shadow: 0 4px 14px rgba(76, 103, 185, 0.3);
}

.ci-btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 103, 185, 0.42);
}

.ci-btn-arrow {
  transition: transform 0.2s ease;
}

.ci-btn-primary:hover .ci-btn-arrow {
  transform: translateX(3px);
}

.ci-btn-secondary {
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-elv));
  color: var(--vp-c-brand-1) !important;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-border));
  box-shadow: var(--vp-shadow-1);
}

.ci-btn-secondary:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-bg-elv));
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: var(--vp-shadow-2);
}

.ci-btn-ghost {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2) !important;
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--vp-shadow-1);
}

.ci-btn-ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  transform: translateY(-1px);
}

.ci-btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* 通透学术指标条 */
.ci-stats-strip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
}

.ci-stat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ci-stat-number {
  font-family: var(--vp-font-family-mono);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1.15;
}

.ci-stat-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
}

.ci-stat-divider {
  width: 1px;
  height: 28px;
  background: var(--vp-c-divider);
}

/* 每日速记微电台嵌入栏 */
.ci-flash-bar {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

/* ============================================================
   2. Quick Chapter Directory (优化后的现代化章节索引系统)
   ============================================================ */
.ci-directory-section {
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 1.5rem);
  margin-bottom: 4rem;
}

.ci-directory-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1.5rem;
}

.ci-directory-tag-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.35rem;
}

.ci-directory-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.ci-shortcut-tip {
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ci-kbd {
  display: inline-block;
  padding: 1px 5px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
}

.ci-directory-title {
  font-family: var(--vp-font-family-serif);
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  margin: 0 0 0.35rem 0;
  border: none !important;
  padding: 0 !important;
}

.ci-directory-sub {
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.ci-directory-sub strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.ci-head-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.ci-reset-pill {
  font-family: var(--vp-font-family-base);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: all 0.16s ease;
}

.ci-reset-pill:hover {
  color: #ef4444;
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, var(--vp-c-bg-soft));
}

.ci-highlight {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

/* 控制台整体容器 */
.ci-control-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.4rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: var(--vp-shadow-1);
  margin-bottom: 2rem;
}

/* 搜索框与热键提示 */
.ci-search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.ci-search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.ci-search-input {
  width: 100%;
  min-height: 48px;
  padding: 10px 80px 10px 42px;
  font-size: 0.92rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;
}

.ci-search-input:focus {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

.ci-search-actions {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ci-search-hint {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.ci-search-clear {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.16s ease;
}

.ci-search-clear:hover {
  background: var(--vp-c-gutter);
  color: var(--vp-c-text-1);
}

/* 热门高频考点快速直搜标签 */
.ci-hot-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ci-hot-label {
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.ci-hot-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.ci-hot-chip {
  padding: 3px 8px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.ci-hot-chip:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-soft));
}

.ci-hot-chip.is-active {
  color: #ffffff;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* 筛选分类组合 */
.ci-filters-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.ci-filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ci-filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  width: 62px;
  flex-shrink: 0;
}

.ci-filter-tabs,
.ci-filter-pills {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ci-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 6px 13px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ci-tab-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.ci-tab-btn.is-active {
  color: #ffffff;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(76, 103, 185, 0.25);
}

.ci-tab-count {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  opacity: 0.85;
}

.ci-pill-btn {
  min-height: 28px;
  padding: 3px 10px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.ci-pill-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.ci-pill-btn.is-active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  border-color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* ============================================================
   1~18 章节卡片 3 列网格 (高信息密度与重点考点直达)
   ============================================================ */
.ci-chapters-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ci-chapter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.ci-chapter-card {
  display: flex;
  flex-direction: column;
  padding: 1.35rem 1.4rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-card);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.ci-chapter-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
}

.ci-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.ci-card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ci-card-num {
  font-family: var(--vp-font-family-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.ci-card-vol-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
}

.vol-guide {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-border);
}

.vol-syntax {
  background: var(--vp-pastel-blue);
  color: var(--vp-pastel-blue-text);
  border-color: var(--vp-pastel-blue-border);
}

.vol-clause {
  background: var(--vp-pastel-purple);
  color: var(--vp-pastel-purple-text);
  border-color: var(--vp-pastel-purple-border);
}

.vol-verb {
  background: var(--vp-pastel-green);
  color: var(--vp-pastel-green-text);
  border-color: var(--vp-pastel-green-border);
}

.vol-special {
  background: var(--vp-pastel-yellow);
  color: var(--vp-pastel-yellow-text);
  border-color: var(--vp-pastel-yellow-border);
}

.vol-exam {
  background: var(--vp-pastel-red);
  color: var(--vp-pastel-red-text);
  border-color: var(--vp-pastel-red-border);
}

.vol-textbook {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}

.ci-card-meta {
  font-family: var(--vp-font-family-mono);
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
}

.ci-card-title {
  font-size: 1.08rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  line-height: 1.35;
  margin: 0 0 0.45rem 0;
  letter-spacing: -0.015em;
}

.ci-title-link {
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  transition: color 0.18s ease;
}

.ci-title-link:hover {
  color: var(--vp-c-brand-1) !important;
}

.ci-card-desc {
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 0.85rem 0;
}

/* 核心压轴考点直达通道 (Highlight Focus Jump Pill) */
.ci-focus-jump {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 7%, var(--vp-c-bg-soft));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  border-radius: 8px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  margin-bottom: 0.85rem;
  transition: all 0.18s ease;
}

.ci-focus-jump:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-bg-soft));
  border-color: var(--vp-c-brand-1);
}

.ci-focus-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #ea580c;
  white-space: nowrap;
}

.ci-focus-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ci-focus-arrow {
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  transition: transform 0.18s ease;
}

.ci-focus-jump:hover .ci-focus-arrow {
  transform: translateX(3px);
}

/* 核心关键词标签 */
.ci-card-keywords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 1rem;
  flex: 1;
}

.ci-keyword-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  font-size: 0.72rem;
  font-family: inherit;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.16s ease;
}

.ci-keyword-tag:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-soft));
}

.ci-keyword-tag.is-active {
  color: #ffffff;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* 卡片底栏 */
.ci-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.ci-card-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
}

.ci-card-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.ci-chapter-card:hover .ci-card-arrow {
  transform: translateX(4px);
}

/* ============================================================
   19 实验专题：全景通栏核心大卡片
   ============================================================ */
.ci-pano-wrap {
  width: 100%;
}

.ci-chapter-card--pano {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--vp-pastel-yellow) 40%, var(--vp-c-bg-elv)) 0%,
    var(--vp-c-bg-elv) 100%
  );
  border: 1px solid color-mix(in srgb, var(--vp-pastel-yellow-border) 60%, var(--vp-c-border));
  padding: 1.6rem 1.8rem;
}

.ci-chapter-card--pano:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
  transform: translateY(-2px);
}

.ci-pano-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.85fr;
  gap: 2rem;
  align-items: center;
}

.ci-pano-main {
  display: flex;
  flex-direction: column;
}

.ci-pano-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ci-card-num--pano {
  font-size: 1.4rem;
}

.ci-pano-indicator {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--vp-pastel-yellow-text);
  letter-spacing: 0.04em;
}

.ci-card-title--pano {
  font-size: 1.35rem;
  margin: 0.4rem 0 0.5rem 0;
}

.ci-card-desc--pano {
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 0.9rem;
}

.ci-focus-jump--pano {
  margin-bottom: 1.2rem;
}

.ci-card-footer--pano {
  border: none;
  padding: 0;
}

/* 右侧四大实验板块直达通道 (2x2 对称网格) */
.ci-pano-subtopics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.ci-pano-subcard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.85rem 0.95rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: all 0.2s ease;
}

.ci-pano-subcard:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.ci-subcard-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
}

.ci-pano-subcard:hover .ci-subcard-title {
  color: var(--vp-c-brand-1);
}

.ci-subcard-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bullet-blue {
  background-color: #3b82f6;
}
.bullet-green {
  background-color: #10b981;
}
.bullet-purple {
  background-color: #8b5cf6;
}
.bullet-orange {
  background-color: #f97316;
}

.ci-subcard-desc {
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 空搜索状态 */
.ci-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3.5rem 1rem;
  background: var(--vp-c-bg-elv);
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
}

.ci-empty-icon {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
}

.ci-empty-title {
  font-size: 1.15rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  margin: 0 0 0.4rem 0;
}

.ci-empty-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin: 0 0 1.25rem 0;
}

.ci-empty-reset {
  padding: 8px 18px;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ci-empty-reset:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

/* ============================================================
   3. Special Highlights Section (考前必看三大特刊)
   ============================================================ */
.ci-specials-section {
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.ci-specials-head {
  text-align: center;
  margin-bottom: 2rem;
}

.ci-specials-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.ci-specials-title {
  font-family: var(--vp-font-family-serif);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.02em;
  border: none !important;
  padding: 0 !important;
}

.ci-specials-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.ci-special-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.4rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  box-shadow: var(--vp-shadow-card);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.ci-special-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-2);
}

.ci-special-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ci-special-icon {
  width: 22px;
  height: 22px;
  color: var(--vp-c-text-2);
}

.ci-special-card:hover .ci-special-icon {
  color: var(--vp-c-brand-1);
}

.ci-special-name {
  font-size: 1.12rem;
  font-weight: 650;
  line-height: 1.35;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  letter-spacing: -0.015em;
}

.ci-special-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 1.25rem 0;
  flex: 1;
}

.ci-special-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.ci-special-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.ci-special-card:hover .ci-special-arrow {
  transform: translateX(3px);
}

.ci-special-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2em 0.65em;
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: 9999px;
  line-height: 1.2;
}

/* ============================================================
   4. Responsive Breakpoints
   ============================================================ */
@media (max-width: 1024px) {
  .ci-chapter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ci-pano-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .ci-hero-title-main {
    font-size: 2.5rem;
  }
  .ci-hero-tagline {
    font-size: 0.98rem;
  }
  .ci-stats-strip {
    gap: 14px;
  }
  .ci-stat-number {
    font-size: 1.3rem;
  }
  .ci-stat-title {
    font-size: 0.74rem;
  }
  .ci-stat-divider {
    display: none;
  }
  .ci-chapter-grid,
  .ci-specials-grid,
  .ci-pano-subtopics {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .ci-directory-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .ci-hot-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
