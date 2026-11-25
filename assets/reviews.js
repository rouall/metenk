/*!
 * MeTenk landing page — real review marquee
 * ---------------------------------------------------------------------------
 * Renders window.METENK_REVIEWS (assets/reviews-data.js) as a calm,
 * seamlessly scrolling wall of real store feedback.
 *
 * Design rules
 *   - One mixed wall: Chrome / Edge / Firefox reviews are not labelled.
 *   - No modal, no links on cards — stars, quote, nickname only.
 *   - Quotes are shown in the visitor's site language (translated when needed).
 *   - Duplicated list keeps the CSS translateX(-50%) loop seamless.
 *   - Hover pauses the motion; prefers-reduced-motion gets a static row (CSS).
 *
 * Depends on: assets/reviews-data.js, assets/i18n.js (optional but expected)
 */
(function (global) {
  'use strict';

  var DATA = global.METENK_REVIEWS;
  if (!DATA || !DATA.reviews || !DATA.reviews.length) return;

  var STAR_PATH = 'M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94z';
  var VERIFIED_PATH = 'M12 2.5l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.7 2.6.7 2.6-2.3 1.4-1 2.5-2.7-.2L12 21.5l-2.2-1.6-2.7.2-1-2.5-2.3-1.4.7-2.6-.7-2.6 2.3-1.4 1-2.5 2.7.2z';
  var PERSON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="9" r="3.2"/><path d="M6.4 19.4c0-2.9 2.5-4.7 5.6-4.7s5.6 1.8 5.6 4.7"/></svg>';

  var els = {};
  var lastViewportWidth = 0;
  var resizeTimer = null;

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */

  function lang() {
    return (global.MetiI18n && global.MetiI18n.lang) || 'en';
  }

  function t(key, fallback) {
    var value = global.MetiI18n && global.MetiI18n.t(key, fallback);
    return value != null ? value : fallback;
  }

  function fill(template, values) {
    return String(template).replace(/\{(\w+)\}/g, function (match, name) {
      return values[name] != null ? values[name] : match;
    });
  }

  /**
   * Quote in the visitor's language. Falls back to English (the shared
   * translation) before the original wording, so a locale that is still
   * missing a translation never surfaces a third language on the page.
   */
  function quoteFor(review) {
    var active = lang();
    if (review.lang === active) return review.body;
    var translations = review.translation || {};
    return translations[active] || translations.en || review.body;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function applyDefaultAvatar(node) {
    node.classList.remove('review-avatar--photo');
    node.innerHTML = PERSON_ICON;
  }

  /** Real photo when available, otherwise a quiet generic silhouette. */
  function createAvatar(review) {
    var node = el('span', 'review-avatar');
    node.setAttribute('aria-hidden', 'true');

    if (!review.avatar) {
      applyDefaultAvatar(node);
      return node;
    }

    node.classList.add('review-avatar--photo');
    var img = document.createElement('img');
    img.src = review.avatar;
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('error', function () {
      applyDefaultAvatar(node);
    });
    node.appendChild(img);
    return node;
  }

  function starsMarkup(rating) {
    var filled = Math.max(0, Math.min(5, Math.round(rating || 0)));
    var html = '';
    for (var i = 0; i < 5; i++) {
      html += '<svg viewBox="0 0 24 24" aria-hidden="true"' +
        (i < filled ? '' : ' class="is-empty"') +
        ' fill="currentColor"><path d="' + STAR_PATH + '"/></svg>';
    }
    return html;
  }

  /* ------------------------------------------------------------------ *
   * Rating summary
   * ------------------------------------------------------------------ */

  function renderSummary() {
    var host = els.summary;
    if (!host || !DATA.summary) return;

    var rating = Number(DATA.summary.rating || 0).toFixed(1);
    var label = fill(t('reviewsSummary', '{rating} average'), {
      rating: rating
    });

    host.innerHTML = '';
    host.hidden = false;

    var star = el('span', 'reviews-summary-star', '★');
    star.setAttribute('aria-hidden', 'true');
    host.appendChild(star);

    var text = el('span', '');
    var at = label.indexOf(rating);
    if (at > -1) {
      text.appendChild(document.createTextNode(label.slice(0, at)));
      text.appendChild(el('strong', '', rating));
      text.appendChild(document.createTextNode(label.slice(at + rating.length)));
    } else {
      text.textContent = label;
    }
    host.appendChild(text);
  }

  /* ------------------------------------------------------------------ *
   * Cards + marquee
   * ------------------------------------------------------------------ */

  function createCard(review) {
    var card = document.createElement('article');
    card.className = 'review-card';

    var quote = quoteFor(review);

    var top = el('div', 'review-card-top');

    var stars = el('div', 'review-stars');
    stars.innerHTML = starsMarkup(review.rating);
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', review.rating + ' / 5');
    top.appendChild(stars);

    var mark = el('span', 'review-quote-mark', '“');
    mark.setAttribute('aria-hidden', 'true');
    top.appendChild(mark);

    card.appendChild(top);

    var bodyWrap = el('div', 'review-body-wrap');
    var body = el('p', 'review-body', quote);
    bodyWrap.appendChild(body);
    card.appendChild(bodyWrap);

    var more = el('button', 'review-more');
    more.type = 'button';
    more.hidden = true;
    more.setAttribute('aria-expanded', 'false');
    more.innerHTML = '<span class="review-more-label"></span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    more.querySelector('.review-more-label').textContent = t('reviewsMore', 'Read full review');

    more.addEventListener('click', function () {
      var expanded = card.classList.toggle('is-expanded');
      more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      more.querySelector('.review-more-label').textContent = expanded
        ? t('reviewsLess', 'Show less')
        : t('reviewsMore', 'Read full review');

      if (els.marquee) {
        var open = els.track && els.track.querySelector('.review-card.is-expanded');
        els.marquee.classList.toggle('is-paused', !!open);
      }
    });

    card.appendChild(more);

    var foot = el('div', 'review-card-foot');
    foot.appendChild(createAvatar(review));

    foot.appendChild(el('span', 'review-author', review.author));

    var verified = el('span', 'review-verified');
    verified.setAttribute('title', t('reviewsVerified', 'Verified store review'));
    verified.setAttribute('aria-label', t('reviewsVerified', 'Verified store review'));
    verified.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="' + VERIFIED_PATH + '"/><path d="M8.6 12.3l2.2 2.2 4.6-4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    foot.appendChild(verified);

    card.appendChild(foot);
    return card;
  }

  function buildHalf(repeats, isClone) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < repeats; i++) {
      DATA.reviews.forEach(function (review) {
        var card = createCard(review);
        if (isClone) {
          card.dataset.clone = 'true';
          card.setAttribute('aria-hidden', 'true');
          Array.prototype.forEach.call(card.querySelectorAll('button'), function (button) {
            button.tabIndex = -1;
          });
        }
        fragment.appendChild(card);
      });
    }
    return fragment;
  }

  /** Show the fold control only when the full quote cannot fit. */
  function markOverflow(track) {
    Array.prototype.forEach.call(track.querySelectorAll('.review-card'), function (card) {
      if (card.classList.contains('is-expanded')) return;

      var body = card.querySelector('.review-body');
      var more = card.querySelector('.review-more');
      if (!body || !more) return;

      var overflowing = body.scrollHeight - body.clientHeight > 2;
      body.classList.toggle('has-more', overflowing);
      more.hidden = !overflowing;
    });
  }

  function renderMarquee() {
    var track = els.track;
    if (!track) return;

    track.innerHTML = '';
    if (els.marquee) els.marquee.classList.remove('is-paused');

    // Measure one pass of the review list to decide how many copies are
    // needed to fully cover (and slightly overflow) the viewport.
    track.appendChild(buildHalf(1, false));
    var setWidth = track.scrollWidth;

    var viewport = els.marquee.clientWidth || global.innerWidth || 1200;
    var repeats = setWidth > 0 ? Math.max(1, Math.ceil(viewport / setWidth)) : 1;

    track.innerHTML = '';
    track.appendChild(buildHalf(repeats, false));
    var halfWidth = track.scrollWidth;
    track.appendChild(buildHalf(repeats, true));
    markOverflow(track);

    // Web fonts can change line breaks after first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (lastViewportWidth === viewport) markOverflow(track);
      });
    }

    // Constant perceived speed (~54px/s), clamped for very long walls.
    var duration = halfWidth > 0 ? Math.round(halfWidth / 54) : 60;
    track.style.animationDuration = Math.max(50, Math.min(170, duration)) + 's';

    lastViewportWidth = viewport;
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */

  function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var width = els.marquee ? els.marquee.clientWidth : 0;
      if (!width || Math.abs(width - lastViewportWidth) < 80) return;
      renderMarquee();
    }, 220);
  }

  function handleLanguageChange() {
    renderSummary();
    renderMarquee();
  }

  function init() {
    els.summary = document.getElementById('reviewsSummary');
    els.marquee = document.getElementById('reviewsMarquee');
    els.track = document.getElementById('reviewsTrack');
    if (!els.track) return;

    renderSummary();
    renderMarquee();

    global.addEventListener('resize', handleResize);

    if (global.MetiI18n && typeof global.MetiI18n.onChange === 'function') {
      global.MetiI18n.onChange(handleLanguageChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
