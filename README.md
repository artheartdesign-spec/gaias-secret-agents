# gaias-secret-agents

## Pinterest automatic publishing — canonical RSS feed

**Public RSS URL:** https://gaiassecretagents.com/pinterest-rss.xml

**Source file in this repository:** `pinterest-rss.xml` (repository root, published by GitHub Pages).

**Validation workflow:** `.github/workflows/build-pinterest-rss.yml` (validates the XML; does not publish Pins directly).

**Pinterest setup:** In the Gaia’s Secret Agents Pinterest business account, Settings → Import content → RSS / Auto-publish, the above RSS URL was connected on 31 October 2026 (Brisbane time). The selected destination board was **Screen Free activities for kids**. The Pinterest settings screen showed the saved RSS URL and an **Add another** button, confirming the connection was saved.

**Important:** Pinterest imports the feed independently. A successful GitHub Actions validation or a saved Pinterest connection does not prove that Pins were imported; verify actual Pins in Pinterest. Do not replace or rebuild the feed from an older hard-coded list, delete it, or create a duplicate RSS connection. Preserve stable RSS item GUIDs when updating entries.

**Separate, currently nonfunctional method:** `.github/workflows/pinterest-production-post.yml` uses Pinterest API OAuth and has failed due to missing `PINTEREST_REFRESH_TOKEN`; it is not required for RSS auto-publishing.
