import type { DefaultTheme } from "vitepress";

import fs from "node:fs";
import path from "node:path";

const sectionDirPattern = /^\d{2}\s/;
const ignoredRootDirs = new Set([
  ".vitepress",
  "node_modules",
  "public",
  "data",
  "hidePage",
  "PDF文件",
]);

export const encodeLink = (link: string): string => encodeURI(link);

export const getSections = (rootDir: string): string[] =>
  fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        sectionDirPattern.test(dirent.name) &&
        !ignoredRootDirs.has(dirent.name),
    )
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

export const getSectionFiles = (sectionPath: string, sectionName?: string): string[] => {
  const files = fs
    .readdirSync(sectionPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
    .map((dirent) => dirent.name);

  // Special explicit ordering for '00 说明': Readme first, 错误反馈 last
  if (sectionName && /^00\s/.test(sectionName)) {
    const pinFirst = "Readme.md";
    const pinLast = "错误反馈.md";
    const middle = files
      .filter((f) => f !== pinFirst && f !== pinLast)
      .sort((a, b) => a.localeCompare(b, "zh-CN"));
    const result: string[] = [];
    if (files.includes(pinFirst)) result.push(pinFirst);
    result.push(...middle);
    if (files.includes(pinLast)) result.push(pinLast);
    return result;
  }

  return files.sort((a, b) => a.localeCompare(b, "zh-CN"));
};

// Build sidebar from numbered top-level folders and their markdown files.
export const buildSidebarItems = (rootDir: string): DefaultTheme.SidebarItem[] => {
  const sections = getSections(rootDir);

  const sectionItems: DefaultTheme.SidebarItem[] = sections.map((sectionName) => {
    const sectionPath = path.join(rootDir, sectionName);
    const files = getSectionFiles(sectionPath, sectionName).filter(
      (name) => name.toLowerCase() !== "index.md",
    );

    const items: DefaultTheme.SidebarItem[] = files.map((filename) => {
      const name = filename.slice(0, -3);
      return {
        text: name,
        link: encodeLink(`/${sectionName}/${name}`),
      };
    });

    return {
      text: sectionName,
      link: encodeLink(`/${sectionName}/index`),
      items,
      collapsed: true,
    };
  });

  const specialItem: DefaultTheme.SidebarItem = {
    text: "考前速查与排雷",
    items: [
      { text: "50 大核心句法公式与速记", link: "/golden-conclusions" },
      { text: "全专题语法防踩坑排雷清单", link: "/warning-cheatsheet" },
    ],
    collapsed: false,
  };

  return [specialItem, ...sectionItems];
};
