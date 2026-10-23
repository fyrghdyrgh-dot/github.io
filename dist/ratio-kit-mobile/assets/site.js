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

if (featureKind === "directoryHub") {
  initDirectoryHub();
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

function initDirectoryHub() {
  const search = document.getElementById("siteFilterInput");
  const counter = document.getElementById("siteCounter");
  const cards = [...document.querySelectorAll("[data-directory-item]")];

  if (search && counter && cards.length) {
    const applyFilter = () => {
      const keyword = String(search.value || "").trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const text = String(card.dataset.directoryItem || "").toLowerCase();
        const show = keyword.length === 0 || text.includes(keyword);
        card.hidden = !show;
        if (show) visible += 1;
      });
      counter.textContent = visible + " / " + cards.length;
    };

    search.addEventListener("input", applyFilter);
    applyFilter();
  }

  const toolRoot = document.querySelector("[data-tool-kind]");
  if (!toolRoot) return;

  const kind = String(toolRoot.dataset.toolKind || "");
  if (kind === "urlEncode") {
    bindOneToOneTool("toolInput", "toolOutput", (value) => encodeURIComponent(value));
  }

  if (kind === "urlDecode") {
    bindOneToOneTool("toolInput", "toolOutput", (value) => {
      try {
        return decodeURIComponent(value);
      } catch {
        return "无法解码：输入可能不是有效的百分号编码。";
      }
    });
  }

  if (kind === "base64Encode") {
    bindOneToOneTool("toolInput", "toolOutput", (value) => bytesToBase64(new TextEncoder().encode(value)));
  }

  if (kind === "base64Decode") {
    bindOneToOneTool("toolInput", "toolOutput", (value) => {
      try {
        const bytes = base64ToBytes(value.trim());
        return new TextDecoder().decode(bytes);
      } catch {
        return "无法解码：请确认输入是有效 Base64。";
      }
    });
  }

  if (kind === "ipv4Integer") {
    const input = document.getElementById("toolInput");
    const output = document.getElementById("toolOutput");
    const button = document.getElementById("toolButton");
    if (!input || !output || !button) return;

    button.addEventListener("click", () => {
      const raw = String(input.value || "").trim();
      if (!raw) {
        output.textContent = "请输入 IPv4 或整数。";
        return;
      }

      if (/^\d+$/.test(raw)) {
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0 || n > 4294967295) {
          output.textContent = "整数范围应在 0 到 4294967295 之间。";
          return;
        }
        output.textContent = integerToIpv4(n >>> 0);
        return;
      }

      const parsed = parseIpv4(raw);
      if (!parsed) {
        output.textContent = "IPv4 格式不正确。";
        return;
      }
      output.textContent = String(ipv4ToInteger(parsed));
    });
  }

  if (kind === "textCount") {
    const input = document.getElementById("toolInput");
    const output = document.getElementById("toolOutput");
    const button = document.getElementById("toolButton");
    if (!input || !output || !button) return;

    button.addEventListener("click", () => {
      const value = String(input.value || "");
      const bytes = new TextEncoder().encode(value).length;
      const codePoints = [...value].length;
      const lines = value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length;
      const words = (value.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)*/g) || []).length;
      const han = (value.match(/[\u4e00-\u9fff]/g) || []).length;

      output.textContent = [
        "代码点：" + codePoints,
        "字节(UTF-8)：" + bytes,
        "行数：" + lines,
        "英文词：" + words,
        "汉字：" + han
      ].join("\n");
    });
  }

  if (kind === "rot13") {
    bindOneToOneTool("toolInput", "toolOutput", (value) =>
      value.replace(/[A-Za-z]/g, (ch) => {
        const base = ch <= "Z" ? 65 : 97;
        return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
      })
    );
  }

  function bindOneToOneTool(inputId, outputId, handler) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    const button = document.getElementById("toolButton");
    if (!input || !output || !button) return;
    button.addEventListener("click", () => {
      output.textContent = handler(String(input.value || ""));
    });
  }

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function parseIpv4(value) {
    const parts = value.split(".").map((part) => part.trim());
    if (parts.length !== 4) return null;
    const nums = parts.map((part) => (part === "" ? NaN : Number(part)));
    if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
    return nums;
  }

  function ipv4ToInteger(parts) {
    return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
  }

  function integerToIpv4(n) {
    return [
      (n >>> 24) & 255,
      (n >>> 16) & 255,
      (n >>> 8) & 255,
      n & 255
    ].join(".");
  }
}
