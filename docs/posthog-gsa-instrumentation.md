# GSA PostHog instrumentation

This branch prepares a small client-side helper for the GSA site. It does not change production.

## Events

- `gsa_page_loaded` — page path and referrer
- Any element marked `data-gsa-track="event_name"` automatically records that event.
- Recommended conversion events:
  - `gsa_free_mission_signup`
  - `gsa_product_view`
  - `gsa_purchase_click`
  - `gsa_secret_postcard_started`
  - `gsa_secret_postcard_downloaded`
  - `gsa_secret_postcard_shared`

## Deployment

1. Install the PostHog web snippet on the site's shared page template/header.
2. Load `/assets/gsa-posthog.js` after the snippet.
3. Add `data-gsa-track` to important CTAs and conversion controls.
4. Verify events in PostHog before merging to production.

No personal data should be placed in event properties.
