<script setup lang="ts">
import { ref, computed } from "vue";

const el = ref<HTMLElement>();
const flipped = ref(false);
const hover = ref(false);
const rx = ref(0);
const ry = ref(0);

function onMove(e: MouseEvent) {
  if (!el.value) return;
  const r = el.value.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  ry.value = +(x * 12).toFixed(1);
  rx.value = +(-y * 12).toFixed(1);
}

function onEnter() {
  hover.value = true;
}

function onLeave() {
  hover.value = false;
  rx.value = 0;
  ry.value = 0;
}

function onClick() {
  flipped.value = !flipped.value;
}

const tiltStyle = computed(() => {
  return {
    transform: `rotateX(${rx.value}deg) rotateY(${ry.value}deg)`,
  };
});
</script>

<template>
  <div
    ref="el"
    class="flip-wrap"
    @mousemove="onMove"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onClick"
  >
    <div class="levitate-box" :class="{ 'is-hovered': hover }">
      <div class="tilt-layer" :style="tiltStyle">
        <div class="flip-card" :class="{ 'is-flipped': flipped }">
          <!-- ====== FRONT: Notebook + Animated Atom ====== -->
          <div class="face front">
            <svg viewBox="0 0 330 380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Back page (blue, tilted) -->
              <rect
                y="29.6086"
                width="285.591"
                height="352"
                rx="18"
                transform="rotate(-5.74915 0 29.6086)"
                fill="var(--atom-cover)"
              />

              <!-- Front page -->
              <g filter="url(#f-shadow)">
                <rect
                  x="45.5326"
                  y="10"
                  width="274"
                  height="352"
                  rx="18"
                  fill="var(--atom-card-bg)"
                />
                <rect x="45.5326" y="10" width="274" height="352" rx="18" fill="url(#f-lines)" />

                <!-- Bohr Atom Orbits -->
                <!-- Orbit 1: 0 deg (Horizontal) -->
                <ellipse
                  cx="182.5"
                  cy="165"
                  rx="66"
                  ry="26"
                  stroke="var(--atom-orbit)"
                  stroke-width="8.5"
                  fill="none"
                  class="atom-orbit orbit-h"
                />

                <!-- Orbit 2: 60 deg -->
                <ellipse
                  cx="182.5"
                  cy="165"
                  rx="66"
                  ry="26"
                  stroke="var(--atom-orbit)"
                  stroke-width="8.5"
                  fill="none"
                  transform="rotate(60 182.5 165)"
                  class="atom-orbit orbit-d1"
                />

                <!-- Orbit 3: 120 deg -->
                <ellipse
                  cx="182.5"
                  cy="165"
                  rx="66"
                  ry="26"
                  stroke="var(--atom-orbit)"
                  stroke-width="8.5"
                  fill="none"
                  transform="rotate(120 182.5 165)"
                  class="atom-orbit orbit-d2"
                />

                <!-- Pulsing Center Nucleus -->
                <g class="nucleus-group">
                  <!-- Soft halo pulse -->
                  <circle
                    cx="182.5"
                    cy="165"
                    r="22"
                    fill="var(--atom-nucleus)"
                    opacity="0.18"
                    class="nucleus-halo"
                  />
                  <circle
                    cx="182.5"
                    cy="165"
                    r="15"
                    fill="var(--atom-nucleus)"
                    class="nucleus-core"
                  />
                  <!-- Nucleus glint -->
                  <circle cx="178.5" cy="161" r="3.5" fill="#ffffff" opacity="0.85" />
                </g>

                <!-- Electrons with lively orbital breathing -->
                <!-- Electron 1 (Horizontal Orbit) -->
                <g class="electron-node electron-1">
                  <circle cx="248.5" cy="165" r="7.5" fill="var(--atom-electron)" />
                  <circle cx="248.5" cy="165" r="2.5" fill="#ffffff" />
                </g>

                <!-- Electron 2 (60 deg Orbit) -->
                <g class="electron-node electron-2">
                  <circle cx="149.5" cy="107.8" r="7.5" fill="var(--atom-electron)" />
                  <circle cx="149.5" cy="107.8" r="2.5" fill="#ffffff" />
                </g>

                <!-- Electron 3 (120 deg Orbit) -->
                <g class="electron-node electron-3">
                  <circle cx="149.5" cy="222.2" r="7.5" fill="var(--atom-electron)" />
                  <circle cx="149.5" cy="222.2" r="2.5" fill="#ffffff" />
                </g>

                <!-- Underline -->
                <path
                  d="M97.5326 271H267.033"
                  stroke="var(--atom-text)"
                  stroke-width="11"
                  stroke-linecap="round"
                />
              </g>

              <defs>
                <filter
                  id="f-shadow"
                  x="35.5326"
                  y="0"
                  width="294"
                  height="372"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
                <pattern
                  id="f-lines"
                  patternUnits="userSpaceOnUse"
                  patternTransform="matrix(1370 0 0 40 45.5326 182)"
                  preserveAspectRatio="none"
                  viewBox="0 0 1370 40"
                  width="1"
                  height="1"
                >
                  <rect width="274" height="4" fill="var(--atom-lines)" />
                </pattern>
              </defs>
            </svg>
          </div>

          <!-- ====== BACK: Easter Egg with Cosmic Animations ====== -->
          <div class="face back">
            <svg viewBox="0 0 330 380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Back page (deep blue, tilted) -->
              <rect
                y="29.6"
                width="285.6"
                height="352"
                rx="18"
                transform="rotate(-5.75 0 29.6)"
                fill="#3b52a5"
              />
              <!-- Card face -->
              <g filter="url(#b-shadow)">
                <rect x="45.5" y="10" width="274" height="352" rx="18" fill="#5672CD" />

                <!-- Twinkling Stars -->
                <circle cx="95" cy="55" r="2.2" fill="white" class="star star-1" />
                <circle cx="260" cy="85" r="1.8" fill="white" class="star star-2" />
                <circle cx="80" cy="275" r="2.2" fill="white" class="star star-3" />
                <circle cx="290" cy="295" r="2.4" fill="white" class="star star-1" />
                <circle cx="130" cy="320" r="1.6" fill="white" class="star star-2" />
                <circle cx="255" cy="48" r="1.4" fill="white" class="star star-3" />
                <circle cx="300" cy="195" r="2" fill="white" class="star star-2" />
                <circle cx="70" cy="145" r="1.8" fill="white" class="star star-1" />

                <!-- E = mc² with Quantum Radiance -->
                <text
                  x="182"
                  y="155"
                  text-anchor="middle"
                  font-family="Georgia, 'Times New Roman', serif"
                  font-size="46"
                  font-style="italic"
                  fill="white"
                  class="easter-equation"
                >
                  E = mc²
                </text>

                <!-- Sparkle rays around equation -->
                <line
                  x1="108"
                  y1="114"
                  x2="118"
                  y2="124"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  opacity="0.7"
                  class="star star-2"
                />
                <line
                  x1="254"
                  y1="116"
                  x2="244"
                  y2="126"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  opacity="0.7"
                  class="star star-3"
                />

                <!-- Newton's Red Apple (Animated gravity bounce) -->
                <g class="newton-apple">
                  <circle cx="182" cy="214" r="13" fill="#ef4444" />
                  <!-- Apple leaf & stem -->
                  <path
                    d="M182 201 Q185 194 190 197"
                    stroke="#22c55e"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <!-- Apple highlight -->
                  <ellipse cx="178.5" cy="210.5" rx="3" ry="2" fill="white" opacity="0.6" />
                </g>

                <!-- Gravity vector arrow pulsing downward -->
                <g class="gravity-arrow">
                  <line
                    x1="182"
                    y1="233"
                    x2="182"
                    y2="253"
                    stroke="white"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M175 246 L182 255 L189 246"
                    stroke="white"
                    stroke-width="2.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>

                <!-- Fun text -->
                <text
                  x="182"
                  y="288"
                  text-anchor="middle"
                  font-family="system-ui, -apple-system, sans-serif"
                  font-size="16"
                  font-weight="600"
                  fill="white"
                  opacity="0.95"
                >
                  发现彩蛋！
                </text>
                <text
                  x="182"
                  y="314"
                  text-anchor="middle"
                  font-family="system-ui, -apple-system, sans-serif"
                  font-size="13"
                  fill="white"
                  opacity="0.65"
                >
                  — 万有引力不是苹果的错
                </text>
              </g>

              <defs>
                <filter
                  id="b-shadow"
                  x="35.5"
                  y="0"
                  width="294"
                  height="372"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="bg" />
                  <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="a"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="a" operator="out" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="bg" result="s" />
                  <feBlend in="SourceGraphic" in2="s" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  perspective: 1000px;
  cursor: pointer;
  user-select: none;
}

/* Ambient Anti-gravity levitation */
.levitate-box {
  width: 100%;
  animation: notebook-float 6s ease-in-out infinite;
  will-change: transform;
}

.levitate-box.is-hovered {
  animation-play-state: paused;
}

.tilt-layer {
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out;
  will-change: transform;
}

.flip-card {
  position: relative;
  width: 100%;
  aspect-ratio: 330 / 380;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1);
  will-change: transform;
}

.flip-card.is-flipped {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.face svg {
  display: block;
  width: 100%;
  height: 100%;
  transition: filter 0.35s ease;
}

.back {
  transform: rotateY(180deg);
}

.flip-wrap:hover .front svg,
.flip-wrap:hover .back svg {
  filter: drop-shadow(0 14px 28px rgba(86, 114, 205, 0.35));
}

/* ---- Front Bohr Atom Micro-Animations ---- */
.nucleus-group {
  transform-origin: 182.5px 165px;
}

.nucleus-halo {
  animation: halo-pulse 3s ease-in-out infinite;
  transform-origin: 182.5px 165px;
}

.nucleus-core {
  animation: core-beat 3s ease-in-out infinite;
  transform-origin: 182.5px 165px;
}

.electron-node {
  transform-origin: 182.5px 165px;
  transition: transform 0.3s ease;
}

.electron-1 {
  animation: electron-drift-1 4s ease-in-out infinite alternate;
}

.electron-2 {
  animation: electron-drift-2 4.6s ease-in-out infinite alternate;
}

.electron-3 {
  animation: electron-drift-3 4.2s ease-in-out infinite alternate;
}

.flip-card.active .electron-node {
  filter: drop-shadow(0 0 6px #5672cd);
}

/* ---- Back Face Animations ---- */
.star {
  transform-origin: center;
  animation: star-twinkle 2.5s ease-in-out infinite;
}

.star-1 {
  animation-delay: 0s;
}
.star-2 {
  animation-delay: 0.8s;
}
.star-3 {
  animation-delay: 1.6s;
}

.easter-equation {
  animation: eq-radiance 4s ease-in-out infinite;
}

.newton-apple {
  transform-origin: 182px 214px;
  animation: apple-bounce 2.8s ease-in-out infinite;
}

.gravity-arrow {
  animation: arrow-drop 1.8s ease-in-out infinite;
}

/* ---- Keyframe Animations ---- */
@keyframes notebook-float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(0.4deg);
  }
}

@keyframes halo-pulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.14;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.28;
  }
}

@keyframes core-beat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes electron-drift-1 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-3px, -2px);
  }
}

@keyframes electron-drift-2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(2px, -3px);
  }
}

@keyframes electron-drift-3 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-2px, 3px);
  }
}

@keyframes star-twinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.25);
  }
}

@keyframes eq-radiance {
  0%,
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9));
  }
}

@keyframes apple-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes arrow-drop {
  0% {
    transform: translateY(-2px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(2px);
    opacity: 1;
  }
  100% {
    transform: translateY(6px);
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .flip-wrap {
    max-width: 250px;
  }
}
</style>
