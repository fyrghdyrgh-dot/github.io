import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "pages-root");

const requiredRootFiles = ["index.html", "404.html", "robots.txt", "sitemap.xml", ".nojekyll"];
const requiredRootDirs = ["assets"];

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const fileName of requiredRootFiles) {
  const sourcePath = path.join(rootDir, fileName);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required file: ${fileName}. Run npm run generate first.`);
  }
  cpSync(sourcePath, path.join(outputDir, fileName));
}

for (const dirName of requiredRootDirs) {
  const sourcePath = path.join(rootDir, dirName);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required dir: ${dirName}. Run npm run generate first.`);
  }
  cpSync(sourcePath, path.join(outputDir, dirName), { recursive: true });
}

for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }
  if (entry.name.startsWith(".")) {
    continue;
  }
  if (["assets", "dist", "scripts", "pages-root", "node_modules", "tmp"].includes(entry.name)) {
    continue;
  }

  const sourcePath = path.join(rootDir, entry.name);
  const indexPath = path.join(sourcePath, "index.html");
  if (!existsSync(indexPath)) {
    continue;
  }

  cpSync(sourcePath, path.join(outputDir, entry.name), { recursive: true });
}

console.log(`Prepared GitHub Pages root package at ${outputDir}`);
