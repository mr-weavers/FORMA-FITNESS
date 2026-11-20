// Wires category/level controls to the program list and topic controls to wellness cards.
export function initFilters(programs, guides) {
  const programList = document.querySelector("#program-list");
  if (programList) {
    let category = "All",
      level = "All";
    const apply = () => {
      let visible = 0;
      programList.querySelectorAll(".program-card").forEach((card) => {
        const show =
          (category === "All" || card.dataset.category === category) &&
          (level === "All" || card.dataset.level === level);
        card.hidden = !show;
        if (show) visible++;
      });
      document.querySelector("#program-count").textContent =
        `Showing ${visible} of ${programs.length} sample programs`;
    };
    document.querySelectorAll("#program-filters [data-value]").forEach((btn) =>
      btn.addEventListener("click", () => {
        category = btn.dataset.value;
        document
          .querySelectorAll("#program-filters [data-value]")
          .forEach((b) => b.classList.toggle("active", b === btn));
        apply();
      }),
    );
    document.querySelector("#level-filter").addEventListener("change", (e) => {
      level = e.target.value;
      apply();
    });
    apply();
  }
  const wellnessList = document.querySelector("#wellness-list");
  if (wellnessList) {
    document.querySelectorAll("#wellness-filters [data-value]").forEach((btn) =>
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#wellness-filters [data-value]")
          .forEach((b) => b.classList.toggle("active", b === btn));
        let count = 0;
        wellnessList.querySelectorAll(".editorial-card").forEach((card, i) => {
          const show =
            btn.dataset.value === "All" ||
            guides[i].category === btn.dataset.value;
          card.hidden = !show;
          if (show) count++;
        });
      }),
    );
  }
}
