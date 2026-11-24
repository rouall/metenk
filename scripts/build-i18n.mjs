/*!
 * Static multi-language build for the MeTenk site.
 * ---------------------------------------------------------------------------
 * Usage:
 *   node scripts/build-i18n.mjs          # write all language pages
 *   node scripts/build-i18n.mjs --check  # verify the tree is up to date
 *
 * English stays at the repo root; every other language is written to
 *   /<lang-dir>/<page>.html   (index -> /<lang-dir>/index.html)
 *
 * The dictionary in assets/locales/<page>.js remains the single source of
 * truth. Nothing else needs to be edited when a language is added.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { bake } from './html-baker.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://metenk.com';
const CHECK = process.argv.includes('--check');

/* Keep deterministic: bump when the page set changes. */
const LASTMOD = '2026-11-24';

const PAGES = [
  { key: 'index', file: 'index.html' },
  { key: 'about', file: 'about.html' },
  { key: 'clockmax', file: 'clockmax.html' },
  { key: 'sponsor', file: 'sponsor.html' },
  { key: 'vip-redeem-code', file: 'vip-redeem-code.html' },
  { key: 'privacy-policy', file: 'privacy-policy.html' },
  { key: 'clock-privacy-policy', file: 'clock-privacy-policy.html' },
  { key: 'pickcolor-privacy-policy', file: 'pickcolor-privacy-policy.html' }
];

const LANGS = [
  { code: 'en',    dir: '',       htmlLang: 'en',    hreflang: 'en',    ogLocale: 'en_US', pin: null },
  { code: 'zh',    dir: 'zh',     htmlLang: 'zh-CN', hreflang: 'zh-CN', ogLocale: 'zh_CN', pin: 'zh' },
  { code: 'zh-TW', dir: 'zh-tw',  htmlLang: 'zh-TW', hreflang: 'zh-TW', ogLocale: 'zh_TW', pin: 'zh-TW' },
  { code: 'es',    dir: 'es',     htmlLang: 'es',    hreflang: 'es',    ogLocale: 'es_ES', pin: 'es' },
  { code: 'pt-BR', dir: 'pt-br',  htmlLang: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR', pin: 'pt-BR' },
  { code: 'ja',    dir: 'ja',     htmlLang: 'ja',    hreflang: 'ja',    ogLocale: 'ja_JP', pin: 'ja' }
];

const ROOT_FILES = new Set([
  'favicon.png', 'clockmax-icon.png', 'welcome.js', 'clockmax-wel.css', 'clockmax-wel.js'
]);
const PAGE_KEYS = new Set(PAGES.map((p) => p.key));

/* Optional partial build, used while a language is still being translated:
 *   node scripts/build-i18n.mjs --langs=en,zh
 * Without it every registered language must be complete. */
const LANGS_ARG = process.argv.find((arg) => arg.startsWith('--langs='));
const ACTIVE_LANGS = LANGS_ARG
  ? LANGS.filter((lang) => LANGS_ARG.slice('--langs='.length).split(',').includes(lang.code))
  : LANGS;

if (!ACTIVE_LANGS.length) {
  console.error('No matching languages for ' + LANGS_ARG);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

/** Load window.METENK_I18N from a plain browser script. */
function loadDict(pageKey) {
  const file = `assets/locales/${pageKey}.js`;
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(file), sandbox, { filename: file });
  const dict = sandbox.window.METENK_I18N;
  if (!dict || typeof dict !== 'object') {
    throw new Error(`${file}: window.METENK_I18N was not defined`);
  }
  return dict;
}

function pageUrl(lang, pageKey) {
  const base = lang.dir ? `/${lang.dir}/` : '/';
  if (pageKey === 'index') return base;
  return `${base}${pageKey}.html`;
}

/** Rewrite a href/src value for a page living in /<lang>/ . */
function makeRewriter(lang) {
  return function rewriteUrl(url) {
    const raw = String(url);
    const value = raw.trim();
    if (!value) return raw;
    if (value[0] === '#' || /^(mailto:|tel:|data:|javascript:)/i.test(value)) return raw;

    let internal = null;
    const absolute = /^https?:\/\/(?:www\.)?metenk\.com(\/[^\s]*)?$/i.exec(value);
    if (absolute) {
      internal = absolute[1] || '/';
    } else if (value[0] === '/') {
      internal = value;
    } else if (/^(\.\/)?[A-Za-z0-9_-][^\s:]*$/.test(value)) {
      internal = '/' + value.replace(/^\.\//, '');
    } else {
      return raw;
    }

    if (/^\/(assets|resource)\//.test(internal)) return internal;
    if (ROOT_FILES.has(internal.slice(1))) return internal;

    let target = internal;
    let hash = '';
    const hashAt = target.indexOf('#');
    if (hashAt !== -1) {
      hash = target.slice(hashAt);
      target = target.slice(0, hashAt);
    }

    let key = null;
    if (target === '/' || target === '' || target === '/index.html') {
      key = 'index';
    } else {
      const cleaned = target.replace(/^\//, '').replace(/\.html$/i, '');
      if (PAGE_KEYS.has(cleaned)) key = cleaned;
    }

    if (key) return pageUrl(lang, key) + hash;
    return internal;
  };
}

function headBlock(lang, pageKey) {
  const canonical = SITE + pageUrl(lang, pageKey);
  const lines = ['  <!-- i18n:head:start -->'];

  lines.push(`  <link rel="canonical" href="${canonical}">`);
  for (const item of LANGS) {
    lines.push(`  <link rel="alternate" hreflang="${item.hreflang}" href="${SITE + pageUrl(item, pageKey)}">`);
  }
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${SITE + pageUrl(LANGS[0], pageKey)}">`);

  lines.push(`  <meta property="og:url" content="${canonical}">`);
  lines.push(`  <meta property="og:locale" content="${lang.ogLocale}">`);
  for (const item of LANGS) {
    if (item.code === lang.code) continue;
    lines.push(`  <meta property="og:locale:alternate" content="${item.ogLocale}">`);
  }

  lines.push('  <!-- i18n:head:end -->');
  return lines.join('\n');
}

function injectHead(html, lang, pageKey) {
  let out = html
    .replace(/^[ \t]*<link\s+rel="canonical"[^>]*>[ \t]*\r?\n/gim, '')
    .replace(/^[ \t]*<meta\s+property="og:url"[^>]*>[ \t]*\r?\n/gim, '')
    .replace(/^[ \t]*<meta\s+property="og:locale(?::alternate)?"[^>]*>[ \t]*\r?\n/gim, '')
    .replace(/[ \t]*<!-- i18n:head:start -->[\s\S]*?<!-- i18n:head:end -->[ \t]*\r?\n?/g, '');

  out = out.replace('</head>', `${headBlock(lang, pageKey)}\n</head>`);
  return out;
}

/** Translate JSON-LD: inLanguage follows the page; FAQPage is rebuilt. */
function patchLd(node, lang, pageDict) {
  if (Array.isArray(node)) return node.map((item) => patchLd(item, lang, pageDict));

  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === 'inLanguage') {
        out[key] = lang.hreflang;
      } else {
        out[key] = patchLd(value, lang, pageDict);
      }
    }

    if (node['@type'] === 'FAQPage' && pageDict && pageDict.faq1Q) {
      const faq = [];
      for (let i = 1; i <= 5; i++) {
        const question = pageDict[`faq${i}Q`];
        const answer = pageDict[`faq${i}A`];
        if (!question || !answer) continue;
        faq.push({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer }
        });
      }
      if (faq.length) out.mainEntity = faq;
    }

    return out;
  }

  return node;
}

function patchJsonLd(html, lang, pageDict) {
  return html.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (match, open, body, close) => {
      try {
        const data = JSON.parse(body);
        return open + '\n' + JSON.stringify(patchLd(data, lang, pageDict), null, 2) + '\n  ' + close;
      } catch (error) {
        console.warn(`  ! JSON-LD left untouched: ${error.message}`);
        return match;
      }
    }
  );
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

function validateSource(dicts) {
  const problems = [];
  const en = dicts.en;
  const enKeys = Object.keys(en).sort();

  for (const lang of ACTIVE_LANGS) {
    if (lang.code === 'en') continue;
    const dict = dicts[lang.code];
    if (!dict) {
      problems.push(`missing "${lang.code}" dictionary block`);
      continue;
    }

    const keys = Object.keys(dict).sort();
    const missing = enKeys.filter((key) => !(key in dict));
    const extra = keys.filter((key) => !(key in en));

    if (missing.length) problems.push(`[${lang.code}] missing keys: ${missing.join(', ')}`);
    if (extra.length) problems.push(`[${lang.code}] unknown keys: ${extra.join(', ')}`);
  }

  if (problems.length) {
    console.error('\nDictionary check failed:');
    for (const problem of problems) console.error('  - ' + problem);
    process.exit(1);
  }
}

function validateOutput(pageKey, lang, html) {
  const problems = [];

  const langAttr = new RegExp(`<html[^>]*\\slang="${lang.htmlLang}"`, 'i');
  if (!langAttr.test(html)) problems.push('<html lang> does not match');

  const canonical = `<link rel="canonical" href="${SITE + pageUrl(lang, pageKey)}">`;
  if (!html.includes(canonical)) problems.push('canonical mismatch');

  const hreflangCount = (html.match(/rel="alternate" hreflang="/g) || []).length;
  if (hreflangCount !== LANGS.length + 1) {
    problems.push(`expected ${LANGS.length + 1} hreflang links, found ${hreflangCount}`);
  }

  // No relative asset references may survive inside a language subdirectory.
  const relative = html.match(/(?:href|src)="(?![#]|https?:|\/\/|\/|data:|mailto:)[^"]*\.(?:css|js|png|jpe?g|webp|avif|svg|ico)"/gi);
  if (relative) problems.push(`relative asset refs: ${relative.slice(0, 3).join(' ')}`);

  if (problems.length) {
    console.error(`\n${pageUrl(lang, pageKey)} failed validation:`);
    for (const problem of problems) console.error('  - ' + problem);
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ *
 * Sitemap
 * ------------------------------------------------------------------ */

function buildSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];

  for (const page of PAGES) {
    for (const lang of ACTIVE_LANGS) {
      const loc = SITE + pageUrl(lang, page.key);
      lines.push('  <url>');
      lines.push(`    <loc>${loc}</loc>`);
      lines.push(`    <lastmod>${LASTMOD}</lastmod>`);
      lines.push(`    <changefreq>${page.key === 'index' ? 'weekly' : 'monthly'}</changefreq>`);
      lines.push(`    <priority>${page.key === 'index' ? '1.0' : '0.8'}</priority>`);
      for (const alt of LANGS) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${SITE + pageUrl(alt, page.key)}"/>`);
      }
      lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE + pageUrl(LANGS[0], page.key)}"/>`);
      lines.push('  </url>');
    }
  }

  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

const outputs = [];

for (const page of PAGES) {
  const source = read(page.file);
  const dicts = loadDict(page.key);

  validateSource(dicts);

  for (const lang of ACTIVE_LANGS) {
    const dict = dicts[lang.code];
    const rewriter = lang.code === 'en' ? null : makeRewriter(lang);

    let html = bake(source, {
      dict,
      htmlLang: lang.htmlLang,
      defaultLang: lang.pin,
      pageKey: page.key,
      rewriteUrl: rewriter
    });

    html = patchJsonLd(html, lang, dict);
    html = injectHead(html, lang, page.key);

    if (lang.code !== 'en') validateOutput(page.key, lang, html);

    const target = lang.dir ? `${lang.dir}/${page.file}` : page.file;
    outputs.push({ target, html });
  }
}

outputs.push({ target: 'sitemap.xml', html: buildSitemap() });

/* Write or verify */
const drift = [];

for (const { target, html } of outputs) {
  const absolute = path.join(ROOT, target);

  if (CHECK) {
    const current = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;
    if (current !== html) drift.push(target);
    continue;
  }

  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, html, 'utf8');
}

if (CHECK) {
  if (drift.length) {
    console.error('Generated files are out of date:');
    for (const file of drift) console.error('  - ' + file);
    console.error('\nRun: npm run build');
    process.exit(1);
  }
  console.log(`OK — ${outputs.length} files are up to date.`);
} else {
  console.log(`Built ${outputs.length} files (${ACTIVE_LANGS.length} languages x ${PAGES.length} pages + sitemap).`);
}
