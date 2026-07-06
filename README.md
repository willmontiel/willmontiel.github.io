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
- **90s terminal-glitch** text effect on the name and nav links (on hover and on load)
- **Old-TV sound** on the home nav links
- **Cursor-reactive phosphor dot-grid** background on the internal pages
- **Project reveal** on the portfolio — screenshots arrive with a pixel-dissolve CRT
  effect; entries without a screenshot show an animated **"NO SIGNAL"** screen
- Cursor effects (dot-grid, project reveal) are disabled on touch devices

## Project structure

```
├── index.html / about.html / portfolio.html / contact.html
├── css/main.css          # single stylesheet — design tokens + all styles
├── js/
│   ├── theme.js          # light/dark toggle + persistence
│   ├── glitch.js         # name decode-in / hover scramble
│   ├── bg.js             # phosphor dot-grid cursor background (internal pages)
│   └── reveal.js         # portfolio project reveal (pixel-dissolve / NO SIGNAL)
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
