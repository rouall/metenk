/*!
 * MeTenk — About page interactions
 * ---------------------------------------------------------------------------
 * Clicking the contact card copies the email address and gives inline feedback.
 */

(function () {
  'use strict';

  var EMAIL = 'colintenk@gmail.com';
  var button = document.getElementById('copy-email');
  var feedback = document.getElementById('copy-feedback');
  if (!button || !feedback) return;

  var resetTimer = null;

  function t(key, fallback) {
    try {
      return (window.MetiI18n && window.MetiI18n.t(key)) || fallback;
    } catch (err) {
      return fallback;
    }
  }

  function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();

      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (err) {
        copied = false;
      }
      document.body.removeChild(area);

      copied ? resolve() : reject(new Error('copy-failed'));
    });
  }

  function showFeedback(message, isError) {
    feedback.textContent = message;
    button.classList.toggle('is-copied', !isError);

    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      feedback.textContent = '';
      button.classList.remove('is-copied');
    }, 2000);
  }

  button.addEventListener('click', function () {
    copyWithFallback(EMAIL)
      .then(function () {
        showFeedback(t('copiedText', 'Copied'), false);
      })
      .catch(function () {
        showFeedback(t('copyFailed', 'Copy failed'), true);
      });
  });
})();
