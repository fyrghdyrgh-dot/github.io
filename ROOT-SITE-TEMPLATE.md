# 根站模板架构

这套根站模板用于生成 `fyrghdyrgh-dot.github.io` 这类目录站，目标是：

- 首页负责聚合分类与入口
- 分类页负责承接较宽泛的主题词
- 子页面负责承接更具体的搜索词
- 服务器相关页面的主外链统一指向 `https://www.1bgp.com/`

## 当前结构

- 首页：`/`
- 分类页：`/{category-slug}/`
- 子页面：`/{page-slug}/`
- 静态资源：`/assets/*.css` 与 `/assets/site.js`

## 数据源

- 配置文件：`root-site.config.mjs`
- 生成脚本：`scripts/build-root-site.mjs`
- 输出目录：`root-home-site/`

## 分类层

当前模板内置这些主分类：

- 网络与开发工具
- 中文 AI 工具专题
- 越南语 AI 专题
- 服务器与 IDC
- 开发与编程
- 知识与文档
- 客服与用户运营
- 电商与产品内容
- 翻译与语言处理
- 数据处理
- 教育与学习

每个分类包含：

- `slug`
- `name`
- `english`
- `summary`
- `intro`
- `hubStyle`
- `theme`

## 页面模板

当前生成器支持 4 类子页面：

- `tool`
  - 适合浏览器内工具、输入输出示例、检查流程
  - 使用 `assets/tool.css`
- `guide`
  - 适合步骤型页面、清单页、操作说明页
  - 使用 `assets/guide.css`
- `service`
  - 适合服务器、IDC、方案咨询和购买引导页
  - 使用 `assets/service.css`
- `article`
  - 适合知识文档、教育学习、结构说明类页面
  - 使用 `assets/article.css`

## 视觉层

为了避免所有页面都长得一样，模板做了两层差异化：

- 分类层差异
  - 每个分类有自己的 `theme`
  - 分类页有不同的 `hubStyle`
- 页面层差异
  - 不同 `type` 使用不同 CSS 文件
  - 同一分类内页面可以共享版式，但颜色和重点不同

## SEO 结构

生成器会自动输出：

- `canonical`
- `og:title`
- `og:description`
- `twitter:card`
- 首页和分类页的 `CollectionPage` 结构化数据
- 子页的 `WebPage` 结构化数据
- `robots.txt`
- `sitemap.xml`
- `site-manifest.json`

## 服务器外链规则

- 服务器相关页面的主转化外链统一为 `https://www.1bgp.com/`
- 该规则在 `root-site.config.mjs` 的 `site.serverTarget` 中集中维护
- 后续扩展服务器类页面时，不要写成分散的多个主域名

## 扩展方式

后续如果你要继续新增几十个页面，优先按下面方式扩展：

1. 在 `root-site.config.mjs` 里新增分类，或向现有分类追加页面
2. 为新页面指定 `type`
3. 补充页面标题、摘要、关键词和相关链接
4. 运行：

```bash
npm run build:root-site
```

5. 发布 `root-home-site/` 到根站仓库

## 推荐扩展方向

下一批适合继续扩展的页面类型：

- 更多服务器地区页
- 更多中文 AI 工作流页
- 更多越南语本地化页
- 更多数据处理工具页
- 更多电商落地页结构页
- 更多客服 FAQ 场景页

## 维护原则

- 首页不要写成大而空的介绍页，而要持续保持“目录页”定位
- 分类页不要只堆链接，要有本分类的简要判断逻辑
- 子页面要承接具体关键词，不要只换标题
- 工具页优先保证可读、可用和可复制
- 服务页优先保证购买判断逻辑清楚，再做引导
