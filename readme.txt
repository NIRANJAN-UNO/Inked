(The file `/home/niranjs/Projects/da1/readme.txt` exists, but contains only whitespace)
Inked — small static literary site
=================================

Overview
--------
`Inked` is a static, front-end project (HTML/CSS/JavaScript) created as a portfolio/assignment site to showcase books, opinions, and community-sourced writing. It contains a homepage, an opinions page, a blog feed, a books & authors page, an about page, and a contact/connect page.

How to view locally
--------------------
- Open `index.html` in your browser directly (double-click / File → Open).
- Or run a simple static server for better behavior (recommended):

```bash
cd /path/to/da1
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Files and structure (important files)
------------------------------------
- `index.html` — Landing page (hero, curated shelf, featured opinion, newsletter)
- `Ink.html` — Ink & Opinions (quotes, community discussion cards)
- `Book.html` — Books & Authors (curated shelf details)
- `blog.html` — Blog feed and modal editor
- `about.html` — About / project story
- `connect.html` — Social / contact links
- `style.css` — Central stylesheet (annotated with per-page comments)
- `script.js` — Client behavior (navbar scroll, reveal-on-scroll, quote generator, simple newsletter UI)
- `images/` — images and assets (logo and visuals)
- `readme.txt` — (this file)

Recent changes (2026-02-03)
--------------------------
- Consolidated multiple quote arrays and duplicate functions into a single `generateQuote()` in `script.js`.
- Standardized quote element IDs (`random-quote` / `random-author`) across pages and updated `Ink.html`.
- Replaced inline header styling with a `header.scrolled` class and added smooth header transitions in `style.css`.
- Improved hero typography, CTA button styles, and responsive hero tweaks in `style.css`.
- Removed a CSS override that forced `.reveal-init` visible, and updated `script.js` so the IntersectionObserver now reveals elements (restores scroll reveal animations like the "Curated Shelf").
- Annotated `style.css` with comments indicating which rules apply to which pages.

Known issues & recommended next steps
------------------------------------
- Logo path: some pages reference a local `logo.png` while the `images/` folder contains a `logo` file without an extension — verify and place the correct `logo.png` inside `images/` and update `src` attributes.
- Responsive navigation: consider adding a hamburger menu for narrow screens and improving link spacing on mobile.
- Accessibility: add `alt` text for all images, labels for form inputs, and ARIA attributes for modal dialogs.
- Performance: optimize large external images (use compressed/local versions) and consider preloading critical fonts.

How you can contribute or continue
---------------------------------
- Edit HTML/CSS/JS files directly in the project folder.
- Test changes by running the simple server above.
- If you'd like, I can: fix the logo path, add a responsive hamburger menu, improve accessibility, or optimize images — tell me which and I'll implement the changes.

Credits
-------
Created as a small static portfolio/assignment site (author: project owner).

License
-------
No license specified. Use and modify locally; add a license file if you plan to publish or share.

Contact
-------
Project files are located in this workspace. For further edits, run the local server above and open the pages.


