// Shared entry point: select a page, render its sections, then initialize site interactions.
import { programs } from "./data/programs.js";
import { guides } from "./data/wellness.js";
import { wellnessArticles } from "./data/wellness-articles.js";
import { initAnimations } from "./animations/scroll.js";
import { initFinder } from "./features/program-finder.js";
import { initFilters } from "./features/filters.js";
import { initContactForm } from "./features/contact-form.js";

// The page key comes from the data-page attribute in each root HTML file.
const page = document.body.dataset.page;
// All locally bundled page and card photography is served from this folder.
const img = (file) => `./assets/images/${file}`;
const publicEmail = "webweavers.freelance@gmail.com";
// Edit this list to update the shared header navigation.
const nav = [
  ["Programs", "programs.html", "programs"],
  ["Wellness", "wellness.html", "wellness"],
  ["About", "about.html", "about"],
  ["Contact", "contact.html", "contact"],
];
// Header and footer are shared by all site pages.
const header = `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="index.html" aria-label="FORMA home" ${page === "home" ? 'aria-current="page"' : ""}>FORMA<span>.</span></a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button><nav class="main-nav" aria-label="Main navigation">${nav.map(([label, href, key]) => `<a href="${href}" ${page === key || (page === "guide" && key === "wellness") ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav></header>`;
const footer = `<footer class="site-footer"><div class="footer-top"><a class="wordmark" href="index.html">FORMA<span>.</span></a><p>Move with purpose.<br>Live with balance.</p><a class="footer-email" href="mailto:${publicEmail}">${publicEmail}</a><a class="round-link" href="#top" aria-label="Back to top">↑</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} FORMA · Demonstration website</span><div><a href="programs.html">Programs</a><a href="wellness.html">Wellness</a><a href="about.html">About</a><a href="contact.html">Contact</a></div></div><p class="demo-note">FORMA is a fictional demonstration brand. Content is educational and not medical advice.</p></footer>`;
document.querySelector("#app").insertAdjacentHTML("afterbegin", header);
document.querySelector("#app").insertAdjacentHTML("beforeend", footer);

// These templates turn records from src/data into reusable visual cards.
const programCard = (p, index = programs.indexOf(p)) =>
  `<article class="program-card reveal-card" id="${p.id}" data-category="${p.category}" data-level="${p.level}"><a href="programs.html#${p.id}" class="card-image"><img src="${img(p.image)}" alt="Demonstration fitness imagery for ${p.title}" loading="lazy"><span class="image-index">${String(index + 1).padStart(2, "0")}</span></a><div class="card-content"><div class="eyebrow">${p.category} · ${p.level}</div><h3>${p.title}</h3><p>${p.description}</p><div class="card-meta"><span>${p.days} days / week</span><span>${p.duration}</span></div></div></article>`;
const guideCard = (g) =>
  `<article class="editorial-card reveal-card"><a class="editorial-image" href="wellness-guide.html?guide=${encodeURIComponent(g.slug)}"><img src="${img(g.image)}" alt="Illustrative image for ${g.title}" loading="lazy"></a><div class="eyebrow">${g.category} · ${g.read}</div><h3>${g.title}</h3><p>${g.intro}</p><a class="text-link" href="wellness-guide.html?guide=${encodeURIComponent(g.slug)}">Explore this topic <span>↗</span></a></article>`;
const recoveryFeatureCard = (g) =>
  `<article class="program-card reveal-card"><a href="wellness-guide.html?guide=${encodeURIComponent(g.slug)}" class="card-image"><img src="${img(g.image)}" alt="Illustrative image for ${g.title}" loading="lazy"><span class="image-index">03</span></a><div class="card-content"><div class="eyebrow">Recovery · Wellness guide</div><h3>${g.title}</h3><p>${g.intro}</p><a class="text-link" href="wellness-guide.html?guide=${encodeURIComponent(g.slug)}">Explore recovery <span>↗</span></a></div></article>`;
const relatedArticleCard = (article) =>
  `<article class="topic-article reveal-card"><img class="topic-article-image" src="${img(article.image)}" alt="Illustrative image for ${article.title}" loading="lazy"><div class="eyebrow">${article.category} · ${article.read}</div><h3>${article.title}</h3><p>${article.intro}</p><details class="topic-article-details"><summary>Read article</summary><p>${article.section1}</p><p>${article.section2}</p></details></article>`;

// HOME: hero, approach, featured starting points, benefits, articles, and contact CTA.
if (page === "home") {
  const strengthProgram = programs.find((program) => program.category === "Strength");
  const mobilityProgram = programs.find((program) => program.category === "Mobility");
  const recoveryGuide = guides.find((guide) => guide.category === "Recovery");
  document.querySelector("#main").innerHTML = `
 <section class="hero home-hero" id="top"><div class="hero-backdrop"><img src="${img("outdoors.jpg")}" alt="Sunrise over a quiet countryside meadow" fetchpriority="high"></div><div class="hero-shade"></div><div class="hero-copy"><div class="eyebrow light">Thoughtful training for everyday life</div><h1 class="split-title">Fitness &amp; wellness<br><em>for real life.</em></h1><p>Explore approachable strength programs, recovery guides, and everyday wellness tools designed for real life.</p><a class="button button-light" href="programs.html">Explore programs <span>↗</span></a></div><div class="scroll-cue">Scroll to explore <span></span></div></section>
 <section class="section-pad home-intro"><div class="eyebrow">The FORMA approach</div><div class="home-intro-layout"><h2>Build strength. Move with confidence. Make room to recover.</h2><div><p>FORMA brings training, mobility, recovery, and practical wellbeing into one approachable place.</p><p>Explore sample programs and educational guides, then choose a starting point that can fit real life.</p><a class="text-link" href="about.html">Learn about our approach <span>↗</span></a></div></div></section>
 <section class="section-pad home-featured"><div class="section-heading compact"><div><div class="eyebrow">Featured starting points</div><h2>Move, strengthen,<br><em>and recover.</em></h2></div><p>Explore a sample strength program, a mobility plan, and a guide to recovery.</p><a class="text-link" href="programs.html">View all programs <span>↗</span></a></div><div class="home-feature-grid">${strengthProgram ? programCard(strengthProgram, 0) : ""}${mobilityProgram ? programCard(mobilityProgram, 1) : ""}${recoveryGuide ? recoveryFeatureCard(recoveryGuide) : ""}</div></section>
 <section class="section-pad home-why"><div class="section-heading compact"><div><div class="eyebrow">Why FORMA</div><h2>A thoughtful approach<br><em>to everyday wellbeing.</em></h2></div><p>FORMA is a fictional demonstration concept, not a physical gym or staffed coaching service.</p></div><div class="home-benefit-grid"><article class="home-benefit-card"><span>01</span><h3>Approachable training</h3><p>Sample programs make it easier to explore strength, mobility, and movement at home.</p></article><article class="home-benefit-card"><span>02</span><h3>Recovery belongs</h3><p>Wellness guides put rest, sustainable habits, and everyday recovery alongside training.</p></article><article class="home-benefit-card"><span>03</span><h3>Find a starting point</h3><p>Use the program finder to browse examples by goal, experience, and weekly schedule.</p><a class="text-link" href="programs.html#program-finder">Try the program finder <span>↗</span></a></article></div></section>
 <section class="section-pad home-articles"><div class="section-heading compact"><div><div class="eyebrow">From the wellness library</div><h2>Learn a little.<br><em>Feel the difference.</em></h2></div><p>Educational reading on training, consistency, and practical wellbeing.</p><a class="text-link" href="wellness.html">Browse wellness guides <span>↗</span></a></div><div class="topic-article-grid">${wellnessArticles.slice(0, 3).map(relatedArticleCard).join("")}</div></section>
 <section class="home-contact-cta"><div><div class="eyebrow light">Questions or feedback?</div><h2>We’re here to help<br><em>you find your next step.</em></h2><p>Send an enquiry about the FORMA demo, its sample programs, or wellness content.</p><a class="home-contact-email" href="mailto:${publicEmail}">${publicEmail}</a></div><a class="button button-light" href="contact.html">Contact FORMA <span>↗</span></a></section>`;
}
// PROGRAMS: program library and filters, finder form, and FAQ.
if (page === "programs") {
  document.querySelector("#main").innerHTML =
    `<section class="page-hero page-hero-image"><img src="${img("home-training.jpg")}" alt="Training session in a calm studio"><div class="page-hero-content"><div class="eyebrow light">Training, thoughtfully structured</div><h1>Find your<br><em>way forward.</em></h1><p>Explore sample programs for strength, conditioning, mobility, and movement at home.</p></div></section><section class="section-pad"><div class="section-heading compact"><div><div class="eyebrow">The program collection</div><h2>Train with <em>intention.</em></h2></div><p>Demonstration programs. Choose a focus and explore a starting point that fits your week.</p></div><div class="filter-bar" id="program-filters"><div class="filter-group" data-filter="category"><button class="filter-chip active" data-value="All">All</button>${["Strength", "Conditioning", "Mobility", "Home"].map((x) => `<button class="filter-chip" data-value="${x}">${x}</button>`).join("")}</div><label class="select-filter">Experience <select id="level-filter"><option value="All">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div><p class="result-count" id="program-count" aria-live="polite"></p><div class="program-grid" id="program-list">${programs.map(programCard).join("")}</div></section><section class="finder-section section-pad" id="program-finder"><div class="finder-intro"><div class="eyebrow light">A considered starting point</div><h2>Find your<br><em>program rhythm.</em></h2><p>Answer three quick questions to see sample programs from the FORMA demonstration library.</p><div class="finder-note">General educational suggestions only — not medical or individualized coaching advice.</div></div><form class="finder-form" id="finder-form"><label>What would you like to focus on?<select name="goal"><option value="strength">Build strength</option><option value="mobility">Improve mobility</option><option value="conditioning">Build conditioning</option><option value="home">Move at home</option></select></label><label>What is your current experience?<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>How many days suit your week?<select name="days"><option value="2">2 days</option><option value="3" selected>3 days</option><option value="4">4 days</option><option value="5">5 days</option></select></label><button class="button button-dark" type="submit">Find sample programs <span>↗</span></button><div id="finder-results" class="finder-results" aria-live="polite"></div></form></section><section class="section-pad faq-section"><div class="section-heading compact"><div><div class="eyebrow">Good to know</div><h2>Training <em>questions.</em></h2></div><p>General information about the demonstration program library.</p></div><div class="faq-list">${[
      [
        "Are these real coaching plans?",
        "No. These are fictional demonstration programs intended to show the website experience.",
      ],
      [
        "Do I need equipment?",
        "Each sample program lists suggested equipment. Choose movements and loads appropriate to your circumstances.",
      ],
      [
        "Can I combine programs?",
        "The examples are not individualized plans. Consider overall training load and recovery before combining routines.",
      ],
      [
        "What if I am new to exercise?",
        "Start conservatively and consider guidance from a qualified exercise professional, especially if you have health concerns.",
      ],
    ]
      .map(
        ([q, a]) =>
          `<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`,
      )
      .join("")}</div></section>`;
}
// WELLNESS: guide library with topic filters and the closing note.
if (page === "wellness") {
  document.querySelector("#main").innerHTML =
    `<section class="page-hero wellness-hero"><img src="${img("wellness.jpg")}" alt="Calm wellness-inspired setting"><div class="page-hero-content"><div class="eyebrow light">Beyond the workout</div><h1>A healthier,<br><em>more balanced you.</em></h1><p>Explore practical guides for recovery, mobility, habits, and everyday wellbeing.</p></div></section><section class="section-pad"><div class="section-heading compact"><div><div class="eyebrow">The wellness library</div><h2>Small practices.<br><em>Lasting rhythm.</em></h2></div><p>Educational articles for a more considered approach to movement and wellbeing.</p></div><div class="tag-row" id="wellness-filters"><button class="filter-chip active" data-value="All">All topics</button>${["Recovery", "Movement", "Habits", "Mindset", "Nutrition"].map((x) => `<button class="filter-chip" data-value="${x}">${x}</button>`).join("")}</div><div class="editorial-grid wellness-grid" id="wellness-list">${guides.map(guideCard).join("")}</div></section><section class="wellness-note"><p>Wellness is not a finish line.<br><em>It is a way of paying attention.</em></p><span>FORMA · EVERYDAY PRACTICE</span></section>`;
}
// GUIDE DETAIL: one guide and only the articles/guides matching its topic.
if (page === "guide") {
  const slug = new URLSearchParams(window.location.search).get("guide");
  const guide = guides.find((item) => item.slug === slug);
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (guide) {
    document.title = `${guide.title} — FORMA`;
    descriptionMeta.content = `${guide.intro} Read related ${guide.category.toLowerCase()} guides and articles from FORMA.`;
    const relatedGuides = guides.filter(
      (item) => item.category === guide.category && item.slug !== guide.slug,
    );
    const relatedArticles = wellnessArticles.filter(
      (article) => article.topic === guide.category,
    );
    document.querySelector("#main").innerHTML =
      `<section class="topic-detail section-pad" id="top"><a class="button button-dark topic-back" href="wellness.html">← Back to Wellness</a><div class="topic-layout"><div class="topic-image"><img src="${img(guide.image)}" alt="Illustrative image for ${guide.title}"></div><article class="topic-copy"><div class="eyebrow">${guide.category} · ${guide.read} read</div><h1>${guide.title}</h1><p class="topic-intro">${guide.intro}</p><ul>${guide.body.map((point) => `<li>${point}</li>`).join("")}</ul><p class="demo-disclaimer">Demonstration wellness content. General information only.</p></article></div></section><section class="section-pad topic-library"><div class="section-heading compact"><div><div class="eyebrow">${guide.category} collection</div><h2>More on <em>${guide.category.toLowerCase()}.</em></h2></div><p>Guides and articles selected for this topic.</p></div>${relatedGuides.length ? `<h3 class="topic-subheading">Related guides</h3><div class="editorial-grid">${relatedGuides.map(guideCard).join("")}</div>` : ""}${relatedArticles.length ? `<h3 class="topic-subheading">Related articles</h3><div class="topic-article-grid">${relatedArticles.map(relatedArticleCard).join("")}</div>` : ""}</section>`;
  } else {
    document.title = "Wellness Guide Not Found | FORMA";
    descriptionMeta.content =
      "The requested FORMA wellness guide could not be found. Browse the Wellness library to choose a topic.";
    document.querySelector("#main").innerHTML =
      `<section class="topic-not-found section-pad"><div class="eyebrow">Wellness library</div><h1>We couldn't find that guide.</h1><p>Choose a guide from the Wellness page to explore its topic.</p><a class="button button-dark" href="wellness.html">Back to Wellness <span>↗</span></a></section>`;
  }
}
// ABOUT: brand story, values, principles, and fictional profile cards.
if (page === "about") {
  document.querySelector("#main").innerHTML =
    `<section class="page-hero about-hero"><img src="${img("home-training.jpg")}" alt="Well-equipped strength training studio"><div class="page-hero-content"><div class="eyebrow light">The idea behind FORMA</div><h1>A holistic approach<br>to a <em>stronger you.</em></h1><p>Movement, recovery, and mindful living belong in the same conversation.</p></div></section><section class="section-pad about-intro"><div class="eyebrow">Our philosophy</div><h2>Wellbeing is not one thing.<br>It is the <em>way things connect.</em></h2><div class="about-copy"><p>FORMA is a fictional fitness and wellness concept built around a simple idea: progress should support a fuller life. Training can build strength and confidence; recovery can create room to adapt; everyday habits can help make the whole practice sustainable.</p><p>Our approach is educational, flexible, and grounded in the belief that movement should be approachable, purposeful, and adaptable to real life.</p></div></section><section class="values-band"><div><span>01</span><h3>People first</h3><p>Respect individual needs, starting points, and lived experience.</p></div><div><span>02</span><h3>Sustainable progress</h3><p>Choose repeatable practices over short-lived extremes.</p></div><div><span>03</span><h3>Whole-life wellbeing</h3><p>Make room for movement, recovery, and the life around them.</p></div></section><section class="section-pad principles"><div class="section-heading compact"><div><div class="eyebrow">Our principles</div><h2>How we think<br>about <em>progress.</em></h2></div><p>These principles guide the sample content and experience presented across this demonstration website.</p></div><div class="principle-list"><div><span>01 / Clarity</span><p>Make the next step understandable and achievable.</p></div><div><span>02 / Consistency</span><p>Build routines that can flex with changing weeks.</p></div><div><span>03 / Curiosity</span><p>Learn from the process and adjust with intention.</p></div></div></section><section class="team-section section-pad"><div class="eyebrow">Illustrative profiles</div><h2>People behind<br>the <em>practice.</em></h2><p class="demo-disclaimer">The following fictional profiles are demonstration content, not real staff or qualified practitioners.</p><div class="team-grid"><article><div class="team-avatar avatar-one">F</div><h3>Alex Morgan</h3><span>Training editor · Fictional profile</span><p>Represents the strength and movement content direction.</p></article><article><div class="team-avatar avatar-two">F</div><h3>Sam Rivera</h3><span>Wellness editor · Fictional profile</span><p>Represents the recovery and everyday wellbeing content direction.</p></article><article><div class="team-avatar avatar-three">F</div><h3>Jordan Lee</h3><span>Community editor · Fictional profile</span><p>Represents the accessible, whole-life approach behind the concept.</p></article></div></section>`;
}
// CONTACT: enquiry form with required fields and Formspree delivery.
if (page === "contact") {
  document.querySelector("#main").innerHTML =
    `<section class="page-hero contact-hero"><img src="${img("contact.jpg")}" alt="A spacious gym with cardio and strength equipment">
    <div class="page-hero-content"><div class="eyebrow light">Start a conversation</div><h1>Fitness &amp; wellness,<br><em>made personal.</em></h1>
    <p>Questions about training, recovery, or FORMA? Send us an enquiry.</p></div></section><section class="section-pad contact-layout"><div class="contact-copy"><div class="eyebrow">Get in touch</div>
    <h2>Tell us what<br><em>you need.</em></h2>
    <p>Share your question or feedback using the form. Fields marked with an asterisk are required.</p>
    <div class="contact-detail"><span>01</span><div><b>General enquiries</b><a href="mailto:${publicEmail}">${publicEmail}</a></div></div><div class="contact-detail"><span>02</span><div><b>Your privacy</b><p>Enquiries submitted here are processed by Formspree.</p></div></div></div><form class="contact-form" id="contact-form" data-form-id="${document.body.dataset.formId || ""}" novalidate><div class="form-row"><label for="contact-name">Name <span aria-hidden="true">*</span><input id="contact-name" name="name" type="text" required minlength="2" maxlength="100" autocomplete="name" placeholder="Your name"></label><label for="contact-email">Email address <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" required maxlength="254" autocomplete="email" placeholder="you@example.com"></label></div><label for="contact-phone">Phone number <span class="optional-label">(optional)</span><input id="contact-phone" name="phone" type="tel" inputmode="numeric" pattern="[0-9]{7,15}" autocomplete="tel" placeholder="Digits only"></label><label for="contact-message">Enquiry message <span aria-hidden="true">*</span><textarea id="contact-message" name="message" rows="5" required minlength="10" maxlength="3000" placeholder="How can we help?"></textarea></label><div class="form-honeypot" aria-hidden="true"><label for="contact-website">Leave this field empty<input id="contact-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></label></div><button class="button button-dark" type="submit">Send enquiry <span>↗</span></button><p class="form-status" id="form-status" role="status" aria-live="polite">Required fields are marked with an asterisk.</p><p class="form-privacy-note">Submissions are processed by Formspree.</p></form></section>`;
}

// Start features after the page markup exists; each feature skips pages without its controls.
initAnimations();
initFinder(programs);
initFilters(programs, guides);
initContactForm();
const menu = document.querySelector(".menu-toggle");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  document.querySelector(".main-nav").classList.toggle("is-open", !open);
  document.body.classList.toggle("nav-open", !open);
});
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector(".main-nav")?.classList.remove("is-open");
    menu?.setAttribute("aria-expanded", "false");
  }),
);
