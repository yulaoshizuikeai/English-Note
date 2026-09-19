<script setup lang="ts">
import { onMounted, ref } from "vue";

// 7 天周期滚动窗口访问曲线
// 严格遵守：零数字展示，纯高级感视觉律动与发光粒子
interface DayPoint {
  x: number;
  y: number;
  isToday: boolean;
}

const WIDTH = 260;
const HEIGHT = 50;
const PADDING_X = 16;
const TOP_Y = 10;
const BOTTOM_Y = 40;

// SSR 预渲染默认 7 天周期采样点（平滑律动基线）
const DEFAULT_POINTS: DayPoint[] = [
  { x: 16, y: 34, isToday: false },
  { x: 54, y: 28, isToday: false },
  { x: 92, y: 32, isToday: false },
  { x: 130, y: 20, isToday: false },
  { x: 168, y: 25, isToday: false },
  { x: 206, y: 18, isToday: false },
  { x: 244, y: 11, isToday: true },
];

function buildSpline(pts: DayPoint[]): { line: string; area: string } {
  if (pts.length < 2) return { line: "", area: "" };

  let line = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    // Catmull-Rom 转换为三阶贝塞尔曲线 (平滑度 1/6)
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = Math.min(Math.max(p1.y + (p2.y - p0.y) / 6, 6), 46);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = Math.min(Math.max(p2.y - (p3.y - p1.y) / 6, 6), 46);

    line += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  const last = pts[pts.length - 1];
  const first = pts[0];
  const area = `${line} L ${last.x.toFixed(1)} ${HEIGHT} L ${first.x.toFixed(1)} ${HEIGHT} Z`;

  return { line, area };
}

const defaultPaths = buildSpline(DEFAULT_POINTS);
const points = ref<DayPoint[]>(DEFAULT_POINTS);
const pathD = ref<string>(defaultPaths.line);
const areaD = ref<string>(defaultPaths.area);

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

onMounted(() => {
  // 7天滚动窗口周期数据计算 (Sliding Window: 过去6天 + 今天)
  try {
    const STORAGE_KEY = "cc_physics_7d_window";
    const raw = localStorage.getItem(STORAGE_KEY);
    const store: Record<string, number> = raw ? JSON.parse(raw) : {};

    const now = new Date();
    const todayKey = formatDateKey(now);

    // 今日访问增量
    store[todayKey] = (store[todayKey] || 0) + 1;

    // 获取 7 天滑动窗口对应的日期键 [D-6, D-5, D-4, D-3, D-2, D-1(昨天), D-0(今天)]
    const windowKeys: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      windowKeys.push(formatDateKey(d));
    }

    // 仿生自然基础序列（确保初始无足量历史时呈现优美的物理波动律动）
    const organicBase = [14, 18, 15, 23, 19, 22, 26];
    const values: number[] = windowKeys.map((k, idx) => {
      const count = store[k] || 0;
      return organicBase[idx] + count * 3;
    });

    // 清理 14 天以前的数据，保持本地轻量
    const newStore: Record<string, number> = {};
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const k = formatDateKey(d);
      if (store[k]) newStore[k] = store[k];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));

    // 归一化映射到 SVG 坐标 (今天对比昨天及前 5 天的动态斜率)
    const minVal = Math.min(...values) * 0.82;
    const maxVal = Math.max(...values) * 1.15;
    const range = maxVal - minVal || 1;

    const dx = (WIDTH - PADDING_X * 2) / (values.length - 1);
    const newPoints: DayPoint[] = values.map((val, idx) => {
      const x = PADDING_X + idx * dx;
      const ratio = (val - minVal) / range;
      const y = BOTTOM_Y - ratio * (BOTTOM_Y - TOP_Y);
      return {
        x,
        y,
        isToday: idx === values.length - 1,
      };
    });

    points.value = newPoints;
    const generated = buildSpline(newPoints);
    pathD.value = generated.line;
    areaD.value = generated.area;
  } catch {
    // 异常保底使用基准点
  }
});
</script>

<template>
  <div class="cycle-sparkline-container" aria-hidden="true">
    <div class="cycle-sparkline-card">
      <svg
        class="sparkline-svg"
        viewBox="0 0 260 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- 面积渐变 -->
          <linearGradient
            id="cycle-area"
            x1="0"
            y1="0"
            x2="0"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#5672CD" stop-opacity="0.32" />
            <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </linearGradient>

          <!-- 7日周期折线流光渐变 -->
          <linearGradient
            id="cycle-stroke"
            x1="0"
            y1="25"
            x2="260"
            y2="25"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#5672CD" stop-opacity="0.55" />
            <stop offset="40%" stop-color="#38bdf8" />
            <stop offset="80%" stop-color="#818cf8" />
            <stop offset="100%" stop-color="#60a5fa" />
          </linearGradient>

          <!-- 辉光滤镜 -->
          <filter id="cycle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- 阴影/面积填充 -->
        <path :d="areaD" fill="url(#cycle-area)" class="sparkline-fill" />

        <!-- 高级感 7 天周期平滑滚动曲线 -->
        <path
          :d="pathD"
          stroke="url(#cycle-stroke)"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-line"
          filter="url(#cycle-glow)"
        />

        <!-- 7 天周期采样节点（零数字，纯发光粒子律动） -->
        <g class="cycle-nodes">
          <circle
            v-for="(pt, idx) in points"
            :key="idx"
            :cx="pt.x"
            :cy="pt.y"
            :r="pt.isToday ? 3.2 : 2"
            :fill="pt.isToday ? '#ffffff' : '#38bdf8'"
            :opacity="pt.isToday ? 1 : 0.4"
            class="cycle-node"
          />
        </g>

        <!-- 今日终点脉冲发光光子粒子 (突出今天对比昨天的当前位态) -->
        <template v-if="points.length > 0">
          <circle
            :cx="points[points.length - 1].x"
            :cy="points[points.length - 1].y"
            r="7.5"
            fill="#38bdf8"
            opacity="0.28"
            class="beacon-halo"
            :style="`transform-origin: ${points[points.length - 1].x}px ${points[points.length - 1].y}px`"
          />
        </template>
      </svg>

      <!-- 7 天滑动窗口周期指示底轨 (无任何数字) -->
      <div class="cycle-window-track">
        <span
          v-for="(pt, idx) in points"
          :key="idx"
          class="cycle-tick"
          :class="{ 'is-today': pt.isToday }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cycle-sparkline-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 18px auto;
}

.cycle-sparkline-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 16%, transparent);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--vp-shadow-1);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.cycle-sparkline-card:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 9%, transparent);
  border-color: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 32%, transparent);
  box-shadow: var(--vp-shadow-2);
}

.sparkline-svg {
  width: 240px;
  height: 46px;
  display: block;
}

.sparkline-line {
  stroke-dasharray: 450;
  stroke-dashoffset: 450;
  animation: sparkline-draw 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.sparkline-fill {
  opacity: 0;
  animation: sparkline-fade 1.2s ease-out 0.8s forwards;
}

.cycle-nodes {
  opacity: 0;
  animation: sparkline-fade 1s ease-out 1.2s forwards;
}

.beacon-halo {
  animation: beacon-pulse 2.2s ease-in-out infinite;
}

/* 7日滚动窗口底轨刻度 (零数字) */
.cycle-window-track {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.cycle-tick {
  width: 14px;
  height: 2.5px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--vp-c-brand-1, #5672cd) 22%, transparent);
  transition: all 0.3s ease;
}

.cycle-tick.is-today {
  width: 22px;
  background: var(--vp-c-brand-1);
}

@keyframes sparkline-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes sparkline-fade {
  to {
    opacity: 1;
  }
}

@keyframes beacon-pulse {
  0%,
  100% {
    transform: scale(0.85);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.45;
  }
}

@media (max-width: 640px) {
  .sparkline-svg {
    width: 200px;
    height: 38px;
  }
  .cycle-tick {
    width: 10px;
  }
  .cycle-tick.is-today {
    width: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sparkline-line,
  .sparkline-fill,
  .cycle-nodes,
  .beacon-halo {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}
</style>
