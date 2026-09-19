import type { App } from "vue";

import DefaultTheme from "vitepress/theme";
import { defineAsyncComponent } from "vue";

import CCActivitySparkline from "./components/CCActivitySparkline.vue";
import CCBackToTop from "./components/CCBackToTop.vue";
import CCBentoGrid from "./components/CCBentoGrid.vue";
import CCChapterOverview from "./components/CCChapterOverview.vue";
import CCDailyQuote from "./components/CCDailyQuote.vue";
import CCErrata from "./components/CCErrata.vue";
import CCHomeIndex from "./components/CCHomeIndex.vue";
import CCPdfDownloadButton from "./components/CCPdfDownloadButton.vue";
import CCSiteSettings from "./components/CCSiteSettings.vue";
import "./style/index.css";
import "./custom.css";
import CCJumper from "./components/shortUrl/CCJumper.vue";
import CCShare from "./components/shortUrl/CCShare.vue";
import layout from "./layout.vue";

// 重型交互组件异步拆包：平时只在 /interactive 用到，不再打进全站 theme.js。
// Vite 会将其拆为独立 chunk，仅访问交互页时才下载（大陆弱网下首屏省约 100KB+ 解析）。
const CCInteractiveLab = defineAsyncComponent(
  () => import("./components/interactive/CCInteractiveLab.vue"),
);
const CCKnowledgeGraph = defineAsyncComponent(
  () => import("./components/interactive/CCKnowledgeGraph.vue"),
);
const CCPhysicsSimulator = defineAsyncComponent(
  () => import("./components/interactive/CCPhysicsSimulator.vue"),
);

export default {
  extends: DefaultTheme,
  Layout: layout,
  enhanceApp({ app }: { app: App }) {
    app.component("CCPdfDownloadButton", CCPdfDownloadButton);
    app.component("CCBackToTop", CCBackToTop);
    app.component("CCErrata", CCErrata);
    app.component("CCSiteSettings", CCSiteSettings);
    app.component("CCJumper", CCJumper);
    app.component("CCShare", CCShare);
    app.component("CCChapterOverview", CCChapterOverview);
    app.component("CCBentoGrid", CCBentoGrid);
    app.component("CCActivitySparkline", CCActivitySparkline);
    app.component("CCDailyQuote", CCDailyQuote);
    app.component("CCHomeIndex", CCHomeIndex);
    app.component("CCPhysicsSimulator", CCPhysicsSimulator);
    app.component("CCInteractiveLab", CCInteractiveLab);
    app.component("CCKnowledgeGraph", CCKnowledgeGraph);
  },
};
