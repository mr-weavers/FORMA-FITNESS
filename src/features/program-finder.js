// Handles the three-question program finder on programs.html.
export function initFinder(programs) {
  const form = document.querySelector("#finder-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const goal = data.get("goal"),
      level = data.get("level"),
      days = Number(data.get("days"));
    const matches = programs
      .filter(
        (p) =>
          (goal === "strength"
            ? p.category === "Strength"
            : goal === "mobility"
              ? p.category === "Mobility"
              : goal === "conditioning"
                ? p.category === "Conditioning"
                : p.category === "Home") && p.level === level,
      )
      .sort((a, b) => Math.abs(a.days - days) - Math.abs(b.days - days))
      .slice(0, 3);
    const fallback = programs
      .filter((p) =>
        goal === "strength"
          ? p.category === "Strength"
          : goal === "mobility"
            ? p.category === "Mobility"
            : goal === "conditioning"
              ? p.category === "Conditioning"
              : p.category === "Home",
      )
      .sort((a, b) => Math.abs(a.days - days) - Math.abs(b.days - days))
      .slice(0, 3);
    const results = matches.length ? matches : fallback;
    document.querySelector("#finder-results").innerHTML =
      `<h3>Sample ideas to explore</h3>${results.map((p) => `<a href="#${p.id}" class="finder-result"><span>${p.title}</span><small>${p.level} · ${p.days} days/week</small></a>`).join("")}<p>These are general demonstration suggestions, not individualized exercise prescriptions.</p>`;
  });
}
