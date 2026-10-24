const searchInput = document.getElementById("directorySearch");
const groups = [...document.querySelectorAll("[data-group]")];
const emptyState = document.getElementById("emptyState");

if (searchInput) {
  const update = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleGroups = 0;

    groups.forEach((group) => {
      const cards = [...group.querySelectorAll("[data-card]")];
      let visibleCards = 0;

      cards.forEach((card) => {
        const text = (card.dataset.keywords || "").toLowerCase();
        const matches = !keyword || text.includes(keyword);
        card.classList.toggle("hidden", !matches);
        if (matches) {
          visibleCards += 1;
        }
      });

      if (cards.length > 0) {
        group.classList.toggle("hidden", visibleCards === 0);
        if (visibleCards > 0) {
          visibleGroups += 1;
        }
      } else {
        const text = (group.dataset.keywords || "").toLowerCase();
        const matches = !keyword || text.includes(keyword);
        group.classList.toggle("hidden", !matches);
        if (matches) {
          visibleGroups += 1;
        }
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleGroups > 0);
    }
  };

  searchInput.addEventListener("input", update);
  update();
}