/* Gaia's Secret Agents — PostHog bridge.
 * Requires the PostHog web snippet to be installed on the site.
 * Preserves the existing GSA event tracker when present.
 */
(function () {
  'use strict';

  var existingTrack = typeof window.gsaTrack === 'function' ? window.gsaTrack : null;

  function sendToPostHog(eventName, properties) {
    var send = function () {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(eventName, properties || {});
        return true;
      }
      return false;
    };

    if (send()) return;
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      if (send() || attempts >= 20) clearInterval(timer);
    }, 250);
  }

  window.gsaTrack = function (eventName, properties) {
    if (existingTrack) {
      try { existingTrack(eventName, properties); } catch (e) {}
    }
    sendToPostHog(eventName, properties);
  };

  document.addEventListener('click', function (event) {
    var el = event.target.closest && event.target.closest('a,button');
    if (!el) return;

    var label = (el.getAttribute('data-gsa-track') || '').trim();
    if (!label) return;

    window.gsaTrack(label, {
      text: (el.textContent || '').trim().slice(0, 100),
      href: el.getAttribute('href') || undefined,
      page: window.location.pathname
    });
  });

  window.addEventListener('DOMContentLoaded', function () {
    window.gsaTrack('gsa_page_loaded', {
      page: window.location.pathname,
      referrer: document.referrer || undefined
    });
  });
}());