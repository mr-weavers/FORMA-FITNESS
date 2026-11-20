<!-- Begin here for setup, then use the section that matches the part of the site you want to edit. -->
# FORMA — Beginner's Guide

FORMA is a five-page demonstration website with one reusable Wellness guide page. It uses HTML, CSS, and ordinary browser JavaScript. No React, Vite, npm, or build step is required.

This guide explains how to start the site, find each part, and edit, add, or remove content. Back up a file before making a large change.

## 1. Start the website

### Recommended: VS Code Live Server

1. Open the **FORMA project folder** in VS Code. It is the folder containing `index.html`, `programs.html`, `src`, and `assets`.
2. Open **Extensions** from the left sidebar, or press `Ctrl+Shift+X`.
3. Search for **Live Server** and install it if needed.
4. In the Explorer panel, right-click `index.html` and choose **Open with Live Server**.
5. Your browser opens the home page. Use its navigation to visit the other pages.

### Alternative: Python's simple local server

If Python is installed, open VS Code's terminal in the project folder and run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Leave the terminal running while you use the site. Press `Ctrl+C` there to stop the server. If `py` is not recognized, use Live Server instead.

**Important:** Do not double-click `index.html` to open it as a `file://` page. Browsers block the site's native JavaScript imports in that mode, so the page may look empty. Do not run `npm install` or `npm run dev`; this project does not use npm or Vite.

## 2. Understand the folders

```text
FORMA/
├── assets/
│   ├── fonts/                     # Self-hosted WOFF2 fonts and license files
│   └── images/                    # Locally stored photos
├── src/
│   ├── animations/scroll.js        # Scroll reveal effects
│   ├── data/
│   │   ├── programs.js             # Program cards and finder choices
│   │   ├── wellness.js             # The ten Wellness guides
│   │   └── wellness-articles.js    # Articles shown on guide pages
│   ├── features/
│   │   ├── program-finder.js       # Programs-page finder
│   │   ├── filters.js              # Program and Wellness filters
│   │   └── contact-form.js         # Contact validation and Formspree sending
│   ├── styles/styles.css           # Colors, layout, responsive rules, animation style
│   └── main.js                     # Shared header/footer and page sections
├── index.html                      # Home page
├── programs.html                   # Programs page
├── wellness.html                  # Wellness guide library
├── wellness-guide.html            # Shared template for a selected guide/topic
├── about.html                      # About page
├── contact.html                    # Contact page
├── README.md                       # This guide
└── DEVELOPER-GUIDE.md              # Short technical reference
```

The root HTML files load the shared CSS and JavaScript. Each has a `data-page` value that tells `src/main.js` which sections to render inside `#main`. The shared guide page also reads a `guide` value from its URL, so each Wellness card opens its own guide content.

## 3. Find and edit each page section

The page sections are assembled in `src/main.js`. Press `Ctrl+F` in that file and search for a distinctive phrase, or search for `if (page === "home")`, `if (page === "programs")`, and so on. The sections are written in the order they appear on the page.

| Page | Sections, top to bottom | Main place to edit |
|---|---|---|
| Every page | Shared header/navigation, page content, shared footer | `src/main.js` |
| Home | Hero; FORMA approach; strength/mobility/recovery starting points; why FORMA; featured articles; contact CTA | Home block in `src/main.js`; cards come from `src/data/` |
| Programs | Hero; program collection and filters; Program Finder; FAQ | Programs block in `src/main.js`; program cards in `src/data/programs.js` |
| Wellness | Hero; guide library and topic filters; closing note | Wellness block in `src/main.js`; guide cards in `src/data/wellness.js` |
| Individual guide | Back button; selected guide text; related guides; topic-matched articles | Guide block in `src/main.js`; content in `src/data/wellness.js` and `src/data/wellness-articles.js` |
| About | Hero; philosophy; values; principles; fictional profile cards | About block in `src/main.js` |
| Contact | Hero; enquiry information; Formspree contact form | Contact block in `src/main.js`; validation and delivery in `src/features/contact-form.js` |

### Change text, buttons, or headings

1. Open `src/main.js`.
2. Press `Ctrl+F` and search for the current text.
3. Change the text inside its HTML element.
4. Save the file and refresh the browser.

Page markup is inside JavaScript template strings, which begin and end with backticks: `` ` ``. Keep those backticks and the HTML tags balanced. For a link, update the `href` if its destination should change.

### Add or remove a section

To add a section, find the correct page block in `src/main.js` and add a `<section>...</section>` where it should appear. Reuse classes such as `section-pad`, `section-heading`, or `editorial-grid` to use the site's existing design. Give any new interactive control a unique `id`.

To remove a section, remove that section's markup from its page block. If it contains a form, filter, or other interactive control, also remove or update its handler in `src/features/`. Do not remove the outer `#app` or `#main` elements from the HTML files; JavaScript needs them to render the page.

### Add a completely new page

1. Copy an existing root HTML file and rename it.
2. Change its `<title>` and `<body data-page="...">`.
3. Add a matching navigation entry near the top of `src/main.js` (label, filename, and page key).
4. Add a matching `if (page === "...")` block in `src/main.js`.
5. Add CSS rules in `src/styles/styles.css` if the page needs a unique layout.
6. If it needs new behavior, add a feature file under `src/features/` and initialize it after the markup is created.

The HTML `data-page` and JavaScript page key must match exactly, including capitalization.

## 4. Edit, add, or remove program cards

Program records are objects in `src/data/programs.js`. The Programs page displays all programs; the Home page displays only the first four, so moving a record in the array changes the Home preview order.

Each record uses:

- `id`: unique short identifier used in links, for example `"foundations"`.
- `title`: card heading.
- `category`: `Strength`, `Conditioning`, `Mobility`, or `Home`.
- `level`: `Beginner`, `Intermediate`, or `Advanced`.
- `days`: days per week; the finder uses this to rank suggestions.
- `equipment`, `duration`, `description`, `focus`: program details.
- `image`: filename of a photo in `assets/images/`, not a full path.
- `schedule`: list of sample sessions.

Copy an existing object to add a program; edit its fields to change a card; remove the whole object to delete it. Keep commas between objects and do not duplicate IDs.

```js
{
  id: "sample-strength",
  title: "Sample Strength",
  category: "Strength",
  level: "Beginner",
  days: 3,
  equipment: "Dumbbells",
  duration: "30 min",
  description: "A short description shown on the card.",
  focus: "Full-body strength",
  image: "strength.jpg",
  schedule: ["Session one", "Session two", "Session three"],
}
```

The category buttons are in `src/main.js`. Goal-to-category matching is in `src/features/program-finder.js`. If you create a new category or level, update the options, matching logic, and filters too. The current program cards display title, category, level, description, days, duration, and image; `equipment`, `focus`, and `schedule` are stored but not displayed.

## 5. Edit, add, or remove Wellness guides

The ten guide records are in the `guides` array in `src/data/wellness.js`. The Home page shows the first three; the Wellness page shows all guides. Each guide has:

- `slug`: unique URL key. Keep it unique; clicking the guide opens `wellness-guide.html?guide=YOUR-SLUG`.
- `title`, `category`, `read`, `image`, `intro`: information shown on guide cards and the guide page.
- `body`: list of points shown on the selected guide page.

To add a guide, copy an existing object and change all fields, especially its unique `slug`. To change a guide, edit its values. To remove it, remove the whole object. Use one of the existing categories (`Recovery`, `Movement`, `Habits`, `Mindset`, `Nutrition`) so the Wellness filter and related-content matching work. If you add a category, add a button for it in the Wellness page block in `src/main.js`.

On the Wellness page, both the guide image and **Explore this topic** button open that guide's dedicated detail view. Its **Back to Wellness** button returns to the guide library.

## 6. Edit, add, or remove topic articles

Related article records are rows in the `wellnessArticles` array in `src/data/wellness-articles.js`. Each row has eight values, in this order:

1. Title
2. Article type/category
3. Reading time
4. Image filename
5. Introduction
6. First article paragraph
7. Second article paragraph
8. Topic that connects the article to a guide

Example:

```js
[
  "A Sample Wellness Article",
  "Recovery",
  "5 min",
  "recovery.jpg",
  "A short introduction shown with the article.",
  "The first paragraph shown when the article is expanded.",
  "The second paragraph shown when the article is expanded.",
  "Recovery",
],
```

Copy a row to add an article, edit its values to change it, or remove the row to delete it. Keep the order and include the final topic. That topic must exactly match a guide category (`Recovery`, `Movement`, `Habits`, `Mindset`, or `Nutrition`). A guide detail page shows only article rows whose topic matches that guide.

The article preview displays title, category, reading time, and introduction. Visitors can open **Read article** to see the two paragraphs. Article images are stored with each record, but are not currently displayed in the related-article card.

## 7. Change pictures

1. Put the new image file in `assets/images/`.
2. Use a clear, high-resolution image; do not enlarge a small thumbnail. The current local photos are JPEGs resized to 1600px wide and compressed for web use.
3. In a program, guide, or article record, set `image` to the exact filename, for example `"new-photo.jpg"`.
4. To change a large banner, search in `src/main.js` for its current image filename and replace it. Update its nearby `alt` text to describe the new photo.
5. Save and refresh. Match filename spelling and extension exactly.

For data records, enter only the filename. The `img()` helper in `src/main.js` adds the `assets/images` folder path automatically. Images are local, so the site does not need an internet connection to display them.

## 8. Change colors, layout, and fonts

The shared stylesheet is `src/styles/styles.css`. Comments in the file mark the larger groups.

- **Theme colors/fonts:** edit the variables at the top inside `:root`. For example, `--forest` is the deep green and `--sand` is the accent. Font files are stored locally in `assets/fonts/`; the `@font-face` declarations near the top of the stylesheet connect them. Keep each font's `OFL-*.txt` license file with the bundled fonts.
- **Header/navigation:** search for `.site-header`, `.main-nav`, or `.menu-toggle`.
- **Banners:** `.hero` controls the Home hero; `.page-hero` controls the inner page banners.
- **Cards and grids:** search for `.program-grid`, `.editorial-grid`, or `.topic-article-grid`.
- **Page sections:** search for `.finder-section`, `.about-intro`, `.team-section`, `.contact-layout`, or `.topic-detail`.
- **Section spacing:** `.section-pad` sets standard top/bottom and side padding.
- **Tablet/phone layouts:** the `@media (max-width: 900px)` and `@media (max-width: 640px)` blocks contain responsive overrides.

A CSS class selector starts with a dot. For example, `.program-card` styles an element with `class="program-card"`. If you rename a class in `src/main.js`, update its CSS selector too.

## 9. Change animations

`src/animations/scroll.js` has a `querySelectorAll(...)` list. Its selectors decide which page elements reveal as they enter the screen. Add a selector to animate another kind of element, or remove one to stop animating it.

The animation's appearance is controlled in `src/styles/styles.css`:

- `.will-reveal` is the starting state (lower and transparent).
- `.will-reveal.is-visible` is the final state.
- `--reveal-delay` controls the small stagger between nearby elements.

The JavaScript checks whether the visitor requests reduced motion. Keep this check so motion-sensitive visitors are respected. Hover effects and smooth scrolling are also in the stylesheet.

## 10. Change navigation and interactions

The shared navigation list is near the top of `src/main.js`; the footer links are just below it. The public contact email is stored in the `publicEmail` constant in that file and appears in the shared footer and Contact page. Add official social-profile links to the shared footer template only after those accounts exist. When you rename a page or add a new one, update the links that point to it.

| Interaction | File to edit | Important selectors/data |
|---|---|---|
| Program filters | `src/features/filters.js` | `#program-filters`, `#level-filter`, `#program-list` |
| Programs finder suggestions | `src/features/program-finder.js` | `#finder-form`, `#finder-results` |
| Wellness topic filters | `src/features/filters.js` | `#wellness-filters`, `#wellness-list` |
| Guide page and related content | `src/main.js` | `guide.slug`, `guide.category`, `article.topic` |
| Contact form validation and delivery | `src/features/contact-form.js` | `#contact-form`, `#form-status`, Formspree ID in `contact.html` |
| Mobile navigation | Bottom of `src/main.js` | `.menu-toggle`, `.main-nav` |

These IDs and classes connect the visible page markup to its JavaScript. If you rename one in `src/main.js`, search for and update its matching selector in `src/features/`. Contact form validation and sending are handled separately: the page markup is in `src/main.js`, and submit behavior is in `src/features/contact-form.js`.

## 11. Change page metadata

Each root `.html` file has a page-specific `<title>` and search description in its `<head>`. Update both when changing a page's purpose or name. The guide page also updates its title and description from the selected guide. Keep the `data-page`, stylesheet link, and module script; they connect the HTML to its shared layout and behavior.

## 12. Check your changes

Save and refresh the browser. Check both desktop and narrow/phone widths:

1. Open each navigation link and verify the correct page appears.
2. On Home, check each featured card and the Contact CTA.
3. On Programs, try a category filter, experience filter, and Program Finder.
4. On Wellness, choose a topic filter and open several different guide cards.
5. On each guide page, check the guide text, related guides, and article topic. Use **Back to Wellness**.
6. On Contact, try an empty form, an invalid email, a short message, and a valid entry. Confirm that non-letter characters are removed from the name field and non-digits are removed from the optional phone field.
7. At phone and tablet widths, open and close the mobile menu and check that no content causes horizontal scrolling.

If a card is missing, check the spelling of its category/topic. If a photo is missing, check its filename and location in `assets/images/`. If a page is blank, confirm its HTML `data-page` matches the page key in `src/main.js`, and check for a missing quote, comma, or backtick.

## 13. Connect the contact form to email

The contact form uses Formspree because this project is a static website with no private server. Formspree currently offers a free plan at **$0/month**, with **50 submissions per month** and a **30-day submission archive**. Its free plan includes basic spam filtering. Limits and pricing can change; see the [official Formspree plans](https://formspree.io/plans).

1. Sign up at [Formspree](https://formspree.io/register) and verify your email address.
2. In its dashboard, create a form and set the destination email address. Confirm/verify that destination when prompted.
3. Copy the **form ID** from the endpoint Formspree shows. It is the final part of a URL like `https://formspree.io/f/abc123xy`.
4. Open `contact.html` and find `<body data-page="contact" data-form-id="">`.
5. Put only that form ID between the quotation marks, for example `data-form-id="abc123xy"`. Keep the attribute name and quotation marks. This ID is public; do not put passwords, SMTP credentials, or private API keys in the website files.
6. Deploy or serve the website over HTTP and submit a test message. The page shows success only when Formspree accepts the request. Check the verified destination inbox and spam folder. If Formspree has domain restrictions enabled, allow your deployed domain there.

The form requires a name, valid email address, and enquiry message; phone is the only optional visible field. The name accepts letters (including accented letters), spaces, apostrophes, periods, and hyphens; other characters are removed as you type or paste. A supplied phone number accepts digits only, with other characters removed, and must contain 7–15 digits. The form also includes a hidden honeypot field and submits it using Formspree's `_gotcha` convention. Formspree provides its own spam controls. Review its dashboard and privacy terms before collecting real visitor information.

Name must contain at least two allowed letters and characters; email must use a valid address/domain format; phone is optional but, when entered, must contain 7–15 digits; and the message must contain at least 10 characters. Invalid fields receive browser validation and an on-page message. A network or service error is shown as a failure, not as a successful send. You can test validation before creating a Formspree account, but a real delivery test requires a configured form ID and access to its verified destination inbox.

## 14. Demo limitations

- FORMA is fictional; its guides, articles, programs, and profiles are sample content.
- There is no database, account system, analytics, or server-side application.
- The contact form sends information only after you connect a Formspree form ID; Formspree then processes submissions.
- Program Finder suggestions are examples, not individualized exercise or medical advice.
- Photos are stored locally and do not require external image requests.
