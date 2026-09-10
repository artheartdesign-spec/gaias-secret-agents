#!/usr/bin/env python3
"""Build the public GSA Facebook feed using only published, linked GSA pages."""

import hashlib
import json
from datetime import datetime, timezone
from email.utils import format_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://gaiassecretagents.com"
FEED_URL = ORIGIN + "/facebook-rss.xml"
ATOM = "http://www.w3.org/2005/Atom"
MEDIA = "http://search.yahoo.com/mrss/"
ET.register_namespace("atom", ATOM)
ET.register_namespace("media", MEDIA)


class Page(HTMLParser):
    def __init__(self, content):
        super().__init__(convert_charrefs=True)
        self.meta, self.links, self.articles = {}, [], []
        self.canonical = None
        self._json = None
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json = ""

    def handle_data(self, data):
        if self._json is not None:
            self._json += data

    def handle_endtag(self, tag):
        if tag != "script" or self._json is None:
            return
        data = json.loads(self._json)
        self._json = None
        records = data if isinstance(data, list) else data.get("@graph", [data])
        for record in records:
            kinds = record.get("@type", [])
            kinds = [kinds] if isinstance(kinds, str) else kinds
            if "Article" in kinds or "BlogPosting" in kinds:
                self.articles.append(record)


def published(value):
    date = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if date.tzinfo is None:
        # Dates without a time refer to the brand's local day in Brisbane.
        date = datetime.fromisoformat(date.isoformat() + "+10:00")
    return date


def read_page(relative):
    path = ROOT / relative
    if path.parent != ROOT or path.suffix != ".html" or not path.is_file():
        raise ValueError(f"Not a public root HTML page: {relative}")
    page = Page(path.read_text(encoding="utf-8"))
    expected = ORIGIN + ("/" if relative == "index.html" else "/" + relative)
    if page.canonical != expected:
        raise ValueError(f"Unexpected canonical URL for {relative}")
    if "noindex" in page.meta.get("robots", "").lower():
        raise ValueError(f"Page marked noindex: {relative}")
    return page


def build(now=None):
    now = now or datetime.now(timezone.utc)
    content = json.loads((ROOT / "facebook-feed-content.json").read_text(encoding="utf-8"))
    overrides = content["article_descriptions"]
    archive = read_page("free-activities-guides.html")
    items = {}
    for link in archive.links:
        url = urlsplit(urljoin(ORIGIN + "/", link))
        if url.netloc != "gaiassecretagents.com" or url.scheme != "https":
            continue
        relative = url.path.lstrip("/")
        if "/" in relative or not relative.endswith(".html"):
            continue
        candidate = ROOT / relative
        if not candidate.is_file() or not Page(candidate.read_text(encoding="utf-8")).articles:
            continue
        page = read_page(relative)
        for article in page.articles:
            item = {
                "path": relative,
                "title": article["headline"],
                "description": overrides.get(relative, page.meta.get("description", article.get("description", ""))),
                "published_at": article["datePublished"],
            }
            items[page.canonical] = (page, item)
    for item in content["featured_pages"]:
        page = read_page(item["path"])
        if page.canonical in items:
            raise ValueError(f"Duplicate featured URL: {page.canonical}")
        items[page.canonical] = (page, item)
    approved_artwork = content.get("approved_artwork", {})

    def artwork_ready(page):
        image = page.meta.get("og:image", "")
        if not image:
            return True
        if not image.startswith(ORIGIN + "/assets/") or image not in approved_artwork:
            return False
        asset = ROOT / urlsplit(image).path.lstrip("/")
        return asset.is_file() and hashlib.sha256(asset.read_bytes()).hexdigest() == approved_artwork[image]

    eligible = [(published(item["published_at"]), url, page, item)
                for url, (page, item) in items.items()
                if published(item["published_at"]) <= now and artwork_ready(page)]
    eligible.sort(key=lambda entry: (entry[0], entry[1]), reverse=True)
    if not eligible:
        raise ValueError("Refusing to publish an empty feed")
    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    for key, value in {
        "title": "Gaia’s Secret Agents — Nature Missions & Family Adventures",
        "link": ORIGIN + "/free-activities-guides.html",
        "description": "Screen-free nature activities and printable adventures for children aged 6–11 and their grown-ups.",
        "language": "en-au",
        "lastBuildDate": format_datetime(eligible[0][0]),
        "ttl": "360",
    }.items():
        ET.SubElement(channel, key).text = value
    ET.SubElement(channel, f"{{{ATOM}}}link", {
        "href": FEED_URL, "rel": "self", "type": "application/rss+xml"
    })
    for date, url, page, item in eligible:
        if not item["title"].strip() or not item["description"].strip():
            raise ValueError(f"Missing post copy: {url}")
        node = ET.SubElement(channel, "item")
        ET.SubElement(node, "guid", {"isPermaLink": "true"}).text = url
        for key, value in {
            "title": item["title"], "link": url,
            "description": item["description"], "pubDate": format_datetime(date),
        }.items():
            ET.SubElement(node, key).text = value
        image = page.meta.get("og:image", "")
        if image.startswith(ORIGIN + "/assets/"):
            if not (ROOT / urlsplit(image).path.lstrip("/")).is_file():
                raise ValueError(f"Missing feed image: {image}")
            ET.SubElement(node, f"{{{MEDIA}}}content", {"url": image, "medium": "image"})
    ET.indent(rss, space="  ")
    return ET.tostring(rss, encoding="utf-8", xml_declaration=True) + b"\n"


if __name__ == "__main__":
    output = build()
    (ROOT / "facebook-rss.xml").write_bytes(output)
    print(f"Built facebook-rss.xml: {len(ET.fromstring(output).findall('./channel/item'))} public GSA items")
