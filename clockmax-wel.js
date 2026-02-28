(function() {
  'use strict';

  var browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    var actualTheme = theme;
    if (theme === 'system') {
      actualTheme = getSystemTheme();
    }
    document.documentElement.setAttribute('data-theme', actualTheme);
  }

  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    
    var hourDeg = (hours % 12) * 30 + minutes * 0.5;
    var minuteDeg = minutes * 6;
    var secondDeg = seconds * 6;
    
    var hourHand = document.getElementById('preview-hour');
    var minuteHand = document.getElementById('preview-minute');
    var secondHand = document.getElementById('preview-second');
    
    if (hourHand) hourHand.style.transform = 'rotate(' + hourDeg + 'deg)';
    if (minuteHand) minuteHand.style.transform = 'rotate(' + minuteDeg + 'deg)';
    if (secondHand) secondHand.style.transform = 'rotate(' + secondDeg + 'deg)';
    
    var digitalTime = document.getElementById('digital-time');
    if (digitalTime) {
      var h = hours < 10 ? '0' + hours : hours;
      var m = minutes < 10 ? '0' + minutes : minutes;
      var s = seconds < 10 ? '0' + seconds : seconds;
      digitalTime.textContent = h + ':' + m + ':' + s;
    }
  }

  function init() {
    if (browserAPI && browserAPI.storage) {
      browserAPI.storage.local.get(['theme'], function(result) {
        var theme = result.theme || 'dark';
        applyTheme(theme);
      });

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
          if (browserAPI && browserAPI.storage) {
            browserAPI.storage.local.get(['theme'], function(r) {
              if (r.theme === 'system') {
                applyTheme('system');
              }
            });
          }
        });
      }
    }

    updateClock();
    setInterval(updateClock, 1000);

    var startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        var chromeWebStoreUrl = 'https://chromewebstore.google.com/detail/amicbegakinicbbbjaocchcnphchogmk?utm_source=item-share-cb';
        window.open(chromeWebStoreUrl, '_blank');
        
        if (browserAPI && browserAPI.storage) {
          browserAPI.storage.local.set({ welcomeShown: true }, function() {
            if (browserAPI.tabs) {
              browserAPI.tabs.getCurrent(function(tab) {
                if (tab) {
                  browserAPI.tabs.remove(tab.id);
                }
              });
            }
          });
        }
      });
    }

    initCarousel();
  }

  function initCarousel() {
    var slides = document.querySelectorAll('.carousel-slide');
    var indicators = document.querySelectorAll('.indicator');
    var prevBtn = document.querySelector('.carousel-prev');
    var nextBtn = document.querySelector('.carousel-next');
    
    if (!slides.length) return;
    
    var currentSlide = 0;
    var slideCount = slides.length;
    var autoPlayInterval;
    
    function goToSlide(index) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      
      slides.forEach(function(slide, i) {
        slide.classList.remove('active', 'prev');
        if (i === currentSlide && i !== index) {
          slide.classList.add('prev');
        }
      });
      
      indicators.forEach(function(indicator, i) {
        indicator.classList.toggle('active', i === index);
      });
      
      slides[index].classList.add('active');
      currentSlide = index;
    }
    
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        nextSlide();
      });
    }

    indicators.forEach(function(indicator, index) {
      indicator.addEventListener('click', function() {
        goToSlide(index);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
