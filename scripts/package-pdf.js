import { execSync } from "child_process";
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pdfRepoDir = path.resolve(rootDir, "pdf-repo");
const distDir = path.resolve(rootDir, ".vitepress/dist");
const distPdfDir = path.resolve(distDir, "pdf");

async function packagePdfs() {
  if (!fs.existsSync(pdfRepoDir)) {
    console.log("pdf-repo folder does not exist, skipping packaging.");
    return;
  }

  // 1. 扫描 pdf-repo 下的所有独立章节 PDF
  const pdfFiles = await fg(["**/*.pdf"], {
    cwd: pdfRepoDir,
    ignore: ["Physics-Note-Complete.pdf", "Physics-Note-All-PDFs.zip"],
  });

  if (pdfFiles.length === 0) {
    console.log("No chapter PDFs found in pdf-repo.");
    return;
  }

  // 按章节与文件名自然数排序（确保 00 -> 01 -> ... -> 19 完美顺序）
  pdfFiles.sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));

  console.log(`Found ${pdfFiles.length} chapter PDFs. Preparing packaging...`);

  // 2. 尝试合并全书单文件完整版 PDF 并进行 Ghostscript 字体去重与全局流优化
  const completePdfPath = path.join(pdfRepoDir, "Physics-Note-Complete.pdf");
  const tempMergedPdfPath = path.join(pdfRepoDir, "Physics-Note-Complete-temp.pdf");
  try {
    const escapedPaths = pdfFiles.map((f) => `"${path.join(pdfRepoDir, f)}"`);
    console.log("Merging all chapter PDFs...");

    let merged = false;
    try {
      execSync(`pdfunite ${escapedPaths.join(" ")} "${tempMergedPdfPath}"`, { stdio: "inherit" });
      merged = true;
    } catch (e) {
      console.warn("pdfunite execution warning:", e.message);
    }

    let hasGs = false;
    try {
      execSync("gs --version", { stdio: "ignore" });
      hasGs = true;
    } catch {
      hasGs = false;
    }

    if (hasGs) {
      console.log("Applying Ghostscript font deduplication & global stream compression...");
      const inputForGs = merged ? `"${tempMergedPdfPath}"` : escapedPaths.join(" ");
      execSync(
        `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/prepress -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${completePdfPath}" ${inputForGs}`,
        { stdio: "inherit" },
      );
      if (fs.existsSync(tempMergedPdfPath)) {
        fs.unlinkSync(tempMergedPdfPath);
      }
      console.log("✓ Successfully created and optimized Physics-Note-Complete.pdf via Ghostscript");
    } else if (merged) {
      fs.renameSync(tempMergedPdfPath, completePdfPath);
      console.log("✓ Successfully created Physics-Note-Complete.pdf via pdfunite (fallback)");
    }
  } catch (err) {
    console.warn("PDF merge execution warning (will fallback to zip packaging):", err.message);
  }

  // 3. 打包压缩为全套分册 ZIP 归档包
  const zipPath = path.join(pdfRepoDir, "Physics-Note-All-PDFs.zip");
  try {
    console.log("Archiving all PDFs into Physics-Note-All-PDFs.zip...");
    if (process.platform === "win32") {
      // Enumerate files to compress, explicitly excluding the complete PDF and any existing zip
      // to avoid the file-lock deadlock that occurs when PowerShell globs try to read the zip target
      const filesToZip = fs
        .readdirSync(pdfRepoDir, { recursive: true })
        .filter((f) => {
          const name = path.basename(f);
          return (
            !name.startsWith("Physics-Note-Complete") &&
            !name.endsWith(".zip") &&
            fs.statSync(path.join(pdfRepoDir, f)).isFile()
          );
        })
        .map((f) => `'${path.join(pdfRepoDir, f)}'`)
        .join(",");
      if (filesToZip) {
        execSync(
          `powershell -NoProfile -Command "Compress-Archive -Path @(${filesToZip}) -DestinationPath '${zipPath}' -Force"`,
          { stdio: "inherit" },
        );
      }
    } else {
      execSync(
        `cd "${pdfRepoDir}" && zip -r "${zipPath}" . -x "Physics-Note-Complete*.pdf" -x "*.zip"`,
        {
          stdio: "inherit",
        },
      );
    }
    console.log("✓ Successfully created Physics-Note-All-PDFs.zip");
  } catch (err) {
    console.warn("Zip creation warning:", err.message);
  }

  // 4. 将生成的完整版 PDF、ZIP 归档包及各单章节 PDF 复制至 .vitepress/dist/pdf
  // 供 GitHub Pages 静态网站直接托管与高速下载
  fs.mkdirSync(distPdfDir, { recursive: true });

  if (fs.existsSync(completePdfPath)) {
    fs.copyFileSync(completePdfPath, path.join(distPdfDir, "Physics-Note-Complete.pdf"));
  }
  if (fs.existsSync(zipPath)) {
    fs.copyFileSync(zipPath, path.join(distPdfDir, "Physics-Note-All-PDFs.zip"));
  }

  for (const file of pdfFiles) {
    const src = path.join(pdfRepoDir, file);
    const dest = path.join(distPdfDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  console.log("✓ All PDF assets copied to .vitepress/dist/pdf/ for GitHub Pages hosting.");
}

packagePdfs().catch((e) => {
  console.error("Failed to package PDFs:", e);
  process.exit(1);
});
