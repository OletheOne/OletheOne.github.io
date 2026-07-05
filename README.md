# The Tarnished's Road

An optimal Elden Ring walkthrough for newcomers and efficiency runners — boss order, grace route, builds, and gear laid out step by step.

## Features

- **Cinematic title gate** — front-door visits open on a title screen: a grace ignites, the golden ring draws itself closed, and "Touch Grace & Enter" dissolves the gate into the guide. Deep links (`#caelid`, etc.) skip it entirely, and it degrades gracefully without JavaScript
- **Self-contained walkthrough** (`elden-ring-guide.html`) — phased route from Limgrave to the Elden Throne
- **Route of Grace sidebar** — jump between phases as you play; the grace-dot for the section you're reading burns lit, and fully checked phases earn a filled dot
- **Checklists** — tasks you tick off as you progress, saved to `localStorage` so your run survives closing the tab
- **Progress tally** — an overall completion percentage under the sidebar, plus a golden reading-progress thread along the top of the page
- **Motion with restraint** — grace flares on arrival, gentle section reveals, and tactile hover/press feedback; everything honors `prefers-reduced-motion`
- **Mobile-ready** — at ≤900px the sidebar becomes a sticky horizontal pill nav, tables swipe-scroll, touch targets enlarge, and safe-area insets cover notched phones; desktop layout is unchanged

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The walkthrough is at `/elden-ring-guide.html`; the site root redirects there.

### Production build

```bash
npm run build
npm run preview
```

Built assets are written to `dist/`.

## Project structure

```
├── index.html              # Redirects to the walkthrough
├── elden-ring-guide.html   # Main walkthrough (self-contained HTML)
└── archive/
    └── json-driven-site/   # Previous JSON + JS renderer approach
```

## Editing guide content

Edit `elden-ring-guide.html` directly. Styles and markup live in that single file.

The earlier JSON-driven version is archived under `archive/json-driven-site/` if you need to reference it.

## License

Walkthrough content is original writing for Elden Ring players. Elden Ring is © FromSoftware / Bandai Namco.
