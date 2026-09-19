import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

import { configureBracketAndMathPlugin } from "./markdown/bracketAndMathPlugin.ts";
import { configureImageOptimization } from "./markdown/imageOptimization.ts";
import { buildNavItems } from "./siteData/nav.ts";
import { buildSidebarItems } from "./siteData/sidebar.ts";
import { buildTransformHead } from "./siteData/transformHead.ts";
import mapShortUrl from "./theme/components/shortUrl/mapShortUrl.ts";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(configDir, "..");
const siteUrl = "https://english.yunet.cfd";
const siteName = "高考英语语法知识库 - Yulaoshizuikeai's English Note";
const defaultDescription =
  "高中英语语法知识库与高考复习指南，全面覆盖简单句结构、三大从句体系、非谓语动词、动词时态语态、情态与虚拟语气、特殊句式、主谓一致、题型实战以及外研版全七册42单元Using language教材知识清单，助力高考英语提分与句法建构。";
const navItems = buildNavItems(contentRoot);
const sidebarItems = buildSidebarItems(contentRoot);

export default defineConfig({
  base: "/",
  title: siteName,
  description: defaultDescription,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/images/icon.svg" }],
    // 性能：字体本地自托管（public/fonts + theme/style/fonts.css，font-display: swap），
    // 全站零 Google Fonts 外部请求；仅预加载正文字体，其余按需加载。
    [
      "link",
      {
        rel: "preload",
        href: "/fonts/geist-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "",
      },
    ],
    ["link", { rel: "preload", href: "/images/icon.svg", as: "image", type: "image/svg+xml" }],
    // 浏览量统计脚本改为懒加载，这里仅做 DNS 预解析以降低延迟。
    ["link", { rel: "dns-prefetch", href: "//busuanzi.ibruce.info" }],
    ["meta", { name: "author", content: "Yulaoshizuikeai" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "高考英语知识库,高中英语语法,英语语法知识库,外研版英语,Using language,定语从句,名词性从句,状语从句,非谓语动词,虚拟语气,倒装句,语法填空,读后续写,高考英语,Yulaoshizuikeai",
      },
    ],
    ["meta", { name: "theme-color", content: "#4F46E5" }],
    ["meta", { name: "robots", content: "index, follow, max-image-preview:large" }],
    ["meta", { property: "og:site_name", content: siteName }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:image", content: `${siteUrl}/images/og-image.png` }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: `${siteUrl}/images/og-image.png` }],
    ["meta", { name: "twitter:title", content: siteName }],
    ["meta", { name: "twitter:description", content: defaultDescription }],
    // 搜索引擎站长平台所有权验证（HTML 标签验证与 public 静态文件双重兜底）
    [
      "meta",
      { name: "google-site-verification", content: "0NrFOzhaskGGSNw5Yj76G5-7HbJawGkKNtknQ7t0tPE" },
    ],
    [
      "meta",
      { name: "google-site-verification", content: "Vqz-Z3qwemNKwFr8z_n5K_60USIw5dVPWjD10xl1abg" },
    ],
    [
      "script",
      {},
      `;(() => {
        try {
          const settings = JSON.parse(localStorage.getItem("cc-site-settings") || "{}");
          const root = document.documentElement;
          root.classList.toggle("cc-hide-contributors", settings.showContributors === false);
          root.classList.toggle("cc-hide-outline", settings.showOutline === false);
          root.classList.toggle("cc-hide-comments", settings.showComments === false);
          root.classList.toggle("cc-font-serif", settings.fontFamily === "serif");
        } catch {}
      })();`,
    ],
  ],
  themeConfig: {
    logo: "/images/icon.svg",
    siteTitle: "高考英语语法知识库",
    nav: navItems,
    sidebar: { "/": sidebarItems },
    socialLinks: [
      { icon: "github", link: "https://github.com/yulaoshizuikeai/English-Note" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        },
        link: "mailto:imharlanyu@gmail.com",
        ariaLabel: "邮件勘误与交流反馈 (imharlanyu@gmail.com)",
      },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    sidebarMenuLabel: "目录",
    returnToTopLabel: "返回顶部",
    darkModeSwitchLabel: "深浅外观",
    lastUpdated: {
      text: "最后更新",
    },
    editLink: {
      pattern: "https://github.com/yulaoshizuikeai/English-Note/edit/master/:path",
      text: "在 GitHub 上查看此页",
    },
    footer: {
      message: "高中英语语法知识库与高考复习指南",
      copyright: "Copyright © 2026 Yulaoshizuikeai",
    },
  },
  markdown: {
    math: true,
    config: (md) => {
      configureImageOptimization(md);
      configureBracketAndMathPlugin(md);
    },
  },
  vite: {
    build: {
      // 公式页 inline MathJax SVG 本来就大（如 golden-conclusions.md 聚合 50 个高频公式约 1.3MB 属正常），
      // 阈值放宽避免 Rolldown 构建噪音；传输体积由 Cloudflare 边缘 Brotli + 长缓存解决，见 public/_headers。
      chunkSizeWarningLimit: 1400,
    },
  },
  rewrites: {
    "hidePage/shortUrl.md": "s.md",
  },
  srcExclude: [
    "README.md",
    "AGENTS.md",
    "PROJECT.md",
    "TEST_INFRA.md",
    "TEST_READY.md",
    "design.md",
    "scripts/**",
    "pdf-repo/**",
    "pdf-repo-single/**",
  ],
  transformHead: buildTransformHead(siteUrl, siteName, defaultDescription),
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items.filter((item) => {
        // VitePress 生成的 item.url 不带前导斜杠（如 "s.html"），需规范化后再匹配
        const url = `/${item.url}`;
        // 排除 404、短链跳转页及任何内部隐藏页面（精确/边界匹配，避免误杀含 s 子串的正常路径）
        if (
          url === "/404.html" ||
          url.startsWith("/404/") ||
          url === "/s.html" ||
          url.startsWith("/s.html?") ||
          url.startsWith("/s/") ||
          url.includes("/hidePage/")
        ) {
          return false;
        }
        return true;
      });
    },
  },

  // 生成哈希 - 路径对应表
  buildEnd: (siteConfig) => {
    mapShortUrl(siteConfig);
  },
});
