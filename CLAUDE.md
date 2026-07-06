# CLAUDE.md

Context for AI assistants (and humans) working on this repository. Read this
first — it captures the constraints and conventions that are not obvious from
the code alone.

## What this is

The personal website & portfolio of **William Montiel** (Senior Software
Engineer), live at **williammontiel.com** / willmontiel.github.io. Design
language: retro-CRT / 90s nostalgia over a clean, minimal, typography-first base.

## Hard constraints (do not break)

- **Pure vanilla HTML/CSS/JS. No build step, no npm, no framework, no bundler.**
  Everything must run as-is when the files are served statically on GitHub Pages.
- **No external runtime dependencies** except Google Fonts (loaded via `<link>`).
  No CDN scripts, no package installs, no imports.
- Keep JS **widely compatible** — the existing code is ES5-style (`var`, function
  expressions, no ES modules). Match it.
- **Deployed from the `master` branch** (GitHub Pages user site). Pushing to
  `master` publishes the site. There is no CI/build.
- Custom domain lives in `CNAME` (`williammontiel.com`). DNS: `A` records →
  185.199.108–111.153; `www` `CNAME` → willmontiel.github.io.
- **Light theme is the default**, white background (`--paper`) everywhere.

## Design system — `css/main.css` (the single stylesheet)

Monochrome, ink-on-white, typography-first. Everything is driven by CSS custom
properties in `:root`, so the whole site is themeable by flipping tokens.

- **Colors:** `--paper #ffffff`, `--ink #0a0a0a`, `--ink-soft #333`,
  `--graphite #707070`, `--hairline #e6e6e6`, `--hairline-strong #cfcfcf`,
  `--accent #FF4A1C` (strong orange — the brand accent).
- **Dark theme:** `:root[data-theme="dark"]` overrides the neutrals
  (paper→`#0d0d0d`, ink→`#f4f4f4`, …). The **orange accent stays constant** in
  both themes — this is intentional.
- **Fonts:** `--font-display` Space Grotesk (headings), `--font-body` Inter
  (prose), `--font-mono` Space Mono (nav, role, labels, tags), and `--font-retro`
  **DotGothic16** — a dot-matrix font used **sparingly** for retro accents (page
  eyebrows, the Home coordinates + "Keep it simple." line, the NO SIGNAL screen).
  Grotesk + Inter keep the base modern; DotGothic16 (letters built from dots, a
  nod to Nothing-Phone / retro-LED displays) carries the retro.
- **Spacing:** `--s-1` (.5rem) … `--s-8` (9rem). **Layout:** `--measure` 42rem
  (reading column), `--page-max` 68rem.
- Because everything uses `var(--…)`, new UI rarely needs per-component color
  rules — reuse the tokens.

## Pages

- `index.html` — **Home.** `body.is-home`; all content wrapped in `.crt-stage`.
  Centered `.home__block` (name / role / `<hr>` / nav) plus a `.home__meta`
  coordinate footer, which is anchored to the bottom via `margin-top:auto`
  (not `position:absolute`) so it never overlaps on short viewports. Home
  deliberately has **no** backlink, top fade, or dot-grid background — it stays
  clean and is the only page with the CRT intro.
- `about.html` — personal bio ("Hi, I'm"), prose story, `.credo` closing line.
- `portfolio.html` — experience timeline (`.entry`), independent projects
  (`.project-item`), technologies (`.tags`), education. Reveal targets are
  marked with data attributes (see below).
- `contact.html` — intro, WhatsApp `.cta`, `.contact-list`.
- `lab-effects.html` — **temporary** sandbox to preview the cursor effects.
  `noindex`, not linked from anywhere, self-contained (its own inline JS). Safe
  to delete; kept for reference while iterating.

## JavaScript — `js/` (all loaded with `defer`), plus a few inline snippets

- `theme.js` — wires the `.theme-toggle` button: toggles `data-theme="dark"` on
  `<html>`, persists to `localStorage['theme']`, updates aria. **Anti-FOUC:**
  every page has a tiny inline `<head>` script that applies the saved theme
  before first paint — that snippet **must stay inline** (an external file loads
  too late and flashes).
- `glitch.js` — terminal-decode scramble for the name headings (`.home__name`,
  `.page__name`). Runs on **hover** and **once automatically on load** (a
  "decode-in"): on Home after the CRT `animationend`; on internal pages after
  `document.fonts.ready`. Preserves spaces.
- `bg.js` — phosphor **dot-grid** cursor background. Self-injects a `.fx-bg`
  canvas (`z-index:-1`, above the page background, below content). Dots near the
  cursor brighten toward `--accent`. **Internal pages only** (not Home).
  Disabled on touch (`pointer: coarse`).
- `reveal.js` — portfolio **project reveal**. Self-injects a `.fx-preview` canvas
  that follows the cursor. Disabled on touch. **Only included
  on `portfolio.html`.** See below for the markup contract.
- **Inline scripts:** CRT gating (in `index.html` `<head>` — arms
  `crt-arm`/`crt-play` on `<html>` before first paint, plays on `fonts.ready`
  with a 2s safety cap, cleans up on `animationend`); Home nav scramble + old-TV
  click sound (in `index.html` before `</body>` — navigation is deferred ~650ms
  so the sound is heard before the page changes).

### Which scripts each page loads

| Page | theme | glitch | bg | reveal | inline (CRT + nav sound) |
|------|:---:|:---:|:---:|:---:|:---:|
| index (Home) | ✓ | ✓ | — | — | ✓ |
| about | ✓ | ✓ | ✓ | — | — |
| portfolio | ✓ | ✓ | ✓ | ✓ | — |
| contact | ✓ | ✓ | ✓ | — | — |

## Effects & the gating rule

- **CRT turn-on intro:** Home only; JS-gated via `crt-arm`/`crt-play` classes.
  No-JS → plain white page.
- **Home nav links:** hover glitch scramble + `sounds/old-tv-sound.mp3` on click.
- **Name decode-in + hover scramble:** all pages (`glitch.js`).
- **Dot-grid background:** internal pages (`bg.js`). **Project reveal:** portfolio.
- **Rule of thumb:** cursor effects must no-op on touch (`pointer: coarse`) —
  there's no cursor to follow. Effects intentionally do **not** gate on
  `prefers-reduced-motion`: Windows over-reports it (desktop animations off →
  `reduce`), which made the whole site look dead there. Follow this for new work.

## Portfolio reveal — how to add or change one

On `portfolio.html`, add **one** attribute to an `.entry` or `.project-item`:

- `data-shot="images/portfolio/<name>.jpg"` → screenshot reveal (pixel-dissolve), or
- `data-nosignal="Tech · Stack · Here"` → animated "NO SIGNAL" static screen.

Currently 4 entries have screenshots (GPS Trackit Cloud, Platform Manager,
Transportes Ejecutivos, D Side); the rest use `data-nosignal`. To promote a
"NO SIGNAL" entry to a real screenshot later, drop the image in
`images/portfolio/` and swap the attribute. Screenshots are served as
**optimized `.jpg`** (~1200px wide); the large `.png` originals are kept in the
same folder but are **not referenced by the site** (they can be pruned to slim
the repo).

## Assets

- `images/logo.svg` — black **W** + orange **M** monogram.
  `images/logo-white.svg` — white variant for dark backgrounds.
  `images/favicon.svg` — adaptive to OS light/dark via an embedded `@media`.
- `images/portfolio/*.jpg` — used by the reveal. `*.png` — originals (unused).
- `sounds/old-tv-sound.mp3` — Home nav click sound (~0.86s).

## Conventions

- **Indentation:** HTML and JS use **tabs**; `css/main.css` uses **2 spaces**.
  Match the file you're editing (a linter reformats HTML to tabs).
- Asset paths are relative and rooted at the repo root (`images/…`, `js/…`,
  `css/…`, `sounds/…`).
- **Clean URLs:** GitHub Pages serves `about.html` at `/about` automatically, so
  **link without the `.html`** — internal links are root-relative (`/about`,
  `/portfolio`, `/contact`) and Home is `href="/"`. Files stay flat in the repo
  root; do **not** move them into folders (relative asset paths keep working
  because the page is served at a no-trailing-slash URL). Caveat: the
  extensionless resolution is a GitHub Pages feature — `python3 -m http.server`
  and `file://` 404 on those links locally. For a faithful local preview run
  **`python3 serve.py`** (a dev-only helper that resolves `/about` → `about.html`
  like GitHub Pages); `file://` can't do clean URLs at all.
- UI copy is in **English**; the owner authors his own bio / portfolio copy.
- **New page checklist:** copy an internal page's `<head>` (theme anti-FOUC
  snippet + font `<link>`s + `main.css`); include `theme.js`, `glitch.js`, and
  `bg.js`; add the `.backlink` and `.theme-toggle` markup near the top of `<body>`.

## Local preview & visual verification

- No build. Run **`python3 serve.py`** then open http://localhost:8000 — this
  resolves the site's clean URLs (`/about`, …) locally, like GitHub Pages does.
  (`python3 -m http.server` and `file://` will 404 on the extensionless links.)
- Headless Chrome is handy for screenshots:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --screenshot=out.png \
    --window-size=1200,800 --virtual-time-budget=3000 \
    "file:///…/page.html"
  ```
  Notes: copy files to a fresh dir to dodge Chrome's CSS cache; headless clamps
  layout width to a ~500px minimum; to capture a mid-animation frame, dispatch
  the triggering event and use a short `--virtual-time-budget`.

## Deploy

Commit and push to `master`; GitHub Pages publishes automatically to the custom
domain. Confirm the site at https://williammontiel.com after the push.

## Communication

The owner (William) generally communicates in **Spanish**. Keep site content,
code, comments, and docs in **English**.
