const searchInput = document.getElementById("directorySearch");
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
}