<script setup lang="ts">
import { withBase } from "vitepress";
import { computed, onMounted, onUnmounted, ref } from "vue";

import CCDailyQuote from "./CCDailyQuote.vue";

interface ChapterItem {
  num: string;
  title: string;
  group: "mechanics" | "electromagnetism" | "waves_modern" | "experiments";
  volume:
    | "必修第一册"
    | "必修第二册"
    | "必修第三册"
    | "选必第一册"
    | "选必第二册"
    | "选必第三册"
    | "实验专题";
  volumeTag: "bx1" | "bx2" | "bx3" | "xb1" | "xb2" | "xb3" | "exp";
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
    num: "01",
    title: "运动的描述与匀变速规律",
    group: "mechanics",
    volume: "必修第一册",
    volumeTag: "bx1",
    fileCount: 5,
    desc: "质点参考系、位移速度加速度、匀变速四大公式与推论、运动图像",
    focusTitle: "运动图像与追及相遇模型",
    focusLink: "/01%20运动的描述与匀变速规律/考点%20运动图像与追及相遇",
    keywords: [
      "质点参考系",
      "位移与速度",
      "加速度",
      "匀变速四大公式",
      "中间时刻速度",
      "v-t 图像",
      "追及相遇",
    ],
    link: "/01%20运动的描述与匀变速规律/index",
  },
  {
    num: "02",
    title: "相互作用与共点力平衡",
    group: "mechanics",
    volume: "必修第一册",
    volumeTag: "bx1",
    fileCount: 6,
    desc: "重力弹力、静动摩擦力、力的合成与分解、共点力动态平衡",
    focusTitle: "受力分析与动态平衡矢量三角形",
    focusLink: "/02%20相互作用与共点力平衡/考点%20受力分析规范与动态平衡模型",
    keywords: [
      "重力与重心",
      "胡克定律",
      "静动摩擦力",
      "力的合成正交分解",
      "动态平衡矢量三角形",
      "轻绳与轻杆",
    ],
    link: "/02%20相互作用与共点力平衡/index",
  },
  {
    num: "03",
    title: "牛顿运动定律与动力学应用",
    group: "mechanics",
    volume: "必修第一册",
    volumeTag: "bx1",
    fileCount: 5,
    desc: "牛顿三定律、力学单位制、超重失重、板块与传送带动力学模型",
    focusTitle: "动力学临界极值与板块传送带",
    focusLink: "/03%20牛顿运动定律与动力学应用/考点%20动力学临界极值与连接体模型",
    keywords: [
      "板块模型",
      "牛顿运动定律",
      "超重失重判断",
      "连接体整体隔离法",
      "传送带动力学",
      "动力学临界极值",
    ],
    link: "/03%20牛顿运动定律与动力学应用/index",
  },
  {
    num: "04",
    title: "抛体运动与曲线运动",
    group: "mechanics",
    volume: "必修第二册",
    volumeTag: "bx2",
    fileCount: 4,
    desc: "曲线运动条件、平抛运动运动学与轨迹方程、斜面平抛解题模型",
    focusTitle: "平抛运动三大经典解题模型",
    focusLink: "/04%20抛体运动与曲线运动/考点%20平抛运动三大经典解题模型",
    keywords: [
      "曲线运动条件",
      "运动合成与分解",
      "小船渡河模型",
      "平抛独立性规律",
      "速度与位移偏角",
      "斜面平抛模型",
    ],
    link: "/04%20抛体运动与曲线运动/index",
  },
  {
    num: "05",
    title: "圆周运动及其应用",
    group: "mechanics",
    volume: "必修第二册",
    volumeTag: "bx2",
    fileCount: 4,
    desc: "线速度角速度、向心加速度、轻绳与轻杆竖直圆周临界模型",
    focusTitle: "竖直圆周轻绳轻杆临界模型",
    focusLink: "/05%20圆周运动及其应用/考点%20竖直面圆周运动轻绳与轻杆临界模型",
    keywords: [
      "线速度与角速度",
      "向心力与加速度",
      "圆锥摆模型",
      "火车转弯外轨超高",
      "轻绳竖直圆周",
      "轻杆临界极值",
    ],
    link: "/05%20圆周运动及其应用/index",
  },
  {
    num: "06",
    title: "万有引力与宇宙航行",
    group: "mechanics",
    volume: "必修第二册",
    volumeTag: "bx2",
    fileCount: 5,
    desc: "开普勒三定律、万有引力定律、三大宇宙速度、卫星变轨与双星",
    focusTitle: "卫星变轨追及与双星系统",
    focusLink: "/06%20万有引力与宇宙航行/考点%20卫星变轨追及相遇与双星模型",
    keywords: [
      "万有引力",
      "双星系统",
      "开普勒三定律",
      "黄金代换式",
      "三大宇宙速度",
      "卫星变轨追及",
    ],
    link: "/06%20万有引力与宇宙航行/index",
  },
  {
    num: "07",
    title: "机械能守恒与功能关系",
    group: "mechanics",
    volume: "必修第二册",
    volumeTag: "bx2",
    fileCount: 5,
    desc: "功与功率、机车启动、动能定理、机械能守恒定律、摩擦生热",
    focusTitle: "变力做功与摩擦生热功能综合",
    focusLink: "/07%20机械能守恒与功能关系/考点%20变力做功计算法与功能关系综合",
    keywords: [
      "恒力与变力做功",
      "机车恒功率启动",
      "动能定理核心应用",
      "机械能守恒判据",
      "功能转化本质",
      "相对滑动摩擦生热",
    ],
    link: "/07%20机械能守恒与功能关系/index",
  },
  {
    num: "08",
    title: "动量守恒定律与碰撞",
    group: "mechanics",
    volume: "选必第一册",
    volumeTag: "xb1",
    fileCount: 5,
    desc: "动量定理、动量守恒定律、完全弹性/非弹性碰撞、反冲与弹簧振子",
    focusTitle: "动量与能量综合三大经典模型",
    focusLink: "/08%20动量守恒定律与碰撞/考点%20动量与能量综合三大经典模型",
    keywords: [
      "动量守恒",
      "碰撞模型",
      "动量定理应用",
      "完全弹性碰撞",
      "完全非弹性碰撞",
      "人船位移模型",
      "反冲与喷气动力",
    ],
    link: "/08%20动量守恒定律与碰撞/index",
  },
  {
    num: "09",
    title: "静电场与电能",
    group: "electromagnetism",
    volume: "必修第三册",
    volumeTag: "bx3",
    fileCount: 6,
    desc: "库仑定律、场强与电场线、电势能与等势面、匀强电场 U=Ed、电容动态分析",
    focusTitle: "静电场性质综合与电场图像",
    focusLink: "/09%20静电场与电能/考点%20静电场性质综合与电场图像模型",
    keywords: [
      "静电场性质",
      "电容器动态",
      "库仑定律",
      "等势面与电场线",
      "电势与电势能",
      "匀强电场U=Ed",
      "电容器动态分析",
    ],
    link: "/09%20静电场与电能/index",
  },
  {
    num: "10",
    title: "带电粒子在电场中的运动",
    group: "electromagnetism",
    volume: "必修第三册",
    volumeTag: "bx3",
    fileCount: 4,
    desc: "带电粒子在电场中的加速、类平抛偏转轨迹、示波管原理、交变电场运动",
    focusTitle: "带电粒子在交变电场中偏转",
    focusLink: "/10%20带电粒子在电场中的运动/考点%20带电粒子在交变电场中的运动模型",
    keywords: [
      "电场直线加速",
      "电场类平抛偏转",
      "偏转角与侧移量",
      "示波管偏转原理",
      "交变方波电场运动",
    ],
    link: "/10%20带电粒子在电场中的运动/index",
  },
  {
    num: "11",
    title: "电路与恒定电流",
    group: "electromagnetism",
    volume: "必修第三册",
    volumeTag: "bx3",
    fileCount: 5,
    desc: "电流微观式、电阻定律、电表改装、闭合电路欧姆定律与电源输出极值",
    focusTitle: "闭合电路动态分析与电源极值",
    focusLink: "/11%20电路与恒定电流/考点%20闭合电路动态分析与电源输出功率",
    keywords: [
      "电流微观表达式",
      "电阻定律电阻率",
      "电表改装与校准",
      "闭合电路欧姆定律",
      "路端电压U-I图线",
      "电源最大输出功率",
    ],
    link: "/11%20电路与恒定电流/index",
  },
  {
    num: "12",
    title: "磁场与安培力洛伦兹力",
    group: "electromagnetism",
    volume: "选必第二册",
    volumeTag: "xb2",
    fileCount: 6,
    desc: "磁感应强度、安培力与左手定则、洛伦兹力、匀强磁场圆周运动几何轨迹与质谱仪",
    focusTitle: "磁场回旋圆周几何轨迹解法",
    focusLink: "/12%20磁场与安培力洛伦兹力/考点%20磁场中圆周运动几何轨迹解题模型",
    keywords: [
      "磁感应强度",
      "安培力与左手定则",
      "洛伦兹力不作功",
      "匀强磁场圆周运动",
      "找圆心定半径算周期",
      "质谱仪与回旋加速器",
    ],
    link: "/12%20磁场与安培力洛伦兹力/index",
  },
  {
    num: "13",
    title: "电磁感应与综合应用",
    group: "electromagnetism",
    volume: "选必第二册",
    volumeTag: "xb2",
    fileCount: 4,
    desc: "楞次定律、法拉第电磁感应定律、动生感生电动势、导轨滑棒力电能量综合",
    focusTitle: "导轨滑棒动力学与能量综合",
    focusLink: "/13%20电磁感应与综合应用/考点%20电磁感应导轨滑棒动力学与能量综合",
    keywords: [
      "电磁感应",
      "导轨滑棒",
      "楞次定律增反减同",
      "法拉第电磁感应定律",
      "动生感生电动势",
      "单棒导轨收尾平衡",
      "双棒与电容导轨系统",
    ],
    link: "/13%20电磁感应与综合应用/index",
  },
  {
    num: "14",
    title: "交变电流与电磁波",
    group: "electromagnetism",
    volume: "选必第二册",
    volumeTag: "xb2",
    fileCount: 5,
    desc: "正弦交变电流四值、理想变压器规律、远距离高压输电、电磁振荡与传感器",
    focusTitle: "变压器动态分析与等效电阻",
    focusLink: "/14%20交变电流与电磁波/考点%20变压器动态分析与等效电阻模型",
    keywords: [
      "交变电流",
      "理想变压器",
      "正弦交流电产生",
      "理想变压器变比",
      "远距离高压输电",
      "LC电磁振荡周期",
      "麦克斯韦电磁场理论",
    ],
    link: "/14%20交变电流与电磁波/index",
  },
  {
    num: "15",
    title: "机械振动与机械波",
    group: "waves_modern",
    volume: "选必第一册",
    volumeTag: "xb1",
    fileCount: 6,
    desc: "简谐运动回复力与能量、单摆与共振、机械波图像与振动图像互化",
    focusTitle: "振动图像与波动图像互化综合",
    focusLink: "/15%20机械振动与机械波/考点%20振动图像与波动图像的综合求解",
    keywords: [
      "简谐运动回复力",
      "单摆周期公式",
      "受迫振动与共振",
      "横波波速波长周期",
      "波动图像振动图像互化",
      "波的干涉衍射多普勒",
    ],
    link: "/15%20机械振动与机械波/index",
  },
  {
    num: "16",
    title: "光学",
    group: "waves_modern",
    volume: "选必第一册",
    volumeTag: "xb1",
    fileCount: 5,
    desc: "折射率与全反射、杨氏双缝干涉、薄膜干涉、衍射偏振与激光技术",
    focusTitle: "几何光学光路全反射综合计算",
    focusLink: "/16%20光学/考点%20几何光学光路全反射综合计算",
    keywords: [
      "几何光学",
      "双缝干涉",
      "折射定律与折射率",
      "全反射临界角条件",
      "光的色散与棱镜",
      "薄膜干涉增透膜",
      "光的偏振与激光特性",
    ],
    link: "/16%20光学/index",
  },
  {
    num: "17",
    title: "热学与分子动理论",
    group: "waves_modern",
    volume: "选必第三册",
    volumeTag: "xb3",
    fileCount: 5,
    desc: "分子动理论微观量估算、气体实验三定律与理想气体状态方程、热力学定律",
    focusTitle: "封闭气体压强与活塞气缸循环",
    focusLink: "/17%20热学与分子动理论/考点%20封闭气体压强计算与活塞气缸热力学循环",
    keywords: [
      "阿伏加德罗常数微观估算",
      "分子力与分子势能曲线",
      "气体实验三定律",
      "理想气体状态方程",
      "气体状态变化图像",
      "热力学第一第二定律",
    ],
    link: "/17%20热学与分子动理论/index",
  },
  {
    num: "18",
    title: "原子物理与近代物理",
    group: "waves_modern",
    volume: "选必第三册",
    volumeTag: "xb3",
    fileCount: 5,
    desc: "黑体辐射与光电效应光子说、玻尔氢原子跃迁、衰变半衰期与结合能质能方程",
    focusTitle: "光电效应图像与核能质能计算",
    focusLink: "/18%20原子物理与近代物理/考点%20光电效应图像分析与核能计算模型",
    keywords: [
      "近代物理",
      "光电效应",
      "普朗克能量子假说",
      "光电效应与光电方程",
      "玻尔氢原子能级跃迁",
      "半衰期计算公式",
      "结合能与质能方程",
    ],
    link: "/18%20原子物理与近代物理/index",
  },
  {
    num: "19",
    title: "物理实验专题",
    group: "experiments",
    volume: "实验专题",
    volumeTag: "exp",
    fileCount: 5,
    desc: "游标卡尺螺旋测微器读数、打点计时器力学验证、伏安法电表内外接分压限流设计与误差分析",
    focusTitle: "电学器材选择与控制电路设计",
    focusLink: "/19%20物理实验专题/考点%20电学实验器材选择与控制电路设计",
    keywords: [
      "物理实验",
      "电学实验",
      "力学实验",
      "仪器读数规范",
      "游标卡尺螺旋测微器",
      "打点计时器加速度逐差",
      "伏安法测电阻内外接",
      "滑动变阻器分压限流",
      "测定电源电动势内阻",
    ],
    link: "/19%20物理实验专题/index",
  },
];

const specialCards: SpecialItem[] = [
  {
    title: "50 大黄金结论与临界条件",
    badge: "秒杀定理矩阵",
    tagClass: "yellow",
    desc: "聚合力学、天体、电磁、近代物理高频临界判据、代换式与速算模型，高考考前压轴提分利器。",
    link: "/golden-conclusions",
    actionText: "速查结论",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    title: "全专题防踩坑排雷白皮书",
    badge: "考前避坑指南",
    tagClass: "red",
    desc: "系统梳理 19 大专题易错陷阱、公式适用边界条件与审题雷区，考前 1 小时速通排雷。",
    link: "/warning-cheatsheet",
    actionText: "查阅排雷",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    title: "高考物理可视化交互空间",
    badge: "动态物理仿真",
    tagClass: "blue",
    desc: "微元积分、平抛轨迹合成、斜面受力分解、磁场回旋等 6 大核心模型动态仿真，直观物理直通考场。",
    link: "/interactive",
    actionText: "进入空间",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m3.6 9 16.8 6"/><path d="m3.6 15 16.8-6"/></svg>`,
  },
];

// 高频热门搜索词推荐
const hotSearchKeywords = [
  "板块模型",
  "平抛运动",
  "双星系统",
  "动量守恒",
  "电容器动态",
  "导轨滑棒",
  "理想变压器",
  "双缝干涉",
  "电学实验",
];

// 交互状态
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const activeGroup = ref<string>("all");
const activeVolume = ref<string>("all");

// 分组配置与计数值
const groupTabs = [
  { key: "all", label: "全部专题", count: 19 },
  { key: "mechanics", label: "经典力学", count: 8 },
  { key: "electromagnetism", label: "电磁学", count: 6 },
  { key: "waves_modern", label: "波·光·热·原", count: 4 },
  { key: "experiments", label: "实验专题", count: 1 },
];

const volumeTabs = [
  { key: "all", label: "全部教材" },
  { key: "bx1", label: "必修一 (01-03)" },
  { key: "bx2", label: "必修二 (04-07)" },
  { key: "bx3", label: "必修三 (09-11)" },
  { key: "xb1", label: "选必一 (08, 15, 16)" },
  { key: "xb2", label: "选必二 (12-14)" },
  { key: "xb3", label: "选必三 (17, 18)" },
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
  return filteredChapters.value.filter((ch) => ch.num !== "19");
});

const experimentChapter = computed(() => {
  return filteredChapters.value.find((ch) => ch.num === "19");
});
</script>

<template>
  <div class="ci-master-container">
    <!-- ============================================================
         1. Master Index Hero Header (顶级学术总索引巨幕)
         ============================================================ -->
    <header class="ci-hero-section">
      <div class="ci-hero-aura" aria-hidden="true" />

      <!-- 顶部发布胶囊 -->
      <div class="ci-pill-badge">
        <span class="ci-pill-dot" aria-hidden="true" />
        <span class="ci-pill-text">人教版新课标 6 册教材深度重构 · 2026 高考物理知识库</span>
        <span class="ci-pill-arrow">→</span>
      </div>

      <!-- 宏大主标题 -->
      <h1 class="ci-hero-title">
        <span class="ci-hero-title-main">高考物理知识库</span>
        <span class="ci-hero-title-tag">Yulaoshizuikeai's Physics Note</span>
      </h1>

      <!-- 核心定位导言 -->
      <p class="ci-hero-tagline">
        融合中国普通高中物理教科书（人教版必修 1-3 与选必 1-3 全套 6 册）与可汗学院直观微元思维。
        涵盖 <strong>19 大体系板块</strong>、<strong>78 幅自研高清矢量图解</strong> 与
        <strong>50 大黄金临界模型</strong>，助你建立完整清晰的物理图景，告别题海死记硬背。
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
          <span>50 大黄金结论速查</span>
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
          <span>防踩坑排雷</span>
        </a>

        <a :href="withBase('/interactive')" class="ci-btn ci-btn-ghost">
          <svg
            class="ci-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m3.6 9 16.8 6" />
            <path d="m3.6 15 16.8-6" />
          </svg>
          <span>交互空间</span>
        </a>
      </div>

      <!-- 极简通透数据指标条 -->
      <div class="ci-stats-strip">
        <div class="ci-stat-col">
          <div class="ci-stat-number">19</div>
          <div class="ci-stat-title">大体系专题板块</div>
        </div>
        <div class="ci-stat-divider" aria-hidden="true" />
        <div class="ci-stat-col">
          <div class="ci-stat-number">78</div>
          <div class="ci-stat-title">幅自研矢量图解</div>
        </div>
        <div class="ci-stat-divider" aria-hidden="true" />
        <div class="ci-stat-col">
          <div class="ci-stat-number">50</div>
          <div class="ci-stat-title">大黄金临界模型</div>
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
         2. Quick Chapter Directory (全新优化快捷章节索引系统)
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
            <strong>【🔥 压轴考点直达】</strong> 快速攻克典型题型模型。
          </p>
        </div>
        <div class="ci-head-count">
          <span
            >匹配 <strong class="ci-highlight">{{ filteredChapters.length }}</strong> / 19
            个专题</span
          >
          <button
            v-if="searchQuery || activeGroup !== 'all' || activeVolume !== 'all'"
            type="button"
            class="ci-reset-pill"
            title="还原为展示全部 19 个专题"
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
            placeholder="检索章节、模型或关键词（按 / 激活，按 Esc 清空）..."
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
          <!-- 学科体系主标签 -->
          <div class="ci-filter-row">
            <div class="ci-filter-label">知识体系:</div>
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

          <!-- 教材版本细筛标签 -->
          <div class="ci-filter-row ci-filter-row--sub">
            <div class="ci-filter-label">人教教材:</div>
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

        <!-- 19 物理实验专题：全景通栏核心卡片 (提供 5 大实验文章直接导航) -->
        <div v-if="experimentChapter" class="ci-pano-wrap">
          <div class="ci-chapter-card ci-chapter-card--pano">
            <div class="ci-pano-grid">
              <!-- 左侧主信息 -->
              <div class="ci-pano-main">
                <div class="ci-card-header">
                  <div class="ci-pano-header-left">
                    <span class="ci-card-num ci-card-num--pano">{{ experimentChapter.num }}</span>
                    <span class="ci-card-vol-badge vol-exp">高考压轴实验专题</span>
                  </div>
                  <span class="ci-pano-indicator">全面攻克 15 分主观实验题</span>
                </div>

                <h3 class="ci-card-title ci-card-title--pano">
                  <a :href="withBase(experimentChapter.link)" class="ci-title-link">
                    {{ experimentChapter.title }}与科学探究
                  </a>
                </h3>

                <p class="ci-card-desc ci-card-desc--pano">
                  涵盖高中阶段基本仪器读数规范、经典力学验证探究实验与伏安法电表内外接分压限流设计，全景拆解误差来源与实战得分要领。
                </p>

                <!-- 实验压轴考点直达 -->
                <a
                  :href="withBase(experimentChapter.focusLink)"
                  class="ci-focus-jump ci-focus-jump--pano"
                  title="直接研读实验压轴模型"
                >
                  <span class="ci-focus-tag">🔥 压轴设计</span>
                  <span class="ci-focus-title">{{ experimentChapter.focusTitle }}</span>
                  <span class="ci-focus-arrow">→</span>
                </a>

                <div class="ci-card-footer ci-card-footer--pano">
                  <a :href="withBase(experimentChapter.link)" class="ci-card-action">
                    <span>研读实验完整体系与误差分析 →</span>
                  </a>
                </div>
              </div>

              <!-- 右侧实验板块直达导航 -->
              <div class="ci-pano-subtopics">
                <a
                  :href="withBase('/19%20物理实验专题/01%20基本仪器使用与读数规范')"
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-blue" />
                    仪器使用与读数规范
                  </div>
                  <p class="ci-subcard-desc">
                    游标卡尺(无估读)、螺旋测微器(千分尺估读)、秒表与打点计时器
                  </p>
                </a>

                <a :href="withBase('/19%20物理实验专题/02%20力学核心实验')" class="ci-pano-subcard">
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-green" />
                    力学核心验证实验
                  </div>
                  <p class="ci-subcard-desc">
                    探究加速度与力/质量、验证机械能守恒、动量守恒频闪与光电门
                  </p>
                </a>

                <a :href="withBase('/19%20物理实验专题/03%20电学核心实验')" class="ci-pano-subcard">
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-purple" />
                    电学测量与电路设计
                  </div>
                  <p class="ci-subcard-desc">
                    伏安法内外接判据、滑动变阻器分压限流选择、测定电源电动势与内阻
                  </p>
                </a>

                <a
                  :href="withBase('/19%20物理实验专题/04%20光学与热学实验')"
                  class="ci-pano-subcard"
                >
                  <div class="ci-subcard-title">
                    <span class="ci-subcard-bullet bullet-orange" />
                    光学与热学探究实验
                  </div>
                  <p class="ci-subcard-desc">
                    双缝干涉测波长、玻璃砖折射率测定、油膜法估测分子大小
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
        <h4 class="ci-empty-title">未找到匹配的物理章节</h4>
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

.vol-bx1,
.vol-bx2,
.vol-bx3 {
  background: var(--vp-pastel-blue);
  color: var(--vp-pastel-blue-text);
  border-color: var(--vp-pastel-blue-border);
}

.vol-xb1,
.vol-xb2,
.vol-xb3 {
  background: var(--vp-pastel-purple);
  color: var(--vp-pastel-purple-text);
  border-color: var(--vp-pastel-purple-border);
}

.vol-exp {
  background: var(--vp-pastel-yellow);
  color: var(--vp-pastel-yellow-text);
  border-color: var(--vp-pastel-yellow-border);
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
