import path from "node:path";
import { pathToFileURL } from "node:url";

import { projectRoot, readJson } from "./utils.mjs";

const familiesPath = path.join(projectRoot, "data", "families.json");
const topicsPath = path.join(projectRoot, "data", "topic-pool.json");
const policyPath = path.join(projectRoot, "data", "publishing-policy.json");
const registryPath = path.join(projectRoot, "registry", "site-registry.json");

export function selectNextJob() {
  const { families } = readJson(familiesPath);
  const { topics } = readJson(topicsPath);
  const policy = readJson(policyPath);
  const registry = readJson(registryPath);

  const enabledFamilies = families.filter((family) => family.enabled);
  const enabledTopics = topics.filter((topic) => topic.enabled !== false);
  const recentFamilies = registry.recent_usage?.families || [];
  const recentTopics = registry.recent_usage?.topics || [];

  const familyCooldown = policy.repeat_controls?.family_cooldown_runs ?? 3;
  const topicCooldown = policy.repeat_controls?.topic_cooldown_runs ?? 5;

  const familyCandidates = enabledFamilies.filter(
    (family) => !recentFamilies.slice(-familyCooldown).includes(family.id)
  );
  const usableFamilies = familyCandidates.length ? familyCandidates : enabledFamilies;

  const topicCandidates = enabledTopics
    .filter((topic) => !recentTopics.slice(-topicCooldown).includes(topic.id))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const usableTopics = topicCandidates.length ? topicCandidates : enabledTopics;

  for (const topic of usableTopics) {
    for (const familyId of topic.preferred_families || []) {
      const family = usableFamilies.find((item) => item.id === familyId);
      if (!family) continue;

      if (topic.preset_file && family.id === "family-nav") {
        return {
          topic,
          family,
          repo_name: topic.repo_slug,
          site_title: topic.site_title,
          preset_file: path.join(projectRoot, topic.preset_file)
        };
      }
    }
  }

  throw new Error("No available family/topic pair found. Expand topic pool or loosen cooldown rules.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const selection = selectNextJob();
  console.log(JSON.stringify(selection, null, 2));
}
