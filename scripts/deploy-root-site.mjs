import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "sites.config.json");
const config = JSON.parse(execFileSync("node", ["-e", `process.stdout.write(require('fs').readFileSync('${configPath}','utf8'))`], { encoding: "utf8" }));

const owner = config.github?.owner;
if (!owner) {
  throw new Error("Missing github.owner in sites.config.json");
}

const repoName = `${owner}.github.io`;
const repoId = `${owner}/${repoName}`;
const packageDir = path.join(rootDir, "pages-root");

if (!existsSync(packageDir)) {
  throw new Error("Missing pages-root. Run npm run generate && npm run package:pages first.");
}

ensureGh();
ensureAuth();
ensureRepo(repoId);

const tempDir = mkdtempSync(path.join(os.tmpdir(), "root-pages-"));
const cloneDir = path.join(tempDir, repoName);

run("git", ["clone", `https://github.com/${repoId}.git`, cloneDir], tempDir);
clearCloneDir(cloneDir);
cpSync(packageDir, cloneDir, { recursive: true });
run("git", ["add", "."], cloneDir);

const status = run("git", ["status", "--short"], cloneDir, true).trim();
if (!status) {
  console.log(`${repoId}: no changes`);
  process.exit(0);
}

run("git", ["commit", "-m", "chore: publish root portal"], cloneDir);
run("git", ["push", "-u", "origin", config.github.defaultBranch || "main"], cloneDir);

console.log(`${repoId}: published`);

function ensureGh() {
  run("gh", ["--version"], rootDir, true);
}

function ensureAuth() {
  run("gh", ["auth", "status"], rootDir, true);
}

function ensureRepo(repoIdValue) {
  try {
    run("gh", ["repo", "view", repoIdValue], rootDir, true);
  } catch {
    run("gh", ["repo", "create", repoIdValue, "--public", "--confirm"], rootDir);
  }
}

function clearCloneDir(cloneDirValue) {
  for (const entry of readdirSync(cloneDirValue)) {
    if (entry === ".git") {
      continue;
    }
    rmSync(path.join(cloneDirValue, entry), { recursive: true, force: true });
  }
}

function run(command, args, cwd, captureOnly = false) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: captureOnly ? ["ignore", "pipe", "pipe"] : "pipe"
  });
}
