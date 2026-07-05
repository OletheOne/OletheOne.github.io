import manifest from '../../data/guide/manifest.json';
import {
  loadProgress,
  attachProgressHandlers,
  countProgress,
} from './progress.js';

const guides = import.meta.glob('../../data/guide/v*.json', { eager: true });

function esc(text) {
  const el = document.createElement('span');
  el.textContent = text;
  return el.innerHTML;
}

function renderBlock(block, progress) {
  switch (block.type) {
    case 'lede':
      return `<p class="lede">${block.html}</p>`;
    case 'heading':
      return `<h3>${esc(block.text)}</h3>`;
    case 'paragraph':
      return `<p>${block.html}</p>`;
    case 'checklist':
      return `<ul class="checklist">${block.items
        .map(
          (item) =>
            `<li><input type="checkbox" id="${esc(item.id)}"${
              progress[item.id] ? ' checked' : ''
            }><label for="${esc(item.id)}">${item.html}</label></li>`
        )
        .join('')}</ul>`;
    case 'table':
      return `<table><tr>${block.headers.map((h) => `<th>${h}</th>`).join('')}</tr>${block.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
        .join('')}</table>`;
    case 'callout': {
      const cls = block.variant === 'warn' ? 'callout warn' : 'callout';
      return `<div class="${cls}"><span class="co-label">${esc(block.label)}</span>${block.paragraphs
        .map((p) => `<p>${p}</p>`)
        .join('')}</div>`;
    }
    case 'bossCard':
      return `<div class="boss-card"><div class="boss-sub">${esc(block.subtitle)}</div><h4>${esc(
        block.name
      )}</h4>${block.paragraphs.map((p) => `<p>${p}</p>`).join('')}${
        block.tips.length
          ? `<ul>${block.tips.map((t) => `<li>${t}</li>`).join('')}</ul>`
          : ''
      }${block.footer ? `<p>${block.footer}</p>` : ''}</div>`;
    case 'restMarker':
      return `<div class="rest-marker">${esc(block.text)}</div>`;
    default:
      return '';
  }
}

function renderPhase(phase, progress) {
  const regionTag = phase.regionTag
    ? `<span class="region-tag">${esc(phase.regionTag)}</span>`
    : '';
  const blocks = phase.blocks.map((b) => renderBlock(b, progress)).join('\n  ');
  return `<section class="phase" id="${esc(phase.id)}">
  <div class="phase-head">
    <span class="grace-mark" aria-hidden="true"></span>
    <h2>${esc(phase.title)}</h2>
    ${regionTag}
  </div>
  ${blocks}
</section>`;
}

function renderNav(guide, counts) {
  const pct = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  const progressHtml =
    counts.total > 0
      ? `<div class="route-progress" aria-live="polite"><span class="route-progress-label">Progress</span><span class="route-progress-value">${counts.completed} / ${counts.total}</span><div class="route-progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="route-progress-fill" style="width:${pct}%"></div></div></div>`
      : '';
  const links = guide.nav
    .map((item) => `<li><a href="#${esc(item.id)}">${esc(item.navLabel)}</a></li>`)
    .join('\n    ');
  return `${progressHtml}
  <div class="route-title">The Route of Grace</div>
  <ol>
    ${links}
  </ol>`;
}

function updateNavProgress(guide, progress) {
  const nav = document.querySelector('nav.route');
  if (!nav) return;
  const counts = countProgress(guide, progress);
  const pct = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  const bar = nav.querySelector('.route-progress-fill');
  const value = nav.querySelector('.route-progress-value');
  const progressbar = nav.querySelector('.route-progress-bar');
  if (bar) bar.style.width = `${pct}%`;
  if (value) value.textContent = `${counts.completed} / ${counts.total}`;
  if (progressbar) {
    progressbar.setAttribute('aria-valuenow', String(pct));
  }
}

function renderGuide(guide, progress) {
  const { meta } = guide;
  document.title = meta.pageTitle;

  const counts = countProgress(guide, progress);

  document.getElementById('guide-hero').innerHTML = `
    <div class="wrap">
      <div class="eyebrow">${meta.eyebrow}</div>
      <h1>${esc(meta.title)}</h1>
      <p class="sub">${meta.subtitle}</p>
      <div class="flame" aria-hidden="true"></div>
    </div>`;

  document.getElementById('guide-nav').innerHTML = renderNav(guide, counts);
  document.getElementById('guide-main').innerHTML = guide.phases
    .map((phase) => renderPhase(phase, progress))
    .join('\n\n');

  document.getElementById('guide-footer').innerHTML = `
    <div class="wrap">
      <div class="fin">${esc(meta.footerTagline)}</div>
      <p>${esc(meta.footerText)}</p>
    </div>`;
}

const guidePath = `../../data/guide/v${manifest.currentVersion}.json`;
const guideData = guides[guidePath]?.default;

if (!guideData) {
  throw new Error(`Guide data not found for version ${manifest.currentVersion}`);
}

const priorVersion = Object.keys(manifest.versions)
  .filter((v) => v !== manifest.currentVersion)
  .sort()
  .pop();

const progress = loadProgress(guideData.id, guideData.version, priorVersion ?? null);

renderGuide(guideData, progress);
attachProgressHandlers(guideData, progress, () => updateNavProgress(guideData, progress));
