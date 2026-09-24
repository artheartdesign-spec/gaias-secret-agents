# GSA Conversion Measurement — v1

This file documents the first-party event hooks currently implemented in the website.

## Funnel

Homepage visit → Free Mission page → confirmed Brevo signup → free mission delivered → mission completed → Starter Kit page → checkout click → purchase → post-purchase preparation.

## Implemented events

### `gsa_page_view`

Emitted automatically by `/assets/gsa-events.js` on pages that load the script.

Currently included on the key funnel pages:

- homepage
- free mission signup
- free mission delivery
- Starter Kit sales page
- report-back page
- mission completion check
- Starter Kit post-purchase page
- Agent Record prototype

Fields include:

- page
- title
- referrer
- timestamp

### `gsa_free_mission_signup_confirmed`

Emitted only after Brevo activates its confirmed-success message on the free mission signup page.

This is deliberately not emitted merely because the submit button was pressed.

Field:

- source = `brevo_form`

### `gsa_nature_signal_completion`

Possible responses:

- `yes`
- `partly`
- `not_yet`

Sources currently include:

- `email_link`
- `survey_button`
- `report_back`

The report-back page emits `yes` only when all four field checks are complete and the mission report is filed.

### `gsa_mission_report_filed`

Emitted when the Nature Signal field report is successfully filed on the report-back page.

Field:

- mission = `nature_signal`

### `gsa_starter_kit_checkout_click`

Emitted when a visitor clicks a Starter Kit Gumroad checkout button from the dedicated Starter Kit page.

Fields include preserved attribution:

- utm_source
- utm_medium
- utm_campaign

The Starter Kit page preserves incoming UTM attribution in session storage and passes it through to Gumroad rather than overwriting every visitor as generic site traffic.

### `gsa_post_purchase_page_view`

Emitted on the post-purchase recruitment page.

Field:

- product = `starter_kit`

**This is not a purchase event.**

A real purchase count must come from Gumroad itself, a transaction webhook, or another trusted payment source.

---

## Local event queue

Events are also stored in the browser under:

`gsa_event_queue_v1`

Purpose:

- first-party debugging
- future analytics integration
- avoid losing the event architecture while no analytics service is connected

Limit:

- last 100 events per browser/device

This is not an aggregate business dashboard and does not replace server-side or analytics reporting.

---

## Audit metric mapping

| Audit metric | Current implementation |
|---|---|
| Homepage visits | `gsa_page_view` on `/` |
| Free Mission page visits | `gsa_page_view` on free signup page |
| Free Mission signups | `gsa_free_mission_signup_confirmed` |
| Mission delivered/opened | `gsa_page_view` on free mission delivery page |
| Mission reportedly completed | `gsa_nature_signal_completion` |
| Starter Kit page visits | `gsa_page_view` on Starter Kit page |
| Starter Kit checkout clicks | `gsa_starter_kit_checkout_click` |
| Starter Kit purchases | **Not yet authoritative — needs Gumroad transaction source** |
| Post-purchase page reached | `gsa_post_purchase_page_view` |

---

## Next connection work

When analytics access becomes available:

1. connect the existing `dataLayer` events to the chosen analytics platform,
2. test each event once,
3. build a simple funnel report,
4. connect Gumroad transaction data so purchase conversion can be measured accurately,
5. do not collect child names, child email addresses, photos, precise location or written mission reports for funnel analytics.

The current event names should remain stable unless there is a compelling implementation reason to change them.
