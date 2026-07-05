/**
 * Legacy extractor — reads a monolithic HTML walkthrough and writes data/guide/v1.0.0.json.
 * Source of truth is now data/guide/v*.json; keep a copy of the original HTML elsewhere if re-running.
 * Run: npm run extract-guide
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const html = readFileSync(join(root, 'elden-ring-guide.html'), 'utf8');

const NAV = [
  { id: 'build', navLabel: 'The Build' },
  { id: 'limgrave', navLabel: 'I · Limgrave' },
  { id: 'weeping', navLabel: 'II · Weeping Peninsula' },
  { id: 'stormveil', navLabel: 'III · Stormveil Castle' },
  { id: 'liurnia', navLabel: 'IV · Liurnia' },
  { id: 'caelid', navLabel: 'V · Caelid & Radahn' },
  { id: 'nokron', navLabel: 'VI · Nokron' },
  { id: 'altus', navLabel: 'VII · Altus Plateau' },
  { id: 'leyndell', navLabel: 'VIII · Leyndell' },
  { id: 'mountaintops', navLabel: 'IX · Mountaintops' },
  { id: 'farum', navLabel: 'X · Farum Azula' },
  { id: 'endgame', navLabel: 'XI · The Elden Throne' },
  { id: 'appendix', navLabel: 'Appendices' },
];

function innerHtml(el) {
  return el.replace(/^[\s\S]*?>/, '').replace(/<\/[^>]+>$/, '').trim();
}

function parseTable(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  const headers = [...rows[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((m) => m[1].trim());
  const dataRows = rows.slice(1).map((row) =>
    [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1].trim())
  );
  return { type: 'table', headers, rows: dataRows };
}

function parseChecklist(ulHtml) {
  const items = [...ulHtml.matchAll(
    /<li><input type="checkbox" id="([^"]+)"><label for="\1">([\s\S]*?)<\/label><\/li>/g
  )].map((m) => ({ id: m[1], html: m[2].trim() }));
  return { type: 'checklist', items };
}

function parseCallout(divHtml) {
  const warn = divHtml.includes('callout warn');
  const label = divHtml.match(/<span class="co-label">([\s\S]*?)<\/span>/)?.[1]?.trim() ?? '';
  const paragraphs = [...divHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
  return { type: 'callout', variant: warn ? 'warn' : 'default', label, paragraphs };
}

function parseBossCard(divHtml) {
  const subtitle = divHtml.match(/<div class="boss-sub">([\s\S]*?)<\/div>/)?.[1]?.trim() ?? '';
  const name = divHtml.match(/<h4>([\s\S]*?)<\/h4>/)?.[1]?.trim() ?? '';
  const tips = [...divHtml.matchAll(/<ul>\s*([\s\S]*?)<\/ul>/g)].flatMap((m) =>
    [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) => li[1].trim())
  );
  const allPs = [...divHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
  const paragraphs = allPs.filter((p) => !p.startsWith('<strong>Reward'));
  const footer = allPs.find((p) => p.startsWith('<strong>After') || p.startsWith('<strong>Reward') || p.startsWith('<strong>Then'));
  return { type: 'bossCard', subtitle, name, paragraphs, tips, footer: footer ?? null };
}

function extractBalancedDiv(html, startIndex) {
  const open = html.indexOf('<div', startIndex);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < html.length; i++) {
    if (html.startsWith('<div', i)) {
      depth++;
      i += 3;
      continue;
    }
    if (html.startsWith('</div>', i)) {
      depth--;
      if (depth === 0) {
        return { html: html.slice(open, i + 6), end: i + 6 };
      }
      i += 5;
    }
  }
  return null;
}

function parseBlocks(body) {
  const blocks = [];
  let cursor = 0;

  while (cursor < body.length) {
    const rest = body.slice(cursor).trimStart();
    cursor += body.slice(cursor).length - rest.length;
    if (!rest) break;

    if (rest.startsWith('<h3>')) {
      const m = rest.match(/^<h3>([\s\S]*?)<\/h3>/);
      blocks.push({ type: 'heading', text: m[1].trim() });
      cursor += m[0].length;
    } else if (rest.startsWith('<p>')) {
      const m = rest.match(/^<p>([\s\S]*?)<\/p>/);
      blocks.push({ type: 'paragraph', html: m[1].trim() });
      cursor += m[0].length;
    } else if (rest.startsWith('<ul class="checklist">')) {
      const m = rest.match(/^<ul class="checklist">[\s\S]*?<\/ul>/);
      blocks.push(parseChecklist(m[0]));
      cursor += m[0].length;
    } else if (rest.startsWith('<table>')) {
      const m = rest.match(/^<table>[\s\S]*?<\/table>/);
      blocks.push(parseTable(m[0]));
      cursor += m[0].length;
    } else if (rest.startsWith('<div class="callout')) {
      const extracted = extractBalancedDiv(body, cursor);
      blocks.push(parseCallout(extracted.html));
      cursor = extracted.end;
    } else if (rest.startsWith('<div class="boss-card">')) {
      const extracted = extractBalancedDiv(body, cursor);
      blocks.push(parseBossCard(extracted.html));
      cursor = extracted.end;
    } else if (rest.startsWith('<div class="rest-marker">')) {
      const extracted = extractBalancedDiv(body, cursor);
      blocks.push({ type: 'restMarker', text: innerHtml(extracted.html) });
      cursor = extracted.end;
    } else {
      cursor++;
    }
  }

  return blocks;
}

function parsePhase(sectionHtml, navLabel) {
  const id = sectionHtml.match(/id="([^"]+)"/)?.[1] ?? '';
  const title = sectionHtml.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim() ?? '';
  const regionTag = sectionHtml.match(/<span class="region-tag">([\s\S]*?)<\/span>/)?.[1]?.trim() ?? null;

  const bodyStart = sectionHtml.indexOf('</div>') + 6;
  const bodyEnd = sectionHtml.lastIndexOf('</section>');
  let body = sectionHtml.slice(bodyStart, bodyEnd);

  const blocks = [];
  const lede = body.match(/<p class="lede">([\s\S]*?)<\/p>/);
  if (lede) {
    blocks.push({ type: 'lede', html: lede[1].trim() });
    body = body.replace(lede[0], '');
  }

  blocks.push(...parseBlocks(body));

  return { id, navLabel, title, regionTag, blocks };
}

const heroMatch = html.match(/<header class="hero">([\s\S]*?)<\/header>/);
const eyebrow = heroMatch?.[1].match(/<div class="eyebrow">([\s\S]*?)<\/div>/)?.[1]?.trim() ?? '';
const heroTitle = heroMatch?.[1].match(/<h1>([\s\S]*?)<\/h1>/)?.[1]?.trim() ?? '';
const subtitle = heroMatch?.[1].match(/<p class="sub">([\s\S]*?)<\/p>/)?.[1]?.trim() ?? '';

const sections = [...html.matchAll(/<section class="phase" id="[^"]+">([\s\S]*?)<\/section>/g)].map((m) =>
  '<section class="phase" id="' + m[0].match(/id="([^"]+)"/)[1] + '">' + m[1] + '</section>'
);

const navById = Object.fromEntries(NAV.map((n) => [n.id, n.navLabel]));
const phases = sections.map((sec) => {
  const id = sec.match(/id="([^"]+)"/)[1];
  return parsePhase(sec, navById[id] ?? id);
});

const guide = {
  id: 'bloodhound-vagabond',
  version: '1.0.0',
  meta: {
    title: heroTitle,
    eyebrow,
    subtitle,
    pageTitle: "The Tarnished's Road — An Optimal Elden Ring Walkthrough",
    footerTagline: 'Well Met, Tarnished',
    footerText: 'An original walkthrough written for elden-ring newcomers and efficiency runners alike.',
  },
  nav: NAV,
  phases,
};

const outDir = join(root, 'data', 'guide');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'v1.0.0.json'), JSON.stringify(guide, null, 2) + '\n');

writeFileSync(
  join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      guideId: 'bloodhound-vagabond',
      currentVersion: '1.0.0',
      versions: {
        '1.0.0': {
          releasedAt: '2026-07-04',
          changelog: 'Initial structured release — content extracted from static HTML.',
        },
      },
    },
    null,
    2
  ) + '\n'
);

const checklistCount = phases.flatMap((p) =>
  p.blocks.filter((b) => b.type === 'checklist').flatMap((b) => b.items)
).length;

console.log(`Wrote data/guide/v1.0.0.json (${phases.length} phases, ${checklistCount} checklist items)`);
