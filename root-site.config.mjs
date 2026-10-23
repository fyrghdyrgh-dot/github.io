const site = {
  title: "关键词导航与专题目录",
  description: "覆盖网络工具、AI 专题、服务器与 IDC、开发与编程、知识文档、电商内容、翻译语言、数据处理与教育学习的目录站。",
  baseUrl: "https://fyrghdyrgh-dot.github.io/",
  brand: "关键词目录",
  serverTarget: "https://www.1bgp.com/"
};

const categories = [
  {
    slug: "net-tools",
    name: "网络与开发工具",
    english: "Network & developer utilities",
    summary: "围绕 IP、CIDR、接口联调和部署前检查整理轻量工具与说明页。",
    intro: "适合从搜索进入后立刻使用，重点是把输入说明、结果说明和常见误区写清楚。",
    hubStyle: "grid",
    theme: { accent: "#0f766e", accentSoft: "#d9f4ef", surface: "#f7fffd", panel: "#ffffff", ink: "#13312d", muted: "#5b6f6a" }
  },
  {
    slug: "zh-ai-tools",
    name: "中文 AI 工具专题",
    english: "Chinese AI workflows",
    summary: "围绕中文写作、客服回复、提纲整理和内容润色整理专题页。",
    intro: "这类页面承接中文搜索词，强调使用场景、提问方式和结果验收标准。",
    hubStyle: "editorial",
    theme: { accent: "#be185d", accentSoft: "#fde7f1", surface: "#fff9fb", panel: "#ffffff", ink: "#3f1730", muted: "#7b5b6d" }
  },
  {
    slug: "vi-ai-tools",
    name: "越南语 AI 专题",
    english: "Vietnamese AI topics",
    summary: "适合越南语产品文案、客服表达、本地化措辞和双语协作场景。",
    intro: "这类页面更像场景化指南页，强调语言语气、市场表达和交付前检查。",
    hubStyle: "signal",
    theme: { accent: "#b45309", accentSoft: "#fff1dc", surface: "#fffaf2", panel: "#ffffff", ink: "#4a2d0d", muted: "#7d644b" }
  },
  {
    slug: "server-idc",
    name: "服务器与 IDC",
    english: "Servers and IDC",
    summary: "围绕香港服务器、CN2、Windows VPS 和 WordPress 部署做专题引导。",
    intro: "这部分页面的主引导统一到 1bgp，首页负责分类，专题页负责承接具体搜索词。",
    hubStyle: "showcase",
    theme: { accent: "#1d4ed8", accentSoft: "#dbeafe", surface: "#f8fbff", panel: "#ffffff", ink: "#172554", muted: "#64748b" }
  },
  {
    slug: "development",
    name: "开发与编程",
    english: "Development and programming",
    summary: "围绕 Python API、前端性能、接口调试和工程交付整理步骤型内容。",
    intro: "这类页面更偏操作型指南，适合做分步骤说明、检查清单和相关工具推荐。",
    hubStyle: "ledger",
    theme: { accent: "#4f46e5", accentSoft: "#e7e5ff", surface: "#fafaff", panel: "#ffffff", ink: "#24204c", muted: "#6b6893" }
  },
  {
    slug: "knowledge-docs",
    name: "知识与文档",
    english: "Knowledge and documentation",
    summary: "面向团队文档、产品规格、知识库结构和交付文档整理。",
    intro: "页面结构更适合做说明文、规范文和模板类内容，减少花哨样式，突出层次。",
    hubStyle: "library",
    theme: { accent: "#475467", accentSoft: "#e8ecf1", surface: "#fbfcfd", panel: "#ffffff", ink: "#1f2937", muted: "#667085" }
  },
  {
    slug: "customer-growth",
    name: "客服与用户运营",
    english: "Support and customer growth",
    summary: "围绕客服回复、FAQ 结构、私域承接和售前流程整理专题。",
    intro: "更偏运营落地，内容需要贴近真实业务，而不是概念化的营销空话。",
    hubStyle: "flow",
    theme: { accent: "#059669", accentSoft: "#d8fbeb", surface: "#f8fffb", panel: "#ffffff", ink: "#143a2b", muted: "#5a776a" }
  },
  {
    slug: "ecommerce-content",
    name: "电商与产品内容",
    english: "Ecommerce and product content",
    summary: "适合商品详情、落地页结构、卖点梳理和内容转化场景。",
    intro: "这类页面更像内容运营页，需要把卖点、结构和行动引导放在清晰位置。",
    hubStyle: "magazine",
    theme: { accent: "#ea580c", accentSoft: "#ffedd5", surface: "#fffaf5", panel: "#ffffff", ink: "#45260f", muted: "#8a644f" }
  },
  {
    slug: "translation-language",
    name: "翻译与语言处理",
    english: "Translation and language workflows",
    summary: "围绕多语校对、术语统一、中文越南语适配和语气调整整理。",
    intro: "这类页面适合放对照表、术语检查和使用说明，既能收录，也能直接使用。",
    hubStyle: "matrix",
    theme: { accent: "#7c3aed", accentSoft: "#efe7ff", surface: "#fbf9ff", panel: "#ffffff", ink: "#32184f", muted: "#73618d" }
  },
  {
    slug: "data-processing",
    name: "数据处理",
    english: "Data processing",
    summary: "覆盖 CSV 清洗、JSON 对比、文本整理和结构化处理的小工具与说明页。",
    intro: "更适合做浏览器内工具页，带示例输入输出和错误提示说明。",
    hubStyle: "lab",
    theme: { accent: "#0891b2", accentSoft: "#dff7ff", surface: "#f6fcff", panel: "#ffffff", ink: "#123544", muted: "#5e7883" }
  },
  {
    slug: "education-learning",
    name: "教育与学习",
    english: "Education and learning",
    summary: "适合学习路径、复盘模板、笔记方法和自学节奏相关页面。",
    intro: "内容更偏长线价值，不追求工具感，而是强调步骤、节奏和复用性。",
    hubStyle: "notebook",
    theme: { accent: "#c2410c", accentSoft: "#ffe7da", surface: "#fffaf7", panel: "#ffffff", ink: "#4a2411", muted: "#876453" }
  }
];

const pages = [
  {
    slug: "ipv4-subnet-toolkit",
    category: "net-tools",
    type: "tool",
    title: "IPv4 与 CIDR 常用工具",
    summary: "把 IP 地址分析、CIDR 网段计算和子网掩码换算放到一个专题页里，方便运维或开发做基础检查。",
    description: "适合 IP 与子网处理场景的工具页，承接 IPv4、CIDR、子网掩码等关键词搜索。",
    eyebrow: "IP & SUBNET TOOLKIT",
    ctaLabel: "打开现有工具站",
    ctaUrl: "https://fyrghdyrgh-dot.github.io/server-location-advisor/",
    secondaryLabel: "返回网络工具分类",
    metrics: [
      ["适合场景", "IP 检查 / 子网换算"],
      ["处理方式", "浏览器内完成"],
      ["配套内容", "示例与错误提示"]
    ],
    inputLabel: "待检查内容",
    inputExample: "192.168.1.10/24",
    outputExample: "{\n  \"网络地址\": \"192.168.1.0\",\n  \"首个可用地址\": \"192.168.1.1\",\n  \"末个可用地址\": \"192.168.1.254\"\n}",
    steps: [
      { title: "先确认输入格式", text: "输入前先看示例，保证没有多余说明文字、单位或换行符。" },
      { title: "运行后核对关键项", text: "重点看网络地址、广播地址、主机范围与掩码是否符合预期。" },
      { title: "保存结果再做变更", text: "上线前先保留原始输入与输出，后续排查更容易对照。" }
    ],
    notes: [
      "这类工具适合做格式与数值检查，不负责归属地、ASN 或代理判断。",
      "如果准备修改线上配置，建议先结合网关、路由器或云平台官方规则再执行。"
    ],
    faq: [
      ["为什么示例里先给固定输入？", "这样用户可以先验证字段格式和结果样式，再替换成自己的内容。"],
      ["结果需要上传吗？", "不需要，工具类页面应优先在浏览器本地处理，不要求登录。"]
    ],
    related: [
      ["CIDR 网段计算器", "https://mira8264.github.io/tool-cidr-range/"],
      ["IPv4 地址分析", "https://mira8264.github.io/tool-ipv4-info/"],
      ["API 联调检查清单", "/api-debug-checklist/"]
    ]
  },
  {
    slug: "api-debug-checklist",
    category: "net-tools",
    type: "guide",
    title: "API 联调检查清单",
    summary: "把接口联调时最容易漏掉的请求头、鉴权、错误码和环境差异集中整理到一个页面。",
    description: "围绕 API 联调、接口测试和错误排查整理的步骤型指南页。",
    eyebrow: "API DEBUG CHECKLIST",
    ctaLabel: "查看开发分类",
    ctaUrl: "/development/",
    secondaryLabel: "返回网络工具分类",
    metrics: [
      ["联调重点", "Header / Token / Env"],
      ["适用对象", "前后端 / 测试"],
      ["页面形式", "清单 + 对照"]
    ],
    pillars: [
      { title: "请求参数核对", text: "路径、Query、Body 字段和类型是否与接口约定一致。" },
      { title: "鉴权与权限", text: "确认 Token、签名、时间戳和角色权限是否匹配当前环境。" },
      { title: "错误返回记录", text: "保留状态码、错误消息和请求示例，避免只截图不留原始文本。" }
    ],
    checklist: [
      "先确认是测试环境还是正式环境，不要混用域名和 Token。",
      "把 Postman 示例和前端实际请求逐项比对，重点看 Header。",
      "发现 4xx 或 5xx 时，先记录原始请求与返回，再继续改动。"
    ],
    faq: [
      ["为什么同一个接口在前端和 Postman 结果不一样？", "常见原因是 Header、Cookie、跨域处理或请求体格式不同。"],
      ["联调记录应该怎么留？", "建议至少保留请求示例、返回结果、时间和环境说明。"]
    ],
    related: [
      ["Python API 开发指南", "/python-api-guide/"],
      ["JSON 格式化与对比", "/json-format-compare/"],
      ["IPv4 与 CIDR 常用工具", "/ipv4-subnet-toolkit/"]
    ]
  },
  {
    slug: "zh-ai-writing-assistant",
    category: "zh-ai-tools",
    type: "guide",
    title: "中文 AI 写作助手怎么用更稳",
    summary: "把写作目标、语气要求、结构限制和结果验收标准放在一页里，适合承接中文 AI 写作相关搜索。",
    description: "面向中文 AI 写作、内容整理和结构化输出的专题指导页。",
    eyebrow: "CHINESE AI WRITING",
    ctaLabel: "查看中文 AI 专题",
    ctaUrl: "/zh-ai-tools/",
    secondaryLabel: "查看客服回复专题",
    metrics: [
      ["常见用途", "提纲 / 摘要 / 初稿"],
      ["关键动作", "写清任务和限制"],
      ["适合人群", "内容编辑 / 运营"]
    ],
    pillars: [
      { title: "先写目标", text: "直接说明要写什么、给谁看、最终拿来做什么，而不是只给一个标题。" },
      { title: "再写限制", text: "包括长度、语气、是否要分段、是否允许营销词等边界条件。" },
      { title: "最后写验收标准", text: "告诉模型你要的是可发布初稿、提纲还是素材整理结果。" }
    ],
    checklist: [
      "先给出具体场景，比如公众号开头、客服回复或产品介绍。",
      "如果结果过泛，补一条“不要出现空话和套话”。",
      "拿到初稿后再做二次追问，而不是重新从零描述。"
    ],
    faq: [
      ["中文 AI 写作为什么经常看起来像模板？", "因为目标、限制和验收标准不够具体，模型会回到最安全的通用表达。"],
      ["怎么减少 AI 味？", "把行业背景、用户对象和不希望出现的表达都提前写进去。"]
    ],
    related: [
      ["中文 AI 客服回复", "/zh-ai-customer-reply/"],
      ["商品详情页文案结构", "/product-detail-copy/"],
      ["知识文档结构模板", "/docs-structure-template/"]
    ]
  },
  {
    slug: "zh-ai-customer-reply",
    category: "zh-ai-tools",
    type: "guide",
    title: "中文 AI 客服回复的写法",
    summary: "围绕咨询接待、售前答疑和售后解释场景，整理可直接复用的中文回复结构。",
    description: "面向中文 AI 客服回复与售前答疑场景的专题页。",
    eyebrow: "AI CUSTOMER REPLY",
    ctaLabel: "查看用户运营分类",
    ctaUrl: "/customer-growth/",
    secondaryLabel: "返回中文 AI 专题",
    metrics: [
      ["适用场景", "售前 / 售后 / FAQ"],
      ["内容重点", "清楚 / 有边界 / 可复制"],
      ["避免问题", "空话和过度承诺"]
    ],
    pillars: [
      { title: "先回答用户问题", text: "不要上来先铺垫品牌介绍，先给用户一个明确答复。" },
      { title: "再补限制说明", text: "如果有价格范围、时间差异或条件限制，要一次说明完整。" },
      { title: "最后给下一步动作", text: "例如补充需求、查看链接、联系客服或提交资料。" }
    ],
    checklist: [
      "每条回复尽量只处理一个问题主线，不要一段话塞太多信息。",
      "遇到价格、库存、时效这类变化项时，避免写死承诺。",
      "把常见回答整理成 FAQ，减少每次重新组织语言。"
    ],
    faq: [
      ["AI 客服回复最容易出什么问题？", "最常见的是回答太像模板，或者说了很多但没有给用户明确动作。"],
      ["适合直接复制给客服团队吗？", "可以先做初稿，再结合你自己的业务规则和语气做一轮校对。"]
    ],
    related: [
      ["私域 FAQ 知识库", "/private-domain-faq-library/"],
      ["中文 AI 写作助手", "/zh-ai-writing-assistant/"],
      ["客服回复 SOP", "/customer-service-reply-playbook/"]
    ]
  },
  {
    slug: "vi-ai-product-copy",
    category: "vi-ai-tools",
    type: "guide",
    title: "越南语商品文案怎么用 AI 起草",
    summary: "适合跨境商品标题、卖点整理和越南语营销描述场景，重点放在本地表达而不是逐字翻译。",
    description: "面向越南语商品文案与本地化表达的专题指导页。",
    eyebrow: "VIETNAMESE AI COPY",
    ctaLabel: "查看越南语 AI 专题",
    ctaUrl: "/vi-ai-tools/",
    secondaryLabel: "查看电商内容分类",
    metrics: [
      ["主要场景", "商品标题 / 卖点"],
      ["重点", "本地表达而非直译"],
      ["适合对象", "跨境运营"]
    ],
    pillars: [
      { title: "先给商品定位", text: "告诉模型商品用途、核心卖点和目标用户，而不是只给中文原文。" },
      { title: "标注语气方向", text: "是偏说明型、促销型还是平台规范型，越南语表达差异会很大。" },
      { title: "最后做人工校对", text: "尤其是尺寸、材质、优惠信息和平台规则，不能完全依赖自动生成。" }
    ],
    checklist: [
      "不要把中文长句直接逐字翻成越南语，先拆出卖点再重写。",
      "带品牌名或参数时，保持格式统一，方便平台批量上传。",
      "上线前最好找熟悉越南语场景的人再过一遍。"
    ],
    faq: [
      ["为什么越南语 AI 文案容易显得不自然？", "因为很多结果只是从中文直译，没有按当地平台语感重组。"],
      ["适合直接发到商品页吗？", "更适合作为初稿和提纲，正式上线前仍建议校对。"]
    ],
    related: [
      ["中文越南语本地化检查", "/zh-vi-localization-checklist/"],
      ["商品详情页文案结构", "/product-detail-copy/"],
      ["多语文案校对流程", "/multilingual-copy-review/"]
    ]
  },
  {
    slug: "zh-vi-localization-checklist",
    category: "vi-ai-tools",
    type: "article",
    title: "中文到越南语本地化检查清单",
    summary: "把直译风险、平台语气、单位表达和活动信息检查整合成一页，适合做上线前核对。",
    description: "围绕中文转越南语本地化场景的检查清单文章页。",
    eyebrow: "ZH TO VI REVIEW",
    ctaLabel: "查看翻译与语言分类",
    ctaUrl: "/translation-language/",
    secondaryLabel: "返回越南语 AI 专题",
    metrics: [
      ["页面类型", "清单文章"],
      ["重点", "语气 / 单位 / 平台表达"],
      ["适合环节", "上线前复核"]
    ],
    sections: [
      { title: "先检查是不是直译", text: "很多问题并不是词汇错误，而是句子结构、语气和信息顺序还停留在中文逻辑。" },
      { title: "再看平台规则", text: "电商平台、广告平台和客服场景对表达方式不同，不能直接混用同一套文案。" },
      { title: "最后确认数字与单位", text: "价格、尺寸、日期、活动信息必须单独核对，避免因为语言转换造成错误。 " }
    ],
    takeaways: [
      "本地化不只是翻译，更是把信息改写到目标市场读者容易接受的方式。",
      "涉及促销、售后和时效的内容，建议始终做人工复核。"
    ],
    faq: [
      ["本地化和翻译有什么区别？", "翻译更关注语义对应，本地化更关注目标市场是否易懂、自然和合规。"],
      ["这份清单适合谁用？", "适合跨境运营、内容编辑和做越南语商品页的人。"]
    ],
    related: [
      ["越南语商品文案怎么写", "/vi-ai-product-copy/"],
      ["多语文案校对流程", "/multilingual-copy-review/"],
      ["电商落地页结构", "/landing-page-structure/"]
    ]
  },
  {
    slug: "hongkong-server",
    category: "server-idc",
    type: "service",
    title: "香港服务器租用与业务匹配",
    summary: "围绕中文访问、跨境业务和网站部署场景，说明香港服务器的线路、带宽、IP 与配置选择方式。",
    description: "面向香港服务器、网站部署和跨境业务的服务型专题页。",
    eyebrow: "HONG KONG SERVER",
    ctaLabel: "获取配置与报价",
    ctaUrl: site.serverTarget,
    secondaryLabel: "查看服务器分类",
    metrics: [
      ["适合场景", "网站 / 电商 / 后台"],
      ["购买重点", "线路 / 带宽 / IP"],
      ["主引导", "1bgp"]
    ],
    audience: [
      "企业网站、内容站和需要兼顾中文访问体验的页面。",
      "跨境电商、独立站和希望先从香港节点起步的业务。",
      "准备从共享主机迁移到 VPS 的站点。"
    ],
    considerations: [
      "先按访问地区和高峰时段判断线路，而不是只看机房位置。",
      "带宽、流量、IP 数量与系统范围要在购买前问清楚。",
      "如果涉及迁移，要把备份窗口和回滚方式一起确认。"
    ],
    offers: [
      ["香港云服务器", "适合企业网站、内容页和中小型应用起步。"],
      ["香港独立服务器", "适合数据库、持续计算负载和更稳定的资源需求。"],
      ["香港多 IP 方案", "适合多站点管理、独立业务和 IP 资源规划。"]
    ],
    faq: [
      ["香港服务器一定比别的地区更适合中文站吗？", "通常会被优先比较，但最终仍要结合线路测试和用户分布判断。"],
      ["购买前最容易漏掉什么？", "常见是续费规则、IP 范围、系统授权和带宽计费方式。"]
    ],
    related: [
      ["CN2 线路服务器", "/cn2-server/"],
      ["Windows VPS", "/windows-vps/"],
      ["VPS 上线清单", "https://fyrghdyrgh-dot.github.io/vps-launch-checklist/"]
    ]
  },
  {
    slug: "cn2-server",
    category: "server-idc",
    type: "service",
    title: "CN2 线路服务器怎么选",
    summary: "面向关心国内访问体验和线路质量的业务，说明什么时候值得重点看 CN2，而不是只看低价方案。",
    description: "面向 CN2 线路、国内访问体验和节点选择的专题页。",
    eyebrow: "CN2 SERVER",
    ctaLabel: "查看 1bgp 方案",
    ctaUrl: site.serverTarget,
    secondaryLabel: "查看香港服务器",
    metrics: [
      ["适合人群", "中文站长"],
      ["关注点", "回程 / 稳定 / 高峰"],
      ["动作建议", "测试后再买"]
    ],
    audience: [
      "主要流量来自国内，需要尽量稳定访问的内容站和服务站。",
      "对页面打开速度、表单提交和接口访问更敏感的业务。",
      "长期运营站点，希望减少后期因为线路问题反复迁移。"
    ],
    considerations: [
      "线路重要，但不能替代 CPU、内存、磁盘与带宽本身的合理配置。",
      "如果访问用户不在国内，CN2 未必是第一优先级。",
      "咨询时最好按运营商和时段做测试，而不是只看宣传文字。"
    ],
    offers: [
      ["香港 CN2 线路", "适合先兼顾中文访问与香港节点起步。"],
      ["线路测试建议", "至少保留不同运营商、不同时间段的对照结果。"],
      ["预算判断", "如果访问质量直接影响转化，线路比纯低价更值得看。"]
    ],
    faq: [
      ["CN2 一定就是最好的吗？", "不是，只有当你的业务确实依赖国内访问质量时，它才更值得优先考虑。"],
      ["怎么判断要不要为线路多花预算？", "看访问体验是否直接影响询盘、注册、付款或后台使用。"]
    ],
    related: [
      ["香港服务器", "/hongkong-server/"],
      ["入门 VPS 购买指南", "/starter-vps-guide/"],
      ["服务器节点建议器", "https://fyrghdyrgh-dot.github.io/server-location-advisor/"]
    ]
  },
  {
    slug: "windows-vps",
    category: "server-idc",
    type: "service",
    title: "Windows VPS 购买前要看什么",
    summary: "适合远程桌面、Windows 软件环境和图形界面操作场景，重点在授权、内存与远程管理。",
    description: "围绕 Windows VPS、远程桌面和系统授权的服务页。",
    eyebrow: "WINDOWS VPS",
    ctaLabel: "咨询 Windows VPS",
    ctaUrl: site.serverTarget,
    secondaryLabel: "查看入门指南",
    metrics: [
      ["适合业务", "远程桌面"],
      ["重点", "授权 / 内存"],
      ["常见用途", "软件环境部署"]
    ],
    audience: [
      "依赖远程桌面或 Windows 软件环境的业务。",
      "更习惯图形界面运维，不想完全用命令行管理服务器的团队。",
      "需要特定 Windows 运行库或桌面环境的场景。"
    ],
    considerations: [
      "系统授权是否包含在报价内，续费怎么算。",
      "内存和磁盘是否足够支撑你要运行的软件。",
      "远程桌面安全、端口管理和备份方案要提前确认。"
    ],
    offers: [
      ["图形界面管理", "适合不想完全依赖命令行的使用方式。"],
      ["系统授权确认", "授权与系统版本要在开通前说清楚。"],
      ["远程操作习惯", "更适合需要桌面方式安装和配置的软件场景。"]
    ],
    faq: [
      ["普通建站一定需要 Windows VPS 吗？", "不一定，多数建站场景 Linux 就够用了，除非业务明确依赖 Windows。"],
      ["Windows VPS 最常漏掉什么？", "授权成本和远程桌面安全配置最容易被忽略。"]
    ],
    related: [
      ["WordPress VPS", "/wordpress-vps/"],
      ["香港服务器", "/hongkong-server/"],
      ["1bgp", site.serverTarget]
    ]
  },
  {
    slug: "wordpress-vps",
    category: "server-idc",
    type: "service",
    title: "WordPress VPS 不一定要高配",
    summary: "面向博客、企业站和内容站部署，重点放在地区、缓存、备份和后续扩容，而不是盲目堆配置。",
    description: "围绕 WordPress VPS、博客建站和内容站部署的专题页。",
    eyebrow: "WORDPRESS VPS",
    ctaLabel: "查看建站方案",
    ctaUrl: site.serverTarget,
    secondaryLabel: "查看上线清单",
    metrics: [
      ["适合对象", "博客 / 企业站"],
      ["关键点", "缓存 / 备份 / 地区"],
      ["系统偏好", "Linux"]
    ],
    audience: [
      "博客、资讯站、企业展示站和营销落地页。",
      "希望后续自己控制环境、插件和备份策略的站点。",
      "准备从轻量托管迁移到 VPS 的内容团队。"
    ],
    considerations: [
      "先按目标访问地区选节点，再决定是否需要更高带宽。",
      "图片、插件和缓存策略通常比盲目升配更影响体验。",
      "上线前要把证书、备份、监控和回滚流程补齐。"
    ],
    offers: [
      ["轻量起步配置", "大多数内容站可以先从适中配置开始，不必一开始上高配。"],
      ["环境和缓存", "Nginx、对象缓存和图片处理方式会显著影响结果。"],
      ["长期维护", "备份、更新和迁移策略要尽早确定。"]
    ],
    faq: [
      ["WordPress 一开始就要高配吗？", "多数情况下不用，先把环境、缓存和图片优化做好更重要。"],
      ["香港和新加坡怎么选？", "按你的用户地区决定，中文访问更重时通常先看香港。"]
    ],
    related: [
      ["香港服务器", "/hongkong-server/"],
      ["入门 VPS 购买指南", "/starter-vps-guide/"],
      ["VPS 上线清单", "https://fyrghdyrgh-dot.github.io/vps-launch-checklist/"]
    ]
  },
  {
    slug: "starter-vps-guide",
    category: "server-idc",
    type: "guide",
    title: "新手第一次买 VPS 的判断顺序",
    summary: "把地区、系统、带宽和配置起步顺序整理成一页，适合第一次买服务器的人快速建立判断框架。",
    description: "面向 VPS 新手和初次购买者的步骤型指南页。",
    eyebrow: "STARTER VPS",
    ctaLabel: "前往 1bgp 看方案",
    ctaUrl: site.serverTarget,
    secondaryLabel: "查看服务器分类",
    metrics: [
      ["适合对象", "第一次买 VPS"],
      ["核心问题", "地区 / 系统 / 预算"],
      ["建议方式", "先小配验证"]
    ],
    pillars: [
      { title: "先看用户地区", text: "地区通常决定节点方向，先看香港、新加坡还是其他地区。" },
      { title: "再看系统和用途", text: "建站、接口、远程桌面不同，系统和资源方向完全不同。" },
      { title: "最后再看配置", text: "CPU、内存和带宽应围绕真实负载，而不是只看别人推荐。 " }
    ],
    checklist: [
      "先确认是内容站、工具站还是后台系统，不同用途差异很大。",
      "不要只看低价，还要看续费、带宽和售后响应。",
      "如果还没验证业务，先选更灵活的周期测试。"
    ],
    faq: [
      ["第一次买 VPS 要不要直接年付？", "如果业务和地区还没验证，通常先测试一段时间会更稳妥。"],
      ["配置不够以后还能升级吗？", "多数情况下可以，所以起步更重要的是方向正确。"]
    ],
    related: [
      ["香港服务器", "/hongkong-server/"],
      ["Windows VPS", "/windows-vps/"],
      ["WordPress VPS", "/wordpress-vps/"]
    ]
  },
  {
    slug: "python-api-guide",
    category: "development",
    type: "guide",
    title: "Python API 开发指南从接口设计开始",
    summary: "适合接口开发、参数约定和错误返回设计场景，重点是让前后端和测试都能看懂。",
    description: "面向 Python API、接口设计和联调流程的指南页。",
    eyebrow: "PYTHON API GUIDE",
    ctaLabel: "查看开发与编程分类",
    ctaUrl: "/development/",
    secondaryLabel: "查看 API 联调清单",
    metrics: [
      ["适合阶段", "设计 / 联调 / 交付"],
      ["重点", "参数与错误码"],
      ["对象", "后端 / 前端 / 测试"]
    ],
    pillars: [
      { title: "接口约定先写清楚", text: "路径、参数、字段类型和错误码越早统一，后面返工越少。" },
      { title: "日志与错误信息要可追踪", text: "方便联调，也方便上线后排查。" },
      { title: "示例请求比口头说明更有效", text: "至少准备一组成功和一组失败示例。 " }
    ],
    checklist: [
      "统一字段命名风格，不要中途切换大小写规则。",
      "把错误返回与权限问题分开说明，减少误判。",
      "上线前保留最小可复现请求样例。"
    ],
    faq: [
      ["接口文档应该什么时候补？", "最好在联调前就写出最小版本，不要等上线后补。"],
      ["示例返回值有必要写吗？", "有，尤其是嵌套字段和错误返回。"]
    ],
    related: [
      ["API 联调检查清单", "/api-debug-checklist/"],
      ["JSON 格式化与对比", "/json-format-compare/"],
      ["产品规格文档流程", "/product-spec-workflow/"]
    ]
  },
  {
    slug: "frontend-performance-checklist",
    category: "development",
    type: "guide",
    title: "前端性能检查清单",
    summary: "适合落地页、工具站和内容页上线前做基础性能复查，重点是资源加载、图片、字体和首屏结构。",
    description: "面向前端性能优化和上线前检查的指南页。",
    eyebrow: "FRONTEND PERFORMANCE",
    ctaLabel: "查看开发与编程分类",
    ctaUrl: "/development/",
    secondaryLabel: "查看比例计算工具",
    metrics: [
      ["适合页面", "落地页 / 工具站"],
      ["重点", "首屏 / 图片 / 字体"],
      ["适合时机", "上线前复查"]
    ],
    pillars: [
      { title: "先减首屏负担", text: "不要把太多卡片、图像和外链脚本全部压在首屏。" },
      { title: "再查图片与字体", text: "图片尺寸、压缩方式和字体加载策略经常决定体验上限。" },
      { title: "最后再补交互", text: "搜索、筛选和动画要在页面清晰可读之后再加。 " }
    ],
    checklist: [
      "减少不必要的大标题和过重的视觉块，先保证可读性。",
      "优先使用系统字体或更轻量的字体加载方式。",
      "移动端按钮、输入框和结果区要尽量在首屏附近。"
    ],
    faq: [
      ["性能优化是不是一定要很技术？", "不一定，很多改动只是减少无意义模块和更合理的首屏层次。"],
      ["工具站要不要做很多动画？", "通常不建议，工具站更需要快、稳和易读。"]
    ],
    related: [
      ["比例计算小工具", "https://fyrghdyrgh-dot.github.io/ratio-kit-mobile/"],
      ["落地页结构模板", "/landing-page-structure/"],
      ["自学路线图", "/self-study-roadmap/"]
    ]
  },
  {
    slug: "docs-structure-template",
    category: "knowledge-docs",
    type: "article",
    title: "知识文档结构模板怎么搭",
    summary: "适合内部知识库、项目文档和操作说明页，重点是结构清晰、可更新、可复用。",
    description: "围绕知识文档结构和团队文档组织方式的文章页。",
    eyebrow: "DOCS STRUCTURE",
    ctaLabel: "查看知识与文档分类",
    ctaUrl: "/knowledge-docs/",
    secondaryLabel: "查看产品规格流程",
    metrics: [
      ["页面类型", "结构模板"],
      ["适合对象", "项目文档 / 知识库"],
      ["核心目标", "可查找 / 可维护"]
    ],
    sections: [
      { title: "先分场景再分层级", text: "按产品、流程、问题排查或角色来划分，会比按部门名更容易被真正使用。" },
      { title: "正文不要写成流水账", text: "建议固定结构，例如背景、步骤、注意事项、FAQ 和相关文档。" },
      { title: "给文档设置更新入口", text: "让读者知道谁负责、什么时候更新、哪些内容已经过期。 " }
    ],
    takeaways: [
      "文档结构的目标不是好看，而是让团队能在需要的时候快速找到正确内容。",
      "如果一份文档需要频繁被引用，就应该有稳定标题、清晰分段和相关链接。"
    ],
    faq: [
      ["知识库为什么总是建了却没人用？", "常见原因是目录按管理视角组织，而不是按使用场景组织。"],
      ["文档适合写多长？", "只要结构清晰、能快速定位，长短不是核心问题。"]
    ],
    related: [
      ["产品规格文档流程", "/product-spec-workflow/"],
      ["中文 AI 写作助手", "/zh-ai-writing-assistant/"],
      ["学习笔记方法", "/study-notes-method/"]
    ]
  },
  {
    slug: "product-spec-workflow",
    category: "knowledge-docs",
    type: "article",
    title: "产品规格文档应该怎么写更好协作",
    summary: "适合产品、设计、开发协作场景，重点放在范围、验收、依赖和变更记录。",
    description: "面向产品规格文档与跨角色协作的文章页。",
    eyebrow: "PRODUCT SPEC",
    ctaLabel: "查看知识与文档分类",
    ctaUrl: "/knowledge-docs/",
    secondaryLabel: "查看开发分类",
    metrics: [
      ["适合角色", "产品 / 设计 / 开发"],
      ["关键模块", "范围 / 验收 / 依赖"],
      ["页面类型", "协作文档"]
    ],
    sections: [
      { title: "先把范围写清楚", text: "如果边界不清，后面所有排期和验收都会跟着模糊。" },
      { title: "验收标准要可检查", text: "不要只写“优化体验”，要写成具体行为和结果。 " },
      { title: "变更记录不能缺", text: "需求调整、优先级变化和接口变更都应该能追溯。 " }
    ],
    takeaways: [
      "规格文档不是单给开发看的，也应该能让设计、测试和运营快速理解改动范围。",
      "好的规格文档会减少会后补充说明和重复追问。"
    ],
    faq: [
      ["产品规格文档和需求文档一样吗？", "相关但不完全相同，规格文档更强调范围、规则和验收细节。"],
      ["规格文档需要多完整才开始做？", "至少要把主流程、边界和验收标准写到可执行。"]
    ],
    related: [
      ["Python API 开发指南", "/python-api-guide/"],
      ["知识文档结构模板", "/docs-structure-template/"],
      ["落地页结构模板", "/landing-page-structure/"]
    ]
  },
  {
    slug: "customer-service-reply-playbook",
    category: "customer-growth",
    type: "guide",
    title: "客服回复 SOP 怎么整理",
    summary: "围绕售前咨询、价格说明、时效答复和问题升级场景，整理更实用的回复 SOP。",
    description: "面向客服回复和用户运营流程的指南页。",
    eyebrow: "SUPPORT PLAYBOOK",
    ctaLabel: "查看客服与用户运营分类",
    ctaUrl: "/customer-growth/",
    secondaryLabel: "查看 FAQ 知识库",
    metrics: [
      ["适合对象", "客服 / 运营"],
      ["重点", "清楚 / 高效 / 可升级"],
      ["常见场景", "咨询 / 售后"]
    ],
    pillars: [
      { title: "先按问题类型分组", text: "价格、时效、售后、登录、发票等问题不应该混在同一套模板里。" },
      { title: "对变化项留余地", text: "价格、库存和时间等内容不要写成绝对承诺。" },
      { title: "给升级场景留出口", text: "遇到特殊情况时，要告诉客服何时转人工或升级处理。 " }
    ],
    checklist: [
      "把最常见的十类问题先整理出来，再逐步扩展。",
      "每条回复模板最好配一条“使用边界”说明。",
      "高频问题应回流到 FAQ 或产品页，而不是只留在聊天里。"
    ],
    faq: [
      ["SOP 会不会让客服回复太机械？", "如果模板只写一句固定话术会，但如果写清楚结构和边界反而更灵活。"],
      ["回复模板多久更新一次？", "建议按高频问题和产品变化节奏更新。"]
    ],
    related: [
      ["私域 FAQ 知识库", "/private-domain-faq-library/"],
      ["中文 AI 客服回复", "/zh-ai-customer-reply/"],
      ["商品详情页文案结构", "/product-detail-copy/"]
    ]
  },
  {
    slug: "private-domain-faq-library",
    category: "customer-growth",
    type: "article",
    title: "私域 FAQ 知识库应该怎么搭",
    summary: "适合承接咨询、减少重复答疑和沉淀常见问题，重点是分类、检索和回链。",
    description: "面向 FAQ 知识库与用户运营承接的文章页。",
    eyebrow: "FAQ LIBRARY",
    ctaLabel: "查看客服与用户运营分类",
    ctaUrl: "/customer-growth/",
    secondaryLabel: "查看知识与文档分类",
    metrics: [
      ["适合用途", "减少重复答疑"],
      ["重点", "分类 / 检索 / 回链"],
      ["页面类型", "知识库文章"]
    ],
    sections: [
      { title: "不要只按内部视角分类", text: "用户不会按部门结构提问，更常按价格、物流、退款、账户等问题去找答案。" },
      { title: "每条 FAQ 都要有去向", text: "好的 FAQ 不只是解答，还会把用户引到下一步动作，例如查看产品页或提交资料。" },
      { title: "FAQ 应该能回流到页面", text: "客服高频问题、表单问题和售后解释都应反向更新回 FAQ。 " }
    ],
    takeaways: [
      "FAQ 是私域承接的重要基础设施，不只是一个补充页面。",
      "如果 FAQ 不能被搜索和被回链，它很快就会失去价值。"
    ],
    faq: [
      ["FAQ 适合做成单页还是多页？", "高频问题多时更适合拆成多页专题，首页只做入口和分类。"],
      ["FAQ 应该多正式？", "重点是清楚和可信，不必堆太多营销语言。"]
    ],
    related: [
      ["客服回复 SOP", "/customer-service-reply-playbook/"],
      ["知识文档结构模板", "/docs-structure-template/"],
      ["中文 AI 客服回复", "/zh-ai-customer-reply/"]
    ]
  },
  {
    slug: "product-detail-copy",
    category: "ecommerce-content",
    type: "guide",
    title: "商品详情页文案结构怎么排更顺",
    summary: "把标题、卖点、对比、使用说明和行动引导拆成更适合商品详情页的顺序。",
    description: "面向商品详情页文案结构和转化逻辑的指南页。",
    eyebrow: "PRODUCT DETAIL COPY",
    ctaLabel: "查看电商与产品内容分类",
    ctaUrl: "/ecommerce-content/",
    secondaryLabel: "查看落地页结构",
    metrics: [
      ["适合对象", "电商运营"],
      ["重点", "卖点排序"],
      ["常见页面", "详情页 / 商品页"]
    ],
    pillars: [
      { title: "先让用户知道卖什么", text: "标题和首屏文案要先明确商品是什么、适合谁、解决什么问题。" },
      { title: "卖点按理解顺序排", text: "不要平铺十几个点，优先展示最能帮助判断的三到五个信息。" },
      { title: "最后再给购买动作", text: "当用户已经理解商品信息后，再给出下单、咨询或查看规格的动作。 " }
    ],
    checklist: [
      "标题、主图文案和规格说明之间不能互相矛盾。",
      "如果有材质、尺寸或套餐差异，最好用表格或分项结构说明。",
      "把常见疑问提前回答，能减少客服重复解释。"
    ],
    faq: [
      ["详情页是不是越长越好？", "不是，关键是信息顺序和是否真正帮助用户判断。"],
      ["适合用 AI 直接生成整页吗？", "更适合作为结构和初稿辅助，正式上线前要结合产品事实再修。"]
    ],
    related: [
      ["落地页结构模板", "/landing-page-structure/"],
      ["中文 AI 写作助手", "/zh-ai-writing-assistant/"],
      ["越南语商品文案", "/vi-ai-product-copy/"]
    ]
  },
  {
    slug: "landing-page-structure",
    category: "ecommerce-content",
    type: "article",
    title: "落地页结构模板怎么搭更像真实页面",
    summary: "围绕首屏、信任信息、卖点顺序和 CTA 位置，整理更适合落地页的结构思路。",
    description: "面向落地页结构与产品内容页组织方式的文章页。",
    eyebrow: "LANDING PAGE STRUCTURE",
    ctaLabel: "查看电商与产品内容分类",
    ctaUrl: "/ecommerce-content/",
    secondaryLabel: "查看前端性能清单",
    metrics: [
      ["页面类型", "结构模板"],
      ["重点", "首屏 / 信任 / CTA"],
      ["适用场景", "产品页 / 活动页"]
    ],
    sections: [
      { title: "首屏先给判断依据", text: "访问者需要在几秒内知道这页讲什么、适合谁、下一步做什么。" },
      { title: "信任信息要早出现", text: "案例、对比、参数、常见问题和联系方式不应该都压在页尾。" },
      { title: "CTA 不要只出现一次", text: "首屏、中段和页尾都可以有动作入口，但文案应贴合当前内容。 " }
    ],
    takeaways: [
      "真实落地页的重点不是把元素堆满，而是让阅读路径自然。",
      "如果所有模块都长得一样，用户会更快跳出。"
    ],
    faq: [
      ["为什么很多落地页看起来像模板？", "因为结构没有围绕具体产品重写，只是在重复通用模块。"],
      ["CTA 放几个合适？", "通常至少首屏一个、中段一个、页尾一个，但要根据内容节奏安排。"]
    ],
    related: [
      ["商品详情页文案结构", "/product-detail-copy/"],
      ["前端性能检查清单", "/frontend-performance-checklist/"],
      ["中文 AI 写作助手", "/zh-ai-writing-assistant/"]
    ]
  },
  {
    slug: "zh-vi-localization",
    category: "translation-language",
    type: "guide",
    title: "中文与越南语本地化协作怎么分工",
    summary: "适合双语内容、商品页和客服内容本地化场景，重点在术语、语气和最终校对流程。",
    description: "围绕中文与越南语本地化协作的指导页。",
    eyebrow: "ZH / VI LOCALIZATION",
    ctaLabel: "查看翻译与语言分类",
    ctaUrl: "/translation-language/",
    secondaryLabel: "查看越南语 AI 专题",
    metrics: [
      ["适合场景", "商品 / 客服 / 活动页"],
      ["重点", "术语 / 语气 / 校对"],
      ["对象", "内容编辑 / 运营"]
    ],
    pillars: [
      { title: "先统一术语", text: "品牌名、功能名、优惠名和尺寸单位最好先建立对照表。" },
      { title: "再区分场景语气", text: "商品页、活动页和客服回复的语气差异很大，不能共用一套话术。 " },
      { title: "最后安排上线前校对", text: "涉及价格、时效和活动承诺的信息要单独复核。 " }
    ],
    checklist: [
      "先把高频术语固定，再做批量翻译。",
      "不要把促销文案、按钮文案和客服话术混为一套模板。",
      "上线后根据实际询盘和点击反馈继续调整词语。"
    ],
    faq: [
      ["为什么同一句中文转成越南语会有多种版本？", "因为表达语气、平台环境和用户对象不同，合理版本不止一种。"],
      ["适合先机器翻译再改吗？", "适合作为初稿，但正式上线前仍需校对。"]
    ],
    related: [
      ["中文到越南语本地化检查", "/zh-vi-localization-checklist/"],
      ["多语文案校对流程", "/multilingual-copy-review/"],
      ["越南语商品文案", "/vi-ai-product-copy/"]
    ]
  },
  {
    slug: "multilingual-copy-review",
    category: "translation-language",
    type: "tool",
    title: "多语文案校对流程与检查点",
    summary: "适合做中英越等多语内容上线前核对，重点在术语统一、长度控制和链接跳转检查。",
    description: "面向多语文案校对与内容上线检查的工具型页面。",
    eyebrow: "COPY REVIEW WORKFLOW",
    ctaLabel: "查看翻译与语言分类",
    ctaUrl: "/translation-language/",
    secondaryLabel: "查看数据处理分类",
    metrics: [
      ["适合阶段", "上线前复核"],
      ["检查点", "术语 / 链接 / 长度"],
      ["页面形式", "检查流程页"]
    ],
    inputLabel: "待校对内容",
    inputExample: "主标题：香港服务器租用\n按钮：立即咨询\n优惠：首月优惠",
    outputExample: "1. 主标题语义一致\n2. 按钮长度可接受\n3. 优惠信息需核对时效",
    steps: [
      { title: "先核对术语与产品名", text: "品牌名、功能名和活动名要统一，否则多语版本会互相打架。" },
      { title: "再核对按钮与链接", text: "按钮长度、跳转地址和锚点文本要逐项看，不要只检查正文。 " },
      { title: "最后看限制性内容", text: "价格、时效、活动范围和售后承诺必须单独确认。 " }
    ],
    notes: [
      "多语文案校对不是只看翻译是否对，还要看页面是否真的能用。",
      "如果不同语言版本跳向不同页面或按钮太长，转化会直接受影响。"
    ],
    faq: [
      ["多语校对为什么要专门留流程？", "因为真正出问题的往往是按钮、链接、活动信息和术语不统一。"],
      ["适合做成清单吗？", "适合，尤其适合给内容编辑和运营反复复用。"]
    ],
    related: [
      ["中文与越南语本地化", "/zh-vi-localization/"],
      ["CSV 清洗与整理", "/csv-cleanup-workflow/"],
      ["商品详情页文案结构", "/product-detail-copy/"]
    ]
  },
  {
    slug: "csv-cleanup-workflow",
    category: "data-processing",
    type: "tool",
    title: "CSV 清洗与整理工作流",
    summary: "围绕表头统一、空值处理、去重和导出检查，整理更适合日常内容和运营数据处理的页面。",
    description: "面向 CSV 清洗与轻量数据整理的工具型页面。",
    eyebrow: "CSV CLEANUP WORKFLOW",
    ctaLabel: "查看数据处理分类",
    ctaUrl: "/data-processing/",
    secondaryLabel: "查看 JSON 工具",
    metrics: [
      ["适合数据", "表格 / 导出文件"],
      ["重点", "去重 / 空值 / 表头"],
      ["页面形式", "工具流程"]
    ],
    inputLabel: "待整理内容",
    inputExample: "name,email,city\nAlice,alice@example.com,Shanghai\nAlice,alice@example.com,Shanghai",
    outputExample: "已识别 2 行数据\n重复记录 1 条\n建议先统一表头再去重",
    steps: [
      { title: "先统一字段名", text: "表头不统一时，后面的去重和合并都很容易出错。" },
      { title: "再处理空值与重复", text: "区分是可以删除、需要补齐，还是需要单独保留说明。 " },
      { title: "最后再导出", text: "导出前再随机抽样几条记录，确认编码和分隔符没有问题。 " }
    ],
    notes: [
      "CSV 处理常见问题不是公式，而是表头不统一、编码混乱和手动改动造成的结构差异。",
      "如果要重复处理同一类文件，最好把清洗顺序固定下来。"
    ],
    faq: [
      ["为什么 CSV 清洗后还是导入失败？", "常见原因是编码、分隔符或列顺序仍然不符合目标系统要求。"],
      ["去重前要不要先备份？", "建议保留原始文件，后续更容易回查。"]
    ],
    related: [
      ["JSON 格式化与对比", "/json-format-compare/"],
      ["多语文案校对流程", "/multilingual-copy-review/"],
      ["知识文档结构模板", "/docs-structure-template/"]
    ]
  },
  {
    slug: "json-format-compare",
    category: "data-processing",
    type: "tool",
    title: "JSON 格式化与结构对比",
    summary: "适合接口调试、结构核对和前后端联调时快速检查 JSON 是否完整、嵌套是否一致。",
    description: "围绕 JSON 格式化、结构比对和联调辅助的工具型页面。",
    eyebrow: "JSON FORMAT & DIFF",
    ctaLabel: "查看数据处理分类",
    ctaUrl: "/data-processing/",
    secondaryLabel: "查看 API 指南",
    metrics: [
      ["适合场景", "接口联调"],
      ["重点", "格式 / 层级 / 字段"],
      ["对象", "前后端 / 测试"]
    ],
    inputLabel: "JSON 输入",
    inputExample: "{ \"code\": 0, \"data\": { \"name\": \"demo\" } }",
    outputExample: "{\n  \"code\": 0,\n  \"data\": {\n    \"name\": \"demo\"\n  }\n}",
    steps: [
      { title: "先校验格式", text: "确认引号、逗号和括号层级是否正确，避免结构错误影响联调。" },
      { title: "再看字段差异", text: "重点看是否少字段、字段名不同或嵌套层级改变。 " },
      { title: "最后保存示例", text: "把成功和失败示例都留存，方便后续定位问题。 " }
    ],
    notes: [
      "JSON 工具页适合配合接口文档一起使用，让开发和测试看到同一套结构。",
      "如果返回值经常变化，建议同步更新示例，而不是只在聊天里口头说明。"
    ],
    faq: [
      ["为什么格式正确仍然联调失败？", "可能是字段语义、类型或层级不匹配，而不只是语法问题。"],
      ["适合给非技术同事看吗？", "适合，只要配清楚字段说明和成功示例。"]
    ],
    related: [
      ["Python API 开发指南", "/python-api-guide/"],
      ["API 联调检查清单", "/api-debug-checklist/"],
      ["CSV 清洗与整理", "/csv-cleanup-workflow/"]
    ]
  },
  {
    slug: "self-study-roadmap",
    category: "education-learning",
    type: "article",
    title: "自学路线图应该怎么排更容易坚持",
    summary: "适合做长期学习规划，重点不是列一堆课程，而是把目标、周期和复盘方式放进计划里。",
    description: "面向自学路线图与学习规划的文章页。",
    eyebrow: "SELF STUDY ROADMAP",
    ctaLabel: "查看教育与学习分类",
    ctaUrl: "/education-learning/",
    secondaryLabel: "查看学习笔记方法",
    metrics: [
      ["适合对象", "长期自学者"],
      ["重点", "目标 / 周期 / 复盘"],
      ["页面类型", "学习文章"]
    ],
    sections: [
      { title: "先定目标，不要先囤资料", text: "先明确三个月后要做到什么，再倒推需要哪些内容和练习。" },
      { title: "周期越短越容易坚持", text: "与其做半年计划，不如先做两周到四周的小周期。 " },
      { title: "复盘比补课更重要", text: "如果学了很多却没有输出、没有记录，路线图很快就会失效。 " }
    ],
    takeaways: [
      "学习路线图不是课程清单，而是一套能持续执行的节奏安排。",
      "真正有效的路线图通常都带有明确产出和复盘节点。"
    ],
    faq: [
      ["自学路线图需要多详细？", "详细到知道下一步做什么就够，不必写成无法执行的超大计划。"],
      ["为什么总是容易中断？", "常见原因是目标太模糊、周期太长或没有固定复盘。"]
    ],
    related: [
      ["学习笔记方法", "/study-notes-method/"],
      ["前端性能检查清单", "/frontend-performance-checklist/"],
      ["知识文档结构模板", "/docs-structure-template/"]
    ]
  },
  {
    slug: "study-notes-method",
    category: "education-learning",
    type: "guide",
    title: "学习笔记方法怎样更容易复用",
    summary: "围绕课程笔记、项目笔记和复盘整理，说明什么信息值得记、怎么记、怎么回看。",
    description: "面向学习笔记与复盘方法的步骤型页面。",
    eyebrow: "STUDY NOTES METHOD",
    ctaLabel: "查看教育与学习分类",
    ctaUrl: "/education-learning/",
    secondaryLabel: "查看知识文档分类",
    metrics: [
      ["常见场景", "课程 / 项目 / 复盘"],
      ["重点", "结构 / 回看 / 复用"],
      ["适合人群", "学生 / 自学者"]
    ],
    pillars: [
      { title: "只记会复用的信息", text: "概念、步骤、例子和常见错误通常最值得留下。" },
      { title: "笔记需要可回看", text: "如果回头找不到重点，再多笔记也很难真正用起来。 " },
      { title: "学完要写一段自己的话", text: "用自己的语言复述，比直接复制原文更容易形成理解。 " }
    ],
    checklist: [
      "每次笔记最好包含背景、步骤、例子和注意事项。",
      "把零散摘录整理成自己的结构，而不是无限堆原文截图。",
      "隔一段时间回看并补充真实使用中的问题。"
    ],
    faq: [
      ["学习笔记一定要很完整吗？", "不一定，关键是回头能看懂、能复用。"],
      ["笔记和知识文档有什么不同？", "笔记更偏个人理解，知识文档更偏团队协作和共享。"]
    ],
    related: [
      ["自学路线图", "/self-study-roadmap/"],
      ["知识文档结构模板", "/docs-structure-template/"],
      ["产品规格文档流程", "/product-spec-workflow/"]
    ]
  }
];

export default {
  site,
  categories,
  pages
};
