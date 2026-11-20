// Adds one-time scroll reveals to the elements listed below; CSS controls the visual transition.
export function initAnimations() {
  // Keep all content visible and still when the visitor requests reduced motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduce-motion");
    return;
  }
  if (!("IntersectionObserver" in window)) return;
  // Add or remove selectors here to choose which elements animate into view.
  const reveal = document.querySelectorAll(
    ".site-header,.hero-copy > *,.section-heading,.pillar,.team-grid article,.principle-list > div,.contact-copy > *,.reveal-card,.statement-image img,.page-hero > img,h2 em,.closing-quote p,.wellness-note p",
  );
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  reveal.forEach((element, index) => {
    element.classList.add("will-reveal");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 40}ms`);
    observer.observe(element);
  });
  window.addEventListener("pagehide", () => observer.disconnect(), {
    once: true,
  });
}
