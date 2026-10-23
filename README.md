# GitHub Pages Batch Builder

这是一个可持续批量创建和发布静态网站的 orchestrator 仓库。

它已经包含：

- 配置驱动的批量站点定义：`sites.config.json`
- 本地静态站生成器：`scripts/generate-sites.mjs`
- 根域名导航站导出器：`scripts/export-root-site.mjs`
- GitHub 仓库创建与批量发布脚本：`scripts/deploy-sites.mjs`
- 本地产物校验脚本：`scripts/verify-sites.mjs`
- 每 10 分钟运行一次的批量发布工作流：`.github/workflows/publish-sites.yml`

## 当前能力

- 批量定义多个站点，每个站点拥有独立仓库名、主题、描述、关键词和类型
- 生成两大类站点：
  - `server-lead`：服务器引流站，会在相关场景自然加入 `https://1bgp.com/`
  - `traffic`：普通流量站，默认不加入推广链接
- 输出完整静态站结构，包括：
  - 根域名导航首页：`/index.html`
  - `index.html`
  - `404.html`
  - `robots.txt`
  - `sitemap.xml`
  - `assets/site.css`
  - `assets/site.js`
  - `.github/workflows/deploy-pages.yml`
- 优先尝试把目标仓库配置为 GitHub Actions Pages 部署
- 若 Actions 模式 API 配置失败，自动降级为 `main / root` 的 Pages 分支模式

## 已内置的示例站点

- `vps-launch-checklist`
- `server-location-advisor`
- `ratio-kit-mobile`
- `utm-link-builder`
- `json-format-workbench`

这些示例不是简单换标题，而是包含不同的页面结构和不同的核心功能。

## 常用命令

```bash
npm run generate
npm run verify
npm run deploy
```

只部署单个站点：

```bash
node scripts/deploy-sites.mjs --slug=vps-launch-checklist
```

## 最少手动步骤

当前仓库已经具备自动化系统代码，但如果要真正创建远程仓库并发布，需要 GitHub 授权。

### 本地立即发布

```bash
gh auth login
npm run deploy
```

### 让当前仓库自动每 10 分钟批量发布

1. 把当前仓库推送到 `main`
2. 在仓库 `Settings -> Secrets and variables -> Actions` 新增 `GH_TOKEN`
3. `GH_TOKEN` 需要至少具备目标仓库创建、代码推送和 Pages 配置权限
4. 启用 GitHub Actions 后，工作流会按 `*/10 * * * *` 自动执行

## 配置站点

编辑 `sites.config.json`，每个站点可配置：

- `slug`
- `repo`
- `name`
- `tagline`
- `description`
- `keywords`
- `category`
- `topic`
- `theme`
- `promoteTarget`
- `customDomain`
- `feature`

## 说明

- 当前环境若没有有效 GitHub 登录，脚本不会伪造部署成功
- 所有站点路径都默认兼容 GitHub Pages 项目路径：`用户名.github.io/仓库名/`
- 后续你可以继续新增 feature 类型，实现更多工具站或引流站模板
