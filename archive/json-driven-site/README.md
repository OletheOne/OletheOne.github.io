# Archived JSON-driven site

This folder preserves the earlier refactor that split the walkthrough into:

- A thin `elden-ring-guide.html` shell
- Structured content in `data/guide/v*.json`
- Client-side rendering via `src/js/render-guide.js` and `src/styles/guide.css`
- Checklist persistence via `src/js/progress.js`

The live site now uses the self-contained HTML walkthrough at the project root (`elden-ring-guide.html`).

To restore or reference this approach, copy files back into the project root and update `vite.config.js` accordingly.
