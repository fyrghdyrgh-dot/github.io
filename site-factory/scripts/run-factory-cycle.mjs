import path from "node:path";
import { execFileSync } from "node:child_process";

import { selectNextJob } from "./select-next-job.mjs";
import { publishStaticSite } from "./publish-static-site.mjs";
import { ensureDir, projectRoot, readJson, writeJson } from "./utils.mjs";

const job = selectNextJob();
const policy = readJson(path.join(projectRoot, "data", "publishing-policy.json"));
const registryPath = path.join(projectRoot, "registry", "site-registry.json");
const registry = readJson(registryPath);

const buildDir = path.join(projectRoot, "build", job.repo_name);
ensureDir(path.dirname(buildDir));

runGenerator(job.preset_file, buildDir);

const published = publishStaticSite({
  owner: policy.publishing.owner,
  repo: job.repo_name,
  sourceDir: buildDir
});

updateRegistry(registry, job, published);
writeJson(registryPath, registry);

console.log(
  JSON.stringify(
    {
      site_title: job.site_title,
      family: job.family.id,
      repo: published.repo,
      repo_url: published.repo_url,
      site_url: published.site_url,
      status: "published"
    },
    null,
    2
  )
);

function runGenerator(presetFile, outputDir) {
  const generatorPath = path.join(projectRoot, "templates", "family-nav", "build-site.mjs");
  execFileSync("node", [generatorPath], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "inherit",
    env: {
      ...process.env,
      ROOT_SITE_CONFIG: presetFile,
      ROOT_SITE_OUTPUT_DIR: outputDir
    }
  });
}

function updateRegistry(registryData, jobData, publishedData) {
  const now = new Date().toISOString();
  registryData.generated_at = now;
  registryData.sites.push({
    site_id: `${jobData.repo_name}-${Date.now()}`,
    title: jobData.site_title,
    family: jobData.family.id,
    topic_id: jobData.topic.id,
    repo: publishedData.repo,
    url: publishedData.site_url,
    published_at: now,
    keywords: jobData.topic.keywords,
    server_target_used: jobData.topic.allow_server_target
  });
  registryData.recent_usage.families.push(jobData.family.id);
  registryData.recent_usage.topics.push(jobData.topic.id);
  registryData.recent_usage.repo_names.push(jobData.repo_name);
}
