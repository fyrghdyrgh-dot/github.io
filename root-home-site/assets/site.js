const searchInput = document.getElementById("siteSearch");
const grid = document.getElementById("siteGrid");
const emptyTip = document.getElementById("emptyTip");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".entry-card")];

let activeFilter = "all";

if (searchInput) {
  searchInput.addEventListener("input", updateCards);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateCards();
  });
});

function updateCards() {
  const keyword = (searchInput?.value || "").trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const keywords = (card.dataset.keywords || "").toLowerCase();
    const type = card.dataset.type || "";
    const matchesKeyword = !keyword || text.includes(keyword) || keywords.includes(keyword);
    const matchesType =
      activeFilter === "all" ||
      (activeFilter === "server" && type === "server") ||
      (activeFilter === "tool" && type === "tool");

    const visible = matchesKeyword && matchesType;
    card.classList.toggle("hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  });

  if (emptyTip) {
    emptyTip.classList.toggle("hidden", visibleCount > 0);
  }

  document.querySelectorAll("[data-group]").forEach((section) => {
    const sectionCards = [...section.querySelectorAll(".entry-card")];
    const anyVisible = sectionCards.some((card) => !card.classList.contains("hidden"));
    section.classList.toggle("hidden", !anyVisible);
  });
}

updateCards();
