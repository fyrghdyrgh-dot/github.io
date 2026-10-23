import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const manifestPath = path.join(distDir, "sites-manifest.json");
const configPath = path.join(rootDir, "sites.config.json");

if (!existsSync(manifestPath)) {
  throw new Error("Missing dist/sites-manifest.json. Run the generate step first.");
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const siteMap = new Map(config.sites.map((site) => [site.slug, site]));
const portal = config.portal || {};
const portalUrl = `https://${config.github.owner}.github.io/`;
const assetsDir = path.join(rootDir, "assets");

mkdirSync(assetsDir, { recursive: true });

writeFileSync(path.join(rootDir, "index.html"), renderPortalHtml(), "utf8");
writeFileSync(path.join(rootDir, "404.html"), renderPortal404(), "utf8");
writeFileSync(path.join(rootDir, "robots.txt"), renderPortalRobots(), "utf8");
writeFileSync(path.join(rootDir, "sitemap.xml"), renderPortalSitemap(), "utf8");
writeFileSync(path.join(rootDir, ".nojekyll"), "", "utf8");
writeFileSync(path.join(assetsDir, "portal.css"), renderPortalCss(), "utf8");
writeFileSync(path.join(assetsDir, "portal.js"), renderPortalJs(), "utf8");

for (const site of manifest) {
  const targetDir = path.join(rootDir, site.slug);
  rmSync(targetDir, { recursive: true, force: true });
  cpSync(site.outputDir, targetDir, { recursive: true });
}

console.log(`Exported root portal and ${manifest.length} site folder(s) into ${rootDir}`);

function getDirectoryData() {
  return manifest.map((site) => {
    const source = siteMap.get(site.slug) || {};
    return {
      slug: site.slug,
      name: site.name,
      topic: source.topic || site.category,
      description: source.description || "",
      tagline: source.tagline || source.description || "",
      category: source.category || site.category,
      directoryGroup: source.directoryGroup || deriveGroup(source),
      referenceStyle: source.referenceStyle || "",
      href: `./${site.slug}/`,
      siteUrl: `${portalUrl}${site.slug}/`
    };
  });
}

function getGroups() {
  const grouped = new Map();
  for (const site of getDirectoryData()) {
    if (!grouped.has(site.directoryGroup)) {
      grouped.set(site.directoryGroup, []);
    }
    grouped.get(site.directoryGroup).push(site);
  }

  const orderedGroups = portal.featuredGroups || [...grouped.keys()];
  const result = [];
  for (const group of orderedGroups) {
    if (grouped.has(group)) {
      result.push([group, grouped.get(group)]);
      grouped.delete(group);
    }
  }

  for (const entry of grouped.entries()) {
    result.push(entry);
  }

  return result;
}

function deriveGroup(site) {
  if (site.category === "server-lead") {
    return "服务器与部署";
  }
  return "开发与效率";
}

function renderPortalHtml() {
  const allSites = getDirectoryData();
  const groups = getGroups();
  const serverCount = allSites.filter((site) => site.category === "server-lead").length;
  const toolCount = allSites.length - serverCount;
  const title = `${portal.name || "网站导航"} - ${portal.tagline || "中文资源目录"}`;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(portal.description || "")}">
  <meta name="theme-color" content="#5b7cff">
  <link rel="canonical" href="${portalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(portal.name || "网站导航")}">
  <meta property="og:description" content="${escapeHtml(portal.description || "")}">
  <meta property="og:url" content="${portalUrl}">
  <meta property="og:locale" content="zh_CN">
  <link rel="stylesheet" href="./assets/portal.css">
</head>
<body>
  <header class="site-shell hero">
    <nav class="nav">
      <a class="brand" href="./">${escapeHtml(portal.name || "网站导航")}</a>
      <div class="nav-links">
        <a href="#directory">网站目录</a>
        <a href="#groups">分类浏览</a>
      </div>
    </nav>
    <section class="hero-grid">
      <div>
        <p class="eyebrow">WEBSITE DIRECTORY</p>
        <h1>${escapeHtml(portal.tagline || "中文工具与资源，一站直达。")}</h1>
        <p class="lead">${escapeHtml(portal.description || "")}</p>
        <div class="cta-row">
          <a class="button" href="#directory">浏览全部网站</a>
          <a class="button button-ghost" href="#groups">按分类查看</a>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="stat-grid">
          <article class="stat-card">
            <strong>${allSites.length}</strong>
            <span>个子目录网站</span>
          </article>
          <article class="stat-card">
            <strong>${groups.length}</strong>
            <span>个主题分类</span>
          </article>
          <article class="stat-card">
            <strong>${serverCount}</strong>
            <span>个服务器站</span>
          </article>
          <article class="stat-card">
            <strong>${toolCount}</strong>
            <span>个工具站</span>
          </article>
        </div>
      </aside>
    </section>
  </header>

  <main class="site-shell">
    <section class="section toolbar-section" id="directory">
      <div class="section-head">
        <p class="eyebrow">目录筛选</p>
        <h2>全部网站</h2>
        <p id="resultCount">显示 ${allSites.length} / ${allSites.length} 个网站</p>
      </div>
      <div class="toolbar">
        <input id="siteSearch" type="search" placeholder="搜索站点名称、主题或描述">
        <div class="chip-row">
          <button class="chip is-active" type="button" data-filter="全部">全部</button>
          ${groups.map(([group]) => `<button class="chip" type="button" data-filter="${escapeHtml(group)}">${escapeHtml(group)}</button>`).join("")}
        </div>
      </div>
    </section>

    <div class="group-list" id="groups">
      ${groups.map(([group, sites]) => renderGroupSection(group, sites)).join("")}
    </div>
  </main>

  <footer class="site-shell footer">
    <p>${escapeHtml(portal.name || "网站导航")} · 根域名入口</p>
    <p>当前地址：<a href="${portalUrl}">${portalUrl}</a></p>
  </footer>

  <script>window.__PORTAL_DATA__ = ${JSON.stringify({ groups: groups.map(([group]) => group), sites: allSites })};</script>
  <script type="module" src="./assets/portal.js"></script>
</body>
</html>`;
}

function renderGroupSection(group, sites) {
  return `<section class="section group-section" data-group-section="${escapeHtml(group)}">
    <div class="section-head">
      <p class="eyebrow">分类目录</p>
      <h2>${escapeHtml(group)}</h2>
      <p>${sites.length} 个网站</p>
    </div>
    <div class="card-grid">
      ${sites.map((site) => renderSiteCard(site)).join("")}
    </div>
  </section>`;
}

function renderSiteCard(site) {
  const searchText = `${site.name} ${site.topic} ${site.description} ${site.tagline} ${site.directoryGroup}`.toLowerCase();
  return `<article class="site-card" data-site-card data-group="${escapeHtml(site.directoryGroup)}" data-search="${escapeHtml(searchText)}">
    <div class="card-top">
      <span class="badge">${escapeHtml(site.referenceStyle || site.directoryGroup)}</span>
      <a class="jump-link" href="${site.href}">${escapeHtml(site.slug)}/</a>
    </div>
    <h3><a href="${site.href}">${escapeHtml(site.name)}</a></h3>
    <p class="topic">${escapeHtml(site.topic)}</p>
    <p>${escapeHtml(site.description)}</p>
    <div class="card-actions">
      <a class="text-link" href="${site.href}">进入子目录</a>
      <a class="text-link text-link-soft" href="${site.siteUrl}">完整地址</a>
    </div>
  </article>`;
}

function renderPortal404() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(portal.name || "网站导航")} - 页面未找到</title>
  <link rel="stylesheet" href="./assets/portal.css">
</head>
<body>
  <main class="site-shell empty-state">
    <div class="site-card solo-card">
      <p class="eyebrow">404</p>
      <h1>页面暂时不存在</h1>
      <p>你可以返回首页继续浏览网站目录，或直接进入已有子目录站点。</p>
      <a class="button" href="./">返回首页</a>
    </div>
  </main>
</body>
</html>`;
}

function renderPortalRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${portalUrl}sitemap.xml
`;
}

function renderPortalSitemap() {
  const entries = [
    `  <url>\n    <loc>${portalUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...getDirectoryData().map((site) => `  <url>\n    <loc>${site.siteUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

function renderPortalCss() {
  return `:root {
  --bg: #09111f;
  --bg-soft: #111d34;
  --panel: rgba(10, 18, 32, 0.86);
  --line: rgba(148, 163, 184, 0.18);
  --text: #ecf3ff;
  --muted: #98a8c5;
  --accent: #5b7cff;
  --accent-soft: #dde5ff;
  --shadow: 0 20px 44px rgba(2, 6, 23, 0.32);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(91, 124, 255, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 24%),
    linear-gradient(180deg, var(--bg), var(--bg-soft));
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.hero {
  padding: 24px 0 40px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
}

.brand {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: var(--muted);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 20px;
  align-items: stretch;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.05;
  margin-bottom: 16px;
}

h2,
h3 {
  line-height: 1.15;
}

.lead {
  max-width: 760px;
  font-size: clamp(18px, 2.5vw, 24px);
  color: #f7fbff;
}

.cta-row,
.chip-row,
.card-actions,
.stat-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-row {
  margin-top: 24px;
}

.button,
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  font: inherit;
}

.button {
  background: var(--accent);
  color: white;
  font-weight: 700;
  box-shadow: var(--shadow);
}

.button-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.14);
  color: var(--text);
}

.hero-panel,
.site-card,
.toolbar,
.stat-card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.hero-panel {
  padding: 22px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stat-card {
  padding: 18px;
}

.stat-card strong {
  display: block;
  font-size: 28px;
  margin-bottom: 6px;
}

.stat-card span {
  color: var(--muted);
  font-size: 14px;
}

.section {
  padding: 18px 0 30px;
}

.section-head {
  margin-bottom: 18px;
}

.section-head p {
  color: var(--muted);
}

.toolbar {
  padding: 18px;
}

input[type="search"] {
  width: 100%;
  min-height: 50px;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  padding: 12px 14px;
  font: inherit;
}

input[type="search"]::placeholder {
  color: #7f8ba1;
}

.chip {
  background: rgba(255, 255, 255, 0.04);
  color: var(--muted);
  border-color: rgba(255, 255, 255, 0.08);
}

.chip.is-active {
  background: var(--accent-soft);
  color: #14203a;
  border-color: transparent;
}

.group-list {
  display: grid;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.site-card {
  padding: 20px;
}

.card-top,
.topic {
  color: var(--muted);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
}

.jump-link,
.text-link {
  color: #dbe6ff;
}

.jump-link {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

.site-card h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.topic {
  margin-bottom: 10px;
}

.site-card p {
  color: var(--muted);
}

.card-actions {
  margin-top: 18px;
}

.text-link-soft {
  color: var(--muted);
}

.footer,
.empty-state {
  padding: 28px 0 40px;
}

.footer {
  color: var(--muted);
}

.empty-state {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.solo-card {
  max-width: 520px;
}

@media (max-width: 980px) {
  .hero-grid,
  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .site-shell {
    width: min(100% - 24px, 1180px);
  }

  .nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .button,
  .chip {
    width: 100%;
  }
}
`;
}

function renderPortalJs() {
  return `const cards = [...document.querySelectorAll("[data-site-card]")];
const chips = [...document.querySelectorAll("[data-filter]")];
const sections = [...document.querySelectorAll("[data-group-section]")];
const searchInput = document.getElementById("siteSearch");
const resultCount = document.getElementById("resultCount");

let activeFilter = "全部";

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter || "全部";
    chips.forEach((item) => item.classList.toggle("is-active", item === chip));
    applyFilters();
  });
});

searchInput?.addEventListener("input", applyFilters);

applyFilters();

function applyFilters() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const matchesGroup = activeFilter === "全部" || card.dataset.group === activeFilter;
    const haystack = card.dataset.search || "";
    const matchesQuery = !query || haystack.includes(query);
    const isVisible = matchesGroup && matchesQuery;
    card.hidden = !isVisible;
    if (isVisible) {
      visible += 1;
    }
  });

  sections.forEach((section) => {
    const hasVisibleCard = section.querySelector("[data-site-card]:not([hidden])");
    section.hidden = !hasVisibleCard;
  });

  if (resultCount) {
    resultCount.textContent = "显示 " + visible + " / " + cards.length + " 个网站";
  }
}
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
