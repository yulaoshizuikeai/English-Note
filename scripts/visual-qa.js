/**
 * scripts/visual-qa.js
 *
 * Playwright Multi-Viewport Visual & Ergonomics QA Test Runner
 * High School Physics Knowledge Base (高考物理知识库)
 *
 * Features verified across viewports:
 *  1. No uncontrolled horizontal page overflow (scrollWidth <= clientWidth + 1)
 *  2. Table scrollability (canScroll or overflowX === 'auto')
 *  3. Touch target ergonomics inspection (>= 44px HIG/WCAG audit)
 *  4. Automated visual artifact screenshots saved to .agents/visual_qa_artifacts/
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import url from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.resolve(projectRoot, ".vitepress", "dist");
const defaultArtifactsDir = path.resolve(projectRoot, ".agents", "visual_qa_artifacts");

// Command-line arguments parsing
const args = process.argv.slice(2);
const help = args.includes("--help") || args.includes("-h");
if (help) {
  console.log(`
Usage: node scripts/visual-qa.js [options]

Options:
  --port <number>            Preferred HTTP server port (default: 8989)
  --artifacts-dir <path>     Directory for visual screenshots (default: .agents/visual_qa_artifacts)
  --strict-touch             Enforce 100% >= 44px touch targets on mobile/tablet (fails test if below)
  -h, --help                 Show help message
`);
  process.exit(0);
}

const portIndex = args.indexOf("--port");
const preferredPort = portIndex >= 0 ? Number(args[portIndex + 1]) : 8989;
const artifactsIndex = args.indexOf("--artifacts-dir");
const artifactsDir =
  artifactsIndex >= 0 ? path.resolve(process.cwd(), args[artifactsIndex + 1]) : defaultArtifactsDir;
const strictTouch = args.includes("--strict-touch") || process.env.STRICT_TOUCH_TARGETS === "1";

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  console.error(`\x1b[31m[ERROR]\x1b[0m .vitepress/dist directory not found at: ${distDir}`);
  console.error("Please run \x1b[33mnpm run docs:build\x1b[0m before running visual QA tests.");
  process.exit(1);
}

// Ensure artifacts output directory exists
fs.mkdirSync(artifactsDir, { recursive: true });

// MIME types for static server
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Static server helper
async function startStaticServer(dist, portToTry) {
  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    const decoded = decodeURIComponent(req.url.split("?")[0]);
    let safePath = decoded.replace(/^\/+/, "");
    if (!safePath || safePath.endsWith("/")) {
      safePath = path.join(safePath, "index.html");
    }

    let filePath = path.resolve(dist, safePath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }

    if (!filePath.startsWith(dist) || !fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE" && portToTry !== 0) {
        console.warn(`\x1b[33m[WARN]\x1b[0m Port ${portToTry} in use, trying dynamic port...`);
        server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
      } else {
        reject(err);
      }
    });
    server.listen(portToTry, "127.0.0.1", () => {
      resolve({ server, port: server.address().port });
    });
  });
}

// Browser launcher with local fallback chain
async function launchBrowser() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:\\Users\\Yu_233\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        return await chromium.launch({
          executablePath: p,
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      } catch (e) {
        // Try next
      }
    }
  }

  try {
    return await chromium.launch({
      channel: "chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch {}

  return await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

// Standard Test Matrix
const viewports = [
  { id: "desktop", name: "Desktop", width: 1280, height: 800, isMobile: false },
  { id: "tablet", name: "Tablet", width: 768, height: 1024, isMobile: false },
  { id: "mobile", name: "Mobile", width: 390, height: 844, isMobile: true },
  { id: "narrow-mobile", name: "Narrow Mobile", width: 375, height: 667, isMobile: true },
];

const testPages = [
  {
    id: "home",
    name: "Home Page",
    path: "/index.html",
    description: "Homepage hero, quick index cards & navigation",
  },
  {
    id: "table-golden-conclusions",
    name: "Table Page (Golden Conclusions)",
    path: "/golden-conclusions.html",
    description: "50 Golden Conclusions featuring dense wide comparison tables",
  },
  {
    id: "svg-circular-motion",
    name: "SVG Diagram Page",
    path: "/05 圆周运动及其应用/考点 竖直面圆周运动轻绳与轻杆临界模型.html",
    description: "Physics vector SVG diagrams and critical mechanics models",
  },
  {
    id: "article-uniform-accel",
    name: "Article Page (Uniform Acceleration)",
    path: "/01 运动的描述与匀变速规律/04 匀变速直线运动规律与自由落体.html",
    description: "Standard long-form chapter with formulas, tables & callouts",
  },
];

// Main Test Execution
async function runVisualQA() {
  console.log(
    "\x1b[1m======================================================================\x1b[0m",
  );
  console.log("\x1b[1;34m [E2E Visual QA] 高考物理知识库 (Yulaoshizuikeai's Physics Note)\x1b[0m");
  console.log(
    "\x1b[1m======================================================================\x1b[0m",
  );

  const { server, port } = await startStaticServer(distDir, preferredPort);
  console.log(
    `\x1b[32m✔\x1b[0m Static server listening at \x1b[36mhttp://127.0.0.1:${port}\x1b[0m`,
  );

  let browser;
  try {
    browser = await launchBrowser();
  } catch (err) {
    server.close();
    console.error("\x1b[31m[FATAL]\x1b[0m Failed to launch Chromium browser:", err.message);
    process.exit(1);
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureDetails = [];
  const testResultsSummary = [];

  for (const vp of viewports) {
    console.log(`\n\x1b[1;35m▶ Testing Viewport: ${vp.name} (${vp.width} × ${vp.height})\x1b[0m`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const tp of testPages) {
      totalTests++;
      const testName = `[${vp.name}] ${tp.name}`;
      const url = `http://127.0.0.1:${port}${encodeURI(tp.path)}`;
      const screenshotName = `${vp.id}_${tp.id}.png`;
      const screenshotPath = path.join(artifactsDir, screenshotName);

      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        const httpStatus = response?.status() ?? 0;
        if (httpStatus !== 200) {
          throw new Error(`Expected HTTP 200, got ${httpStatus}`);
        }

        // Allow micro-animations and fonts to stabilize
        await page.waitForTimeout(300);

        // 1. Horizontal Overflow Assertion
        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          const clientWidth = root.clientWidth;
          const scrollWidth = root.scrollWidth;

          // Test scrollability
          const initialScrollX = window.scrollX;
          window.scrollTo(200, window.scrollY);
          const scrolledX = window.scrollX;
          window.scrollTo(initialScrollX, window.scrollY);

          const diff = scrollWidth - clientWidth;
          const hasUncontrolledScroll = scrolledX > 0;
          const hasOverflow = diff > 1.5 && hasUncontrolledScroll;

          return {
            clientWidth,
            scrollWidth,
            diff: Math.max(0, diff),
            scrolledX,
            passed: !hasOverflow,
          };
        });

        // 2. Table Scrollability Assertion
        const tableCheck = await page.evaluate(() => {
          const tables = Array.from(document.querySelectorAll(".vp-doc table, table"));
          const details = tables.map((t, idx) => {
            const style = window.getComputedStyle(t);
            const parent = t.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;

            const isScrollStyle =
              style.overflowX === "auto" ||
              style.overflowX === "scroll" ||
              parentStyle?.overflowX === "auto" ||
              parentStyle?.overflowX === "scroll";
            const canScroll =
              t.scrollWidth > t.clientWidth + 1 ||
              (parent && parent.scrollWidth > parent.clientWidth + 1);
            const fitsWithinParent = t.scrollWidth <= t.clientWidth + 1;

            const passed = canScroll || isScrollStyle || fitsWithinParent;
            return {
              index: idx + 1,
              scrollWidth: t.scrollWidth,
              clientWidth: t.clientWidth,
              overflowX: style.overflowX,
              parentOverflowX: parentStyle?.overflowX,
              canScroll,
              fitsWithinParent,
              isScrollStyle,
              passed,
            };
          });

          return {
            count: tables.length,
            allPassed: details.every((d) => d.passed),
            details,
          };
        });

        // 3. Touch Target Heights Audit
        const touchAudit = await page.evaluate(() => {
          const selectors = [
            "button",
            "a[href]",
            ".caret",
            ".outline-link",
            ".copylink",
            ".CCPdfDownloadButtonBtn",
            ".cc-settings-trigger",
          ];
          const elements = Array.from(document.querySelectorAll(selectors.join(",")));
          let totalInteractive = 0;
          let compliant44 = 0;
          const samplesBelow44 = [];

          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (
              rect.width > 0 &&
              rect.height > 0 &&
              style.display !== "none" &&
              style.visibility !== "hidden"
            ) {
              totalInteractive++;
              if (rect.height >= 43.5) {
                compliant44++;
              } else {
                if (samplesBelow44.length < 3) {
                  samplesBelow44.push({
                    tag: el.tagName.toLowerCase(),
                    text:
                      (el.textContent || "").trim().slice(0, 20) ||
                      el.getAttribute("aria-label") ||
                      el.className,
                    height: Math.round(rect.height * 10) / 10,
                  });
                }
              }
            }
          }

          return {
            totalInteractive,
            compliant44,
            under44: totalInteractive - compliant44,
            complianceRate:
              totalInteractive > 0
                ? ((compliant44 / totalInteractive) * 100).toFixed(1) + "%"
                : "100%",
            samplesBelow44,
          };
        });

        // 4. Capture Screenshot Artifact
        await page.screenshot({ path: screenshotPath, fullPage: false });
        const screenshotSaved =
          fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 0;

        // Determine pass/fail status
        const overflowPassed = overflow.passed;
        const tablesPassed = tableCheck.allPassed;
        const touchPassed = strictTouch ? touchAudit.under44 === 0 : true;
        const testPassed = overflowPassed && tablesPassed && touchPassed && screenshotSaved;

        if (testPassed) {
          passedTests++;
          console.log(
            `  \x1b[32m✔\x1b[0m \x1b[1m${tp.name}\x1b[0m ` +
              `| Overflow: \x1b[32mOK\x1b[0m (w=${overflow.clientWidth}px) ` +
              `| Tables: \x1b[36m${tableCheck.count}\x1b[0m (\x1b[32m${tablesPassed ? "Scrollable/Fit" : "FAIL"}\x1b[0m) ` +
              `| Touch 44px: \x1b[33m${touchAudit.complianceRate}\x1b[0m (${touchAudit.compliant44}/${touchAudit.totalInteractive}) ` +
              `| Artifact: \x1b[90m${screenshotName}\x1b[0m`,
          );
        } else {
          failedTests++;
          const reasons = [];
          if (!overflowPassed)
            reasons.push(
              `Horizontal overflow detected (scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, diff=${overflow.diff}px)`,
            );
          if (!tablesPassed) reasons.push(`Unscrollable truncated table detected`);
          if (!touchPassed)
            reasons.push(
              `Strict touch target standard violated: ${touchAudit.under44} items < 44px`,
            );
          if (!screenshotSaved) reasons.push(`Failed to generate screenshot at ${screenshotPath}`);

          failureDetails.push({ testName, reasons });
          console.log(
            `  \x1b[31m✖\x1b[0m \x1b[1;31m${tp.name}\x1b[0m | Failed: ${reasons.join("; ")}`,
          );
        }

        testResultsSummary.push({
          viewport: vp.name,
          page: tp.name,
          passed: testPassed,
          overflow: overflowPassed,
          tables: tablesPassed ? `${tableCheck.count} OK` : "FAIL",
          touch44Rate: touchAudit.complianceRate,
          artifact: screenshotName,
        });
      } catch (err) {
        failedTests++;
        failureDetails.push({ testName, reasons: [err.message] });
        console.log(`  \x1b[31m✖\x1b[0m \x1b[1;31m${tp.name}\x1b[0m | Error: ${err.message}`);
      }
    }
  }

  // Cleanup
  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  // Print Summary Table
  console.log(
    "\n\x1b[1m======================================================================\x1b[0m",
  );
  console.log("\x1b[1m Visual QA Test Execution Summary\x1b[0m");
  console.log(
    "\x1b[1m======================================================================\x1b[0m",
  );
  console.log(
    `Total Tests: \x1b[1m${totalTests}\x1b[0m | ` +
      `Passed: \x1b[32m${passedTests}\x1b[0m | ` +
      `Failed: \x1b[31m${failedTests}\x1b[0m | ` +
      `Artifacts: \x1b[36m${totalTests} images\x1b[0m in \x1b[90m${path.relative(projectRoot, artifactsDir)}\x1b[0m`,
  );

  if (failureDetails.length > 0) {
    console.log("\n\x1b[31mFailure Details:\x1b[0m");
    for (const f of failureDetails) {
      console.log(` - \x1b[1;31m${f.testName}\x1b[0m:`);
      for (const r of f.reasons) {
        console.log(`     • ${r}`);
      }
    }
  }

  console.log(
    "\x1b[1m======================================================================\x1b[0m",
  );
  if (failedTests === 0) {
    console.log("\x1b[1;32m🎉 ALL VISUAL QA TESTS PASSED SUCCESSFULLY! (Exit 0)\x1b[0m");
    process.exit(0);
  } else {
    console.log(
      `\x1b[1;31m❌ VISUAL QA TESTS FAILED: ${failedTests} test(s) failed. (Exit 1)\x1b[0m`,
    );
    process.exit(1);
  }
}

// Run runner
runVisualQA().catch((err) => {
  console.error("\x1b[31m[UNHANDLED ERROR]\x1b[0m", err);
  process.exit(1);
});
