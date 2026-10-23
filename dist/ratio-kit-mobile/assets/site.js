const site = window.__SITE_DATA__;

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
  ].join("\n\n");
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
    ].join("\n\n");
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
      result.textContent = text + "\n\n已复制到剪贴板。";
    } catch {
      result.textContent = text + "\n\n当前浏览器未授予复制权限，请手动复制。";
    }
  });

  function build() {
    const baseValue = baseInput.value.trim();
    if (!baseValue) {
      result.textContent = "请先输入落地页地址。";
      delete result.dataset.link;
      return;
    }

    const normalizedBase = /^https?:\/\//i.test(baseValue) ? baseValue : "https://" + baseValue;

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
      ].join("\n");
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
        "行数：" + output.split("\n").length
      ].join(" | ");
    } catch (error) {
      result.textContent = "解析失败：\n" + error.message;
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
