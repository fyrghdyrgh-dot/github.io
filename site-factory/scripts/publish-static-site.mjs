import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { clearCloneDir, requireToken, run, repoUrl } from "./utils.mjs";

export function publishStaticSite({ owner, repo, sourceDir }) {
  requireToken();

  ensureRepo(owner, repo);

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), `${repo}-`));
  const cloneDir = path.join(tempRoot, repo);

  run("git", ["clone", repoUrl(owner, repo), cloneDir], tempRoot);
  clearCloneDir(cloneDir);
  run("bash", ["-lc", `cp -R "${sourceDir}/." "${cloneDir}/"`], tempRoot);
  run("git", ["checkout", "-B", "main"], cloneDir);
  run("git", ["config", "user.name", "TRAE Bot"], cloneDir);
  run("git", ["config", "user.email", "bot@trae.ai"], cloneDir);
  run("git", ["add", "."], cloneDir);

  const status = run("git", ["status", "--short"], cloneDir, true).trim();
  if (status) {
    run("git", ["commit", "-m", `publish ${repo}`], cloneDir);
    run("git", ["push", "-u", "origin", "main"], cloneDir);
  }

  tryEnablePages(owner, repo);

  return {
    repo: `${owner}/${repo}`,
    repo_url: `https://github.com/${owner}/${repo}`,
    site_url: `https://${owner}.github.io/${repo}/`
  };
}

function ensureRepo(owner, repo) {
  try {
    run("gh", ["repo", "view", `${owner}/${repo}`], process.cwd(), true, { GH_TOKEN: process.env.GH_TOKEN });
  } catch {
    run("gh", ["repo", "create", `${owner}/${repo}`, "--public", "--disable-wiki", "--confirm"], process.cwd(), false, {
      GH_TOKEN: process.env.GH_TOKEN
    });
  }
}

function tryEnablePages(owner, repo) {
  const attempts = [
    ["api", "-X", "POST", `repos/${owner}/${repo}/pages`, "-f", "source[branch]=main", "-f", "source[path]=/"],
    ["api", "-X", "PUT", `repos/${owner}/${repo}/pages`, "-f", "source[branch]=main", "-f", "source[path]=/"]
  ];

  for (const args of attempts) {
    try {
      run("gh", args, process.cwd(), true, { GH_TOKEN: process.env.GH_TOKEN });
      return;
    } catch {
      continue;
    }
  }
}
