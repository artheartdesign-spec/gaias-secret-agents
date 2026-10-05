/* Gaia's Secret Agents — PostHog event helpers.
 * Requires the PostHog web snippet to be installed on the site.
 * Safe to load before PostHog: calls are queued until posthog is available.
 */
(function () {
  'use strict';

  window.gsaTrack = function (eventName, properties) {
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
