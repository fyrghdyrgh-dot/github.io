import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

export const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

export function run(command, args, cwd, captureOnly = false, extraEnv = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: captureOnly ? ["ignore", "pipe", "pipe"] : "pipe",
    env: { ...process.env, ...extraEnv }
  });
}

export function requireToken() {
  if (!process.env.GH_TOKEN) {
    throw new Error("Missing GH_TOKEN. Export GH_TOKEN before running site-factory.");
  }
}

export function clearCloneDir(cloneDir) {
  for (const entry of readdirSync(cloneDir)) {
    if (entry === ".git") continue;
    rmSync(path.join(cloneDir, entry), { recursive: true, force: true });
  }
}

export function copyDirContents(sourceDir, targetDir) {
  cpSync(sourceDir, targetDir, { recursive: true });
}

export function tempDir(prefix = "site-factory-") {
  return path.join(os.tmpdir(), `${prefix}${Date.now()}`);
}

export function repoUrl(owner, repo) {
  requireToken();
  return `https://x-access-token:${process.env.GH_TOKEN}@github.com/${owner}/${repo}.git`;
}

export function hasPath(filePath) {
  return existsSync(filePath);
}
