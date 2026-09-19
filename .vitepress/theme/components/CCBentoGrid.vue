<script setup lang="ts">
import { withBase } from "vitepress";

interface SpecialCard {
  title: string;
  badge: string;
  tagClass: "blue" | "yellow" | "red";
  desc: string;
  link: string;
  actionText: string;
  iconSvg: string;
}

interface ChapterLink {
  num: string;
  title: string;
  desc: string;
  link: string;
}

interface ClusterGroup {
  name: string;
  subtitle: string;
  badge: string;
  tagClass: "blue" | "red" | "green" | "purple";
  chapters: ChapterLink[];
}

const specialCards: SpecialCard[] = [
  {
    title: "高考物理可视化交互空间",
    badge: "动态仿真",
    tagClass: "blue",
    desc: "运动学微元积分、斜面受力分解、平抛末速度合成、磁场回旋等 6 大核心模型动态仿真，直观物理直通考场。",
    link: "/interactive",
    actionText: "进入空间",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m3.6 9 16.8 6"/><path d="m3.6 15 16.8-6"/></svg>`,
  },
  {
    title: "50 大黄金结论与临界条件",
    badge: "秒杀定理",
    tagClass: "yellow",
    desc: "高考高频必考临界判据、黄金代换与秒杀定理矩阵速查，覆盖力学、天体、电磁、近代物理与实验。",
    link: "/golden-conclusions",
    actionText: "速查结论",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    title: "全专题防踩坑排雷白皮书",
    badge: "考前排雷",
    tagClass: "red",
    desc: "聚合 19 大专题易错陷阱、公式适用边界与考场雷区，考前 1 小时速通避坑提分利器。",
    link: "/warning-cheatsheet",
    actionText: "查阅排雷",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
];

const clusters: ClusterGroup[] = [
  {
    name: "经典力学体系",
    subtitle: "运动学 · 相互作用 · 牛顿定律 · 万有引力 · 动能动量",
    badge: "Mechanics 01-08",
    tagClass: "blue",
    chapters: [
      {
        num: "01",
        title: "运动的描述与匀变速规律",
        desc: "质点参考系、位移速度加速度、匀变速四大公式与推论、运动图象",
        link: "/01%20运动的描述与匀变速规律/01%20质点与参考系",
      },
      {
        num: "02",
        title: "相互作用与共点力平衡",
        desc: "重力弹力、静动摩擦力、力的合成与分解、共点力动态平衡",
        link: "/02%20相互作用与共点力平衡/01%20重力与弹力",
      },
      {
        num: "03",
        title: "牛顿运动定律与动力学应用",
        desc: "牛顿三定律、力学单位制、超重失重、板块与传送带动力学模型",
        link: "/03%20牛顿运动定律与动力学应用/01%20牛顿第一定律",
      },
      {
        num: "04",
        title: "抛体运动与曲线运动",
        desc: "曲线运动条件、平抛运动运动学与轨迹方程、斜面平抛解题模型",
        link: "/04%20抛体运动与曲线运动/01%20曲线运动的特征与条件",
      },
      {
        num: "05",
        title: "圆周运动及其应用",
        desc: "线速度角速度、向心加速度、轻绳与轻杆竖直圆周临界模型",
        link: "/05%20圆周运动及其应用/01%20描述圆周运动的物理量",
      },
      {
        num: "06",
        title: "万有引力与宇宙航行",
        desc: "开普勒三定律、万有引力定律与卡文迪许扭秤、三大宇宙速度、卫星变轨与双星",
        link: "/06%20万有引力与宇宙航行/01%20行星的运动与开普勒定律",
      },
      {
        num: "07",
        title: "机械能守恒与功能关系",
        desc: "功与功率、机车启动、动能定理、机械能守恒定律、摩擦生热",
        link: "/07%20机械能守恒与功能关系/01%20功与功率",
      },
      {
        num: "08",
        title: "动量守恒定律与碰撞",
        desc: "动量定理、动量守恒定律、完全弹性/非弹性碰撞、反冲与弹簧振子",
        link: "/08%20动量守恒定律与碰撞/01%20动量与动量定理",
      },
    ],
  },
  {
    name: "电磁学与电路体系",
    subtitle: "静电场 · 粒子偏转 · 恒定电流 · 磁场洛伦兹力 · 电磁感应 · 交变电流",
    badge: "Electromagnetism 09-14",
    tagClass: "red",
    chapters: [
      {
        num: "09",
        title: "静电场与电能",
        desc: "库仑定律、场强与电场线、电势能与等势面、匀强电场 U=Ed、电容动态分析",
        link: "/09%20静电场与电能/01%20电荷守恒与库仑定律",
      },
      {
        num: "10",
        title: "带电粒子在电场中的运动",
        desc: "带电粒子在电场中的加速、类平抛偏转轨迹、示波管原理、交变电场运动",
        link: "/10%20带电粒子在电场中的运动/01%20带电粒子在电场中的加速",
      },
      {
        num: "11",
        title: "电路与恒定电流",
        desc: "电流微观式、电阻定律、电表改装、闭合电路欧姆定律与电源输出极值",
        link: "/11%20电路与恒定电流/01%20电流与电阻定律",
      },
      {
        num: "12",
        title: "磁场与安培力洛伦兹力",
        desc: "磁感应强度、安培力与左手定则、洛伦兹力、匀强磁场圆周运动几何轨迹与质谱仪",
        link: "/12%20磁场与安培力洛伦兹力/01%20磁场与磁感应强度",
      },
      {
        num: "13",
        title: "电磁感应与综合应用",
        desc: "楞次定律、法拉第电磁感应定律、动生感生电动势、导轨滑棒力电能量综合",
        link: "/13%20电磁感应与综合应用/01%20电磁感应现象与楞次定律",
      },
      {
        num: "14",
        title: "交变电流与电磁波",
        desc: "正弦交变电流四值、理想变压器规律、远距离高压输电、电磁振荡与传感器",
        link: "/14%20交变电流与电磁波/01%20正弦交变电流的产生与描述",
      },
    ],
  },
  {
    name: "波动·光学·热学与微观物理",
    subtitle: "机械振动与波 · 折射干涉 · 分子动理论 · 氢原子与光电效应",
    badge: "Modern Physics 15-18",
    tagClass: "green",
    chapters: [
      {
        num: "15",
        title: "机械振动与机械波",
        desc: "简谐运动回复力与能量、单摆与共振、机械波图像与振动图像互化",
        link: "/15%20机械振动与机械波/01%20简谐运动与描述",
      },
      {
        num: "16",
        title: "光学",
        desc: "折射率与全反射、杨氏双缝干涉、薄膜干涉、衍射偏振与激光技术",
        link: "/16%20光学/01%20光的折射与折射率",
      },
      {
        num: "17",
        title: "热学与分子动理论",
        desc: "分子动理论微观量估算、气体实验三定律与理想气体状态方程、热力学定律",
        link: "/17%20热学与分子动理论/01%20分子动理论与微观量估算",
      },
      {
        num: "18",
        title: "原子物理与近代物理",
        desc: "黑体辐射与光电效应光子说、玻尔氢原子跃迁、衰变半衰期与结合能质能方程",
        link: "/18%20原子物理与近代物理/01%20黑体辐射与光电效应",
      },
    ],
  },
  {
    name: "物理实验专题与科学探究",
    subtitle: "仪器读数规范 · 力学验证 · 电学测电阻与电源参数 · 误差分析",
    badge: "Experiment 19",
    tagClass: "purple",
    chapters: [
      {
        num: "19",
        title: "物理实验专题",
        desc: "游标卡尺螺旋测微器读数、打点计时器力学验证、伏安法电表内外接分压限流设计与误差分析",
        link: "/19%20物理实验专题/01%20基本仪器使用与读数规范",
      },
    ],
  },
];
</script>

<template>
  <div class="cc-bento-container">
    <!-- Top Row: 3 Highlight Feature Bento Cards -->
    <div class="cc-bento-highlights">
      <a
        v-for="item in specialCards"
        :key="item.title"
        :href="withBase(item.link)"
        class="cc-bento-special-card"
        :class="`is-${item.tagClass}`"
      >
        <div class="cc-card-top">
          <span class="cc-badge" :class="`badge-${item.tagClass}`">{{ item.badge }}</span>
          <div class="cc-card-icon" v-html="item.iconSvg" />
        </div>
        <div class="cc-card-body">
          <h3 class="cc-special-title">{{ item.title }}</h3>
          <p class="cc-special-desc">{{ item.desc }}</p>
        </div>
        <div class="cc-card-action">
          <span>{{ item.actionText }}</span>
          <svg class="cc-arrow-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor">
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

    <!-- Cluster Title Section -->
    <div class="cc-cluster-header">
      <div class="cc-cluster-tag">CURRICULUM MATRIX</div>
      <h2 class="cc-cluster-title">高中物理知识体系总览</h2>
      <p class="cc-cluster-lead">涵盖人教版新课标 6 册教材 19 大板块，依循物理内在逻辑分类编排。</p>
    </div>

    <!-- Main Clusters Matrix -->
    <div class="cc-clusters-grid">
      <section
        v-for="group in clusters"
        :key="group.name"
        class="cc-cluster-card"
        :class="`cluster-${group.tagClass}`"
      >
        <header class="cc-cluster-card-head">
          <div class="cc-cluster-head-left">
            <span class="cc-badge" :class="`badge-${group.tagClass}`">{{ group.badge }}</span>
            <h3 class="cc-cluster-name">{{ group.name }}</h3>
          </div>
          <span class="cc-cluster-sub">{{ group.subtitle }}</span>
        </header>

        <div class="cc-chapter-list">
          <a
            v-for="ch in group.chapters"
            :key="ch.num"
            :href="withBase(ch.link)"
            class="cc-chapter-row"
          >
            <span class="cc-ch-num">{{ ch.num }}</span>
            <div class="cc-ch-content">
              <span class="cc-ch-title">{{ ch.title }}</span>
              <span class="cc-ch-desc">{{ ch.desc }}</span>
            </div>
            <svg class="cc-ch-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M6 12l4-4-4-4"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cc-bento-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3.5rem;
  box-sizing: border-box;
}

/* ------------------------------------------------------------
   1. Special Highlights (Top Row)
   ------------------------------------------------------------ */
.cc-bento-highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 3.5rem;
}

.cc-bento-special-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1.4rem;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  box-shadow: var(--vp-shadow-card);
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.cc-bento-special-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-2);
}

.dark .cc-bento-special-card:hover {
  box-shadow: var(--vp-shadow-2);
}

.cc-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cc-card-icon {
  width: 22px;
  height: 22px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.cc-bento-special-card:hover .cc-card-icon {
  color: var(--vp-c-brand-1);
}

.cc-card-body {
  flex: 1;
}

.cc-special-title {
  font-size: 1.12rem;
  font-weight: 650;
  line-height: 1.35;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  letter-spacing: -0.015em;
}

.cc-special-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cc-card-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 1.25rem;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.cc-arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.cc-bento-special-card:hover .cc-arrow-icon {
  transform: translateX(3px);
}

/* ------------------------------------------------------------
   2. Status & Discipline Badges (Muted Pastels)
   ------------------------------------------------------------ */
.cc-badge {
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

.badge-blue {
  background-color: var(--vp-pastel-blue);
  color: var(--vp-pastel-blue-text);
  border: 1px solid var(--vp-pastel-blue-border);
}

.badge-red {
  background-color: var(--vp-pastel-red);
  color: var(--vp-pastel-red-text);
  border: 1px solid var(--vp-pastel-red-border);
}

.badge-green {
  background-color: var(--vp-pastel-green);
  color: var(--vp-pastel-green-text);
  border: 1px solid var(--vp-pastel-green-border);
}

.badge-yellow {
  background-color: var(--vp-pastel-yellow);
  color: var(--vp-pastel-yellow-text);
  border: 1px solid var(--vp-pastel-yellow-border);
}

.badge-purple {
  background-color: var(--vp-pastel-purple);
  color: var(--vp-pastel-purple-text);
  border: 1px solid var(--vp-pastel-purple-border);
}

/* ------------------------------------------------------------
   3. Cluster Header
   ------------------------------------------------------------ */
.cc-cluster-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cc-cluster-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.cc-cluster-title {
  font-family: var(--vp-font-family-serif);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  margin: 0 0 0.4rem 0;
  border: none !important;
  padding: 0 !important;
}

.cc-cluster-lead {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* ------------------------------------------------------------
   4. Clusters Matrix
   ------------------------------------------------------------ */
.cc-clusters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.cc-cluster-card {
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.4rem 1.5rem;
  box-shadow: var(--vp-shadow-card);
}

.cc-cluster-card-head {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 1rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.cc-cluster-head-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.cc-cluster-name {
  font-size: 1.18rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.015em;
}

.cc-cluster-sub {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

/* Chapter row */
.cc-chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cc-chapter-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition:
    background-color 0.16s ease,
    transform 0.16s ease;
}

.cc-chapter-row:hover {
  background-color: var(--vp-c-bg-soft);
  transform: translateX(2px);
}

.cc-ch-num {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  width: 20px;
  flex-shrink: 0;
}

.cc-ch-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.cc-ch-title {
  font-size: 0.92rem;
  font-weight: 550;
  color: var(--vp-c-text-1);
  line-height: 1.35;
}

.cc-chapter-row:hover .cc-ch-title {
  color: var(--vp-c-brand-1);
}

.cc-ch-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.cc-ch-arrow {
  width: 13px;
  height: 13px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  opacity: 0;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  align-self: center;
}

.cc-chapter-row:hover .cc-ch-arrow {
  opacity: 1;
  transform: translateX(2px);
}

/* ------------------------------------------------------------
   5. Responsive Breakpoints
   ------------------------------------------------------------ */
@media (max-width: 960px) {
  .cc-bento-highlights {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  .cc-clusters-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.25rem;
  }
}
</style>
