<script setup lang="ts">
import { useData } from "vitepress";
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";

interface GraphNode {
  id: string;
  name: string;
  shortName: string;
  category: "mechanics" | "electromagnetism" | "waves_optics" | "thermal_modern" | "experiment";
  categoryName: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  link: string;
  desc: string;
  keyFormulas: string[];
  connections: string[]; // 关联的节点 id 列表
}

interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const selectedCategory = ref<string>("all");
const activeNode = ref<GraphNode | null>(null);
const hoveredNode = ref<GraphNode | null>(null);
const { isDark: vpIsDark } = useData();

// 视口变换参数
const transform = ref({
  x: 0,
  y: 0,
  scale: 1,
});

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let draggedNode: GraphNode | null = null;
let animationFrameId: number | null = null;

// ==================== 19 大专题节点数据 ====================
const categories = [
  { id: "all", name: "全部专题", count: 19 },
  { id: "mechanics", name: "力学板块", color: "#5672cd", count: 8 },
  { id: "electromagnetism", name: "电磁学体系", color: "#d45951", count: 6 },
  { id: "waves_optics", name: "振动与光学", color: "#2da44e", count: 2 },
  { id: "thermal_modern", name: "热学与近代", color: "#c27803", count: 2 },
  { id: "experiment", name: "物理实验", color: "#8b5cf6", count: 1 },
];

const nodes: GraphNode[] = [
  // 力学集群 (Mechanics)
  {
    id: "01",
    name: "01 运动的描述与匀变速规律",
    shortName: "运动学与图像",
    category: "mechanics",
    categoryName: "力学基础",
    x: 160,
    y: 120,
    radius: 26,
    link: "/01%20运动的描述与匀变速规律/01%20质点与参考系",
    desc: "速度、加速度、匀变速四大公式与微积分累积思想。",
    keyFormulas: ["v = v₀ + at", "x = v₀t + ½at²", "v² - v₀² = 2ax"],
    connections: ["03", "04", "19"],
  },
  {
    id: "02",
    name: "02 相互作用与共点力平衡",
    shortName: "受力与平衡",
    category: "mechanics",
    categoryName: "力学基础",
    x: 320,
    y: 80,
    radius: 26,
    link: "/02%20相互作用与共点力平衡/01%20重力与弹力",
    desc: "重力、胡克定律弹力、静动摩擦力与正交分解平衡。",
    keyFormulas: ["F = kx", "f = μN", "∑F_x = 0, ∑F_y = 0"],
    connections: ["03", "07"],
  },
  {
    id: "03",
    name: "03 牛顿运动定律与动力学应用",
    shortName: "牛顿动力学",
    category: "mechanics",
    categoryName: "力学核心",
    x: 280,
    y: 200,
    radius: 30,
    link: "/03%20牛顿运动定律与动力学应用/01%20牛顿第一定律",
    desc: "经典力学支柱，力与加速度瞬时对应联系 F合 = ma。",
    keyFormulas: ["F_合 = ma", "超重失重判据", "板块传送带临界"],
    connections: ["01", "02", "04", "05", "07", "08", "15"],
  },
  {
    id: "04",
    name: "04 抛体运动与曲线运动",
    shortName: "抛体曲线运动",
    category: "mechanics",
    categoryName: "力学延伸",
    x: 140,
    y: 290,
    radius: 24,
    link: "/04%20抛体运动与曲线运动/01%20曲线运动的特征与条件",
    desc: "运动合成与分解，平抛正交解耦与末速度偏角定理。",
    keyFormulas: ["x = v₀t", "y = ½gt²", "tanθ = 2 tanα"],
    connections: ["03", "05", "10"],
  },
  {
    id: "05",
    name: "05 圆周运动及其应用",
    shortName: "圆周与向心力",
    category: "mechanics",
    categoryName: "力学延伸",
    x: 280,
    y: 330,
    radius: 26,
    link: "/05%20圆周运动及其应用/01%20描述圆周运动的物理量",
    desc: "角速度、线速度、向心力模型与竖直绳杆圆周临界。",
    keyFormulas: ["a_n = v²/r = ω²r", "轻绳最高点 v ≥ √(gr)"],
    connections: ["03", "06", "12"],
  },
  {
    id: "06",
    name: "06 万有引力与宇宙航行",
    shortName: "万有引力天体",
    category: "mechanics",
    categoryName: "力学综合",
    x: 420,
    y: 360,
    radius: 28,
    link: "/06%20万有引力与宇宙航行/01%20行星的运动与开普勒定律",
    desc: "开普勒定律、黄金代换 GM=gR²、宇宙速度与卫星变轨。",
    keyFormulas: ["F = G·Mm/r²", "v₁ = 7.9 km/s", "双星系统综合"],
    connections: ["05"],
  },
  {
    id: "07",
    name: "07 机械能守恒与功能关系",
    shortName: "功能关系",
    category: "mechanics",
    categoryName: "力学核心",
    x: 460,
    y: 190,
    radius: 30,
    link: "/07%20机械能守恒与功能关系/01%20功与功率",
    desc: "功和功率、动能定理、重力/弹性势能与机械能守恒。",
    keyFormulas: ["W_合 = ΔE_k", "E_k1 + E_p1 = E_k2 + E_p2", "Q = f·s_相对"],
    connections: ["02", "03", "08", "13", "18"],
  },
  {
    id: "08",
    name: "08 动量守恒定律与碰撞",
    shortName: "动量与碰撞",
    category: "mechanics",
    categoryName: "力学综合",
    x: 450,
    y: 80,
    radius: 28,
    link: "/08%20动量守恒定律与碰撞/01%20动量与动量定理",
    desc: "冲量动量定理、系统动量守恒、弹性/完全非弹性碰撞。",
    keyFormulas: ["I_合 = Δp", "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'", "反冲与弹簧滑块"],
    connections: ["03", "07", "18"],
  },

  // 电磁学集群 (Electromagnetism)
  {
    id: "09",
    name: "09 静电场与电能",
    shortName: "静电场性质",
    category: "electromagnetism",
    categoryName: "电磁基础",
    x: 630,
    y: 100,
    radius: 28,
    link: "/09%20静电场与电能/01%20电荷守恒与库仑定律",
    desc: "库仑定律、场强与电场线、电势能等势面与电容器动态分析。",
    keyFormulas: ["E = F/q", "U = Ed", "C = Q/U = εS/(4πkd)"],
    connections: ["10", "11"],
  },
  {
    id: "10",
    name: "10 带电粒子在电场中的运动",
    shortName: "电场粒子加速偏转",
    category: "electromagnetism",
    categoryName: "电磁综合",
    x: 750,
    y: 190,
    radius: 26,
    link: "/10%20带电粒子在电场中的运动/01%20带电粒子在电场中的加速",
    desc: "带电粒子加速(动能定理)与类平抛偏转轨迹计算。",
    keyFormulas: ["qU = ½mv²", "y = ½·(qE/m)·t²", "示波管原理"],
    connections: ["04", "09", "12"],
  },
  {
    id: "11",
    name: "11 电路与恒定电流",
    shortName: "电路欧姆定律",
    category: "electromagnetism",
    categoryName: "电磁基础",
    x: 620,
    y: 230,
    radius: 26,
    link: "/11%20电路与恒定电流/01%20电流与电阻定律",
    desc: "电阻定律、电表改装、闭合电路欧姆定律与功率极值。",
    keyFormulas: ["I = E/(R+r)", "P_出 = I²R", "电路动态串反并同"],
    connections: ["09", "13", "19"],
  },
  {
    id: "12",
    name: "12 磁场与安培力洛伦兹力",
    shortName: "磁场与洛伦兹力",
    category: "electromagnetism",
    categoryName: "电磁核心",
    x: 780,
    y: 300,
    radius: 30,
    link: "/12%20磁场与安培力洛伦兹力/01%20磁场与磁感应强度",
    desc: "左手定则、安培力 F=BIL、洛伦兹力与匀强磁场圆周运动几何轨迹。",
    keyFormulas: ["F = qvB", "R = mv/(qB)", "T = 2πm/(qB)"],
    connections: ["05", "10", "13"],
  },
  {
    id: "13",
    name: "13 电磁感应与综合应用",
    shortName: "电磁感应",
    category: "electromagnetism",
    categoryName: "电磁核心",
    x: 630,
    y: 350,
    radius: 32,
    link: "/13%20电磁感应与综合应用/01%20电磁感应现象与楞次定律",
    desc: "楞次定律右手定则、法拉第电磁感应定律与导轨滑棒力电综合。",
    keyFormulas: ["E = BLv", "E = n·ΔΦ/Δt", "滑棒收尾恒定速度"],
    connections: ["07", "11", "12", "14"],
  },
  {
    id: "14",
    name: "14 交变电流与电磁波",
    shortName: "交变电流变压器",
    category: "electromagnetism",
    categoryName: "电磁应用",
    x: 760,
    y: 420,
    radius: 24,
    link: "/14%20交变电流与电磁波/01%20正弦交变电流的产生与描述",
    desc: "正弦交变电流四值、理想变压器变压变流规律与远距离高压输电。",
    keyFormulas: ["U₁/U₂ = n₁/n₂", "I₁/I₂ = n₂/n₁", "ΔP = I²R_线"],
    connections: ["13"],
  },

  // 机械振动与光学 (Waves & Optics)
  {
    id: "15",
    name: "15 机械振动与机械波",
    shortName: "振动与机械波",
    category: "waves_optics",
    categoryName: "波动光学",
    x: 220,
    y: 450,
    radius: 26,
    link: "/15%20机械振动与机械波/01%20简谐运动与描述",
    desc: "简谐运动回复力、单摆、机械横波图像与质点振动同侧法互化。",
    keyFormulas: ["F = -kx", "T = 2π√(L/g)", "v = λ·f = λ/T"],
    connections: ["03", "16"],
  },
  {
    id: "16",
    name: "16 光学",
    shortName: "几何与物理光学",
    category: "waves_optics",
    categoryName: "波动光学",
    x: 370,
    y: 470,
    radius: 26,
    link: "/16%20光学/01%20光的折射与折射率",
    desc: "折射定律、全反射临界角、杨氏双缝干涉条纹间距公式与偏振。",
    keyFormulas: ["n = sin i / sin r", "sin C = 1/n", "Δx = (L/d)·λ"],
    connections: ["15"],
  },

  // 热学与近代物理 (Thermal & Modern Physics)
  {
    id: "17",
    name: "17 热学与分子动理论",
    shortName: "热学气体定律",
    category: "thermal_modern",
    categoryName: "热学微观",
    x: 940,
    y: 110,
    radius: 25,
    link: "/17%20热学与分子动理论/01%20分子动理论与微观量估算",
    desc: "分子动理论微观估算、理想气体状态方程 pV/T=C 与热力学定律。",
    keyFormulas: ["pV/T = C", "ΔU = W + Q", "气体微观压强本质"],
    connections: ["18"],
  },
  {
    id: "18",
    name: "18 原子物理与近代物理",
    shortName: "近代物理与量子",
    category: "thermal_modern",
    categoryName: "近代量子",
    x: 930,
    y: 250,
    radius: 28,
    link: "/18%20原子物理与近代物理/01%20黑体辐射与光电效应",
    desc: "爱因斯坦光电效应方程、玻尔能级跃迁、核衰变半衰期与质能方程。",
    keyFormulas: ["E_k = hν - W₀", "hν = E_m - E_n", "ΔE = Δm·c²"],
    connections: ["07", "08", "17"],
  },

  // 物理实验 (Experiments)
  {
    id: "19",
    name: "19 物理实验专题",
    shortName: "物理实验专题",
    category: "experiment",
    categoryName: "实验规范",
    x: 520,
    y: 450,
    radius: 30,
    link: "/19%20物理实验专题/01%20基本仪器使用与读数规范",
    desc: "游标卡尺螺旋测微器读数、力学验证打点纸带处理与电学内外接分压限流。",
    keyFormulas: ["电表内接外接判据", "逐差法算加速度", "实验误差与有效数字"],
    connections: ["01", "11"],
  },
];

// 关系连线
const links: GraphLink[] = [
  { source: "01", target: "03", label: "运动学状态输入" },
  { source: "02", target: "03", label: "合力来源" },
  { source: "03", target: "04", label: "分运动受力" },
  { source: "03", target: "05", label: "向心力方程" },
  { source: "05", target: "06", label: "轨道向心力" },
  { source: "03", target: "07", label: "空间积分做功" },
  { source: "03", target: "08", label: "时间积分冲量" },
  { source: "07", target: "08", label: "动量能量双守恒" },
  { source: "09", target: "10", label: "电场力作用" },
  { source: "09", target: "11", label: "电势差与能" },
  { source: "04", target: "10", label: "类平抛偏转" },
  { source: "10", target: "12", label: "粒子注入偏转" },
  { source: "05", target: "12", label: "匀强磁场圆周" },
  { source: "11", target: "13", label: "回路感应电流" },
  { source: "12", target: "13", label: "安培力阻尼" },
  { source: "07", target: "13", label: "滑棒能量转换" },
  { source: "13", target: "14", label: "变压器物理源" },
  { source: "03", target: "15", label: "简谐回复力" },
  { source: "15", target: "16", label: "波动光学统一" },
  { source: "17", target: "18", label: "微观到量子" },
  { source: "07", target: "18", label: "质能方程守恒" },
  { source: "08", target: "18", label: "光子碰撞动量" },
  { source: "01", target: "19", label: "运动测量实验" },
  { source: "11", target: "19", label: "电学仪表测量" },
];

// ==================== 主题与配色 ====================
const isDark = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

const getCategoryColor = (cat: string) => {
  const dark = isDark();
  const map: Record<string, string> = dark
    ? {
        mechanics: "#758ee6",
        electromagnetism: "#f49f99",
        waves_optics: "#7ee787",
        thermal_modern: "#f0c37b",
        experiment: "#a78bfa",
      }
    : {
        mechanics: "#5672cd",
        electromagnetism: "#d45951",
        waves_optics: "#2da44e",
        thermal_modern: "#c27803",
        experiment: "#8b5cf6",
      };
  return map[cat] || "#5672cd";
};

// ==================== 画布交互与渲染 ====================

const redraw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dark = isDark();
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
  ctx.fillStyle = dark ? "#151718" : "#faf9f5";
  ctx.fillRect(0, 0, width, height);

  // 网格点装饰
  ctx.fillStyle = dark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)";
  for (let x = 20; x < width; x += 30) {
    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 应用用户平移与缩放
  ctx.save();
  ctx.translate(transform.value.x, transform.value.y);
  ctx.scale(transform.value.scale, transform.value.scale);

  // 1. 绘制连线
  links.forEach((link) => {
    const sNode = nodes.find((n) => n.id === link.source);
    const tNode = nodes.find((n) => n.id === link.target);
    if (!sNode || !tNode) return;

    const isConnectedToHovered =
      hoveredNode.value && (hoveredNode.value.id === sNode.id || hoveredNode.value.id === tNode.id);
    const isConnectedToActive =
      activeNode.value && (activeNode.value.id === sNode.id || activeNode.value.id === tNode.id);

    const isHighlight = isConnectedToHovered || isConnectedToActive;

    const isCategoryFiltered =
      selectedCategory.value !== "all" &&
      sNode.category !== selectedCategory.value &&
      tNode.category !== selectedCategory.value;

    ctx.beginPath();
    ctx.moveTo(sNode.x, sNode.y);
    ctx.lineTo(tNode.x, tNode.y);

    if (isHighlight) {
      ctx.strokeStyle = dark ? "#758ee6" : "#5672cd";
      ctx.lineWidth = 2.5;
    } else if (isCategoryFiltered) {
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
    } else {
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1.2;
    }
    ctx.stroke();
  });

  // 2. 绘制节点
  nodes.forEach((node) => {
    const isCatMatch = selectedCategory.value === "all" || node.category === selectedCategory.value;
    const isHovered = hoveredNode.value?.id === node.id;
    const isActive = activeNode.value?.id === node.id;
    const isConnected =
      (hoveredNode.value && hoveredNode.value.connections.includes(node.id)) ||
      (activeNode.value && activeNode.value.connections.includes(node.id));

    const color = getCategoryColor(node.category);

    ctx.save();
    ctx.translate(node.x, node.y);

    // 节点外光晕
    if (isActive || isHovered) {
      ctx.beginPath();
      ctx.arc(0, 0, node.radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = `${color}33`;
      ctx.fill();
    }

    // 节点圆圈
    ctx.beginPath();
    ctx.arc(0, 0, node.radius, 0, Math.PI * 2);

    if (!isCatMatch && !isHovered && !isActive && !isConnected) {
      // 过滤变暗
      ctx.fillStyle = dark ? "#1f2224" : "#f0ede6";
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
    } else {
      ctx.fillStyle = dark ? "#1c1f21" : "#ffffff";
      ctx.strokeStyle = color;
      ctx.lineWidth = isActive || isHovered ? 3 : 2;
    }
    ctx.fill();
    ctx.stroke();

    // 节点编号徽章
    ctx.beginPath();
    ctx.arc(0, -node.radius + 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, 0, -node.radius + 2);

    // 节点名称文字
    ctx.fillStyle =
      isCatMatch || isHovered || isActive || isConnected
        ? dark
          ? "#e3e5e8"
          : "#1f2328"
        : dark
          ? "#5b6269"
          : "#a8a29e";
    ctx.font = isHovered || isActive ? "bold 11px sans-serif" : "10.5px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.shortName, 0, 2);

    ctx.restore();
  });

  ctx.restore();
  ctx.restore();
};

// ==================== 鼠标拾取与拖动交互 ====================

const getEventPos = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  // 逆映射到全局图坐标
  const worldX = (screenX - transform.value.x) / transform.value.scale;
  const worldY = (screenY - transform.value.y) / transform.value.scale;
  return { screenX, screenY, worldX, worldY };
};

const findNodeAtPos = (worldX: number, worldY: number): GraphNode | null => {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const dx = n.x - worldX;
    const dy = n.y - worldY;
    if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {
      return n;
    }
  }
  return null;
};

const getTouchPos = (touch: Touch) => {
  const canvas = canvasRef.value;
  if (!canvas) return { screenX: 0, screenY: 0, worldX: 0, worldY: 0 };
  const rect = canvas.getBoundingClientRect();
  const screenX = touch.clientX - rect.left;
  const screenY = touch.clientY - rect.top;
  const worldX = (screenX - transform.value.x) / transform.value.scale;
  const worldY = (screenY - transform.value.y) / transform.value.scale;
  return { screenX, screenY, worldX, worldY };
};

let touchDistanceStart = 0;
let scaleStart = 1;
let touchCenter = { x: 0, y: 0 };

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    const { screenX, screenY, worldX, worldY } = getTouchPos(e.touches[0]);
    const targetNode = findNodeAtPos(worldX, worldY);
    if (targetNode) {
      draggedNode = targetNode;
      activeNode.value = targetNode;
    } else {
      isDragging = true;
      dragStartX = screenX - transform.value.x;
      dragStartY = screenY - transform.value.y;
    }
    redraw();
  } else if (e.touches.length === 2) {
    isDragging = false;
    draggedNode = null;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    touchDistanceStart = Math.hypot(dx, dy);
    scaleStart = transform.value.scale;
    const canvas = canvasRef.value;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      touchCenter = {
        x: (t1.clientX + t2.clientX) / 2 - rect.left,
        y: (t1.clientY + t2.clientY) / 2 - rect.top,
      };
    }
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    const { screenX, screenY, worldX, worldY } = getTouchPos(e.touches[0]);
    if (draggedNode) {
      draggedNode.x = worldX;
      draggedNode.y = worldY;
      redraw();
      return;
    }
    if (isDragging) {
      transform.value.x = screenX - dragStartX;
      transform.value.y = screenY - dragStartY;
      redraw();
      return;
    }
  } else if (e.touches.length === 2 && touchDistanceStart > 0) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    const currentDist = Math.hypot(dx, dy);
    const factor = currentDist / touchDistanceStart;
    const newScale = Math.min(Math.max(scaleStart * factor, 0.55), 2.2);

    transform.value.x =
      touchCenter.x - (touchCenter.x - transform.value.x) * (newScale / transform.value.scale);
    transform.value.y =
      touchCenter.y - (touchCenter.y - transform.value.y) * (newScale / transform.value.scale);
    transform.value.scale = newScale;
    redraw();
  }
};

const onTouchEnd = () => {
  isDragging = false;
  draggedNode = null;
  touchDistanceStart = 0;
};

const closeDetail = () => {
  activeNode.value = null;
  redraw();
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && activeNode.value) {
    closeDetail();
  }
};

const onMouseDown = (e: MouseEvent) => {
  const { screenX, screenY, worldX, worldY } = getEventPos(e);
  const targetNode = findNodeAtPos(worldX, worldY);

  if (targetNode) {
    draggedNode = targetNode;
    activeNode.value = targetNode;
  } else {
    isDragging = true;
    dragStartX = screenX - transform.value.x;
    dragStartY = screenY - transform.value.y;
  }
  redraw();
};

const onMouseMove = (e: MouseEvent) => {
  const { screenX, screenY, worldX, worldY } = getEventPos(e);

  if (draggedNode) {
    draggedNode.x = worldX;
    draggedNode.y = worldY;
    redraw();
    return;
  }

  if (isDragging) {
    transform.value.x = screenX - dragStartX;
    transform.value.y = screenY - dragStartY;
    redraw();
    return;
  }

  // 鼠标悬停拾取
  const target = findNodeAtPos(worldX, worldY);
  if (hoveredNode.value?.id !== target?.id) {
    hoveredNode.value = target;
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.style.cursor = target ? "pointer" : "grab";
    }
    redraw();
  }
};

const onMouseUp = () => {
  isDragging = false;
  draggedNode = null;
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.style.cursor = hoveredNode.value ? "pointer" : "grab";
  }
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  const newScale = Math.min(Math.max(transform.value.scale * zoomFactor, 0.55), 2.2);

  transform.value.x = mouseX - (mouseX - transform.value.x) * (newScale / transform.value.scale);
  transform.value.y = mouseY - (mouseY - transform.value.y) * (newScale / transform.value.scale);
  transform.value.scale = newScale;

  redraw();
};

// 居中复位
const resetView = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  // 默认节点包围盒范围约为 [100, 1000] x [60, 520]
  const graphW = 900;
  const graphH = 500;
  const scale = Math.min(w / (graphW + 100), h / (graphH + 80), 1.0);

  transform.value.scale = scale;
  transform.value.x = (w - graphW * scale) / 2 - 80 * scale;
  transform.value.y = (h - graphH * scale) / 2 - 30 * scale;
  redraw();
};

const selectCategory = (catId: string) => {
  selectedCategory.value = catId;
  redraw();
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.style.cursor = "grab";
  }
  resetView();

  window.addEventListener("resize", resetView);
  window.addEventListener("keydown", onKeydown);
  // 主题切换后重绘，避免背景/连线/节点残留旧肤色
  watch(vpIsDark, () => {
    redraw();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resetView);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div ref="containerRef" class="cc-knowledge-graph">
    <!-- 顶部过滤与操作工具栏 -->
    <div class="graph-toolbar">
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-pill"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span v-if="cat.color" class="pill-dot" :style="{ backgroundColor: cat.color }" />
          {{ cat.name }} ({{ cat.count }})
        </button>
      </div>

      <div class="tool-actions">
        <button class="tool-btn" title="复位视角" @click="resetView">⟲ 复位视角</button>
      </div>
    </div>

    <!-- 图谱画布 -->
    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        class="graph-canvas"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @wheel="onWheel"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      />

      <!-- 画布浮动操作小提示 -->
      <div class="canvas-hint">
        <span>滚轮/双指缩放 · 拖拽平移 · 拖动节点重构拓扑 · 点击节点锁定剖析</span>
      </div>
    </div>

    <!-- 选中节点的深度剖析详情卡片 -->
    <transition name="fade">
      <div v-if="activeNode" class="node-detail-card">
        <div class="detail-header">
          <div class="detail-title-group">
            <span
              class="detail-cat-badge"
              :style="{
                backgroundColor: `${getCategoryColor(activeNode.category)}20`,
                color: getCategoryColor(activeNode.category),
              }"
            >
              {{ activeNode.categoryName }}
            </span>
            <h3 class="detail-title">{{ activeNode.name }}</h3>
          </div>
          <div class="detail-actions">
            <a :href="activeNode.link" class="detail-jump-link"> 进入本章详细笔记 &rarr; </a>
            <button
              type="button"
              class="detail-close-btn"
              title="关闭详情卡片 (Esc)"
              aria-label="关闭详情卡片"
              @click="closeDetail"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <p class="detail-desc">{{ activeNode.desc }}</p>

        <div class="detail-body">
          <div class="detail-col">
            <span class="col-label">核心考点与公式矩阵：</span>
            <div class="formula-chips">
              <code v-for="(f, i) in activeNode.keyFormulas" :key="i" class="formula-chip">
                {{ f }}
              </code>
            </div>
          </div>
          <div class="detail-col">
            <span class="col-label"
              >前承后继关联节点 ({{ activeNode.connections.length }} 个)：</span
            >
            <div class="conn-chips">
              <span
                v-for="cId in activeNode.connections"
                :key="cId"
                class="conn-chip"
                @click="
                  activeNode = nodes.find((n) => n.id === cId) || null;
                  redraw();
                "
              >
                专题 {{ cId }} ({{ nodes.find((n) => n.id === cId)?.shortName }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.cc-knowledge-graph {
  margin: 1.25rem 0 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  box-shadow: var(--vp-shadow-1);
}

.graph-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  flex-wrap: wrap;
}

.category-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.5rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.cat-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.cat-pill.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.dark .cat-pill.active {
  color: #121415;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tool-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tool-btn {
  min-height: 44px;
  padding: 0.5rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tool-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
}

.canvas-container {
  width: 100%;
  height: 480px;
  position: relative;
  background: var(--vp-c-bg);
}

.graph-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}

.canvas-hint {
  position: absolute;
  bottom: 8px;
  left: 12px;
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  pointer-events: none;
  opacity: 0.85;
}

.node-detail-card {
  padding: 1.1rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.detail-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.detail-close-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.detail-cat-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.detail-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.detail-jump-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  text-decoration: none !important;
  transition: opacity 0.15s ease;
}

.detail-jump-link:hover {
  opacity: 0.9;
}

.dark .detail-jump-link {
  color: #121415 !important;
}

.detail-desc {
  margin: 0 0 0.85rem;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.col-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  margin-bottom: 0.35rem;
}

.formula-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.formula-chip {
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  background: var(--vp-code-bg);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.conn-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.conn-chip {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 0.78rem;
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.15s ease;
}

.conn-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .detail-body {
    grid-template-columns: 1fr;
  }
}
</style>
