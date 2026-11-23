/*!
 * Clock Max — product page behaviour
 * ---------------------------------------------------------------------------
 * 1. Accessible screenshot carousel (buttons, dots, keyboard, swipe, autoplay)
 * 2. Keeps the original welcome-page flow when opened inside the extension
 */

(function () {
  'use strict';

  var browserAPI = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);

  /* ---------------- Carousel ---------------- */

  function initCarousel() {
    var root = document.getElementById('carousel');
    if (!root) return;

    var slides = root.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.dot-btn');
    var prevBtn = root.querySelector('.carousel-prev');
    var nextBtn = root.querySelector('.carousel-next');
    var toggleBtn = document.getElementById('carouselToggle');
    var counter = document.getElementById('slideCounter');
    var total = slides.length;
    if (!total) return;

    var current = 0;
    var autoTimer = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var userPaused = !!reduceMotion;

    function toggleLabel(key, fallback) {
      if (window.MetiI18n && typeof window.MetiI18n.t === 'function') {
        return window.MetiI18n.t(key) || fallback;
      }
      return fallback;
    }

    function syncToggle() {
      if (!toggleBtn) return;
      toggleBtn.setAttribute('data-playing', userPaused ? 'false' : 'true');
      toggleBtn.setAttribute('data-i18n-attr', 'aria-label:' + (userPaused ? 'carouselPlay' : 'carouselPause'));
      toggleBtn.setAttribute('aria-label', userPaused
        ? toggleLabel('carouselPlay', 'Play slideshow')
        : toggleLabel('carouselPause', 'Pause slideshow'));
    }

    function render(index) {
      current = (index + total) % total;

      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });

      if (counter) {
        counter.textContent = (current + 1) + ' / ' + total;
      }
    }

    function next() { render(current + 1); }
    function prev() { render(current - 1); }

    function stopAutoPlay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAutoPlay() {
      if (reduceMotion || userPaused) return;
      stopAutoPlay();
      autoTimer = setInterval(next, 6000);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        if (userPaused) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
        syncToggle();
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoPlay(); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(index)) {
          render(index);
          startAutoPlay();
        }
      });
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
        startAutoPlay();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
        startAutoPlay();
      }
    });

    var pointerStartX = null;
    root.addEventListener('pointerdown', function (event) {
      pointerStartX = event.clientX;
    });
    root.addEventListener('pointerup', function (event) {
      if (pointerStartX === null) return;
      var delta = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) next(); else prev();
      startAutoPlay();
    });

    root.addEventListener('mouseenter', stopAutoPlay);
    root.addEventListener('mouseleave', startAutoPlay);
    root.addEventListener('focusin', stopAutoPlay);
    root.addEventListener('focusout', startAutoPlay);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoPlay(); else startAutoPlay();
    });

    render(0);
    syncToggle();
    startAutoPlay();
  }

  /* ---------------- Extension welcome flow ---------------- */

  function initStoreButton() {
    var startBtn = document.getElementById('startBtn');
    if (!startBtn || !browserAPI || !browserAPI.storage) return;

    startBtn.addEventListener('click', function () {
      browserAPI.storage.local.set({ welcomeShown: true }, function () {
        if (browserAPI.tabs && browserAPI.tabs.getCurrent) {
          browserAPI.tabs.getCurrent(function (tab) {
            if (tab) browserAPI.tabs.remove(tab.id);
          });
        }
      });
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    initCarousel();
    initStoreButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
