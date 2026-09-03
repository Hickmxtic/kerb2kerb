(function () {
  'use strict';

  var PIXEL_ID = 'REPLACE_ME';
  var WA_NUMBER = '447926438553';
  var CONSENT_KEY = 'k2k_consent';
  var SRC_KEY = 'k2k_src';

  var params = new URLSearchParams(window.location.search);
  var src = (params.get('src') || '').trim().slice(0, 60);
  try {
    if (src) sessionStorage.setItem(SRC_KEY, src);
    else src = sessionStorage.getItem(SRC_KEY) || '';
  } catch (e) {}

  function lead(detail) {
    if (window.fbq) window.fbq('track', 'Lead', detail || {});
  }

  function whatsappUrl(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function defaultMessage() {
    var page = document.title.replace(/^Kerb2Kerb\s*[|—-]\s*/i, '').replace(/\s*[|—-]\s*Kerb2Kerb.*$/i, '').replace(/\.\s*$/, '');
    return 'Hi James, I\'d like a price for luggage or goods (' + page + ').' + (src ? '\nSource: ' + src : '');
  }

  function loadPixel() {
    if (PIXEL_ID === 'REPLACE_ME' || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function consentState() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function showConsent() {
    var box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookies');
    box.innerHTML =
      '<p>One ad cookie (Meta Pixel), only if you accept. Nothing else.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-consent="declined">No thanks</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-consent="accepted">Accept</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      setConsent(b.getAttribute('data-consent'));
      box.remove();
      document.body.classList.remove('has-consent');
      if (b.getAttribute('data-consent') === 'accepted') loadPixel();
    });
    document.body.classList.add('has-consent');
    document.body.appendChild(box);
  }

  function initNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var path = window.location.pathname.replace(/index\.html$/, '');
    nav.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  function initWhatsAppLinks() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      if (a.href.indexOf('text=') === -1) a.href = whatsappUrl(defaultMessage());
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="wa.me"]');
      if (a) lead({ content_name: 'whatsapp', page: window.location.pathname, src: src });
    });
  }

  window.K2K = { src: src, lead: lead, whatsappUrl: whatsappUrl, WA_NUMBER: WA_NUMBER };

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initWhatsAppLinks();
    var state = consentState();
    if (state === 'accepted') loadPixel();
    else if (!state) showConsent();
  });
})();
