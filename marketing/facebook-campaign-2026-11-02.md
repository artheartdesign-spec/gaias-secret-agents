# Gaia’s Secret Agents — Facebook organic campaign — 2 November 2026

**Campaign date:** Monday 2 November 2026 (Australia/Brisbane)
**Facebook Page:** Gaia’s Secret Agents, Page ID 61594001054231
**Status:** QUEUED_IN_GITHUB_FACEBOOK_RSS; FEED_BUILD_SUCCESS; GITHUB_PAGES_DEPLOYMENT_PENDING_VERIFICATION; FACEBOOK_PAGE_PUBLICATION_NOT_VERIFIED
**Daily limit:** One new Facebook item for 2026-11-02. No Pinterest content, feed or automation was changed.

## Checks and verification

- Reviewed the existing 31 October and 1 November campaign logs, the current `facebook-feed-content.json`, `facebook-rss.xml`, live homepage, live Secret Meeting Cards product page, and the linked Gumroad product listing.
- Live product landing page advertises a **16-card Founding Pack**, a **12-page A4 printable PDF**, and **A$5**. The linked Gumroad product listing is accessible and describes 16 cards, meeting guide, action sheet, matching backs and tuck box. **Gumroad checkout currency/total and actual purchase completion were not independently tested**, so the Facebook copy does not make a price claim.
- Previous Facebook RSS posts: 31 October Tiny World Hunt; 1 November Agent Kai's sea turtle navigation mission. Today's post uses a different family-connection, imaginative conversation and Secret Meeting Cards angle. Previous Secret Meeting Cards promotional copy was last dated 6 October and is different.
- Public Facebook Page could not be fetched; one-per-day limit is confirmed against the controlled repository campaign feed and logs, not against all possible posts made directly on Facebook.
- Approved, unchanged image: `https://gaiassecretagents.com/assets/founding-pack-cover.jpg`. Inspected full image: navy/teal/gold cover, legible headline, original GSA round logo, no spelling errors or anomalous animal anatomy detected. The feed builder's SHA-256 approval gate verifies this asset before inclusion.
- The GitHub Facebook RSS build initially failed because the existing homepage HTML contains invalid UTF-8 bytes. Repaired **only** the feed builder's text decoding (`errors="replace"`), leaving the homepage, official logo and all approved artwork untouched. Subsequent RSS build workflow run **41351977865 succeeded**, including the step that requests GitHub Pages publication. The generated `facebook-rss.xml` has today's GUID as its first item.
- RSS feed delivery is **not proof** of a Facebook Page post. No direct Facebook publishing connector or verified Page permalink was available. Do not manually repost until Page delivery is checked to prevent duplication.

## Facebook post — ready to publish

**Headline:** The tree that could talk: tonight’s family Secret Meeting

If the oldest tree in your street could tell your family one secret, what would it say?

Try a little Secret Meeting tonight. Ask everyone that question, then listen. The youngest might invent a dragon. A grandparent might remember what the neighbourhood looked like years ago. Every answer counts, and anyone can pass.

Finish by choosing one tiny Earth Protector action together — perhaps caring for a pot plant or leaving a little corner of the garden for wildlife.

That’s the spirit of Gaia’s Secret Agents Secret Meeting Cards: 16 printable TALK, IMAGINE and DO prompts to help children and grown-ups laugh, connect and care for nature. The Founding Pack is a digital A4 PDF to download and print at home; no physical cards are posted.

Explore the 16-card Founding Pack: https://gaiassecretagents.com/secret_meeting_cards.html

#ScreenFreeFamilyTime #FamilyActivities #NatureActivitiesForKids #GaiasSecretAgents

## Publishing record

- **Destination:** Facebook Page 61594001054231 (target); GitHub Facebook RSS feed (actual prepared channel).
- **Canonical CTA:** https://gaiassecretagents.com/secret_meeting_cards.html
- **RSS:** https://gaiassecretagents.com/facebook-rss.xml
- **RSS GUID:** `gsa-facebook-2026-11-02-tree-that-could-talk-secret-meeting`
- **RSS pubDate:** Mon, 02 Nov 2026 07:20:00 +1000
- **Artwork:** https://gaiassecretagents.com/assets/founding-pack-cover.jpg
- **Alt text:** Dark navy and teal Gaia’s Secret Agents promotional cover for 16 Secret Meeting Cards, with TALK, IMAGINE, DO lettering beside a gold-framed illustrated Founding Pack Meeting Guide.
- **AI disclosure:** If posted manually, use the Facebook AI-generated/modified-content disclosure where applicable. RSS does not provide a verified way to apply that label.
- **Source content commit:** `01113f8f4542fa1025e43eb11a5416f3cc708d36`
- **RSS builder repair commit:** `29547587d974139d69ef5275759f019e76d412b7`
- **RSS build workflow:** https://github.com/artheartdesign-spec/gaias-secret-agents/actions/runs/41351977865 (success).
- **Facebook post permalink:** Not available; actual Facebook publication not confirmed.
- **No paid advertising, boosts, DMs, group posts, or Pinterest actions.**
