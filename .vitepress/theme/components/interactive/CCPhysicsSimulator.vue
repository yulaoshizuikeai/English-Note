<script setup lang="ts">
import { useData } from "vitepress";
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from "vue";

const props = withDefaults(
  defineProps<{
    model?: "kinematics" | "slope" | "projectile" | "cyclotron" | "optics" | "wave";
    height?: number;
    showControls?: boolean;
    compact?: boolean;
  }>(),
  {
    model: "slope",
    height: 380,
    showControls: true,
    compact: false,
  },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const isVisible = ref(true);
const { isDark: vpIsDark } = useData();
let animationFrameId: number | null = null;
let intersectionObserver: IntersectionObserver | null = null;

// ==================== 状态定义 ====================

// 1. 运动学微元积分 (kinematics)
const kParams = reactive({
  v0: 5, // m/s
  a: 3, // m/s^2
  t: 4, // s
  slices: 8, // 微元切片数
  animProgress: 1, // 0~1 动画进度
});

// 2. 斜面滑块受力分解 (slope)
const sParams = reactive({
  angle: 30, // deg
  mu: 0.5, // 动摩擦因数
  mass: 2, // kg
});

// 3. 平抛运动轨迹 (projectile)
const pParams = reactive({
  h: 45, // m
  v0: 20, // m/s
  animTime: 0,
});

// 4. 磁场回旋偏转 (cyclotron)
const cParams = reactive({
  B: 0.8, // T
  v: 15, // 10^5 m/s
  charge: 1, // 1: 正电荷, -1: 负电荷
  qm: 1.0, // q/m 比荷标度
  particlePos: 0, // 0 ~ 1 沿轨道位置
});

// 5. 光的折射与全反射 (optics)
const oParams = reactive({
  n: 1.5, // 介质折射率
  angleInc: 40, // 入射角 (deg)
});

// 6. 机械横波与质点振动 (wave)
const wParams = reactive({
  amplitude: 35, // 振幅 px
  wavelength: 200, // 波长 px
  frequency: 0.8, // Hz
  speed: 160, // px/s
  time: 0,
  showMethod: true, // 显示同侧法辅助箭头
});

// ==================== 计算属性与物理公式 ====================

// 运动学计算
const kResult = computed(() => {
  const v = kParams.v0 + kParams.a * kParams.t;
  const x = kParams.v0 * kParams.t + 0.5 * kParams.a * kParams.t * kParams.t;
  const vAvg = (kParams.v0 + v) / 2;
  return { v: v.toFixed(1), x: x.toFixed(1), vAvg: vAvg.toFixed(1) };
});

// 斜面计算
const sResult = computed(() => {
  const rad = (sParams.angle * Math.PI) / 180;
  const g = 9.8;
  const G = sParams.mass * g;
  const Gx = G * Math.sin(rad); // 沿斜面向下
  const Gy = G * Math.cos(rad); // 垂直斜面向下
  const N = Gy;
  const fMax = sParams.mu * N;
  const tanTheta = Math.tan(rad);
  const isSliding = tanTheta > sParams.mu;
  const isCritical = Math.abs(tanTheta - sParams.mu) < 0.02;
  const a = isSliding ? g * (Math.sin(rad) - sParams.mu * Math.cos(rad)) : 0;
  return {
    Gx: Gx.toFixed(1),
    Gy: Gy.toFixed(1),
    N: N.toFixed(1),
    f: (isSliding ? fMax : Gx).toFixed(1),
    fMax: fMax.toFixed(1),
    isSliding,
    isCritical,
    statusText: isCritical ? "临界即将滑动" : isSliding ? "加速下滑中" : "静止平衡",
    a: a.toFixed(2),
  };
});

// 平抛计算
const pResult = computed(() => {
  const g = 9.8;
  const tTotal = Math.sqrt((2 * pParams.h) / g);
  const xTotal = pParams.v0 * tTotal;
  const vy = g * tTotal;
  const vEnd = Math.sqrt(pParams.v0 * pParams.v0 + vy * vy);
  const tanTheta = vy / pParams.v0; // 速度偏向角正切
  const tanAlpha = pParams.h / xTotal; // 位移偏向角正切
  return {
    tTotal: tTotal.toFixed(2),
    xTotal: xTotal.toFixed(1),
    vy: vy.toFixed(1),
    vEnd: vEnd.toFixed(1),
    tanTheta: tanTheta.toFixed(2),
    tanAlpha: tanAlpha.toFixed(2),
    angleDeg: ((Math.atan(tanTheta) * 180) / Math.PI).toFixed(1),
  };
});

// 磁场偏转计算
const cResult = computed(() => {
  const R = (cParams.v / (cParams.B * cParams.qm)) * 12; // 像素缩放
  const T = ((2 * Math.PI) / (cParams.B * cParams.qm)).toFixed(2);
  return {
    R: R.toFixed(1),
    T,
  };
});

// 光学折射计算
const oResult = computed(() => {
  const radInc = (oParams.angleInc * Math.PI) / 180;
  const sinC = 1 / oParams.n;
  const critAngleDeg = (Math.asin(sinC) * 180) / Math.PI;
  const isTIR = oParams.angleInc >= critAngleDeg; // 全反射 Total Internal Reflection
  let refAngleDeg = 0;
  if (!isTIR) {
    const sinR = oParams.n * Math.sin(radInc);
    refAngleDeg = (Math.asin(Math.min(sinR, 1)) * 180) / Math.PI;
  }
  return {
    critAngle: critAngleDeg.toFixed(1),
    isTIR,
    refAngle: isTIR ? "无折射光" : `${refAngleDeg.toFixed(1)}°`,
  };
});

// ==================== 渲染引擎 (Canvas 2D) ====================

const isDark = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

// 获取主题配色
const getThemeColors = () => {
  const dark = isDark();
  return {
    bg: dark ? "#151718" : "#faf9f5",
    cardBg: dark ? "#1c1f21" : "#ffffff",
    border: dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    text: dark ? "#e3e5e8" : "#1f2328",
    textSub: dark ? "#9ba1a6" : "#656d76",
    brand: dark ? "#758ee6" : "#5672cd",
    brandSoft: dark ? "rgba(117, 142, 230, 0.2)" : "rgba(86, 114, 205, 0.15)",
    red: dark ? "#f49f99" : "#d45951",
    green: dark ? "#7ee787" : "#2da44e",
    orange: dark ? "#f0c37b" : "#c27803",
    blue: dark ? "#58a6ff" : "#0969da",
    grid: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  };
};

// 绘制箭头辅助函数
const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  width = 2,
  headLen = 8,
) => {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
};

// 1. 渲染运动学微元积分
const renderKinematics = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const pad = 50;
  const originX = pad;
  const originY = height - pad;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  // 坐标轴
  ctx.beginPath();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5;
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + plotW, originY);
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, originY - plotH);
  ctx.stroke();

  // 轴标签
  ctx.fillStyle = theme.textSub;
  ctx.font = "12px sans-serif";
  ctx.fillText("t / s", originX + plotW - 15, originY + 25);
  ctx.fillText("v / (m/s)", originX - 35, originY - plotH + 10);

  const tMax = 6;
  const vMax = 25;
  const scaleX = plotW / tMax;
  const scaleY = plotH / vMax;

  // 绘制微元切片矩形
  const currentT = kParams.t;
  const n = Math.max(1, kParams.slices);
  const dt = currentT / n;

  for (let i = 0; i < n; i++) {
    const tSlice = i * dt;
    const vSlice = kParams.v0 + kParams.a * tSlice;
    const sliceX = originX + tSlice * scaleX;
    const sliceW = dt * scaleX;
    const sliceH = vSlice * scaleY;

    ctx.fillStyle = theme.brandSoft;
    ctx.fillRect(sliceX, originY - sliceH, sliceW, sliceH);

    ctx.strokeStyle = theme.brand;
    ctx.lineWidth = 1;
    ctx.strokeRect(sliceX, originY - sliceH, sliceW, sliceH);
  }

  // 绘制理论 v-t 连续直线
  ctx.beginPath();
  ctx.strokeStyle = theme.blue;
  ctx.lineWidth = 2.5;
  const vStart = kParams.v0;
  const vEnd = kParams.v0 + kParams.a * currentT;
  ctx.moveTo(originX, originY - vStart * scaleY);
  ctx.lineTo(originX + currentT * scaleX, originY - vEnd * scaleY);
  ctx.stroke();

  // 当前时间虚线
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = theme.orange;
  ctx.moveTo(originX + currentT * scaleX, originY);
  ctx.lineTo(originX + currentT * scaleX, originY - vEnd * scaleY);
  ctx.lineTo(originX, originY - vEnd * scaleY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 标注关键点
  ctx.fillStyle = theme.orange;
  ctx.fillText(`v=${vEnd.toFixed(1)}`, originX + 8, originY - vEnd * scaleY - 6);
  ctx.fillText(`v0=${vStart}`, originX + 8, originY - vStart * scaleY - 6);
  ctx.fillText(`t=${currentT}s`, originX + currentT * scaleX - 12, originY + 18);

  // 面积微积分说明
  ctx.fillStyle = theme.text;
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("梯形面积 = 位移 x = v₀t + ½at²", originX + 30, originY - plotH + 25);
};

// 2. 渲染斜面滑块受力分解
const renderSlope = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const rad = (sParams.angle * Math.PI) / 180;

  // 斜面底座几何
  const originX = 60;
  const originY = height - 50;
  const baseLen = width - 130;
  const topX = originX + baseLen * Math.cos(rad);
  const topY = originY - baseLen * Math.sin(rad);

  // 画斜面三角形
  ctx.beginPath();
  ctx.fillStyle = theme.grid;
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + baseLen, originY);
  ctx.lineTo(topX, topY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = theme.textSub;
  ctx.lineWidth = 2;
  ctx.moveTo(originX, originY);
  ctx.lineTo(topX, topY);
  ctx.stroke();

  // 倾角圆弧
  ctx.beginPath();
  ctx.arc(originX, originY, 45, 0, -rad, true);
  ctx.strokeStyle = theme.orange;
  ctx.stroke();
  ctx.fillStyle = theme.orange;
  ctx.font = "12px sans-serif";
  ctx.fillText(`θ=${sParams.angle}°`, originX + 52, originY - 10);

  // 滑块中心位置
  const dist = baseLen * 0.55;
  const blockX = originX + dist * Math.cos(rad);
  const blockY = originY - dist * Math.sin(rad);
  const bW = 54;
  const bH = 34;

  ctx.save();
  ctx.translate(blockX, blockY);
  ctx.rotate(-rad);

  // 滑块矩形
  ctx.fillStyle = theme.cardBg;
  ctx.strokeStyle = theme.brand;
  ctx.lineWidth = 2;
  ctx.fillRect(-bW / 2, -bH, bW, bH);
  ctx.strokeRect(-bW / 2, -bH, bW, bH);

  ctx.restore();

  // 全局绘制重力 G 及分力
  const gScale = 1.4;
  const G_len = sParams.mass * 9.8 * gScale;
  const Gx_len = G_len * Math.sin(rad);
  const Gy_len = G_len * Math.cos(rad);

  // 重力 G (向下)
  drawArrow(ctx, blockX, blockY - bH / 2, blockX, blockY - bH / 2 + G_len, theme.red, 2.5);
  ctx.fillStyle = theme.red;
  ctx.fillText("G=mg", blockX + 6, blockY - bH / 2 + G_len);

  // 重力分力 Gx (沿斜面向下)
  const gxEndLocalX = blockX - Gx_len * Math.cos(rad);
  const gxEndLocalY = blockY - bH / 2 + Gx_len * Math.sin(rad);
  drawArrow(ctx, blockX, blockY - bH / 2, gxEndLocalX, gxEndLocalY, theme.blue, 1.8);
  ctx.fillStyle = theme.blue;
  ctx.fillText("Gx=mg·sinθ", gxEndLocalX - 35, gxEndLocalY + 16);

  // 支持力 FN (垂直斜面向上)
  const fnEndX = blockX - Gy_len * Math.sin(rad);
  const fnEndY = blockY - bH / 2 - Gy_len * Math.cos(rad);
  drawArrow(ctx, blockX, blockY - bH / 2, fnEndX, fnEndY, theme.green, 2);
  ctx.fillStyle = theme.green;
  ctx.fillText("FN", fnEndX - 20, fnEndY - 6);

  // 摩擦力 f (沿斜面向上)
  const fLen = sResult.value.isSliding ? sParams.mu * Gy_len : Gx_len;
  const fEndX = blockX + fLen * Math.cos(rad);
  const fEndY = blockY - bH / 2 - fLen * Math.sin(rad);
  drawArrow(ctx, blockX, blockY - bH / 2, fEndX, fEndY, theme.orange, 2);
  ctx.fillStyle = theme.orange;
  ctx.fillText("f", fEndX + 6, fEndY - 4);
};

// 3. 渲染平抛运动
const renderProjectile = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const originX = 60;
  const originY = 60;
  const groundY = height - 40;

  // 平台与地面
  ctx.beginPath();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  ctx.moveTo(15, originY);
  ctx.lineTo(originX, originY);
  ctx.lineTo(originX, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  // 轨迹比例
  const g = 9.8;
  const tTotal = Math.sqrt((2 * pParams.h) / g);
  const xTotal = pParams.v0 * tTotal;
  const scaleX = (width - originX - 60) / Math.max(xTotal, 30);
  const scaleY = (groundY - originY) / pParams.h;

  // 绘制抛物线轨迹
  ctx.beginPath();
  ctx.strokeStyle = theme.brand;
  ctx.lineWidth = 2;
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (tTotal * i) / steps;
    const px = originX + pParams.v0 * t * scaleX;
    const py = originY + 0.5 * g * t * t * scaleY;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // 落地瞬间点
  const endX = originX + xTotal * scaleX;
  const endY = groundY;

  // 速度矢量三角形
  const vy = g * tTotal;
  const vScale = 1.2;
  const vxLen = pParams.v0 * vScale;
  const vyLen = vy * vScale;

  drawArrow(ctx, endX, endY, endX + vxLen, endY, theme.blue, 2); // vx
  drawArrow(ctx, endX + vxLen, endY, endX + vxLen, endY + vyLen, theme.green, 2); // vy
  drawArrow(ctx, endX, endY, endX + vxLen, endY + vyLen, theme.red, 2.5); // v合

  ctx.fillStyle = theme.blue;
  ctx.fillText("v₀", endX + vxLen / 2 - 5, endY - 6);
  ctx.fillStyle = theme.green;
  ctx.fillText("vy=gt", endX + vxLen + 6, endY + vyLen / 2);
  ctx.fillStyle = theme.red;
  ctx.fillText("v末", endX + vxLen / 2, endY + vyLen / 2 + 16);

  // 标注射程与高度
  ctx.fillStyle = theme.textSub;
  ctx.font = "12px sans-serif";
  ctx.fillText(`h = ${pParams.h}m`, originX - 50, (originY + groundY) / 2);
  ctx.fillText(`射程 x = ${pResult.value.xTotal}m`, (originX + endX) / 2 - 30, groundY + 24);
};

// 4. 渲染匀强磁场粒子回旋
const renderCyclotron = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const cX = width / 2;
  const cY = height / 2;

  // 绘制磁场区域网格 (X: 垂直纸面向里)
  const gridStep = 36;
  ctx.fillStyle = theme.border;
  ctx.font = "12px monospace";
  for (let x = 40; x < width - 40; x += gridStep) {
    for (let y = 40; y < height - 40; y += gridStep) {
      ctx.fillText("×", x, y);
    }
  }

  // 计算轨道圆心与半径
  const R = parseFloat(cResult.value.R);
  const orbitCenterX = cX;
  const orbitCenterY = cY;

  // 轨道圆
  ctx.beginPath();
  ctx.strokeStyle = theme.brandSoft;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.arc(orbitCenterX, orbitCenterY, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 当前粒子动态位置
  const angle = cParams.particlePos * Math.PI * 2 * (cParams.charge > 0 ? 1 : -1);
  const px = orbitCenterX + R * Math.cos(angle);
  const py = orbitCenterY + R * Math.sin(angle);

  // 绘制洛伦兹力与速度矢量
  const vAngle = angle + (cParams.charge > 0 ? Math.PI / 2 : -Math.PI / 2);
  const fAngle = angle + Math.PI; // 指向圆心

  const vLen = 35;
  const fLen = 30;

  drawArrow(
    ctx,
    px,
    py,
    px + vLen * Math.cos(vAngle),
    py + vLen * Math.sin(vAngle),
    theme.green,
    2,
  );
  drawArrow(ctx, px, py, px + fLen * Math.cos(fAngle), py + fLen * Math.sin(fAngle), theme.red, 2);

  ctx.fillStyle = theme.green;
  ctx.fillText("v", px + (vLen + 5) * Math.cos(vAngle), py + (vLen + 5) * Math.sin(vAngle));
  ctx.fillStyle = theme.red;
  ctx.fillText("F洛", px + (fLen + 5) * Math.cos(fAngle), py + (fLen + 5) * Math.sin(fAngle));

  // 绘制粒子
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fillStyle = cParams.charge > 0 ? theme.red : theme.blue;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText(cParams.charge > 0 ? "+" : "-", px - 3, py + 3);

  // 标注半径 R
  ctx.beginPath();
  ctx.strokeStyle = theme.orange;
  ctx.lineWidth = 1;
  ctx.moveTo(orbitCenterX, orbitCenterY);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.fillStyle = theme.orange;
  ctx.fillText(`R = mv/qB`, (orbitCenterX + px) / 2 - 20, (orbitCenterY + py) / 2 - 8);
};

// 5. 渲染光学折射与全反射
const renderOptics = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const cX = width / 2;
  const cY = height / 2;

  // 下半介质背景 (光密介质折射率 n)
  ctx.fillStyle = theme.brandSoft;
  ctx.fillRect(0, cY, width, height - cY);

  // 分界面与法线
  ctx.beginPath();
  ctx.strokeStyle = theme.text;
  ctx.lineWidth = 2;
  ctx.moveTo(30, cY);
  ctx.lineTo(width - 30, cY); // 界面
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = theme.textSub;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.moveTo(cX, 20);
  ctx.lineTo(cX, height - 20); // 法线
  ctx.stroke();
  ctx.setLineDash([]);

  // 文字标注介质
  ctx.fillStyle = theme.textSub;
  ctx.font = "12px sans-serif";
  ctx.fillText("空气 (n₀ = 1.0)", 40, cY - 20);
  ctx.fillText(`光密介质 (n = ${oParams.n})`, 40, cY + 30);

  // 入射光线 (从介质射向空气，下方向上方)
  const radInc = (oParams.angleInc * Math.PI) / 180;
  const rayLen = 130;
  const inX = cX - rayLen * Math.sin(radInc);
  const inY = cY + rayLen * Math.cos(radInc);

  // 画入射光
  drawArrow(ctx, inX, inY, cX, cY, theme.red, 2.5);
  ctx.fillStyle = theme.red;
  ctx.fillText(`入射光 (i=${oParams.angleInc}°)`, inX - 20, inY + 16);

  // 反射光线 (回到介质内，角度对称)
  const refX = cX + rayLen * Math.sin(radInc);
  const refY = cY + rayLen * Math.cos(radInc);
  drawArrow(ctx, cX, cY, refX, refY, theme.orange, 2);
  ctx.fillStyle = theme.orange;
  ctx.fillText("反射光", refX - 10, refY + 16);

  // 折射光线 (折射入空气中)
  if (!oResult.value.isTIR) {
    const radRef = Math.asin(Math.min(oParams.n * Math.sin(radInc), 1));
    const outX = cX + rayLen * Math.sin(radRef);
    const outY = cY - rayLen * Math.cos(radRef);
    drawArrow(ctx, cX, cY, outX, outY, theme.blue, 2.5);
    ctx.fillStyle = theme.blue;
    ctx.fillText(`折射光 (r=${oResult.value.refAngle})`, outX + 8, outY);
  } else {
    // 全反射高亮提示
    ctx.fillStyle = theme.red;
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("发生全反射 (i ≥ 临界角 C)！折射光完全消失", cX - 140, cY - 45);
  }
};

// 6. 渲染机械横波与质点振动
const renderWave = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const theme = getThemeColors();
  const cY = height / 2;
  const pad = 40;

  // 平衡位置虚线
  ctx.beginPath();
  ctx.strokeStyle = theme.border;
  ctx.setLineDash([4, 4]);
  ctx.moveTo(pad, cY);
  ctx.lineTo(width - pad, cY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 波形曲线 y = A * sin(kx - wt)
  const k = (2 * Math.PI) / wParams.wavelength;
  const w = 2 * Math.PI * wParams.frequency;
  const t = wParams.time;

  ctx.beginPath();
  ctx.strokeStyle = theme.brand;
  ctx.lineWidth = 2.5;

  for (let x = pad; x <= width - pad; x++) {
    const y = cY - wParams.amplitude * Math.sin(k * (x - pad) - w * t);
    if (x === pad) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 跟踪 3 个代表性质点 (x1, x2, x3)
  const points = [
    { name: "P₁", x: pad + 40 },
    { name: "P₂", x: pad + 100 },
    { name: "P₃", x: pad + 160 },
  ];

  points.forEach((pt) => {
    const y = cY - wParams.amplitude * Math.sin(k * (pt.x - pad) - w * t);
    // 质点速度方向 vy = -w * A * cos(kx - wt)
    const vy = -w * wParams.amplitude * Math.cos(k * (pt.x - pad) - w * t);

    // 画质点小球
    ctx.beginPath();
    ctx.arc(pt.x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = theme.orange;
    ctx.fill();

    // 振动速度矢量箭头
    if (Math.abs(vy) > 2) {
      const arrowLen = Math.sign(vy) * 22;
      drawArrow(ctx, pt.x, y, pt.x, y - arrowLen, theme.green, 2);
    }

    ctx.fillStyle = theme.text;
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(pt.name, pt.x - 6, y - 10);
  });

  // 波传播方向指示大箭头
  drawArrow(ctx, width - pad - 90, 45, width - pad - 20, 45, theme.blue, 2.5, 10);
  ctx.fillStyle = theme.blue;
  ctx.font = "12px sans-serif";
  ctx.fillText("波传播方向 v →", width - pad - 120, 30);
};

// ==================== 主渲染与动画帧循环 ====================

const redraw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // 背景底色
  const theme = getThemeColors();
  ctx.fillStyle = theme.cardBg;
  ctx.fillRect(0, 0, width, height);

  // 根据当前模型渲染
  switch (props.model) {
    case "kinematics":
      renderKinematics(ctx, width, height);
      break;
    case "slope":
      renderSlope(ctx, width, height);
      break;
    case "projectile":
      renderProjectile(ctx, width, height);
      break;
    case "cyclotron":
      renderCyclotron(ctx, width, height);
      break;
    case "optics":
      renderOptics(ctx, width, height);
      break;
    case "wave":
      renderWave(ctx, width, height);
      break;
  }

  ctx.restore();
};

let lastTimestamp = 0;
const tick = (timestamp: number) => {
  if (!isVisible.value) return;

  const dt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
  lastTimestamp = timestamp;

  // 仅在需要动态更新的模型上累进时间
  if (props.model === "wave") {
    wParams.time += dt;
    redraw();
  } else if (props.model === "cyclotron") {
    cParams.particlePos = (cParams.particlePos + dt * 0.4) % 1;
    redraw();
  }

  // 只有需要连续动画的模型才请求下一帧
  if (props.model === "wave" || props.model === "cyclotron") {
    animationFrameId = requestAnimationFrame(tick);
  }
};

const startLoopIfNeeded = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (props.model === "wave" || props.model === "cyclotron") {
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(tick);
  } else {
    redraw();
  }
};

// ==================== 视口与后台可见性监听 ====================

const onVisibilityChange = () => {
  if (document.hidden) {
    isVisible.value = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  } else {
    isVisible.value = true;
    startLoopIfNeeded();
  }
};

onMounted(() => {
  redraw();

  // 1. IntersectionObserver 监控是否在视口中
  if (typeof IntersectionObserver !== "undefined" && containerRef.value) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisible.value = true;
          startLoopIfNeeded();
        } else {
          isVisible.value = false;
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(containerRef.value);
  }

  // 2. 页面后台暂停
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  startLoopIfNeeded();
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }
});

// 监听参数变化，立即重绘
watch(
  [kParams, sParams, pParams, cParams, oParams, () => props.model],
  () => {
    redraw();
  },
  { deep: true },
);

// 主题切换（亮/暗色）时重绘，避免画布残留旧肤色
watch(vpIsDark, () => {
  redraw();
});
</script>

<template>
  <div ref="containerRef" class="cc-physics-simulator" :class="{ 'is-compact': compact }">
    <!-- 画布主体 -->
    <div class="canvas-wrap" :style="{ height: `${height}px` }">
      <canvas ref="canvasRef" class="sim-canvas" />
    </div>

    <!-- 交互控制面板 -->
    <div v-if="showControls" class="sim-controls">
      <!-- 1. 运动学微元控制 -->
      <div v-if="model === 'kinematics'" class="ctrl-group">
        <div class="ctrl-row">
          <label>初速度 v₀: {{ kParams.v0 }} m/s</label>
          <input v-model.number="kParams.v0" type="range" min="0" max="15" step="1" />
        </div>
        <div class="ctrl-row">
          <label>加速度 a: {{ kParams.a }} m/s²</label>
          <input v-model.number="kParams.a" type="range" min="0" max="8" step="0.5" />
        </div>
        <div class="ctrl-row">
          <label>运动时间 t: {{ kParams.t }} s</label>
          <input v-model.number="kParams.t" type="range" min="1" max="6" step="0.5" />
        </div>
        <div class="ctrl-row">
          <label>微元切片数: {{ kParams.slices }} 块</label>
          <input v-model.number="kParams.slices" type="range" min="2" max="32" step="2" />
        </div>
        <div class="result-badge-row">
          <span class="badge"
            >末速度: <strong>{{ kResult.v }}</strong> m/s</span
          >
          <span class="badge"
            >积分位移: <strong>{{ kResult.x }}</strong> m</span
          >
          <span class="badge"
            >平均速度: <strong>{{ kResult.vAvg }}</strong> m/s</span
          >
        </div>
      </div>

      <!-- 2. 斜面滑块受力控制 -->
      <div v-if="model === 'slope'" class="ctrl-group">
        <div class="ctrl-row">
          <label>斜面倾角 θ: {{ sParams.angle }}°</label>
          <input v-model.number="sParams.angle" type="range" min="5" max="75" step="1" />
        </div>
        <div class="ctrl-row">
          <label>摩擦因数 μ: {{ sParams.mu }}</label>
          <input v-model.number="sParams.mu" type="range" min="0.1" max="0.8" step="0.05" />
        </div>
        <div class="ctrl-row">
          <label>滑块质量 m: {{ sParams.mass }} kg</label>
          <input v-model.number="sParams.mass" type="range" min="1" max="5" step="0.5" />
        </div>
        <div class="result-badge-row">
          <span class="badge" :class="sResult.isSliding ? 'badge-danger' : 'badge-success'">
            状态: <strong>{{ sResult.statusText }}</strong>
          </span>
          <span class="badge"
            >下滑分力 Gx: <strong>{{ sResult.Gx }}</strong> N</span
          >
          <span class="badge"
            >实际摩擦力 f: <strong>{{ sResult.f }}</strong> N</span
          >
          <span v-if="sResult.isSliding" class="badge badge-warning">
            下滑加速度 a: <strong>{{ sResult.a }}</strong> m/s²
          </span>
        </div>
      </div>

      <!-- 3. 平抛运动控制 -->
      <div v-if="model === 'projectile'" class="ctrl-group">
        <div class="ctrl-row">
          <label>抛出高度 h: {{ pParams.h }} m</label>
          <input v-model.number="pParams.h" type="range" min="10" max="80" step="5" />
        </div>
        <div class="ctrl-row">
          <label>初速度 v₀: {{ pParams.v0 }} m/s</label>
          <input v-model.number="pParams.v0" type="range" min="5" max="40" step="2" />
        </div>
        <div class="result-badge-row">
          <span class="badge"
            >落地用时: <strong>{{ pResult.tTotal }}</strong> s</span
          >
          <span class="badge"
            >水平射程: <strong>{{ pResult.xTotal }}</strong> m</span
          >
          <span class="badge"
            >末速度: <strong>{{ pResult.vEnd }}</strong> m/s</span
          >
          <span class="badge badge-brand"
            >速度偏角 tanα: <strong>{{ pResult.tanTheta }}</strong> (= 2 tanθ，θ为位移偏角)</span
          >
        </div>
      </div>

      <!-- 4. 磁场回旋控制 -->
      <div v-if="model === 'cyclotron'" class="ctrl-group">
        <div class="ctrl-row">
          <label>磁感应强度 B: {{ cParams.B }} T</label>
          <input v-model.number="cParams.B" type="range" min="0.2" max="2.0" step="0.1" />
        </div>
        <div class="ctrl-row">
          <label>初速度 v: {{ cParams.v }} ×10⁵ m/s</label>
          <input v-model.number="cParams.v" type="range" min="5" max="30" step="1" />
        </div>
        <div class="ctrl-row toggle-row">
          <label>电荷电性:</label>
          <button
            class="toggle-btn"
            :class="{ active: cParams.charge > 0 }"
            @click="cParams.charge = 1"
          >
            正电荷 (+)
          </button>
          <button
            class="toggle-btn"
            :class="{ active: cParams.charge < 0 }"
            @click="cParams.charge = -1"
          >
            负电荷 (-)
          </button>
        </div>
        <div class="result-badge-row">
          <span class="badge"
            >轨道半径 R: <strong>{{ cResult.R }}</strong> px</span
          >
          <span class="badge badge-brand"
            >回旋周期 T: <strong>{{ cResult.T }}</strong> s (与速度无关)</span
          >
        </div>
      </div>

      <!-- 5. 光学折射控制 -->
      <div v-if="model === 'optics'" class="ctrl-group">
        <div class="ctrl-row">
          <label>介质折射率 n: {{ oParams.n }}</label>
          <input v-model.number="oParams.n" type="range" min="1.1" max="2.4" step="0.05" />
        </div>
        <div class="ctrl-row">
          <label>入射角 i: {{ oParams.angleInc }}°</label>
          <input v-model.number="oParams.angleInc" type="range" min="0" max="85" step="1" />
        </div>
        <div class="result-badge-row">
          <span class="badge"
            >临界角 C: <strong>{{ oResult.critAngle }}°</strong></span
          >
          <span class="badge" :class="oResult.isTIR ? 'badge-danger' : 'badge-brand'">
            {{ oResult.isTIR ? "全反射！折射光消失" : `折射角 r: ${oResult.refAngle}` }}
          </span>
        </div>
      </div>

      <!-- 6. 机械波控制 -->
      <div v-if="model === 'wave'" class="ctrl-group">
        <div class="ctrl-row">
          <label>波长 λ: {{ wParams.wavelength }} px</label>
          <input v-model.number="wParams.wavelength" type="range" min="120" max="300" step="10" />
        </div>
        <div class="ctrl-row">
          <label>频率 f: {{ wParams.frequency }} Hz</label>
          <input v-model.number="wParams.frequency" type="range" min="0.4" max="1.6" step="0.1" />
        </div>
        <div class="ctrl-row">
          <label>振幅 A: {{ wParams.amplitude }} px</label>
          <input v-model.number="wParams.amplitude" type="range" min="15" max="50" step="5" />
        </div>
        <div class="result-badge-row">
          <span class="badge badge-brand">核心考点: 质点只在平衡位置垂直振动，不随波迁移</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-physics-simulator {
  margin: 1.2rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  box-shadow: var(--vp-shadow-1);
}

.canvas-wrap {
  width: 100%;
  position: relative;
  background: var(--vp-c-bg);
}

.sim-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: pan-y;
}

.sim-controls {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.ctrl-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ctrl-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 1rem;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
}

.ctrl-row label {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.ctrl-row input[type="range"] {
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
  min-height: 44px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.toggle-btn {
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  font-size: 0.82rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-btn.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.dark .toggle-btn.active {
  color: #121415;
}

.result-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.82rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.badge strong {
  color: var(--vp-c-brand-1);
}

.badge-brand {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.badge-success {
  border-color: #2da44e;
  background: rgba(45, 164, 78, 0.1);
}

.badge-warning {
  border-color: #c27803;
  background: rgba(194, 120, 3, 0.1);
}

.badge-danger {
  border-color: #d45951;
  background: rgba(212, 89, 81, 0.1);
}

@media (max-width: 768px) {
  .ctrl-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
