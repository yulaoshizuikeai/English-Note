<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface PhysicsFlash {
  text: string;
  tag: string;
}

// 精选高中物理核心速记与解题模型（每条控制在十几字，2~3 秒读完）
const PHYSICS_FLASHES: PhysicsFlash[] = [
  { text: "v-t 图像斜率是加速度，面积是位移。", tag: "运动学" },
  { text: "加速度为零时速度达极值；速度为零时加速度不一定为零。", tag: "运动学" },
  { text: "受力分析先重力，次弹力，后摩擦，再外力。", tag: "受力平衡" },
  { text: "滑动摩擦力只由正压力与摩擦因数决定，与相对速度无关。", tag: "相互作用" },
  { text: "超重时加速度向上，失重时加速度向下，重力本身从未改变。", tag: "牛顿定律" },
  { text: "平抛运动水平与竖直互不干扰，下落时间由下落高度唯一决定。", tag: "抛体运动" },
  { text: "轻绳竖直圆周最高点临界速度为 √(gR)，轻杆则可为 0。", tag: "圆周模型" },
  { text: "万有引力充当向心力：高轨低速大周期，低轨高速小周期。", tag: "天体引力" },
  { text: "双星系统公转角速度相等，轨道半径与天体质量成反比。", tag: "双星模型" },
  { text: "合外力做功等于动能变化，重力做功等于重力势能减少。", tag: "功能关系" },
  { text: "机械能守恒看非重力弹力，动量守恒看系统合外力。", tag: "守恒定律" },
  { text: "完全弹性碰撞动能无损，完全非弹性碰撞动能损失最大。", tag: "碰撞模型" },
  { text: "静电平衡导体内部场强处处为零，整个导体是等势体。", tag: "静电场" },
  { text: "沿电场线方向电势一定降低，电场线密集处场强更大。", tag: "静电场" },
  { text: "路端电压随外电阻增大而增大，外电路断路时等于电动势。", tag: "恒定电流" },
  { text: "安培力左手定则，感应电动势右手定则，右手螺旋定磁场。", tag: "三大定则" },
  { text: "洛伦兹力永不做功，只能改变速度方向，不改变速率与动能。", tag: "磁场动力学" },
  { text: "楞次定律：感应电流效果总是反抗引起它的原因——增反减同，来拒去留。", tag: "电磁感应" },
  { text: "法拉第电磁感应：电动势大小取决于磁通量变化率，而非磁通量本身。", tag: "电磁感应" },
  { text: "简谐运动回复力恒指向平衡位置，加速度与位移反向。", tag: "机械振动" },
  { text: "机械波波速由介质决定，波源频率决定振动频率，折射时频率不变。", tag: "机械波" },
  { text: "光在介质中折射传播：频率不变，波速减小，波长变短。", tag: "光学规律" },
  { text: "光电效应瞬时发生，能否发生只取决于入射光频率。", tag: "光电效应" },
  { text: "玻尔原子跃迁：从高能级跃迁到低能级辐射光子，hν = E₂ - E₁。", tag: "玻尔原子" },
  { text: "质量亏损并非质量消亡，而是转化释放了结合能：ΔE = Δmc²。", tag: "质能方程" },
  { text: "传送带模型中，物块与传送带共速是滑动摩擦力突变的关键分界点。", tag: "临界极值" },
  { text: "连接体动力学：求系统整体加速度用整体法，求相互作用力用隔离法。", tag: "连接体" },
  { text: "机车恒功率启动：做加速度减小的变加速运动，直到牵引力等于阻力。", tag: "机车启动" },
  { text: "带电粒子匀强磁场圆周运动，周期 T = 2πm/qB 与速率无关。", tag: "磁场回旋" },
  { text: "平抛运动速度偏角正切值等于位移偏角正切值的 2 倍：tanα = 2tanθ。", tag: "平抛几何" },
  { text: "游标卡尺读数不估读，螺旋测微器必须估读到千分位。", tag: "实验规范" },
  { text: "伏安法测电阻：大电阻内接（测值偏大），小电阻外接（测值偏小）。", tag: "电学实验" },
  { text: "卫星变轨：点火加速做离心运动抬升轨道，点火减速进入低轨。", tag: "变轨模型" },
  { text: "动生电动势本质是洛伦兹力，感生电动势本质是感生电场力。", tag: "感应本质" },
  { text: "碰撞三原则：动量必须守恒，机械能绝不增加，碰后不互相穿透。", tag: "碰撞模型" },
  { text: "电容器充放电是电荷的转移，电容决定式 C = εS / 4πkd。", tag: "电容器" },
  { text: "分子势能极值点：分子间距等于 r₀ 时引力等于斥力，势能达到最小。", tag: "热学分子论" },
  { text: "热力学第二定律：热量不可能自发地从低温物体传到高温物体。", tag: "热学定律" },
  { text: "自由落体是初速度为零的匀加速运动，下落快慢与质量完全无关。", tag: "自由落体" },
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
  currentIndex.value = Math.floor(Math.random() * PHYSICS_FLASHES.length);
});

const currentItem = computed<PhysicsFlash>(() => {
  return PHYSICS_FLASHES[currentIndex.value] || PHYSICS_FLASHES[0];
});

// 点击换一条
const handleNext = () => {
  if (isChanging.value) return;
  isChanging.value = true;
  if (nextTimer) clearTimeout(nextTimer);
  nextTimer = setTimeout(() => {
    let nextIdx = Math.floor(Math.random() * PHYSICS_FLASHES.length);
    if (nextIdx === currentIndex.value) {
      nextIdx = (nextIdx + 1) % PHYSICS_FLASHES.length;
    }
    currentIndex.value = nextIdx;
    isChanging.value = false;
    nextTimer = null;
  }, 160);
};

// 复制速记
const handleCopy = async (event: MouseEvent) => {
  event.stopPropagation();
  const text = `【高中物理速记】${currentItem.value.text}（#${currentItem.value.tag}）`;
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
  <div class="cc-physics-flash-wrap">
    <div
      class="cc-physics-flash-card"
      role="button"
      tabindex="0"
      title="点击换一条高中物理速记"
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
.cc-physics-flash-wrap {
  margin-top: 22px;
  width: 100%;
}

.cc-physics-flash-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 680px;
  width: 100%;
  padding: 8px 14px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 5%, var(--vp-c-bg-soft));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 18%, transparent);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--vp-shadow-1);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cc-physics-flash-card:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 9%, var(--vp-c-bg-soft));
  border-color: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 35%, transparent);
  box-shadow: var(--vp-shadow-2);
  transform: translateY(-1px);
}

.cc-physics-flash-card:focus-visible {
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
  .cc-physics-flash-card {
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
