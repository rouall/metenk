/*!
 * MeTenk — VIP Redeem Code page
 * ---------------------------------------------------------------------------
 * Page logic for the redeem-code list. Localization strings live in
 * assets/locales/vip-redeem-code.js and are resolved through the shared
 * i18n runtime (assets/i18n.js).
 */
(function () {
  'use strict';

  var CODES = [
    'UHBG-QZS9-UJSZ-8SH9',
    'T5BG-WZS5-T7Y2-6KGG',
    'EQNK-ME9X-8JCM-67B6',
    'HMBF-3DTP-8P8T-8U74',
    'ZGGJ-CBUP-9E6F-JXGN',
    'RCEG-P4V3-7EGC-GCSC',
    'EC4N-FZPG-FG87-QPE7',
    'VNFC-K8V9-P2H5-8ND5',
    'B78P-NWXN-FKV3-YGNZ',
    'R3N4-WBFK-J2SS-JVA2'
  ];

  var EMAIL = 'colintenk@gmail.com';

  /** Translate a key through the shared i18n runtime, with an English fallback. */
  function tr(key) {
    if (window.MetiI18n && typeof window.MetiI18n.t === 'function') {
      return window.MetiI18n.t(key);
    }
    var dict = (window.METENK_I18N && window.METENK_I18N.en) || {};
    return dict[key] != null ? dict[key] : key;
  }

  function renderCodes() {
    var block = document.getElementById('code-block');
    if (!block) return;

    block.innerHTML = '';
    CODES.forEach(function (code) {
      var line = document.createElement('div');
      line.className = 'code-line';
      line.innerHTML = '<code></code><span class="copy-icon"></span>';
      line.querySelector('code').textContent = code;
      line.querySelector('.copy-icon').textContent = tr('copy');
      line.addEventListener('click', function () {
        copyCode(code, line);
      });
      block.appendChild(line);
    });
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
    done();
  }

  function copyCode(code, item) {
    copyText(code, function () {
      var icon = item.querySelector('.copy-icon');
      item.classList.add('copied');
      icon.textContent = tr('copied');
      setTimeout(function () {
        item.classList.remove('copied');
        icon.textContent = tr('copy');
      }, 1500);
    });
  }

  function bindEmail() {
    var emailLink = document.getElementById('email-link');
    if (!emailLink) return;

    emailLink.addEventListener('click', function (e) {
      e.preventDefault();
      copyText(EMAIL, function () {
        emailLink.textContent = tr('copied');
        emailLink.classList.add('copied');
        setTimeout(function () {
          emailLink.textContent = EMAIL;
          emailLink.classList.remove('copied');
        }, 1500);
      });
    });
  }

  function init() {
    renderCodes();
    bindEmail();

    // Re-render the dynamic code list whenever the language changes.
    if (window.MetiI18n && typeof window.MetiI18n.onChange === 'function') {
      window.MetiI18n.onChange(renderCodes);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
