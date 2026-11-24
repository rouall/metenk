/*!
 * Zero-dependency HTML tokenizer + static i18n baker.
 * ---------------------------------------------------------------------------
 * Used only at build time (scripts/build-i18n.mjs). It rewrites a source page
 * so that the translated copy is present in the served HTML — crawlers never
 * have to run JavaScript to see it.
 *
 * Why a tokenizer instead of regex:
 *   - attribute values may contain ">" (e.g. "Focus → Task")
 *   - tags span multiple lines (the store buttons)
 *   - String.replace treats "$&" / "$1" in the replacement as special, which
 *     breaks translations containing currency like "R$"
 *
 * Supported markup API (mirrors assets/i18n.js):
 *   data-i18n="key"            -> element textContent
 *   data-i18n-html="key"       -> element innerHTML
 *   data-i18n-attr="a:k,b:k2"  -> attributes
 */

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/* ------------------------------------------------------------------ *
 * Tokenizer
 * ------------------------------------------------------------------ */

export function tokenize(html) {
  const tokens = [];
  let i = 0;
  let textStart = 0;

  const flushText = (end) => {
    if (end > textStart) tokens.push({ t: 'text', v: html.slice(textStart, end) });
  };

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;

    // Comment
    if (html.startsWith('<!--', lt)) {
      flushText(lt);
      const close = html.indexOf('-->', lt + 4);
      const end = close === -1 ? html.length : close + 3;
      tokens.push({ t: 'raw', v: html.slice(lt, end) });
      i = textStart = end;
      continue;
    }

    // Doctype / CDATA / processing instruction
    if (html[lt + 1] === '!' || html[lt + 1] === '?') {
      flushText(lt);
      const close = html.indexOf('>', lt);
      const end = close === -1 ? html.length : close + 1;
      tokens.push({ t: 'raw', v: html.slice(lt, end) });
      i = textStart = end;
      continue;
    }

    // End tag
    if (html[lt + 1] === '/') {
      flushText(lt);
      const close = html.indexOf('>', lt);
      const end = close === -1 ? html.length : close + 1;
      const raw = html.slice(lt, end);
      const name = raw.replace(/^<\//, '').replace(/>$/, '').trim().toLowerCase().split(/\s/)[0];
      tokens.push({ t: 'end', name, raw });
      i = textStart = end;
      continue;
    }

    // Start tag
    const tagEnd = findTagEnd(html, lt);
    if (tagEnd === -1) break;

    flushText(lt);
    const raw = html.slice(lt, tagEnd);
    const tag = parseStartTag(raw);
    tokens.push(tag);
    i = textStart = tagEnd;

    // Raw-text elements: keep their body verbatim so "<" inside JS/CSS is safe.
    if ((tag.name === 'script' || tag.name === 'style') && !tag.selfClose) {
      const closeRe = new RegExp('</' + tag.name + '\\s*>', 'i');
      const match = closeRe.exec(html.slice(i));
      if (match) {
        const contentEnd = i + match.index;
        if (contentEnd > i) tokens.push({ t: 'raw', v: html.slice(i, contentEnd) });
        tokens.push({ t: 'raw', v: match[0] });
        i = textStart = contentEnd + match[0].length;
      }
    }
  }

  flushText(html.length);
  return tokens;
}

function findTagEnd(html, start) {
  let quote = null;
  for (let i = start + 1; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '>') return i + 1;
  }
  return -1;
}

function parseStartTag(raw) {
  const len = raw.length;
  let i = 1;
  while (i < len && /\s/.test(raw[i])) i++;

  const nameStart = i;
  while (i < len && !/[\s/>]/.test(raw[i])) i++;
  const name = raw.slice(nameStart, i).toLowerCase();

  const attrs = [];
  let selfClose = false;

  while (i < len) {
    while (i < len && /\s/.test(raw[i])) i++;
    if (i >= len) break;
    if (raw[i] === '/') { selfClose = true; i++; continue; }
    if (raw[i] === '>') { i++; continue; }

    const attrStart = i;
    while (i < len && !/[\s=/>]/.test(raw[i])) i++;
    const attrName = raw.slice(attrStart, i);
    if (!attrName) { i++; continue; }

    let value = null;
    let j = i;
    while (j < len && /\s/.test(raw[j])) j++;

    if (raw[j] === '=') {
      j++;
      while (j < len && /\s/.test(raw[j])) j++;
      if (raw[j] === '"' || raw[j] === "'") {
        const quote = raw[j];
        const valueStart = j + 1;
        let valueEnd = raw.indexOf(quote, valueStart);
        if (valueEnd === -1) valueEnd = len;
        value = raw.slice(valueStart, valueEnd);
        i = valueEnd + 1;
      } else {
        const valueStart = j;
        while (j < len && !/[\s>]/.test(raw[j])) j++;
        value = raw.slice(valueStart, j);
        i = j;
      }
    }

    attrs.push({ name: attrName, value });
    if (i <= attrStart) i = attrStart + 1;
  }

  const attrsMap = {};
  for (const attr of attrs) attrsMap[attr.name.toLowerCase()] = attr.value;

  return { t: 'start', name, attrs, attrsMap, selfClose, raw };
}

/* ------------------------------------------------------------------ *
 * Escaping (dictionary values are plain text, not HTML)
 * ------------------------------------------------------------------ */

export function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeAttr(value, quote) {
  let out = String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  if (quote === "'") out = out.replace(/'/g, '&#39;');
  else out = out.replace(/"/g, '&quot;');
  return out;
}

/* ------------------------------------------------------------------ *
 * In-place attribute replacement (preserves the original formatting)
 * ------------------------------------------------------------------ */

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function setAttrRaw(raw, attrName, value) {
  if (value == null) return raw;

  const re = new RegExp(
    '(\\s' + escapeRegExp(attrName) + '\\s*=\\s*)("[^"]*"|\'[^\']*\'|[^\\s>]+)',
    'i'
  );
  const match = re.exec(raw);

  if (match) {
    const existing = match[2];
    const quote = (existing[0] === '"' || existing[0] === "'") ? existing[0] : '"';
    return raw.slice(0, match.index) + match[1] + quote + escapeAttr(value, quote) +
      quote + raw.slice(match.index + match[0].length);
  }

  // Attribute not present: insert it before the closing ">" (or "/>").
  const close = raw.lastIndexOf('>');
  if (close === -1) return raw;
  const at = /\/\s*>$/.test(raw) ? raw.lastIndexOf('/', close) : close;
  return raw.slice(0, at) + ' ' + attrName + '="' + escapeAttr(value, '"') + '"' + raw.slice(at);
}

/* ------------------------------------------------------------------ *
 * Baking
 * ------------------------------------------------------------------ *
 * options:
 *   dict         active language dictionary
 *   htmlLang     value for <html lang>
 *   defaultLang  optional <html data-default-lang> (static pages only)
 *   pageKey      optional <html data-i18n-page>
 *   rewriteUrl   optional (url, attrName) => url  -- used for subdirectory pages
 */
export function bake(html, options) {
  const dict = options.dict || {};
  const tokens = tokenize(html);

  // Pass 1: attributes only (never touches formatting of untouched tags).
  for (const tk of tokens) {
    if (tk.t !== 'start') continue;

    let raw = tk.raw;
    const attrs = tk.attrsMap;

    if (tk.name === 'html') {
      if (options.htmlLang) raw = setAttrRaw(raw, 'lang', options.htmlLang);
      raw = setAttrRaw(raw, 'dir', 'ltr');
      if (options.defaultLang) raw = setAttrRaw(raw, 'data-default-lang', options.defaultLang);
      if (options.pageKey) raw = setAttrRaw(raw, 'data-i18n-page', options.pageKey);
    }

    if (tk.name === 'meta') {
      const nameAttr = (attrs.name || '').toLowerCase();
      const propAttr = (attrs.property || '').toLowerCase();

      if (nameAttr === 'description' && dict.metaDescription != null) {
        raw = setAttrRaw(raw, 'content', dict.metaDescription);
      }
      if (propAttr === 'og:title' && dict.docTitle != null) {
        raw = setAttrRaw(raw, 'content', dict.docTitle);
      }
      if (nameAttr === 'twitter:title' && dict.docTitle != null) {
        raw = setAttrRaw(raw, 'content', dict.docTitle);
      }
      if ((propAttr === 'og:description' || nameAttr === 'twitter:description') &&
          dict.metaDescription != null) {
        raw = setAttrRaw(raw, 'content', dict.metaDescription);
      }
    }

    const spec = attrs['data-i18n-attr'];
    if (spec) {
      for (const pair of String(spec).split(',')) {
        const idx = pair.indexOf(':');
        if (idx === -1) continue;
        const attrName = pair.slice(0, idx).trim();
        const key = pair.slice(idx + 1).trim();
        if (!attrName || !key) continue;
        const value = dict[key];
        if (value != null) raw = setAttrRaw(raw, attrName, value);
      }
    }

    if (options.rewriteUrl) {
      for (const attrName of ['href', 'src']) {
        const value = attrs[attrName];
        if (value == null) continue;
        const next = options.rewriteUrl(value, attrName);
        if (next != null && next !== value) raw = setAttrRaw(raw, attrName, next);
      }
    }

    tk.raw = raw;
  }

  // Pass 2: element content.
  const out = [];
  let i = 0;

  while (i < tokens.length) {
    const tk = tokens[i];

    if (tk.t === 'start') {
      let mode = null;
      let key = null;

      if (tk.name === 'title' && dict.docTitle != null) {
        mode = 'text';
        key = 'docTitle';
      } else if (tk.attrsMap['data-i18n-html']) {
        mode = 'html';
        key = tk.attrsMap['data-i18n-html'];
      } else if (tk.attrsMap['data-i18n']) {
        mode = 'text';
        key = tk.attrsMap['data-i18n'];
      }

      if (mode) {
        const end = findMatchingEnd(tokens, i);
        const value = dict[key];

        if (end === -1) {
          // Element is void / self-closing: nothing to replace.
          out.push(tk.raw);
          i++;
          continue;
        }

        out.push(tk.raw);
        if (value != null) {
          out.push(mode === 'html' ? String(value) : escapeText(value));
        } else {
          for (let k = i + 1; k < end; k++) out.push(tokenRaw(tokens[k]));
        }
        out.push(tokens[end].raw);
        i = end + 1;
        continue;
      }
    }

    out.push(tokenRaw(tk));
    i++;
  }

  return out.join('');
}

/** Text and raw blocks store their slice in `v`; tags store it in `raw`. */
function tokenRaw(tk) {
  return (tk.t === 'text' || tk.t === 'raw') ? tk.v : tk.raw;
}

function findMatchingEnd(tokens, startIdx) {
  const tag = tokens[startIdx];
  if (tag.selfClose || VOID_ELEMENTS.has(tag.name)) return -1;

  let depth = 1;
  for (let i = startIdx + 1; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk.t === 'start' && tk.name === tag.name && !tk.selfClose && !VOID_ELEMENTS.has(tk.name)) {
      depth++;
    } else if (tk.t === 'end' && tk.name === tag.name) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
