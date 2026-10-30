# GSA Pinterest conversion campaign — 30 October 2026

Status: keyword-informed campaign prepared, NOT automatically posted. Search-growth evidence is available for "screen free activities" (+200%) and "outdoor learning" (+65%) from Pinterest's 2026 parenting report; exact keyword volumes and sales conversion are NOT verified.

## Proposed Pinterest boards (rename existing matching boards; don't duplicate)
1. Screen-Free Activities for Kids | Outdoor Adventures
2. Nature Scavenger Hunts & Printable Games
3. Outdoor Family Games & Nature Adventures
4. Homeschool Nature Study & Outdoor Learning
5. Kids' Ocean & Wildlife Activities
6. Printable Kids Activities & Secret Agent Missions

Do not rename or delete boards automatically without inspecting existing boards and pin distribution.

## Pin schedule: 3 unique creatives per week for 4 weeks
- Monday: free mission -> /free-secret-agent-mission.html (email conversion)
- Wednesday: family nature play -> /screen-free-nature-activities.html (discovery; link to Starter Kit)
- Friday: Starter Kit -> /starter-kit.html (sales)
- Each pin requires a distinct approved image. Do not generate copies with only changed text.
- Avoid showing readable paid product pages or altering official GSA logos.

## SEO pin title and description candidates
| Board | Title | Description | Destination |
|---|---|---|---|
| Screen-Free Activities for Kids | Screen-Free Activities for Kids: A Free Nature Mission | Need screen-free activities for kids? Try a free printable secret-agent nature mission with a code name and outdoor discovery challenge. Explore together as a family. | /free-secret-agent-mission.html |
| Nature Scavenger Hunts | Nature Scavenger Hunt Printable with a Secret-Agent Twist | Turn a nature walk into a mission. Download a free printable nature adventure for children, with simple ways for families to explore outdoors together. | /free-secret-agent-mission.html |
| Outdoor Family Games | Outdoor Family Adventure: Turn a Walk into a Mission | Looking for outdoor family activities? Discover a story-led secret-agent nature adventure that makes time outside more engaging. | /starter-kit.html |
| Homeschool Nature Study | Homeschool Nature Study: Screen-Free Outdoor Learning | Bring observation, curiosity and outdoor learning into your homeschool routine with a printable nature mission. Start with the free activity. | /free-secret-agent-mission.html |
| Kids' Ocean & Wildlife | Ocean Activities for Kids: Explore Nature Beyond Screens | Discover a screen-free adventure inspired by sea turtles, dolphins and real-world nature exploration. Start your free mission. | /free-secret-agent-mission.html |
| Printable Kids Activities | Printable Adventure Kit for Kids: 33-Page Secret Agent Starter Kit | An illustrated, screen-free nature adventure for families. The A$19 printable Starter Kit includes a story-led mission and 28 Secret Meeting Cards. | /starter-kit.html |

## Conversion audit from repository source
- /free-secret-agent-mission.html has an actual Brevo embedded form, and a MutationObserver that redirects on confirmed success. This is code inspection, NOT a successful live signup test.
- /free-mission-download.html contains the PDF download button and Starter Kit upsell.
- /starter-kit.html has a Gumroad checkout link; checkout not independently tested here.
- /assets/gsa-events.js only queues events to localStorage and dataLayer; no analytics ingestion is demonstrated by that file alone.
- Homepage is too large for a complete connector read in this audit.
- The known sitemap.xml is dated September for key conversion pages and needs maintenance.
- Do not claim automated Pinterest posting is active until authenticated Pinterest publishing and a successful test pin are verified.

## Success criteria
Use UTM links per pin and measure Pinterest outbound clicks, Brevo confirmed signups, Starter Kit checkout starts and purchases. Avoid relying on impressions alone.
