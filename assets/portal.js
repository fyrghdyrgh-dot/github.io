const cards = [...document.querySelectorAll("[data-site-card]")];
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
