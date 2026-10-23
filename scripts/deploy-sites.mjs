import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distRoot = path.join(rootDir, "dist");
const manifestPath = path.join(distRoot, "sites-manifest.json");
const configPath = path.join(rootDir, "sites.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const slugFilter = process.argv.find((arg) => arg.startsWith("--slug="))?.split("=")[1];

run("node", [path.join(rootDir, "scripts", "generate-sites.mjs")], rootDir);

if (!existsSync(manifestPath)) {
  throw new Error("Missing dist/sites-manifest.json. Generate step did not complete.");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sites = slugFilter ? manifest.filter((item) => item.slug === slugFilter) : manifest;

if (sites.length === 0) {
  throw new Error(slugFilter ? `No site found for slug "${slugFilter}"` : "No site package found.");
}

if (!hasGh()) {
  exitWithManualSteps("当前环境没有安装 gh CLI，已完成本地代码与工作流，需你在支持 gh 的环境执行部署。");
}

if (!isGhAuthenticated()) {
  exitWithManualSteps("当前环境未登录 GitHub，无法直接创建或更新远程仓库。");
}

const results = [];

for (const site of sites) {
  const repoId = `${config.github.owner}/${site.repo}`;
  const repoUrl = getRepoUrl(repoId);
  ensureRepo(repoId);
  const tempDir = mkdtempSync(path.join(os.tmpdir(), `${site.slug}-`));
  const cloneDir = path.join(tempDir, site.repo);

  run("git", ["clone", repoUrl, cloneDir], tempDir);
  clearCloneDir(cloneDir);
  cpSync(site.outputDir, cloneDir, { recursive: true });
  run("git", ["checkout", "-B", config.github.defaultBranch || "main"], cloneDir);
  configureGitIdentity(cloneDir);
  run("git", ["add", "."], cloneDir);

  const status = run("git", ["status", "--short"], cloneDir, true).trim();
  if (!status) {
    results.push(`${repoId}: no changes`);
    continue;
  }

  run("git", ["commit", "-m", `chore: publish ${site.slug}`], cloneDir);
  run("git", ["push", "-u", "origin", config.github.defaultBranch || "main"], cloneDir);

  const pagesMode = configurePages(repoId);
  results.push(`${repoId}: pushed (${pagesMode})`);
}

console.log(results.join("\n"));

function hasGh() {
  try {
    run("gh", ["--version"], rootDir, true);
    return true;
  } catch {
    return false;
  }
}

function isGhAuthenticated() {
  try {
    run("gh", ["auth", "status"], rootDir, true);
    return true;
  } catch {
    return false;
  }
}

function ensureRepo(repoId) {
  try {
    run("gh", ["repo", "view", repoId], rootDir, true);
  } catch {
    const visibility = config.deployment.public === false ? "--private" : "--public";
    run("gh", ["repo", "create", repoId, visibility, "--disable-wiki", "--confirm"], rootDir);
  }
}

function clearCloneDir(cloneDir) {
  for (const entry of readdirSync(cloneDir)) {
    if (entry === ".git") {
      continue;
    }
    rmSync(path.join(cloneDir, entry), { recursive: true, force: true });
  }
}

function configurePages(repoId) {
  const tries = [
    {
      mode: "actions",
      args: ["api", "-X", "POST", `repos/${repoId}/pages`, "-f", "build_type=workflow"]
    },
    {
      mode: "actions",
      args: ["api", "-X", "PUT", `repos/${repoId}/pages`, "-f", "build_type=workflow"]
    },
    {
      mode: "branch",
      args: [
        "api",
        "-X",
        "POST",
        `repos/${repoId}/pages`,
        "-f",
        "source[branch]=main",
        "-f",
        "source[path]=/"
      ]
    },
    {
      mode: "branch",
      args: [
        "api",
        "-X",
        "PUT",
        `repos/${repoId}/pages`,
        "-f",
        "source[branch]=main",
        "-f",
        "source[path]=/"
      ]
    }
  ];

  for (const attempt of tries) {
    try {
      run("gh", attempt.args, rootDir, true);
      return attempt.mode;
    } catch {
      continue;
    }
  }

  return "manual-pages-check";
}

function getRepoUrl(repoId) {
  if (process.env.GH_TOKEN) {
    return `https://x-access-token:${process.env.GH_TOKEN}@github.com/${repoId}.git`;
  }

  return `https://github.com/${repoId}.git`;
}

function configureGitIdentity(cloneDir) {
  const gitUserName = process.env.GIT_AUTHOR_NAME || "github-actions[bot]";
  const gitUserEmail =
    process.env.GIT_AUTHOR_EMAIL || "41898282+github-actions[bot]@users.noreply.github.com";

  run("git", ["config", "user.name", gitUserName], cloneDir);
  run("git", ["config", "user.email", gitUserEmail], cloneDir);
}

function exitWithManualSteps(reason) {
  console.error(reason);
  console.error("");
  console.error("最少需要你执行的步骤：");
  console.error("1. 在当前仓库根目录运行 gh auth login");
  console.error("2. 运行 npm run deploy");
  console.error("3. 如果要让当前 orchestrator 仓库每 10 分钟自动批量发布，给仓库新增 GH_TOKEN secret 后启用 Actions");
  process.exit(2);
}

function run(command, args, cwd, captureOnly = false) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: captureOnly ? ["ignore", "pipe", "pipe"] : "pipe"
  });
}
