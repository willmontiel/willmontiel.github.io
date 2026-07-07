# williammontiel.com

Personal site & portfolio of **William Montiel** — Senior Software Engineer.

🔗 **Live:** https://williammontiel.com  (also https://willmontiel.github.io)

Hand-built with **plain HTML, CSS, and vanilla JavaScript** — no framework, no
build step, nothing to install. It runs exactly as-is on GitHub Pages.

## Stack

- Static HTML / CSS / vanilla JS (no bundler, widely-compatible ES)
- Google Fonts: Space Grotesk (display), Inter (body), Space Mono (labels/mono), DotGothic16 (dot-matrix retro accents)
- Hosted on **GitHub Pages** (served from the `master` branch) with a custom domain (`CNAME`)

## Pages

| File | Page |
|------|------|
| `index.html` | Home — name, role, nav; CRT "old-TV" turn-on intro |
| `about.html` | About — personal bio & story |
| `portfolio.html` | Portfolio — experience timeline, projects, skills |
| `contact.html` | Contact — links & WhatsApp call-to-action |

## Features

- **Light / dark theme** toggle — defaults to light; the choice is saved in `localStorage`
- **CRT turn-on intro** on the home page
- **Terminal typewriter** on the name — it types in behind a blinking cursor (on load and on hover)
- **90s terminal-glitch** text effect on the home nav links (on hover)
- **Old-TV sound** on the home nav links
- **Cursor-reactive background** on the internal pages — a binary (0/1) field that lights up near the cursor (swappable; see `js/bg-effects/`)
- **Reveal preview** — hover a portfolio project (screenshots arrive with a
  pixel-dissolve CRT effect; entries without one show an animated **"NO SIGNAL"**
  screen) or an *about* family name to pop its photo; the screen auto-sizes to the
  image's aspect ratio
- Cursor effects (background, reveal preview) are disabled on touch devices

## Project structure

```
├── index.html / about.html / portfolio.html / contact.html
├── css/main.css          # single stylesheet — design tokens + all styles
├── js/
│   ├── theme.js          # light/dark toggle + persistence
│   ├── type.js           # name typewriter (types in + blinking cursor)
│   ├── reveal.js         # shared hover preview (portfolio + about)
│   └── bg-effects/       # swappable cursor backgrounds — binary.js is active
├── images/               # logo, adaptive favicon, portfolio screenshots
├── sounds/               # old-tv-sound.mp3
├── lab-effects.html      # temporary effects sandbox (unlinked, noindex)
├── serve.py              # local dev server — clean-URL preview (not deployed)
└── CNAME                 # custom domain
```

## Local development

The site uses clean URLs (`/about`, `/portfolio`, …) that GitHub Pages resolves
in production. To preview them locally the same way, run the tiny included dev
server:

```bash
python3 serve.py
# then open http://localhost:8000
```

(`python3 -m http.server` and opening files via `file://` will 404 on the
extensionless links — a plain static server can't resolve them.)

## Deploy

Push to `master`. GitHub Pages rebuilds automatically and serves the site at the
custom domain.

---

See [`CLAUDE.md`](CLAUDE.md) for architecture notes and conventions.
