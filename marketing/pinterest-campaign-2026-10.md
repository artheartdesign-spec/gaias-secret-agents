# GSA Pinterest sales campaign — 30 October 2026

## Status and evidence
- Browser audit attempted: Pinterest returned its own Access Denied page twice. No board or existing Pin was edited in Pinterest.
- Latest available board inventory: repository audit timestamp 2026-10-29T23:12:55Z (18 boards). This is a saved inventory, not a new live browser audit. Board descriptions, pin distribution and importer settings remain unverified.
- Ahrefs Free Keyword Generator was attempted for "screen free activities" (United States); a Cloudflare human-verification challenge prevented results. No volume estimates were obtained.
- Use free, first-party Pinterest search-growth evidence below. These are published year-over-year growth figures, not monthly volumes, current October rankings, or evidence of GSA sales.
- Source: Pinterest Parenting Trend Report, published 24 February 2026:
  https://newsroom.pinterest.com/en-au/news/parenting-trend-report-2026/?change_language=true&filters=ads
- RSS requirements: https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed

| Exact researched term | Published growth | Application |
| --- | --- | --- |
| screen free activities | +200% | Primary family/Starter Kit discovery term |
| environmental activities for kids | +220% | Nature-action activity guides |
| outdoor learning | +65% | Homeschool/teacher discovery |
| educational activities for kids | +280% | Broader activity-guide audience |
| wild animals activities for kids | +170% | Wildlife observation content |
| family traditions ideas | +200% | Secret Meeting Cards family ritual angle |

Longer terms such as "printable family conversation cards", "homeschool nature study" and "printable nature activities for kids" are relevant product-fit hypotheses; their exact search volume and conversion are not verified. Do not label these as proven high-volume keywords.

## Proposed board edits — not applied
Keep existing board IDs. Inspect actual saved Pins before applying each rename; do not merge or delete boards without reviewing their contents. Preserve existing brand artwork and logo.

| Current board / ID | Proposed name | Proposed description |
| --- | --- | --- |
| Screen Free activities for kids / 992621642811023629 | Screen-Free Activities for Kids & Families | Screen-free activities for kids and families who want more time exploring together. Discover printable nature missions, observation games and outdoor adventures from Gaia’s Secret Agents. Start with a free nine-page Secret Agent mission. |
| Fun activities to do in Nature for kids / 992621642811023635 | Nature Activities for Kids & Outdoor Learning | Nature activities for kids, outdoor learning ideas and simple wildlife investigations. Explore birds, leaves, sounds and tiny habitats together, with low-prep family activities from Gaia’s Secret Agents. |
| Homeschool Nature Activities / 992621642811023633 | Homeschool Nature Study & Outdoor Learning | Add curiosity and observation to your homeschool day with nature study, outdoor learning and environmental activities for kids. Find printable missions and practical activities to explore alongside your children. |
| Earth Protection. Gaia’s secret agents / 992621642810885566 | Environmental Activities for Kids | Environmental activities for kids and families: notice wildlife, explore biodiversity and choose small actions that help nature. Discover hands-on ideas and screen-free Secret Agent missions from Gaia’s Secret Agents. |
| Screen free printable games for the family / 992621642811023638 | Printable Family Games & Conversation Cards | Printable family games and conversation cards for time together away from screens. Explore Gaia’s Secret Agents Secret Meeting Cards with TALK, IMAGINE and DO prompts for children and grown-ups. |
| Family fun printables / 992621642811023639 | Family Activities & Screen-Free Traditions | Make time for shared stories, outdoor discoveries and screen-free family traditions. Find family activity ideas and print-at-home Secret Agent adventures from Gaia’s Secret Agents. |
| Printable activities for children / 992621642811023632 | Printable Activities for Kids & Nature Missions | Printable activities for kids who love stories, secrets and discovering nature. Find free activities and the 33-page Gaia’s Secret Agents Starter Kit, including 28 Secret Meeting Cards. Digital downloads to print at home. |
| Printable outdoor adventures for kids / 992621642811023634 | Outdoor Adventures for Kids & Families | Turn everyday time outside into an adventure with nature missions, observation challenges and printable activities for kids and families. Explore together with Gaia’s Secret Agents. |
| Earth’s Animals and how we can help them / 992621642811038997 | Wildlife Activities for Kids & Families | Wildlife activities for kids and families: watch birds, investigate habitats and learn how to respect animals from a safe distance. Explore nature with Gaia’s Secret Agents. |

Keep Earth Day and eco-party boards seasonal and relevant; do not advertise an unfinished birthday product as purchasable. The inventory also contains currency trading, Quick Saves, My cutouts, Trees and Trends. Their contents were not inspected, so no deletion, archive or privacy change is proposed as an automatic action.

Suggested profile name: Gaia’s Secret Agents | Screen-Free Family Activities
Suggested profile description: Screen-free nature adventures for families. Explore together with printable Secret Agent missions, outdoor activities and family conversation cards. Start with a free nine-page mission, then discover our 33-page Starter Kit.

## Sales strategy
Primary offer: A$19 33-page Starter Kit, including 28 Secret Meeting Cards.
Entry offer: free nine-page mission with parent/guardian signup.
Separate lower-price offer: A$5 16-card Founding Pack; do not confuse this with the 28 cards in the Starter Kit.
Monthly subscription: user-confirmed A$11/month with 12 more cards each month; verify its active checkout before dedicating publishing slots to it.

Target requested by Maz: at least 10 Pins per day. Initial test mix:
- 4 distinct Pins to the free-mission signup page.
- 4 distinct Pins to the Starter Kit sales page.
- 2 distinct Pins to the Founding Pack sales page.

This allocation is a test, not a proven optimum. Every Pin must accurately match the destination, use a distinct reviewed image, and include a clear next action. Preserve the official logo; never expose readable paid pages. Ten daily Pins require a maintained supply of 70 reviewed creatives per week; changing only titles on the same image does not provide that supply.

Use the exact researched phrase naturally near the start of a relevant title. Follow it with a specific benefit or product:
- Screen-Free Activities for Kids: Free 9-Page Nature Mission
- Screen-Free Family Activities: Printable Secret Agent Starter Kit
- Outdoor Learning: A Bird-Watching Activity for Kids & Families
- Environmental Activities for Kids: One Small Earth Protector Action
- Printable Family Conversation Cards: 16 Secret Meeting Prompts (product-fit test, volume unverified)

Measure outbound clicks, confirmed adult signups, checkout starts and completed purchases by UTM campaign. A successful workflow or impressions alone are not sales evidence. Keep a weekly comparison by offer and creative before reallocating slots.

## Feed repair
The hard-coded builder overwrote direct XML edits, deleting three October 30 promotions. The repair:
1. Makes pinterest-rss.xml the authoritative source, with a read-only validation workflow.
2. Restores the three lost entries without changing their GUIDs.
3. Preserves all 21 existing GUIDs and publication dates.
4. Corrects the WebP image incorrectly labelled image/jpeg.
5. Improves 13 titles using researched terms and accurate product language.
6. Validates required fields, unique GUIDs, copy lengths, dated entries, claimed-domain links, attribution and image MIME types.

Existing published Pinterest Pins may retain their original titles: an RSS edit is not proof that Pinterest updated an existing Pin. The failed Pinterest API route is not used or revived.

## Remaining publishing verification
- In Pinterest Import content / RSS settings, verify https://gaiassecretagents.com/pinterest-rss.xml is connected to the claimed domain and intended public board.
- Check last import/error status and match a restored GUID/title to an actual live Pin.
- Pinterest says updates generally publish within 24 hours; another official creator page allows 24–48 hours.
- Current feed inventory: 24 entries, only five distinct images. There is no daily fresh-content generator or verified 10-Pin/day schedule. Do not report one as active.
- Multiple board destinations require their own connected feeds or another verified publishing method. Renaming a board alone does not change routing.
