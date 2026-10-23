import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "sites.config.json");
const distRoot = path.join(rootDir, "dist");

const config = JSON.parse(readFileSync(configPath, "utf8"));

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(distRoot, { recursive: true });

const manifest = [];

for (const site of config.sites) {
  validateSite(site);

  const repo = site.repo;
  const branch = config.github.defaultBranch || "main";
  const siteUrl = site.customDomain
    ? `https://${site.customDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "")}/`
    : `https://${config.github.owner}.github.io/${repo}/`;
  const outputDir = path.join(distRoot, site.slug);
  const publicData = buildPublicData(site, siteUrl);

  mkdirSync(path.join(outputDir, "assets"), { recursive: true });
  mkdirSync(path.join(outputDir, ".github", "workflows"), { recursive: true });

  writeFileSync(path.join(outputDir, "index.html"), renderIndexHtml(publicData), "utf8");
  writeFileSync(path.join(outputDir, "404.html"), render404Html(publicData), "utf8");
  writeFileSync(path.join(outputDir, "robots.txt"), renderRobotsTxt(siteUrl), "utf8");
  writeFileSync(path.join(outputDir, "sitemap.xml"), renderSitemap(siteUrl), "utf8");
  writeFileSync(path.join(outputDir, "assets", "site.css"), renderStyles(publicData), "utf8");
  writeFileSync(path.join(outputDir, "assets", "site.js"), renderScript(publicData), "utf8");
  writeFileSync(path.join(outputDir, "README.md"), renderSiteReadme(publicData, branch), "utf8");
  writeFileSync(
    path.join(outputDir, ".github", "workflows", "deploy-pages.yml"),
    renderPagesWorkflow(),
    "utf8"
  );

  if (site.customDomain) {
    writeFileSync(path.join(outputDir, "CNAME"), site.customDomain.trim(), "utf8");
  }

  manifest.push({
    slug: site.slug,
    repo: site.repo,
    name: site.name,
    category: site.category,
    siteUrl,
    outputDir
  });
}

writeFileSync(path.join(distRoot, "sites-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Generated ${manifest.length} site package(s) into ${distRoot}`);

function validateSite(site) {
  const requiredFields = ["slug", "repo", "name", "description", "category", "feature"];
  for (const key of requiredFields) {
    if (!site[key]) {
      throw new Error(`Missing required field "${key}" for site ${site.slug || site.name || "unknown"}`);
    }
  }

  const allowedCategories = new Set(["server-lead", "traffic"]);
  if (!allowedCategories.has(site.category)) {
    throw new Error(`Unsupported category "${site.category}" for ${site.slug}`);
  }
}

function buildPublicData(site, siteUrl) {
  const targetLink = config.defaults.targetLink;
  return {
    owner: config.github.owner,
    siteUrl,
    repo: site.repo,
    slug: site.slug,
    name: site.name,
    tagline: site.tagline || site.description,
    description: site.description,
    topic: site.topic,
    category: site.category,
    keywords: site.keywords || [],
    lang: site.lang || config.defaults.lang || "zh-CN",
    colors: {
      accent: site.theme?.accent || "#6d5efc",
      accentSoft: site.theme?.accentSoft || "#edeaff",
      surface: site.theme?.surface || "#111827",
      surfaceSoft: site.theme?.surfaceSoft || "#1f2937"
    },
    promoteTarget: Boolean(site.promoteTarget),
    targetLink,
    analyticsPlaceholder: Boolean(config.defaults.analyticsPlaceholder),
    adPlaceholder: Boolean(config.defaults.adPlaceholder),
    feature: site.feature,
    referenceStyle: site.referenceStyle || "",
    sections: buildSections(site)
  };
}

function buildSections(site) {
  if (site.category === "server-lead") {
    return {
      highlights: [
        {
          title: "选题聚焦",
          text: "围绕真实服务器使用场景输出内容，避免无意义关键词堆砌。"
        },
        {
          title: "自然引导",
          text: "只在服务器采购、节点选择或带宽需求相关位置自然引导到 1bgp.com。"
        },
        {
          title: "可持续扩展",
          text: "保留专题页、FAQ、广告位和统计位，后续可继续叠加流量玩法。"
        }
      ],
      contentCards: [
        {
          title: "常见场景",
          text: "博客建站、API 托管、下载分发、出海电商、跨境业务部署。"
        },
        {
          title: "内容方向",
          text: "配置教程、部署清单、选型指南、排障问答、节点推荐。"
        },
        {
          title: "增长方式",
          text: "通过搜索需求页获取精准流量，再在相关位置放置合适的购买入口。"
        }
      ],
      faq: [
        {
          q: "为什么站点里会出现 1bgp.com？",
          a: "仅在用户已经产生服务器采购或节点筛选需求时，页面会提供一个自然的延伸入口。"
        },
        {
          q: "站点适合发布什么内容？",
          a: "适合教程、实用工具、部署流程、问题排查和服务器选型建议。"
        },
        {
          q: "是否支持后续加专题页？",
          a: "支持。当前模板是静态结构，可继续扩展更多 HTML 页面或 JSON 数据源。"
        }
      ]
    };
  }

  return {
    highlights: [
      {
        title: "轻量可用",
        text: "首页即具备可实际使用的小工具或有效内容，适合移动端直接访问。"
      },
      {
        title: "变现预留",
        text: "保留广告位、统计代码位和联盟位，但默认不接入外部账号服务。"
      },
      {
        title: "低维护成本",
        text: "纯静态站结构，更新快，适合批量生成和长期托管。"
      }
    ],
    contentCards: [
      {
        title: "适合主题",
        text: "工具站、查询页、导航页、教程页、手机端小工具、轻量资源页。"
      },
      {
        title: "页面策略",
        text: "减少复杂依赖，保留核心交互，让页面快开、好用、容易继续扩展。"
      },
      {
        title: "后续演化",
        text: "可继续追加专题文章、站内搜索、广告位、赞助位和自定义域名。"
      }
    ],
    faq: [
      {
        q: "为什么默认不插入推广链接？",
        a: "普通流量站先保证内容和工具本身可用，只有主题真正相关时才加入推广。"
      },
      {
        q: "这个模板支持扩展更多工具吗？",
        a: "支持，可继续新增 feature 类型并在配置中批量声明。"
      },
      {
        q: "是否适合手机端？",
        a: "模板默认以移动端优先设计，按钮、卡片和输入区都做了窄屏优化。"
      }
    ]
  };
}

function renderIndexHtml(site) {
  const title = `${site.name} - ${site.tagline}`;
  const keywords = escapeHtml(site.keywords.join(", "));
  const intro = site.category === "server-lead"
    ? "围绕服务器建站、节点选择与部署场景，提供真实可用的内容与工具。"
    : "为移动端和轻量静态站场景设计，打开即用，适合快速获取自然流量。";

  return `<!doctype html>
<html lang="${site.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(site.description)}">
  <meta name="keywords" content="${keywords}">
  <meta name="theme-color" content="${site.colors.accent}">
  <link rel="canonical" href="${site.siteUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(site.name)}">
  <meta property="og:description" content="${escapeHtml(site.description)}">
  <meta property="og:url" content="${site.siteUrl}">
  <meta property="og:locale" content="zh_CN">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="./assets/site.css">
</head>
<body>
  <header class="site-shell hero">
    <nav class="nav">
      <a class="brand" href="./">${escapeHtml(site.name)}</a>
      <div class="nav-meta">
        <span class="pill">${site.category === "server-lead" ? "服务器引流站" : "普通流量站"}</span>
        <span class="pill pill-soft">${escapeHtml(site.referenceStyle)}</span>
      </div>
    </nav>
    <div class="hero-grid">
      <section>
        <p class="eyebrow">${escapeHtml(site.topic)}</p>
        <h1>${escapeHtml(site.name)}</h1>
        <p class="lead">${escapeHtml(site.tagline)}</p>
        <p class="sublead">${escapeHtml(intro)}</p>
        <div class="cta-row">
          <a class="button" href="#feature">立即使用</a>
          <a class="button button-ghost" href="#faq">查看常见问题</a>
        </div>
      </section>
      <aside class="hero-panel">
        <h2>站点摘要</h2>
        <ul class="summary-list">
          <li><strong>主题</strong><span>${escapeHtml(site.topic)}</span></li>
          <li><strong>发布方式</strong><span>GitHub Pages 静态托管</span></li>
          <li><strong>更新形态</strong><span>配置驱动 + 自动部署</span></li>
          <li><strong>SEO 基础</strong><span>Canonical / robots / sitemap 已生成</span></li>
        </ul>
      </aside>
    </div>
  </header>

  <main class="site-shell">
    <section class="section section-grid">
      ${site.sections.highlights.map((item) => `<article class="card"><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p></article>`).join("")}
    </section>

    <section class="section split">
      <div>
        <p class="eyebrow">站点定位</p>
        <h2>不是简单换标题，而是按主题组织结构</h2>
        <p>${escapeHtml(site.description)}</p>
      </div>
      <div class="card-stack">
        ${site.sections.contentCards.map((item) => `<article class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}
      </div>
    </section>

    <section class="section feature-wrap" id="feature">
      <div class="section-head">
        <p class="eyebrow">核心功能</p>
        <h2>${renderFeatureTitle(site.feature.kind)}</h2>
        <p>${renderFeatureIntro(site)}</p>
      </div>
      ${renderFeatureHtml(site)}
    </section>

    ${renderPromotionSection(site)}

    <section class="section utility-grid">
      <article class="card">
        <h2>规范链接</h2>
        <p>当前页面已输出 canonical、robots.txt 与 sitemap.xml，适配 GitHub Pages 项目路径。</p>
      </article>
      <article class="card">
        <h2>统计预留</h2>
        <p>${site.analyticsPlaceholder ? "已预留统计代码位置，后续可接入你自己的分析方案。" : "当前模板未启用统计代码。"}</p>
        <pre class="placeholder">&lt;!-- analytics slot --&gt;</pre>
      </article>
      <article class="card">
        <h2>广告位预留</h2>
        <p>${site.adPlaceholder ? "已预留内容位与广告位插槽，但默认不接入第三方广告账号。" : "当前模板未启用广告位。"}</p>
        <pre class="placeholder">&lt;!-- ad slot --&gt;</pre>
      </article>
    </section>

    <section class="section" id="faq">
      <div class="section-head">
        <p class="eyebrow">常见问题</p>
        <h2>后续扩展时重点关注这些点</h2>
      </div>
      <div class="faq-list">
        ${site.sections.faq.map((item) => `<details class="faq-item"><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join("")}
      </div>
    </section>
  </main>

  <footer class="site-shell footer">
    <p>${escapeHtml(site.name)} · ${escapeHtml(site.topic)}</p>
    <p>当前地址：<a href="${site.siteUrl}">${site.siteUrl}</a></p>
  </footer>

  <script>window.__SITE_DATA__ = ${JSON.stringify(site)};</script>
  <script type="module" src="./assets/site.js"></script>
</body>
</html>`;
}

function render404Html(site) {
  return `<!doctype html>
<html lang="${site.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(site.name)} - 页面未找到</title>
  <link rel="stylesheet" href="./assets/site.css">
</head>
<body>
  <main class="site-shell empty-state">
    <div class="card">
      <p class="eyebrow">404</p>
      <h1>页面暂时不存在</h1>
      <p>你可以返回首页继续使用 ${escapeHtml(site.name)}。</p>
      <a class="button" href="./">返回首页</a>
    </div>
  </main>
</body>
</html>`;
}

function renderRobotsTxt(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap.xml
`;
}

function renderSitemap(siteUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;
}

function renderSiteReadme(site, branch) {
  return `# ${site.name}

这是由批量建站系统生成的静态站点包。

- 站点类型：${site.category === "server-lead" ? "服务器引流站" : "普通流量站"}
- 仓库：${site.repo}
- 默认分支：${branch}
- Pages 地址：${site.siteUrl}

## 目录

- \`index.html\`：站点首页
- \`assets/site.css\`：样式文件
- \`assets/site.js\`：交互脚本
- \`robots.txt\`：爬虫规则
- \`sitemap.xml\`：站点地图
- \`.github/workflows/deploy-pages.yml\`：GitHub Actions Pages 工作流
`;
}

function renderPagesWorkflow() {
  return `name: Deploy GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

function renderStyles(site) {
  return `:root {
  --accent: ${site.colors.accent};
  --accent-soft: ${site.colors.accentSoft};
  --surface: ${site.colors.surface};
  --surface-soft: ${site.colors.surfaceSoft};
  --line: rgba(148, 163, 184, 0.18);
  --text: #e5eef9;
  --muted: #99a7bd;
  --card: rgba(15, 23, 42, 0.68);
  --shadow: 0 18px 45px rgba(2, 8, 23, 0.28);
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
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.08), transparent 30%),
    linear-gradient(180deg, var(--surface), var(--surface-soft));
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.hero {
  padding: 24px 0 42px;
}

.nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 36px;
}

.brand {
  font-weight: 800;
  letter-spacing: 0.02em;
}

.nav-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 6px 12px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
}

.pill-soft {
  background: var(--accent-soft);
  color: #182135;
  border-color: transparent;
}

.hero-grid,
.split,
.section-grid,
.utility-grid,
.feature-grid {
  display: grid;
  gap: 18px;
}

.hero-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: stretch;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 10px;
}

h1,
h2,
h3 {
  margin: 0 0 12px;
  line-height: 1.15;
}

h1 {
  font-size: clamp(32px, 5vw, 54px);
}

.lead {
  font-size: clamp(18px, 2.6vw, 24px);
  color: #f8fbff;
  max-width: 720px;
}

.sublead,
p {
  color: var(--muted);
}

.cta-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  background: var(--accent);
  color: white;
  font-weight: 700;
  border: 1px solid transparent;
  box-shadow: var(--shadow);
}

.button-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.14);
  color: var(--text);
  box-shadow: none;
}

.hero-panel,
.card,
.tool-card,
.faq-item {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--card);
  box-shadow: var(--shadow);
}

.hero-panel {
  padding: 24px;
}

.summary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.summary-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 14px;
}

.summary-list li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.section {
  padding: 18px 0 30px;
}

.section-grid,
.utility-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.card-stack {
  display: grid;
  gap: 16px;
}

.card,
.tool-card {
  padding: 22px;
}

.split {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: start;
}

.section-head {
  margin-bottom: 18px;
}

.feature-wrap {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.feature-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #ced8e7;
  font-size: 14px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  padding: 12px 14px;
  min-height: 48px;
  margin-bottom: 14px;
}

input::placeholder,
textarea::placeholder {
  color: #7f8ba1;
}

.meta-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tool-textarea {
  min-height: 220px;
  resize: vertical;
}

.code-block {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  overflow: auto;
}

.progress {
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  margin: 14px 0 10px;
}

.progress-bar {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--accent), #ffffff);
}

.checklist {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.check-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
}

.result-panel,
.placeholder {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  padding: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  white-space: pre-wrap;
}

.promo {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.08));
}

.promo-note {
  font-size: 14px;
  color: var(--muted);
}

.faq-list {
  display: grid;
  gap: 12px;
}

.faq-item {
  padding: 18px 20px;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
}

.footer,
.empty-state {
  padding: 28px 0 40px;
}

.empty-state {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

@media (max-width: 920px) {
  .hero-grid,
  .split,
  .section-grid,
  .utility-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .site-shell {
    width: min(100% - 24px, 1120px);
  }

  .nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .meta-row {
    grid-template-columns: 1fr;
  }

  .button {
    width: 100%;
  }
}
`;
}

function renderFeatureTitle(kind) {
  const map = {
    deploymentChecklist: "部署检查清单",
    serverSelector: "服务器节点建议器",
    ratioCalculator: "比例与尺寸换算工具",
    utmBuilder: "UTM 推广链接生成工具",
    jsonFormatter: "JSON 格式化与压缩工具"
  };
  return map[kind] || "核心功能";
}

function renderFeatureIntro(site) {
  const map = {
    deploymentChecklist: "把上线前后最常漏掉的关键步骤放到一个可勾选、可保存进度的清单里。",
    serverSelector: "根据业务类型、访问地区与预算区间，快速给出更合适的部署方向建议。",
    ratioCalculator: "输入原始尺寸与目标宽度，快速换算等比高度，并查看常见比例预设。",
    utmBuilder: "把投放来源、媒介、活动名和内容参数整理成可直接使用的推广链接。",
    jsonFormatter: "对 JSON 文本进行格式化、压缩和基础校验，方便接口联调与排错。"
  };
  return escapeHtml(map[site.feature.kind] || "围绕页面主题提供一个可以直接操作的实用组件。");
}

function renderFeatureHtml(site) {
  if (site.feature.kind === "deploymentChecklist") {
    return `<div class="feature-grid">
      <article class="tool-card">
        <h3>上线进度</h3>
        <p>勾选后会自动保存在本地浏览器，下次打开会继续保留进度。</p>
        <div class="progress"><div class="progress-bar" id="progressBar"></div></div>
        <p id="progressText">0 / ${site.feature.items.length} 完成</p>
        <div class="checklist" id="checklistRoot">
          ${site.feature.items.map((item, index) => `<label class="check-item"><input type="checkbox" data-check-item="${index}"><span>${escapeHtml(item)}</span></label>`).join("")}
        </div>
      </article>
      <article class="tool-card">
        <h3>上线建议</h3>
        <div class="result-panel">
          适合用于单页建站、VPS 部署、反向代理配置、备份和回滚梳理。<br><br>
          先把基础环境、证书、监控和回滚链路确认好，再逐步补营销页与 SEO 页面，效率更高。
        </div>
      </article>
    </div>`;
  }

  if (site.feature.kind === "serverSelector") {
    return `<div class="feature-grid">
      <article class="tool-card">
        <h3>填写需求</h3>
        <label for="workload">业务类型</label>
        <select id="workload">
          ${site.feature.workloads.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
        </select>
        <label for="region">主要访问地区</label>
        <select id="region">
          ${site.feature.regions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
        </select>
        <label for="budget">预算区间</label>
        <select id="budget">
          <option value="low">预算敏感</option>
          <option value="mid">平衡优先</option>
          <option value="high">稳定优先</option>
        </select>
        <button class="button" id="selectorButton" type="button">生成建议</button>
      </article>
      <article class="tool-card">
        <h3>建议结果</h3>
        <div class="result-panel" id="selectorResult">选择业务类型、地区和预算后查看建议。</div>
      </article>
    </div>`;
  }

  if (site.feature.kind === "ratioCalculator") {
    return `<div class="feature-grid">
      <article class="tool-card">
        <h3>输入尺寸</h3>
        <div class="meta-row">
          <div>
            <label for="originWidth">原始宽度</label>
            <input id="originWidth" type="number" min="1" placeholder="例如 1080">
          </div>
          <div>
            <label for="originHeight">原始高度</label>
            <input id="originHeight" type="number" min="1" placeholder="例如 1920">
          </div>
        </div>
        <label for="targetWidth">目标宽度</label>
        <input id="targetWidth" type="number" min="1" placeholder="例如 750">
        <button class="button" id="ratioButton" type="button">计算等比高度</button>
      </article>
      <article class="tool-card">
        <h3>结果与预设</h3>
        <div class="result-panel" id="ratioResult">输入尺寸后查看结果。</div>
        <div class="checklist">
          ${site.feature.presets.map((preset) => `<button class="button button-ghost preset-button" type="button" data-preset-width="${preset.width}" data-preset-height="${preset.height}">${escapeHtml(preset.name)} ${preset.width} x ${preset.height}</button>`).join("")}
        </div>
      </article>
    </div>`;
  }

  if (site.feature.kind === "utmBuilder") {
    return `<div class="feature-grid">
      <article class="tool-card">
        <h3>填写参数</h3>
        <label for="utmBase">落地页地址</label>
        <input id="utmBase" type="url" placeholder="例如 https://example.com/pricing">
        <div class="meta-row">
          <div>
            <label for="utmSource">来源 source</label>
            <input id="utmSource" type="text" placeholder="例如 xiaohongshu">
          </div>
          <div>
            <label for="utmMedium">媒介 medium</label>
            <input id="utmMedium" type="text" placeholder="例如 social">
          </div>
        </div>
        <div class="meta-row">
          <div>
            <label for="utmCampaign">活动 campaign</label>
            <input id="utmCampaign" type="text" placeholder="例如 summer_launch">
          </div>
          <div>
            <label for="utmContent">内容 content</label>
            <input id="utmContent" type="text" placeholder="例如 note_a">
          </div>
        </div>
        <label for="utmTerm">关键词 term</label>
        <input id="utmTerm" type="text" placeholder="例如 server_plan">
        <div class="button-row">
          <button class="button" id="utmBuildButton" type="button">生成链接</button>
          <button class="button button-ghost" id="utmCopyButton" type="button">复制结果</button>
        </div>
      </article>
      <article class="tool-card">
        <h3>生成结果</h3>
        <div class="result-panel code-block" id="utmResult">填写参数后查看结果。</div>
        <div class="checklist">
          <div class="check-item"><span>适合广告投放、私域分发、内容渠道统计和活动复盘。</span></div>
          <div class="check-item"><span>建议统一命名规则，避免 source、medium 和 campaign 写法混乱。</span></div>
        </div>
      </article>
    </div>`;
  }

  if (site.feature.kind === "jsonFormatter") {
    return `<div class="feature-grid">
      <article class="tool-card">
        <h3>粘贴 JSON</h3>
        <label for="jsonInput">原始内容</label>
        <textarea id="jsonInput" class="tool-textarea" placeholder='例如 {"name":"demo","enabled":true}'></textarea>
        <div class="button-row">
          <button class="button" id="jsonFormatButton" type="button">格式化</button>
          <button class="button button-ghost" id="jsonMinifyButton" type="button">压缩</button>
          <button class="button button-ghost" id="jsonClearButton" type="button">清空</button>
        </div>
      </article>
      <article class="tool-card">
        <h3>处理结果</h3>
        <div class="result-panel code-block" id="jsonResult">输入 JSON 后查看结果。</div>
        <div class="result-panel" id="jsonSummary">可用于接口联调、日志排查、Webhook 数据查看和配置文件整理。</div>
      </article>
    </div>`;
  }

  return `<article class="tool-card"><p>当前站点未配置核心功能。</p></article>`;
}

function renderPromotionSection(site) {
  if (site.category !== "server-lead" || !site.promoteTarget) {
    return "";
  }

  return `<section class="section promo">
    <div class="section-head">
      <p class="eyebrow">相关资源</p>
      <h2>如果你已经进入服务器采购阶段</h2>
      <p>当前页面以教程和工具为主；当你已经明确需要购买服务器、补节点或比较带宽方案时，可以继续查看相关产品。</p>
    </div>
    <article class="card">
      <h3>服务器采购入口</h3>
      <p>如果你的需求已经从“学习怎么部署”进入到“准备实际购买节点或服务器”，可以继续前往 <a class="inline-link" href="${site.targetLink}">1bgp.com</a> 查看服务器产品与节点方案。</p>
      <p class="promo-note">这里只在主题相关的场景提供延伸入口，不会在无关内容里强插推广。</p>
    </article>
  </section>`;
}

function renderScript(site) {
  return `const site = window.__SITE_DATA__;

const featureKind = site.feature?.kind;

if (featureKind === "deploymentChecklist") {
  initChecklist();
}

if (featureKind === "serverSelector") {
  initServerSelector();
}

if (featureKind === "ratioCalculator") {
  initRatioCalculator();
}

if (featureKind === "utmBuilder") {
  initUtmBuilder();
}

if (featureKind === "jsonFormatter") {
  initJsonFormatter();
}

function initChecklist() {
  const storageKey = "deploy-checklist-" + site.slug;
  const items = [...document.querySelectorAll("[data-check-item]")];
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

  items.forEach((input, index) => {
    input.checked = saved.includes(index);
    input.addEventListener("change", () => {
      const active = items.filter((item) => item.checked).map((item) => Number(item.dataset.checkItem));
      localStorage.setItem(storageKey, JSON.stringify(active));
      updateChecklist();
    });
  });

  updateChecklist();

  function updateChecklist() {
    const done = items.filter((item) => item.checked).length;
    const total = items.length;
    const ratio = total === 0 ? 0 : Math.round((done / total) * 100);
    progressBar.style.width = ratio + "%";
    progressText.textContent = done + " / " + total + " 完成";
  }
}

function initServerSelector() {
  const button = document.getElementById("selectorButton");
  const result = document.getElementById("selectorResult");
  const workload = document.getElementById("workload");
  const region = document.getElementById("region");
  const budget = document.getElementById("budget");

  button.addEventListener("click", () => {
    const advice = createServerAdvice(workload.value, region.value, budget.value);
    result.textContent = advice;
  });
}

function createServerAdvice(workload, region, budget) {
  const regionHint = {
    "中国香港": "优先兼顾中文用户访问速度与部署灵活性",
    "新加坡": "适合东南亚或国际业务中转",
    "日本东京": "适合东亚访问与相对稳定的国际链路",
    "美国西海岸": "更适合海外产品、API 服务或全球访问"
  };

  const budgetHint = {
    low: "先从入门配置开始，观察 CPU 与带宽占用，再按业务增长加配。",
    mid: "建议选择平衡型配置，重点关注稳定性和回源速度。",
    high: "可以优先考虑更稳定的线路、冗余备份与监控告警。"
  };

  const workloadHint = {
    "个人博客": "博客和内容站更看重延迟稳定、SSL、缓存与备份。",
    "下载分发": "下载业务更看重峰值带宽、回源链路和文件缓存策略。",
    "跨境电商": "跨境电商需要兼顾地区访问速度、支付链路和营销页稳定性。",
    "API 服务": "API 服务要重点关注网络波动、监控、限流与可回滚部署。"
  };

  return [
    "建议节点：" + region + "。",
    regionHint[region] || "优先选择与你主要用户更接近的节点。",
    workloadHint[workload] || "请根据真实业务负载评估带宽与内存。",
    budgetHint[budget] || "建议优先保留可升级空间。"
  ].join("\\n\\n");
}

function initRatioCalculator() {
  const widthInput = document.getElementById("originWidth");
  const heightInput = document.getElementById("originHeight");
  const targetWidthInput = document.getElementById("targetWidth");
  const result = document.getElementById("ratioResult");
  const button = document.getElementById("ratioButton");
  const presets = [...document.querySelectorAll(".preset-button")];

  button.addEventListener("click", calculate);
  presets.forEach((preset) => {
    preset.addEventListener("click", () => {
      widthInput.value = preset.dataset.presetWidth;
      heightInput.value = preset.dataset.presetHeight;
      if (!targetWidthInput.value) {
        targetWidthInput.value = preset.dataset.presetWidth;
      }
      calculate();
    });
  });

  function calculate() {
    const width = Number(widthInput.value);
    const height = Number(heightInput.value);
    const targetWidth = Number(targetWidthInput.value);

    if (!width || !height || !targetWidth) {
      result.textContent = "请先输入有效的原始尺寸和目标宽度。";
      return;
    }

    const ratio = width / height;
    const targetHeight = Math.round(targetWidth / ratio);
    result.textContent = [
      "原始比例：" + width + " : " + height,
      "目标尺寸：" + targetWidth + " x " + targetHeight,
      "等比系数：" + (targetWidth / width).toFixed(3)
    ].join("\\n\\n");
  }
}

function initUtmBuilder() {
  const baseInput = document.getElementById("utmBase");
  const sourceInput = document.getElementById("utmSource");
  const mediumInput = document.getElementById("utmMedium");
  const campaignInput = document.getElementById("utmCampaign");
  const contentInput = document.getElementById("utmContent");
  const termInput = document.getElementById("utmTerm");
  const buildButton = document.getElementById("utmBuildButton");
  const copyButton = document.getElementById("utmCopyButton");
  const result = document.getElementById("utmResult");

  buildButton.addEventListener("click", build);
  copyButton.addEventListener("click", async () => {
    const text = result.dataset.link || "";
    if (!text) {
      result.textContent = "请先生成有效链接。";
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      result.textContent = text + "\\n\\n已复制到剪贴板。";
    } catch {
      result.textContent = text + "\\n\\n当前浏览器未授予复制权限，请手动复制。";
    }
  });

  function build() {
    const baseValue = baseInput.value.trim();
    if (!baseValue) {
      result.textContent = "请先输入落地页地址。";
      delete result.dataset.link;
      return;
    }

    const normalizedBase = /^https?:\\/\\//i.test(baseValue) ? baseValue : "https://" + baseValue;

    try {
      const url = new URL(normalizedBase);
      setIfPresent(url, "utm_source", sourceInput.value);
      setIfPresent(url, "utm_medium", mediumInput.value);
      setIfPresent(url, "utm_campaign", campaignInput.value);
      setIfPresent(url, "utm_content", contentInput.value);
      setIfPresent(url, "utm_term", termInput.value);
      const finalUrl = url.toString();
      result.dataset.link = finalUrl;
      result.textContent = [
        "最终链接：",
        finalUrl,
        "",
        "参数数量：" + [...url.searchParams.keys()].length
      ].join("\\n");
    } catch {
      result.textContent = "请输入有效的网址，例如 https://example.com/page 。";
      delete result.dataset.link;
    }
  }
}

function setIfPresent(url, key, value) {
  const normalized = value.trim();
  if (!normalized) {
    return;
  }
  url.searchParams.set(key, normalized);
}

function initJsonFormatter() {
  const input = document.getElementById("jsonInput");
  const result = document.getElementById("jsonResult");
  const summary = document.getElementById("jsonSummary");
  const formatButton = document.getElementById("jsonFormatButton");
  const minifyButton = document.getElementById("jsonMinifyButton");
  const clearButton = document.getElementById("jsonClearButton");

  formatButton.addEventListener("click", () => transform(false));
  minifyButton.addEventListener("click", () => transform(true));
  clearButton.addEventListener("click", () => {
    input.value = "";
    result.textContent = "输入 JSON 后查看结果。";
    summary.textContent = "可用于接口联调、日志排查、Webhook 数据查看和配置文件整理。";
  });

  function transform(minify) {
    const raw = input.value.trim();
    if (!raw) {
      result.textContent = "请先输入 JSON 内容。";
      summary.textContent = "支持对象、数组、布尔值、数字和字符串等标准 JSON。";
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const output = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      result.textContent = output;
      summary.textContent = [
        "顶层类型：" + getJsonKind(parsed),
        "字符数：" + output.length,
        "行数：" + output.split("\\n").length
      ].join(" | ");
    } catch (error) {
      result.textContent = "解析失败：\\n" + error.message;
      summary.textContent = "请检查逗号、引号、括号和末尾多余字符是否正确。";
    }
  }
}

function getJsonKind(value) {
  if (Array.isArray(value)) {
    return "数组";
  }
  if (value === null) {
    return "null";
  }
  return typeof value === "object" ? "对象" : typeof value;
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
