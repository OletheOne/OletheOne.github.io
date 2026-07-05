# The Tarnished's Road

An optimal Elden Ring walkthrough for newcomers and efficiency runners — boss order, grace route, builds, and gear laid out step by step.

## Features

- **Self-contained walkthrough** (`elden-ring-guide.html`) — phased route from Limgrave to the Elden Throne
- **Route of Grace sidebar** — jump between phases as you play
- **Checklists** — optional tasks you can tick off as you progress

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
