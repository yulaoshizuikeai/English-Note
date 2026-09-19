<script setup lang="ts">
import { computed, ref } from "vue";

import CCKnowledgeGraph from "./CCKnowledgeGraph.vue";
import CCPhysicsSimulator from "./CCPhysicsSimulator.vue";

type ModelKey = "graph" | "slope" | "kinematics" | "projectile" | "cyclotron" | "optics" | "wave";

interface ModelInfo {
  key: ModelKey;
  title: string;
  badge: string;
  desc: string;
  formula: string;
  thinking: string;
  chapterLink: string;
  chapterTitle: string;
}

const activeKey = ref<ModelKey>("graph");

const models: ModelInfo[] = [
  {
    key: "graph",
    title: "全景物理知识网络图谱",
    badge: "高考 19 大专题关联拓扑",
    desc: "宏观统揽高中物理五大领域（力学、电磁学、振动与光、热学近代物理、实验）全景关联图谱。支持画布自由拖拽平移、滚轮缩放、拖拽节点探索关联拓扑，点击任意节点即可锁定核心考点公式并直达对应章节。",
    formula: "牛顿动力学 + 动量动能双守恒 + 电磁场路综合 + 波动量子化",
    thinking: "系统化物理图景、时空对称性与跨专题迁移整合",
    chapterLink: "/00%20说明/高考物理全景图与思想方法",
    chapterTitle: "说明·高考物理全景图与思想方法",
  },
  {
    key: "slope",
    title: "斜面滑块受力与滑动临界",
    badge: "02 相互作用与共点力平衡",
    desc: "直观展示重力正交分解与斜面倾角变化规律。当 tanθ < μ 时物体静止处于平衡状态；tanθ = μ 为临界滑动点；tanθ > μ 时产生沿斜面向下的恒定加速度 a = g(sinθ - μ·cosθ)。",
    formula: "Gx = mg·sinθ, Gy = mg·cosθ, f_max = μ·mg·cosθ",
    thinking: "正交分解法、力的平衡与临界极值法",
    chapterLink: "/02%20相互作用与共点力平衡/考点%20受力分析规范与动态平衡模型",
    chapterTitle: "专题 02 考点·受力分析规范与动态平衡模型",
  },
  {
    key: "kinematics",
    title: "运动学微元累积与 v-t 面积积分",
    badge: "01 运动的描述与匀变速规律",
    desc: "融入可汗学院直观微积分思维：利用无限细分的微小时间切片矩形逼近梯形，直观印证 v-t 图像下方包围面积即为质点位移 x = ∫v·dt = v₀t + ½at²。",
    formula: "v = v₀ + at,  x = v₀t + ½at²,  v_avg = (v₀ + v)/2",
    thinking: "微积分微元累积思想（极限求和）、图像面积法",
    chapterLink: "/01%20运动的描述与匀变速规律/04%20匀变速直线运动规律与自由落体",
    chapterTitle: "专题 01 04·匀变速直线运动规律与自由落体",
  },
  {
    key: "projectile",
    title: "平抛运动轨迹与速度矢量三角形",
    badge: "04 抛体运动与曲线运动",
    desc: "将平抛运动正交分解为水平方向匀速运动与竖直方向自由落体。落地末速度由 vx 与 vy 正交合成，速度偏角正切值为位移偏角正切值的 2 倍，验证高考黄金结论 tanα = 2 tanθ（α为速度偏角，θ为位移偏角）。",
    formula: "x = v₀t,  y = ½gt²,  vy = gt,  tanα = 2·tanθ",
    thinking: "运动的合成与分解（等效替代）、时空解耦法",
    chapterLink: "/04%20抛体运动与曲线运动/03%20平抛运动的规律",
    chapterTitle: "专题 04 03·平抛运动的规律",
  },
  {
    key: "cyclotron",
    title: "带电粒子在匀强磁场中的回旋偏转",
    badge: "12 磁场与安培力洛伦兹力",
    desc: "洛伦兹力始终垂直于速度方向，充当向心力做圆周运动而不做功。回旋轨道半径 R = mv/(qB)，回旋周期 T = 2πm/(qB) 严谨证明周期与速度无关，为回旋加速器核心物理基石。",
    formula: "qvB = m·v²/R  ⇒  R = mv/(qB),  T = 2πm/(qB)",
    thinking: "向心力物理模型、圆周运动几何法（找圆心、求半径、定时间）",
    chapterLink: "/12%20磁场与安培力洛伦兹力/04%20带电粒子在匀强磁场中的圆周运动",
    chapterTitle: "专题 12 04·带电粒子在匀强磁场中的圆周运动",
  },
  {
    key: "optics",
    title: "折射定律与全反射临界光纤追踪",
    badge: "16 光学",
    desc: "光从光密介质射入光疏介质时，折射角大于入射角。当入射角达到临界角 C = arcsin(1/n) 时折射角达 90°；大于临界角时折射光线彻底消失发生全反射，构成光纤通信与全反射棱镜基础。",
    formula: "n = sin r / sin i,  sin C = 1/n",
    thinking: "边界几何光路追踪法、临界约束条件分析",
    chapterLink: "/16%20光学/02%20全反射与光导纤维",
    chapterTitle: "专题 16 02·全反射与光导纤维",
  },
  {
    key: "wave",
    title: "机械横波传播与质点简谐振动联动",
    badge: "15 机械振动与机械波",
    desc: "破除高考最大易错点：介质质点仅在平衡位置附近做上下简谐振动，并不随波向前迁移。掌握判断质点振动方向的“同侧法”（波形坡度与箭头同侧）与“波形微平移法”。",
    formula: "v = λ·f = λ / T,  y = A·sin(2π/λ · (x - vt))",
    thinking: "波动与振动双重視角互化、时间周期性与空间对称性",
    chapterLink: "/15%20机械振动与机械波/04%20机械波的产生与波的描述",
    chapterTitle: "专题 15 04·机械波的产生与波的描述",
  },
];

const currentModel = computed<ModelInfo>(() => {
  const found = models.find((m) => m.key === activeKey.value);
  const fallback: ModelInfo = models[0] as ModelInfo;
  return found ?? fallback;
});
</script>

<template>
  <div class="cc-interactive-lab">
    <!-- 模型导航切换选项卡 -->
    <div class="lab-tabs-scroll">
      <div class="lab-tabs">
        <button
          v-for="m in models"
          :key="m.key"
          class="tab-btn"
          :class="{ active: activeKey === m.key }"
          @click="activeKey = m.key"
        >
          <span class="tab-title">{{ m.title }}</span>
        </button>
      </div>
    </div>

    <!-- 全景知识图谱或物理仿真台组件 -->
    <div class="lab-simulator-card">
      <CCKnowledgeGraph v-if="activeKey === 'graph'" />
      <CCPhysicsSimulator v-else :key="activeKey" :model="activeKey" :height="390" />
    </div>

    <!-- 知识体系与考点剖析卡片 -->
    <div class="lab-info-card">
      <div class="info-header">
        <div class="info-title-wrap">
          <span class="info-badge">{{ currentModel.badge }}</span>
          <h3 class="info-title">{{ currentModel.title }}</h3>
        </div>
        <a :href="currentModel.chapterLink" class="chapter-jump-btn"> 深度阅读本章 → </a>
      </div>

      <p class="info-desc">{{ currentModel.desc }}</p>

      <div class="info-meta-grid">
        <div class="meta-item">
          <span class="meta-label">核心公式：</span>
          <code class="meta-code">{{ currentModel.formula }}</code>
        </div>
        <div class="meta-item">
          <span class="meta-label">物理思想：</span>
          <span class="meta-val">{{ currentModel.thinking }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-interactive-lab {
  margin: 1.5rem 0 2.5rem;
}

.lab-tabs-scroll {
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.lab-tabs {
  display: flex;
  gap: 0.5rem;
  min-width: max-content;
}

.tab-btn {
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-1);
}

.dark .tab-btn.active {
  color: #121415;
}

.lab-simulator-card {
  margin-top: 0.75rem;
}

.lab-info-card {
  margin-top: 1rem;
  padding: 1.25rem 1.4rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.info-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.info-badge {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.02em;
}

.info-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chapter-jump-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  text-decoration: none !important;
  transition: opacity 0.15s ease;
}

.chapter-jump-btn:hover {
  opacity: 0.9;
}

.info-desc {
  margin: 0 0 1rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.info-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.meta-item {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.84rem;
}

.meta-label {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.meta-code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  background: var(--vp-code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.meta-val {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

@media (max-width: 640px) {
  .info-meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
