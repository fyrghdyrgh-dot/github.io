import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "../root-site.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "root-home-site");

const categoryMap = new Map(config.categories.map((category) => [category.slug, category]));
const pageMap = new Map(config.pages.map((page) => [page.slug, page]));
const pagesByCategory = new Map(
  config.categories.map((category) => [
    category.slug,
    config.pages.filter((page) => page.category === category.slug)
  ])
);

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(path.join(outputDir, "assets"), { recursive: true });

writeAsset("base.css", renderBaseCss());
writeAsset("home.css", renderHomeCss());
writeAsset("hub.css", renderHubCss());
writeAsset("tool.css", renderToolCss());
writeAsset("guide.css", renderGuideCss());
writeAsset("service.css", renderServiceCss());
writeAsset("article.css", renderArticleCss());
writeAsset("site.js", renderSiteJs());

writeFile("index.html", renderHomePage());
writeFile("404.html", renderNotFoundPage());
writeFile("robots.txt", renderRobotsTxt());
writeFile("sitemap.xml", renderSitemap());
writeFile("site-manifest.json", JSON.stringify(buildManifest(), null, 2));

for (const category of config.categories) {
  writeFile(path.join(category.slug, "index.html"), renderCategoryPage(category));
}

for (const page of config.pages) {
  writeFile(path.join(page.slug, "index.html"), renderContentPage(page));
}

console.log(`Built root site with ${config.categories.length} categories and ${config.pages.length} content pages.`);

function writeAsset(name, content) {
  writeFile(path.join("assets", name), content);
}

function writeFile(relativePath, content) {
  const filePath = path.join(outputDir, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function buildManifest() {
  const entries = [
    {
      type: "home",
      title: config.site.title,
      url: config.site.baseUrl
    }
  ];

  for (const category of config.categories) {
    entries.push({
      type: "category",
      title: category.name,
      category: category.slug,
      url: absoluteUrl(`${category.slug}/`)
    });
  }

  for (const page of config.pages) {
    entries.push({
      type: page.type,
      title: page.title,
      category: page.category,
      url: absoluteUrl(`${page.slug}/`)
    });
  }

  return entries;
}

function absoluteUrl(relative) {
  return new URL(relative, config.site.baseUrl).toString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeHref(href) {
  if (/^https?:\/\//.test(href)) {
    return href;
  }
  const clean = href.replace(/^\/+/, "");
  return `/${clean.replace(/\/?$/, "/")}`;
}

function bodyVars(theme) {
  return `--accent:${theme.accent};--accent-soft:${theme.accentSoft};--surface:${theme.surface};--panel:${theme.panel};--ink:${theme.ink};--muted:${theme.muted};`;
}

function renderMeta({ title, description, canonical, cssFiles, ogType = "website", jsonLd = "" }) {
  const cssLinks = cssFiles.map((href) => `  <link rel="stylesheet" href="${href}">`).join("\n");
  return `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
${cssLinks}${jsonLd ? `\n${jsonLd}` : ""}`;
}

function renderJsonLd(data) {
  return `  <script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderSiteHeader(currentLabel = "") {
  return `<header class="site-header">
    <div class="shell nav-row">
      <a class="brand" href="/">${escapeHtml(config.site.brand)}</a>
      <nav class="top-nav">
        <a href="/#directory">网站目录</a>
        <a href="/#ai-groups">AI 专题</a>
        <a href="/server-idc/">服务器与 IDC</a>
        <a href="${config.site.serverTarget}">1bgp</a>
      </nav>
    </div>
    ${currentLabel ? `<div class="shell crumb-bar">${currentLabel}</div>` : ""}
  </header>`;
}

function renderFooter() {
  return `<footer class="site-footer">
    <div class="shell footer-grid">
      <div>
        <p class="footer-title">${escapeHtml(config.site.brand)}</p>
        <p class="footer-text">目录页承接分类，子页承接搜索词；服务器相关外链统一指向 1bgp。</p>
      </div>
      <div class="footer-links">
        <a href="/net-tools/">网络与开发工具</a>
        <a href="/zh-ai-tools/">中文 AI 工具专题</a>
        <a href="/server-idc/">服务器与 IDC</a>
        <a href="${config.site.serverTarget}">1bgp</a>
      </div>
    </div>
  </footer>`;
}

function renderHomePage() {
  const totalPages = config.pages.length;
  const jsonLd = renderJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.site.title,
    url: config.site.baseUrl,
    description: config.site.description,
    hasPart: config.categories.map((category) => ({
      "@type": "CollectionPage",
      name: category.name,
      url: absoluteUrl(`${category.slug}/`)
    }))
  });

  const cards = config.categories.map((category, index) => {
    const pages = pagesByCategory.get(category.slug) || [];
    return `<section class="catalog-section" id="group-${index}" data-filter-item data-keywords="${escapeHtml(
      [category.name, category.english, category.summary, ...pages.map((page) => `${page.title} ${page.summary}`)].join(" ")
    )}" style="${bodyVars(category.theme)}">
      <div class="catalog-head">
        <div>
          <p class="tiny-label">${escapeHtml(category.english)}</p>
          <h2>${escapeHtml(category.name)}</h2>
          <p class="catalog-summary">${escapeHtml(category.summary)}</p>
        </div>
        <div class="catalog-meta">
          <span>${pages.length} 个专题页</span>
          <a href="/${category.slug}/">查看分类页</a>
        </div>
      </div>
      <div class="catalog-grid">
        ${pages.slice(0, 2).map((page) => renderHomeEntry(page)).join("")}
      </div>
    </section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="zh-CN">
<head>
${renderMeta({
  title: config.site.title,
  description: config.site.description,
  canonical: config.site.baseUrl,
  cssFiles: ["./assets/base.css", "./assets/home.css"],
  jsonLd
})}
</head>
<body class="home-body">
  ${renderSiteHeader()}
  <main class="shell" id="directory">
    <section class="home-hero">
      <div class="hero-copy">
        <p class="tiny-label">KEYWORD DIRECTORY</p>
        <h1>按关键词组织分类，按页面承接搜索。</h1>
        <p class="hero-text">目录覆盖网络与开发工具、中文 AI、越南语 AI、服务器与 IDC、开发编程、知识文档、电商内容、翻译语言、数据处理与教育学习。首页负责聚合入口，分类页与子页负责承接更细的搜索意图。</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#directory">查看全部分类</a>
          <a class="button button-secondary" href="${config.site.serverTarget}">服务器入口到 1bgp</a>
        </div>
      </div>
      <aside class="hero-stats">
        <div class="stat-box">
          <strong>${config.categories.length}</strong>
          <span>个主分类</span>
        </div>
        <div class="stat-box">
          <strong>${totalPages}</strong>
          <span>个内容页模板</span>
        </div>
        <div class="stat-box">
          <strong>4</strong>
          <span>种主要页面版式</span>
        </div>
      </aside>
    </section>

    <section class="control-panel" id="ai-groups">
      <div>
        <p class="tiny-label">FILTER</p>
        <h2>按分类或关键词快速定位</h2>
      </div>
      <div class="search-row">
        <input id="directorySearch" type="search" placeholder="搜索分类、主题、关键词，例如：CN2、越南语、JSON、客服、教育">
      </div>
    </section>

    ${cards}

    <p id="emptyState" class="empty-state hidden">没有找到匹配分类，请换一个关键词再试。</p>
  </main>
  ${renderFooter()}
  <script type="module" src="./assets/site.js"></script>
</body>
</html>`;
}

function renderHomeEntry(page) {
  const category = categoryMap.get(page.category);
  return `<article class="entry-card">
    <p class="entry-type">${escapeHtml(typeLabel(page.type))}</p>
    <h3><a href="/${page.slug}/">${escapeHtml(page.title)}</a></h3>
    <p>${escapeHtml(page.summary)}</p>
    <div class="entry-links">
      <a href="/${page.slug}/">进入页面</a>
      <a href="/${category.slug}/">查看分类</a>
    </div>
  </article>`;
}

function renderCategoryPage(category) {
  const pages = pagesByCategory.get(category.slug) || [];
  const canonical = absoluteUrl(`${category.slug}/`);
  const jsonLd = renderJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: canonical,
    description: category.summary,
    hasPart: pages.map((page) => ({
      "@type": "WebPage",
      name: page.title,
      url: absoluteUrl(`${page.slug}/`)
    }))
  });

  return `<!doctype html>
<html lang="zh-CN">
<head>
${renderMeta({
  title: `${category.name} - ${category.english}`,
  description: category.summary,
  canonical,
  cssFiles: ["../assets/base.css", "../assets/hub.css"],
  jsonLd
})}
</head>
<body class="hub-body hub-${category.hubStyle}" style="${bodyVars(category.theme)}">
  ${renderSiteHeader(`<a href="/">首页</a> / ${escapeHtml(category.name)}`)}
  <main class="shell">
    <section class="hub-hero">
      <div class="hub-copy">
        <p class="tiny-label">${escapeHtml(category.english)}</p>
        <h1>${escapeHtml(category.name)}</h1>
        <p class="hub-text">${escapeHtml(category.intro)}</p>
      </div>
      <aside class="hub-side">
        <div class="hub-pill">${pages.length} 个专题页</div>
        <a class="button button-primary" href="/#directory">返回总目录</a>
      </aside>
    </section>

    <section class="hub-layout">
      ${pages.map((page, index) => `<article class="hub-card hub-card-${(index % 4) + 1}">
        <p class="card-kicker">${escapeHtml(typeLabel(page.type))}</p>
        <h2><a href="/${page.slug}/">${escapeHtml(page.title)}</a></h2>
        <p>${escapeHtml(page.summary)}</p>
        <div class="hub-links">
          <a href="/${page.slug}/">进入页面</a>
          <a href="${safeHref(page.ctaUrl)}">${escapeHtml(page.ctaLabel)}</a>
        </div>
      </article>`).join("")}
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function renderContentPage(page) {
  const category = categoryMap.get(page.category);
  const canonical = absoluteUrl(`${page.slug}/`);
  const css = `../assets/${page.type}.css`;
  const jsonLd = renderJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: canonical,
    description: page.description
  });

  return `<!doctype html>
<html lang="zh-CN">
<head>
${renderMeta({
  title: page.title,
  description: page.description,
  canonical,
  cssFiles: ["../assets/base.css", css],
  ogType: "article",
  jsonLd
})}
</head>
<body class="content-body type-${page.type}" style="${bodyVars(category.theme)}">
  ${renderSiteHeader(`<a href="/">首页</a> / <a href="/${category.slug}/">${escapeHtml(category.name)}</a> / ${escapeHtml(page.title)}`)}
  <main class="shell">
    ${renderByType(page, category)}
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function renderByType(page, category) {
  if (page.type === "tool") return renderToolPage(page, category);
  if (page.type === "service") return renderServicePage(page, category);
  if (page.type === "article") return renderArticlePage(page, category);
  return renderGuidePage(page, category);
}

function renderHeroTop(page, category) {
  return `<section class="page-hero">
    <div class="page-hero-copy">
      <p class="tiny-label">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="page-summary">${escapeHtml(page.summary)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${safeHref(page.ctaUrl)}">${escapeHtml(page.ctaLabel)}</a>
        ${page.secondaryLabel ? `<a class="button button-secondary" href="/${category.slug}/">${escapeHtml(page.secondaryLabel)}</a>` : ""}
      </div>
    </div>
    <div class="metric-strip">
      ${page.metrics.map(([label, value]) => `<div class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
    </div>
  </section>`;
}

function renderGuidePage(page, category) {
  return `${renderHeroTop(page, category)}
  <section class="guide-grid">
    ${page.pillars.map((item, index) => `<article class="guide-card">
      <p class="step-index">${String(index + 1).padStart(2, "0")}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.text)}</p>
    </article>`).join("")}
  </section>
  <section class="checklist-panel">
    <div>
      <p class="tiny-label">CHECKLIST</p>
      <h2>上线前或交付前建议这样核对</h2>
    </div>
    <ul class="bullet-list">
      ${page.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  </section>
  ${renderFaqAndRelated(page)}`;
}

function renderToolPage(page, category) {
  return `${renderHeroTop(page, category)}
  <section class="tool-layout">
    <article class="tool-panel">
      <p class="tiny-label">INPUT</p>
      <h2>${escapeHtml(page.inputLabel)}</h2>
      <textarea rows="7" readonly>${page.inputExample}</textarea>
      <div class="tool-actions">
        <button class="button button-primary" type="button">运行示例</button>
        <button class="button button-secondary" type="button">清空</button>
      </div>
    </article>
    <article class="tool-panel">
      <p class="tiny-label">OUTPUT</p>
      <h2>结果示例</h2>
      <pre>${escapeHtml(page.outputExample)}</pre>
    </article>
  </section>
  <section class="step-columns">
    ${page.steps.map((step, index) => `<article class="step-card">
      <p class="step-index">${String(index + 1).padStart(2, "0")}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.text)}</p>
    </article>`).join("")}
  </section>
  <section class="note-panel">
    <p class="tiny-label">NOTE</p>
    <h2>适用范围与说明</h2>
    <ul class="bullet-list">
      ${page.notes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  </section>
  ${renderFaqAndRelated(page)}`;
}

function renderServicePage(page, category) {
  return `${renderHeroTop(page, category)}
  <section class="service-grid">
    <article class="service-panel">
      <p class="tiny-label">WHO IT FITS</p>
      <h2>适合哪些业务先看</h2>
      <ul class="bullet-list">
        ${page.audience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
    <article class="service-panel">
      <p class="tiny-label">BEFORE YOU BUY</p>
      <h2>购买前需要先确认</h2>
      <ul class="bullet-list">
        ${page.considerations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  </section>
  <section class="offer-grid">
    ${page.offers.map(([title, text]) => `<article class="offer-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      <a href="${safeHref(page.ctaUrl)}">前往 1bgp 继续看</a>
    </article>`).join("")}
  </section>
  ${renderFaqAndRelated(page)}`;
}

function renderArticlePage(page, category) {
  return `${renderHeroTop(page, category)}
  <section class="article-stack">
    ${page.sections.map((section) => `<article class="article-card">
      <h2>${escapeHtml(section.title)}</h2>
      <p>${escapeHtml(section.text)}</p>
    </article>`).join("")}
  </section>
  <section class="takeaway-panel">
    <p class="tiny-label">TAKEAWAY</p>
    <h2>这页的核心结论</h2>
    <ul class="bullet-list">
      ${page.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  </section>
  ${renderFaqAndRelated(page)}`;
}

function renderFaqAndRelated(page) {
  return `<section class="faq-related">
    <div class="faq-panel">
      <p class="tiny-label">FAQ</p>
      <h2>常见问题</h2>
      <div class="faq-list">
        ${page.faq.map(([q, a]) => `<article class="faq-item"><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></article>`).join("")}
      </div>
    </div>
    <aside class="related-panel">
      <p class="tiny-label">RELATED</p>
      <h2>继续查看</h2>
      <ul class="related-list">
        ${page.related.map(([label, href]) => `<li><a href="${safeHref(href)}">${escapeHtml(label)}</a></li>`).join("")}
      </ul>
    </aside>
  </section>`;
}

function renderNotFoundPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
${renderMeta({
  title: "页面未找到",
  description: "返回关键词目录查看分类页与专题页。",
  canonical: absoluteUrl("404.html"),
  cssFiles: ["./assets/base.css", "./assets/article.css"]
})}
</head>
<body class="content-body" style="${bodyVars(config.categories[0].theme)}">
  ${renderSiteHeader(`<a href="/">首页</a> / 404`)}
  <main class="shell">
    <section class="page-hero">
      <div class="page-hero-copy">
        <p class="tiny-label">404</p>
        <h1>这个页面不存在</h1>
        <p class="page-summary">你可以返回首页继续查看分类目录，或直接进入服务器与 IDC 分类。</p>
        <div class="hero-actions">
          <a class="button button-primary" href="/">返回首页</a>
          <a class="button button-secondary" href="/server-idc/">查看服务器分类</a>
        </div>
      </div>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function renderSitemap() {
  const urls = [
    config.site.baseUrl,
    ...config.categories.map((category) => absoluteUrl(`${category.slug}/`)),
    ...config.pages.map((page) => absoluteUrl(`${page.slug}/`))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url, index) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${index === 0 ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>`;
}

function renderRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("sitemap.xml")}`;
}

function typeLabel(type) {
  return {
    tool: "工具页",
    guide: "指南页",
    service: "服务页",
    article: "文章页"
  }[type] || "页面";
}

function renderSiteJs() {
  return `const searchInput = document.getElementById("directorySearch");
const sections = [...document.querySelectorAll("[data-filter-item]")];
const emptyState = document.getElementById("emptyState");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let visible = 0;

    sections.forEach((section) => {
      const text = (section.dataset.keywords || "").toLowerCase();
      const matches = !keyword || text.includes(keyword);
      section.classList.toggle("hidden", !matches);
      if (matches) visible += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", visible > 0);
    }
  });
}`;
}

function renderBaseCss() {
  return `:root {
  --accent: #1d4ed8;
  --accent-soft: #dbeafe;
  --surface: #f8fbff;
  --panel: #ffffff;
  --ink: #172554;
  --muted: #64748b;
  --line: color-mix(in srgb, var(--accent) 14%, #d9dde8);
  --shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  --radius: 22px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 7%, transparent), transparent 24%), var(--surface);
  color: var(--ink);
  line-height: 1.65;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; }
.shell { width: min(1180px, calc(100% - 28px)); margin: 0 auto; }
.site-header { padding: 18px 0 10px; }
.nav-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}
.brand {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.top-nav {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: var(--muted);
  font-size: 14px;
}
.crumb-bar {
  margin-top: 12px;
  font-size: 13px;
  color: var(--muted);
}
.tiny-label {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}
h1, h2, h3, p, ul, pre, textarea { margin: 0; }
h1 { font-size: clamp(28px, 4vw, 36px); line-height: 1.15; }
h2 { font-size: clamp(22px, 3vw, 28px); line-height: 1.22; }
h3 { font-size: 18px; line-height: 1.3; }
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 700;
}
.button-primary { background: var(--accent); color: white; }
.button-secondary { background: transparent; border-color: var(--line); color: var(--ink); }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
.site-footer { padding: 12px 0 34px; }
.footer-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.footer-title { font-size: 15px; font-weight: 700; }
.footer-text, .footer-links { color: var(--muted); font-size: 14px; }
.footer-links { display: flex; gap: 14px; flex-wrap: wrap; }
.metric-strip {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.metric-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  padding: 16px;
  box-shadow: var(--shadow);
}
.metric-card span {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--muted);
}
.metric-card strong { font-size: 18px; line-height: 1.25; }
.page-hero {
  display: grid;
  gap: 18px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 40%, white), var(--panel));
  box-shadow: var(--shadow);
}
.page-summary { color: var(--muted); max-width: 780px; font-size: 15px; }
.bullet-list, .related-list { list-style: none; padding: 0; margin: 0; }
.bullet-list { display: grid; gap: 10px; }
.bullet-list li {
  position: relative;
  padding-left: 16px;
}
.bullet-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.faq-related {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  margin: 24px 0 34px;
}
.faq-panel, .related-panel {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  box-shadow: var(--shadow);
  padding: 22px;
}
.faq-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}
.faq-item {
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.faq-item:first-child { border-top: 0; padding-top: 0; }
.faq-item p { margin-top: 8px; color: var(--muted); font-size: 14px; }
.related-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.related-list a {
  display: block;
  padding: 12px 14px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--accent-soft) 50%, white);
  border: 1px solid var(--line);
  font-size: 14px;
  font-weight: 600;
}
.hidden { display: none !important; }
@media (max-width: 860px) {
  .nav-row, .footer-grid, .faq-related, .metric-strip { grid-template-columns: 1fr; }
  .nav-row, .footer-grid { display: grid; }
}
@media (max-width: 640px) {
  .shell { width: min(100% - 20px, 1180px); }
  .button { width: 100%; }
  .hero-actions { flex-direction: column; }
}`;
}

function renderHomeCss() {
  return `.home-hero, .control-panel, .catalog-section, .entry-card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr);
  gap: 20px;
  padding: 28px;
  margin: 18px 0 18px;
}
.hero-text { color: var(--muted); font-size: 15px; max-width: 760px; }
.hero-stats {
  display: grid;
  gap: 14px;
}
.stat-box {
  padding: 16px 18px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--accent-soft) 46%, white);
  border: 1px solid var(--line);
}
.stat-box strong {
  display: block;
  font-size: 28px;
  margin-bottom: 6px;
}
.control-panel {
  padding: 22px 24px;
  margin-bottom: 18px;
}
.search-row { margin-top: 14px; }
input[type="search"] {
  width: 100%;
  min-height: 48px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: white;
  padding: 0 16px;
  font-size: 14px;
}
.catalog-section {
  padding: 24px;
  margin-bottom: 16px;
}
.catalog-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
}
.catalog-summary, .catalog-meta { color: var(--muted); font-size: 14px; }
.catalog-meta {
  display: grid;
  gap: 8px;
  text-align: right;
}
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.entry-card { padding: 18px; }
.entry-type {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-soft) 55%, white);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}
.entry-card h3 { margin: 10px 0 8px; }
.entry-card p { color: var(--muted); font-size: 14px; }
.entry-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
  font-size: 14px;
}
.entry-links a { color: var(--accent); font-weight: 700; }
.empty-state {
  padding: 18px 0 30px;
  text-align: center;
  color: var(--muted);
}
@media (max-width: 860px) {
  .home-hero, .catalog-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .catalog-head { flex-direction: column; }
  .catalog-meta { text-align: left; }
}`;
}

function renderHubCss() {
  return `.hub-hero, .hub-card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.hub-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(220px, 0.8fr);
  gap: 18px;
  padding: 28px;
  margin: 18px 0;
}
.hub-text { color: var(--muted); font-size: 15px; max-width: 760px; }
.hub-side {
  display: grid;
  gap: 14px;
  align-content: start;
}
.hub-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-soft) 58%, white);
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
}
.hub-layout {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}
.hub-grid .hub-layout,
.hub-showcase .hub-layout {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.hub-card {
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.hub-card::after {
  content: "";
  position: absolute;
  inset: auto -20px -40px auto;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 9%, transparent);
}
.card-kicker {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hub-card h2 { margin: 8px 0; }
.hub-card p { color: var(--muted); font-size: 14px; }
.hub-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
  position: relative;
  z-index: 1;
}
.hub-links a { color: var(--accent); font-weight: 700; }
.hub-editorial .hub-layout { grid-template-columns: 1.15fr 0.85fr; }
.hub-editorial .hub-card-1 { min-height: 260px; }
.hub-library .hub-layout,
.hub-ledger .hub-layout,
.hub-matrix .hub-layout,
.hub-notebook .hub-layout { grid-template-columns: 1fr; }
.hub-library .hub-card,
.hub-ledger .hub-card,
.hub-notebook .hub-card { border-left: 6px solid var(--accent); }
.hub-flow .hub-card,
.hub-signal .hub-card { background: linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 40%, white), var(--panel)); }
.hub-magazine .hub-layout { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.hub-lab .hub-layout { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (max-width: 900px) {
  .hub-hero, .hub-layout, .hub-grid .hub-layout, .hub-showcase .hub-layout, .hub-editorial .hub-layout, .hub-magazine .hub-layout, .hub-lab .hub-layout {
    grid-template-columns: 1fr;
  }
}`;
}

function renderGuideCss() {
  return `.guide-grid, .checklist-panel {
  margin: 22px 0;
}
.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.guide-card, .checklist-panel {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.guide-card { padding: 20px; }
.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-soft) 60%, white);
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}
.guide-card p, .checklist-panel p { color: var(--muted); font-size: 14px; }
.checklist-panel { padding: 22px; }
.checklist-panel .bullet-list { margin-top: 14px; }
@media (max-width: 900px) {
  .guide-grid { grid-template-columns: 1fr; }
}`;
}

function renderToolCss() {
  return `.tool-layout, .step-columns, .note-panel {
  margin: 22px 0;
}
.tool-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.tool-panel, .step-card, .note-panel {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.tool-panel, .note-panel { padding: 22px; }
.tool-panel textarea, .tool-panel pre {
  width: 100%;
  margin-top: 14px;
  min-height: 200px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--accent-soft) 26%, white);
  padding: 14px;
  font: 13px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--ink);
  white-space: pre-wrap;
}
.tool-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.step-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.step-card {
  padding: 20px;
}
.step-card p, .note-panel p { color: var(--muted); font-size: 14px; }
.note-panel .bullet-list { margin-top: 14px; }
@media (max-width: 900px) {
  .tool-layout, .step-columns { grid-template-columns: 1fr; }
}`;
}

function renderServiceCss() {
  return `.service-grid, .offer-grid {
  display: grid;
  gap: 16px;
  margin: 22px 0;
}
.service-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.service-panel, .offer-card {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.service-panel { padding: 22px; }
.offer-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.offer-card {
  padding: 20px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 36%, white), var(--panel));
}
.offer-card p { margin-top: 8px; color: var(--muted); font-size: 14px; }
.offer-card a {
  display: inline-block;
  margin-top: 14px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
}
@media (max-width: 900px) {
  .service-grid, .offer-grid { grid-template-columns: 1fr; }
}`;
}

function renderArticleCss() {
  return `.article-stack, .takeaway-panel {
  margin: 22px 0;
}
.article-stack {
  display: grid;
  gap: 16px;
}
.article-card, .takeaway-panel {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  box-shadow: var(--shadow);
}
.article-card {
  padding: 24px;
}
.article-card p {
  margin-top: 10px;
  color: var(--muted);
  font-size: 15px;
}
.takeaway-panel {
  padding: 22px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 32%, white), var(--panel));
}
.takeaway-panel .bullet-list { margin-top: 14px; }`;
}
