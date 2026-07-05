# The Tarnished's Road

An optimal Elden Ring walkthrough for newcomers and efficiency runners — boss order, grace route, builds, and gear laid out step by step.

## Features

- **Landing page** (`index.html`) — overview and entry point
- **Interactive walkthrough** (`elden-ring-guide.html`) — phased route from Limgrave to the Elden Throne
- **Checklist progress** — optional tasks tracked in the browser via `localStorage`, with a sidebar progress bar
- **Versioned guide data** — content lives in JSON under `data/guide/` so updates can be released without rewriting markup

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The walkthrough is at `/elden-ring-guide.html`.

### Production build

```bash
npm run build
npm run preview
```

Built assets are written to `dist/`.

## Project structure

```
├── index.html              # Landing page
├── elden-ring-guide.html   # Walkthrough shell (rendered by JS)
├── data/guide/
│   ├── manifest.json       # Guide ID, current version, changelog
│   └── v1.0.0.json         # Structured walkthrough content
├── src/
│   ├── js/
│   │   ├── render-guide.js # Loads JSON and renders the guide
│   │   └── progress.js     # Checklist persistence (localStorage)
│   └── styles/
│       └── guide.css
└── scripts/
    └── extract-guide.mjs   # Legacy HTML → JSON extractor
```

## Editing guide content

The source of truth is `data/guide/v*.json`. Each version file includes metadata, navigation, and an array of **phases** with typed **blocks**:

| Block type   | Purpose                          |
|--------------|----------------------------------|
| `lede`       | Opening paragraph for a section  |
| `heading`    | Subsection title                 |
| `paragraph`  | Body text (HTML allowed)         |
| `checklist`  | Trackable checkbox items         |
| `table`      | Stat or comparison tables        |
| `callout`    | Tips and warnings                |
| `bossCard`   | Boss fight breakdowns            |
| `restMarker` | Section dividers                 |

To ship a new version:

1. Copy the latest `v*.json` to a new file (e.g. `v1.1.0.json`) and edit content.
2. Update `data/guide/manifest.json` — set `currentVersion` and add an entry under `versions` with a release date and changelog.

Checklist progress is keyed by guide ID and version. When a user loads a new version with no saved progress, items from the previous version are migrated automatically.

## Legacy extractor

`npm run extract-guide` parses a monolithic HTML walkthrough and writes `data/guide/v1.0.0.json`. This was used for the initial migration; day-to-day edits should go directly into the JSON files.

## License

Walkthrough content is original writing for Elden Ring players. Elden Ring is © FromSoftware / Bandai Namco.
