# williammontiel.com

Personal site & portfolio of **William Montiel** — Senior Software Engineer.

🔗 **Live:** https://williammontiel.com  (also https://willmontiel.github.io)

Hand-built with **plain HTML, CSS, and vanilla JavaScript** — no framework, no
build step, nothing to install. It runs exactly as-is on GitHub Pages.

## Stack

- Static HTML / CSS / vanilla JS (no bundler, widely-compatible ES)
- Google Fonts: Space Grotesk (display), Inter (body), Space Mono (labels/mono)
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
- Respects `prefers-reduced-motion`; cursor effects are disabled on touch devices

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
└── CNAME                 # custom domain
```

## Local development

No tooling required — open the HTML files directly, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Push to `master`. GitHub Pages rebuilds automatically and serves the site at the
custom domain.

---

See [`CLAUDE.md`](CLAUDE.md) for architecture notes and conventions.
