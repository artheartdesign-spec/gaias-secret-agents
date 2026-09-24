# GSA Audit Implementation Status

Updated: 24 September 2026

This file tracks implementation of the 65-page GSA audit.

## Phase 1 — Conversion

### Completed

- [x] Reposition homepage around **screen-free secret missions for curious young Earth Protectors**
- [x] Make Starter Kit the clear official starting product
- [x] Remove/qualify premature recurring-monthly language
- [x] Create dedicated `starter-kit.html` sales page
- [x] Route free-mission and report-back traffic through the Starter Kit sales page before checkout
- [x] Add verified 33-page Starter Kit contents and preparation requirements
- [x] Preserve UTM attribution through Starter Kit checkout
- [x] Add first-party event layer `/assets/gsa-events.js`
- [x] Track page views on the key funnel pages
- [x] Track confirmed Brevo free-mission signup
- [x] Fix free-mission flow so mission opens only after Brevo confirms signup
- [x] Track Nature Signal completion: Yes / Partly / Not yet
- [x] Track filed Nature Signal mission report
- [x] Track Starter Kit checkout clicks
- [x] Create post-purchase Starter Kit recruitment page
- [x] Document that authoritative purchase count still requires Gumroad transaction data
- [x] Create five-email Nature Signal → Starter Kit nurture sequence
- [x] Add one-click completion survey links to prepared nurture sequence
- [x] Create one-question mission-completion page

### Prepared but requires external-account connection

- [ ] Load and activate the five-email sequence in Brevo
- [ ] Connect the existing site events to an analytics account/dashboard
- [ ] Connect authoritative Gumroad purchase data
- [ ] Set Gumroad post-purchase redirect to `/starter-kit-confirmed.html`

These items should not be marked complete until the relevant external account confirms them.

---

## Product evidence

### Completed

- [x] Verify the real Starter Kit against the current 33-page customer PDF
- [x] Reject the existing AI collage for website use because it contains text/logo inaccuracies
- [x] Build a replacement product preview from actual Starter Kit PDF pages
- [x] Save the verified preview in Library:
  `/GSA Web Assets/gsa-starter-kit-real-preview-v2.png`

### Pending

- [ ] Upload the verified preview image to the GitHub website assets and place it on the Starter Kit sales page

Current GitHub connector in this chat exposes text-file writes but no direct binary-image upload action. Do not replace this with the inaccurate collage.

---

## Recurring Agent journey

### Completed

- [x] Define Agent progression system
- [x] Create printable interactive `agent-record.html`
- [x] Keep mission numbering separate from Character File numbering
- [x] Preserve archive sequence:
  - 001 Bramblewick
  - 002 Kai
  - 003 Flip
  - 004 Sprig
  - 005 Astra
- [x] Make Secret Meeting Cards optional family/friends play rather than rank requirements
- [x] Set provisional Field Agent clearance to 5 verified field skills
- [x] Current known skills:
  - Mission 01 — Curiosity
  - Mission 02 — Observation
  - Mission 03 — Connections
- [x] Keep future skill names and later rank thresholds classified until designed

---

## Mission 02

### Completed architecture

`docs/mission-02-operation-pollinator.md`

Includes:

- [x] complete three-page story structure
- [x] mission letter and objective
- [x] clue sequence
- [x] environmental learning objective
- [x] safe Pollinator Watch activity
- [x] no-flowers alternative
- [x] real-world Pollinator Pause Zone action
- [x] Field Guide
- [x] creative page
- [x] Secret Code
- [x] Pollinator Specialist badge
- [x] Agent Super Power — Observation
- [x] Sprig — Character File 004
- [x] 12 Secret Meeting Cards: 4 TALK / 4 IMAGINE / 4 DO
- [x] Parent Guide notes
- [x] bridge into Mission 03

### Still to manufacture

- [ ] final designed printable pages
- [ ] final Character File 004 artwork/front
- [ ] universal Character File back artwork if not already finalised
- [ ] duplex Secret Meeting Card sheets
- [ ] final PDF assembly and print test

---

## Mission 03

### Completed architecture

`docs/mission-03-the-vanishing-water.md`

Includes:

- [x] direct continuity from Mission 02
- [x] three-page story structure
- [x] water-path mapping investigation
- [x] safe dry-weather field method
- [x] runoff protection action
- [x] Water Investigator badge
- [x] Agent Super Power — Connections
- [x] Astra — Character File 005
- [x] 12 Secret Meeting Cards: 4 TALK / 4 IMAGINE / 4 DO
- [x] Parent Guide accuracy/safety notes
- [x] next mystery left classified instead of inventing Mission 04

### Still to manufacture

- [ ] final designed printable pages
- [ ] Character File 005 artwork/front
- [ ] duplex Secret Meeting Card sheets
- [ ] final PDF assembly and print test

---

## Measurement status

See:

`docs/conversion-measurement.md`

Implemented event hooks:

- `gsa_page_view`
- `gsa_free_mission_signup_confirmed`
- `gsa_nature_signal_completion`
- `gsa_mission_report_filed`
- `gsa_starter_kit_checkout_click`
- `gsa_post_purchase_page_view`

Authoritative Starter Kit purchase count remains pending Gumroad transaction integration.

---

## Highest-leverage next work

1. Activate the prepared email automation in Brevo when account access is available.
2. Connect Gumroad purchase data and set the post-purchase redirect.
3. Put the verified real-product preview on the Starter Kit sales page once binary image upload to GitHub is available.
4. Manufacture Mission 02 into final printable pages before adding new speculative features.
5. Get real parent/child tester feedback and use it as genuine social proof.

Do not divert into generic content expansion or redesign while these conversion/product tasks remain open.
