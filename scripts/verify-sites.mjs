import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "dist", "sites-manifest.json");

if (!existsSync(manifestPath)) {
  console.error("dist/sites-manifest.json 不存在，请先运行 npm run generate");
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
let failed = false;

for (const site of manifest) {
  const requiredFiles = [
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "assets/site.css",
    "assets/site.js",
    ".github/workflows/deploy-pages.yml"
  ];

  for (const relativePath of requiredFiles) {
    const absolutePath = path.join(site.outputDir, relativePath);
    if (!existsSync(absolutePath)) {
      console.error(`[missing] ${site.slug}: ${relativePath}`);
      failed = true;
    }
  }

  const indexHtml = readFileSync(path.join(site.outputDir, "index.html"), "utf8");
  if (!indexHtml.includes("<link rel=\"canonical\"")) {
    console.error(`[seo] ${site.slug}: canonical 缺失`);
    failed = true;
  }

  if (!indexHtml.includes("viewport")) {
    console.error(`[seo] ${site.slug}: viewport 缺失`);
    failed = true;
  }

  if (!indexHtml.includes("./assets/site.js")) {
    console.error(`[asset] ${site.slug}: JS 资源引用缺失`);
    failed = true;
  }

  console.log(`[ok] ${site.slug}: file structure verified`);
}

console.log("");
console.log("远程 Pages 在线验证说明：");
console.log("- 本脚本默认只验证本地产物结构。");
console.log("- 若仓库已发布，可执行: curl -I -L https://用户名.github.io/仓库名/");

if (process.argv.includes("--remote")) {
  console.log("");
  console.log("执行远程状态检查：");
  for (const site of manifest) {
    try {
      const output = execFileSync("curl", ["-I", "-L", "--max-time", "20", site.siteUrl], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
      console.log(`[remote] ${site.siteUrl}`);
      console.log(output.split("\n").slice(0, 5).join("\n"));
    } catch (error) {
      console.error(`[remote-failed] ${site.siteUrl}`);
      console.error(error.stderr || error.message);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}
