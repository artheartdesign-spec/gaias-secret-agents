# Gaia’s Secret Agents Facebook launch

Prepared 10 September 2026. Page creation and automatic Facebook delivery still require an authenticated Facebook account and a successful connection test. This file does not mean that posts have been published.

**Artwork approval:** Maz has authorised new post artwork, with a review before publication. Show each new artwork to Maz and obtain approval before adding it to a public post or automatic feed. Preserve existing approved product art and the exact official logo. The feed allows only the existing website's two image assets listed by URL and SHA-256 in `approved_artwork`; it withholds items that declare new or changed social-preview artwork until their approved bytes are recorded there. Approval must come from Maz, not from the fact that an image exists on the website.

## Page details

- Name: **Gaia’s Secret Agents**
- Category: **Education website**, if offered by Facebook.
- Bio: **Screen-free secret-agent adventures, nature missions and printable family activities for ages 6–11.**
- Website: <https://gaiassecretagents.com/>
- Profile picture: use the existing official round GSA logo, unchanged. A byte-for-byte copy extracted from the website is `assets/gsa-official-logo.webp`.
- Preferred action button: **Shop Now**, linking to <https://gaiassecretagents.com/secret_meeting_cards.html?utm_source=facebook&utm_medium=organic_social&utm_campaign=page_shop>.
- Check for an existing Page owned by the signed-in account before creating another one.

## First post — welcome and small purchase

Your next family adventure can start with ten ordinary minutes. 🌿

Welcome to Gaia’s Secret Agents: screen-free secret-agent adventures for curious children aged 6–11 and the grown-ups beside them.

Start small with the **A$5 Founding Pack**: 16 printable TALK, IMAGINE and DO cards, matching backs, a meeting guide, an action sheet and a printable storage box.

Take turns. Anyone may pass. Finish with one small Earth-positive action together.

See the cards and get the printable:
https://gaiassecretagents.com/secret_meeting_cards.html?utm_source=facebook&utm_medium=organic_social&utm_campaign=page_launch

Digital download. Print at home. Follow this Page for free nature missions you can try together.

Use the existing product illustration: <https://gaiassecretagents.com/assets/founding-pack-cover.jpg>.

## Second post — immediately useful activity

A free secret mission for your next walk: **The Five-Colour Hunt**.

Choose five colours. Ask your child to spot one natural example of each, without picking or disturbing anything. Look closely at bark, fallen leaves, flowers and stones.

At the end, ask: “Which colour surprised you?”

No special equipment. No printing. Just a reason to look a little closer.

Find seven screen-free nature activities here:
https://gaiassecretagents.com/screen-free-nature-activities.html?utm_source=facebook&utm_medium=organic_social&utm_campaign=colour_hunt

## Third post — the complete starting point

“You have been chosen.”

That’s where the adventure begins. The **A$19 Gaia’s Secret Agents Starter Kit** introduces children aged 6–11 to stories, agent identities, curiosity and care for the natural world.

Prepare the printable materials at home and begin your child’s first agent induction together.

See the Starter Kit:
https://gaiassecretagents.gumroad.com/l/gsa-starter-kit?utm_source=facebook&utm_medium=organic_social&utm_campaign=starter_kit_launch

Digital download; no printed pack is shipped.

## Current purchase checks

Both Gumroad product pages returned HTTP 200 on 10 September 2026. Their product data marked them published and in stock, with merchant prices of AUD 5.00 and AUD 19.00 respectively. No purchase was made and delivery after payment was not tested. Recheck before reposting fixed-price copy after a price change.

## RSS → Facebook setup

Recommended service: **Make Free**, using the native RSS and Facebook Pages modules. Its published free allowance is 1,000 credits per month as checked on 10 September 2026. A check every six hours uses roughly 120–124 polling operations per month, plus posting operations; this is an estimate, and retries or other scenarios add usage. Do not enable paid upgrades or automatic credit purchases.

1. Create or reuse the GSA Facebook Page, keeping the official logo unchanged.
2. In Make, create a scenario with **RSS → Watch RSS feed items**.
3. Feed URL: **https://gaiassecretagents.com/facebook-rss.xml**. Use a maximum of one returned item per execution initially. Set the starting point deliberately; use **From now on** after the welcome post so old items do not all publish at launch.
4. Add **Facebook Pages → Create a Post**. Authorise only the GSA Page access needed for posting. The account must have the required Page access.
5. Set message to the RSS title, a blank line, then the RSS description. Set the link to the RSS item link with `?utm_source=facebook&utm_medium=organic_social&utm_campaign=rss` appended. These feed links have no existing query strings. Do not copy image URLs into the link field.
6. Schedule checks every six hours. This shares new feed items; it does not create new articles or guarantee a post at a specific time.
7. Test one intentional item, confirm the post appears on the correct GSA Page and opens its product or activity link, then switch the scenario on. Avoid reposting the same test item manually. Do not call the automation live before the successful test.

The welcome post can be pinned manually. Read the results after the first week: Facebook link clicks and Gumroad sales, not follower count alone. The business goal is purchases of existing GSA products; no Facebook creator-payment eligibility or earnings are assumed.

## How the feed stays current

`scripts/build-facebook-rss.py` automatically includes root-level GSA articles linked from `free-activities-guides.html` that have `Article` or `BlogPosting` JSON-LD with a headline and original publication date. It rejects unexpected canonical domains and `noindex` pages. The explicit promotional entries and optional article copy overrides live in `facebook-feed-content.json`.

The workflow rebuilds when root HTML, the copy file or the generator changes. It commits only the generated feed and explicitly requests the existing GitHub Pages build, because ordinary GITHUB_TOKEN commits do not trigger that build themselves. It does not change the hosting provider or the Pinterest feed.

Keep article canonical URLs and `datePublished` stable. Use `dateModified` for corrections. Stable RSS GUIDs help the connected service avoid posting edits as new articles. RSS identity is not an end-to-end delivery guarantee; check Make execution history if duplicates or omissions appear. Future-dated items are omitted and need a build after their publication time. Do not backdate a newly published article behind the feed consumer’s start point.

To add a new article, publish it with its own canonical URL and Article metadata, and link it from the free guide archive in the same update. To deliberately announce a non-article page, add a new featured page entry with its actual publication time. Avoid adding the same URL twice. No automatic article-writing task has been installed.

Sources: [Make pricing](https://www.make.com/en/pricing), [RSS modules](https://apps.make.com/rss), [Facebook Pages integration](https://www.make.com/en/integrations/facebook-pages/rss), [Meta Page creation](https://www.facebook.com/help/104002523024878), [GitHub Pages build API](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build).
