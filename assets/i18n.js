/*!
 * MeTenk i18n Runtime
 * ---------------------------------------------------------------------------
 * Zero-build, runtime-based localization for the MeTenk static site.
 *
 * HOW TO ADD A NEW LANGUAGE
 *   1. Append one entry to the LANGS registry below.
 *   2. Add the matching `xx: { ... }` block to every file in assets/locales/.
 *   The switcher UI, browser-language detection, persistence and RTL support
 *   are all generic — no other file needs to change.
 *
 * HOW TO USE IN A PAGE
 *   <link rel="stylesheet" href="assets/i18n.css">
 *   <script defer src="assets/locales/<page>.js"></script>
 *   <script defer src="assets/i18n.js"></script>
 *
 * MARKUP API
 *   data-i18n="key"             -> textContent
 *   data-i18n-html="key"        -> innerHTML (for rich content: <strong>, <code> ...)
 *   data-i18n-attr="a:k,b:k2"   -> attributes (content / alt / title / placeholder / aria-label)
 *   dict key "docTitle"         -> document.title
 *
 * PUBLIC API (window.MetiI18n)
 *   get lang(), setLang(code), t(key, fallback), detect(), onChange(fn), LANGS
 */

(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Language registry — the single source of truth for supported locales.
   * ------------------------------------------------------------------ */
  var LANGS = [
    { code: 'en', label: 'English', htmlLang: 'en',    dir: 'ltr' },
    { code: 'zh', label: '中文',    htmlLang: 'zh-CN', dir: 'ltr' }
  ];

  var STORAGE_KEY = 'metenk:lang';
  var DEFAULT_LANG = 'en';
  var DICT_GLOBAL = 'METENK_I18N';

  var current = DEFAULT_LANG;
  var listeners = [];
  var switcher = null;

  /* ------------------------------------------------------------------ *
   * Internal helpers
   * ------------------------------------------------------------------ */

  function findLang(code) {
    if (!code) return null;
    var c = String(code).toLowerCase();
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code.toLowerCase() === c ||
          LANGS[i].htmlLang.toLowerCase() === c) {
        return LANGS[i];
      }
    }
    return null;
  }

  function readStored() {
    try {
      return global.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // Private mode / storage disabled
    }
  }

  function writeStored(code) {
    try {
      global.localStorage.setItem(STORAGE_KEY, code);
    } catch (e) { /* ignore — in-memory only for this page */ }
  }

  /** Full dictionary map for the active page: { en: {...}, zh: {...} } */
  function dicts() {
    var d = global[DICT_GLOBAL];
    return (d && typeof d === 'object') ? d : {};
  }

  function dictFor(code) {
    var d = dicts()[code];
    return (d && typeof d === 'object') ? d : null;
  }

  /**
   * Resolve a key with graceful fallback:
   *   active language -> default language -> fallback argument -> key name
   */
  function lookup(key, fallback) {
    var active = dictFor(current);
    if (active && active[key] != null) return active[key];

    var base = dictFor(DEFAULT_LANG);
    if (base && base[key] != null) return base[key];

    return fallback != null ? fallback : key;
  }

  /** Public translation accessor for page scripts. */
  function t(key, fallback) {
    return lookup(key, fallback);
  }

  /**
   * Resolve the browser's preferred language.
   * Order: explicit user choice -> browser locales -> default.
   */
  function detect() {
    var saved = findLang(readStored());
    if (saved) return saved.code;

    var nav = navigator.languages && navigator.languages.length
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);

    for (var i = 0; i < nav.length; i++) {
      var raw = String(nav[i] || '').toLowerCase();
      if (!raw) continue;

      var exact = findLang(raw);
      if (exact) return exact.code;

      // "zh-Hans-CN" -> "zh"
      var base = raw.split('-')[0];
      for (var j = 0; j < LANGS.length; j++) {
        if (LANGS[j].code.toLowerCase() === base) return LANGS[j].code;
      }
    }

    return DEFAULT_LANG;
  }

  /* ------------------------------------------------------------------ *
   * DOM application
   * ------------------------------------------------------------------ */

  function applyAttributes(el, spec, active, base) {
    var pairs = String(spec).split(',');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].trim();
      if (!pair) continue;

      var idx = pair.indexOf(':');
      if (idx === -1) continue;

      var attr = pair.slice(0, idx).trim();
      var key = pair.slice(idx + 1).trim();
      if (!attr || !key) continue;

      var value = null;
      if (active && active[key] != null) value = active[key];
      else if (base && base[key] != null) value = base[key];
      if (value == null) continue;

      el.setAttribute(attr, value);
    }
  }

  function applyToDocument(code) {
    var langDef = findLang(code) || findLang(DEFAULT_LANG);
    if (!langDef) return;

    var active = dictFor(code);
    var base = dictFor(DEFAULT_LANG);
    var html = document.documentElement;

    html.setAttribute('lang', langDef.htmlLang);
    html.setAttribute('dir', langDef.dir);
    html.setAttribute('data-i18n-lang', langDef.code);

    var nodes, i, el, key, value;

    // textContent
    nodes = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute('data-i18n');
      value = resolve(key, active, base);
      if (value != null) el.textContent = value;
    }

    // innerHTML (rich content)
    nodes = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute('data-i18n-html');
      value = resolve(key, active, base);
      if (value != null) el.innerHTML = value;
    }

    // attributes
    nodes = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      applyAttributes(el, el.getAttribute('data-i18n-attr'), active, base);
    }

    // document title
    if (active && active.docTitle != null) {
      document.title = active.docTitle;
    }

    // remove the pre-boot marker once content is in the target language
    html.removeAttribute('data-i18n-pending');
  }

  function resolve(key, active, base) {
    if (!key) return null;
    if (active && active[key] != null) return active[key];
    if (base && base[key] != null) return base[key];
    return null;
  }

  /* ------------------------------------------------------------------ *
   * Language switcher (inline, at the bottom of the page footer)
   * ------------------------------------------------------------------ */

  /**
   * Build the inline language control and mount it into the page.
   *
   * The control is a flat row of text links (English · 中文) — deliberately
   * quiet so it reads as a footer utility rather than a floating widget.
   *
   * Mounting rules:
   *   1. Prefer an explicit `[data-i18n-slot]` element supplied by the page.
   *   2. Fall back to the page's own <footer> element.
   *   3. Last resort: create a minimal footer so the control is never lost.
   */
  function buildSwitcher() {
    if (switcher) return switcher;

    var host = document.createElement('div');
    host.className = 'i18n-switcher';
    host.setAttribute('data-i18n-switcher', '');
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', 'Language');

    LANGS.forEach(function (lang) {
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'i18n-option';
      opt.setAttribute('data-lang', lang.code);
      opt.setAttribute('lang', lang.htmlLang);
      opt.textContent = lang.label;
      opt.addEventListener('click', function () {
        setLang(opt.getAttribute('data-lang'));
      });
      host.appendChild(opt);
    });

    var slot = document.querySelector('[data-i18n-slot]');
    if (!slot) {
      // No explicit slot: use the page footer if there is one.
      var footer = document.querySelector('footer');
      if (footer) {
        slot = document.createElement('div');
        slot.className = 'i18n-lang-row';
        footer.appendChild(slot);
      } else {
        // Last resort — give the page a footer so the control stays reachable.
        slot = document.createElement('footer');
        slot.className = 'i18n-footer';
        document.body.appendChild(slot);
      }
    }

    slot.appendChild(host);
    switcher = { host: host, slot: slot };
    return switcher;
  }

  function renderSwitcher(code) {
    if (!switcher) return;
    var opts = switcher.host.querySelectorAll('.i18n-option');
    for (var i = 0; i < opts.length; i++) {
      var active = opts[i].getAttribute('data-lang') === code;
      opts[i].setAttribute('aria-current', active ? 'true' : 'false');
      opts[i].classList.toggle('is-active', active);
    }
  }

  /* ------------------------------------------------------------------ *
   * Public API
   * ------------------------------------------------------------------ */

  /**
   * Switch the active language.
   * @param {string} code  language code, e.g. "en" / "zh"
   * @param {boolean} persist  save the choice for future visits (default true)
   */
  function setLang(code, persist) {
    var def = findLang(code);
    if (!def) return false;

    current = def.code;
    if (persist !== false) writeStored(current);

    applyToDocument(current);
    renderSwitcher(current);

    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](current);
      } catch (e) { /* listener errors must not break the switch */ }
    }
    return true;
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i !== -1) listeners.splice(i, 1);
    };
  }

  function getLang() {
    return current;
  }

  /* ------------------------------------------------------------------ *
   * Theme detection
   * ------------------------------------------------------------------ */

  /**
   * Determine whether the page renders on a light or dark background, so the
   * switcher can match it. Explicit page themes (data-theme) always win;
   * otherwise we sample the computed background colour of the page.
   */
  function detectPageTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'night' || explicit === 'dark') {
      return explicit === 'night' ? 'night' : explicit;
    }

    var bg = '';
    try {
      var bodyStyle = getComputedStyle(document.body);
      bg = bodyStyle.backgroundColor;
      // A transparent body background means the real backdrop sits on <html>.
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        bg = getComputedStyle(document.documentElement).backgroundColor;
      }
    } catch (e) { /* ignore */ }

    var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(bg || '');
    if (!m) return 'dark';

    var luminance = (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
    return luminance > 0.6 ? 'light' : 'dark';
  }

  function applyPageTheme() {
    var theme = detectPageTheme();
    document.documentElement.setAttribute('data-i18n-theme', theme);
    return theme;
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  function boot() {
    buildSwitcher();

    var initial = detect();
    current = findLang(initial) ? initial : DEFAULT_LANG;
    applyToDocument(current);
    renderSwitcher(current);

    // Keep the switcher in sync with pages that expose their own theme
    // attribute (Clock Max switches between light / night / dark).
    if (typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function () {
        var theme = document.documentElement.getAttribute('data-theme');
        if (theme) {
          document.documentElement.setAttribute('data-i18n-theme', theme);
        } else {
          applyPageTheme();
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      var initialTheme = document.documentElement.getAttribute('data-theme');
      if (initialTheme) {
        document.documentElement.setAttribute('data-i18n-theme', initialTheme);
      } else {
        applyPageTheme();
      }
    } else {
      applyPageTheme();
    }
  }

  // Expose the API
  global.MetiI18n = {
    get lang() { return current; },
    setLang: setLang,
    t: t,
    detect: detect,
    onChange: onChange,
    LANGS: LANGS,
    DEFAULT_LANG: DEFAULT_LANG
  };

  // Backward-compatible global used by the legacy VIP redeem page.
  global.setLang = function (code) { return setLang(code); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
