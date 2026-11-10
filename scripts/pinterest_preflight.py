"""Inspect all Pinterest feeds, with optional append-only and live destination checks."""
import argparse
import collections
import hashlib
from html.parser import HTMLParser
import re
import subprocess
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urlsplit

from validate_pinterest_rss import DOMAIN, MEDIA, validate

FEEDS = ("pinterest-rss.xml", "pinterest-family-games-rss.xml", "pinterest-homeschool-rss.xml",
         "pinterest-outdoor-rss.xml", "pinterest-earth-protectors-rss.xml")
OPTIONAL = set(FEEDS[-2:])
BAD = re.compile(r"â[\x80-\x9f€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]|[ÃÂ][\x80-\xbf\u2000-\u2122]|\ufffd|[\x80-\x9f]|&(?:amp|apos|quot|nbsp|rsquo|lsquo|#\d+|#x[0-9a-f]+);")

TYPOS = re.compile(r"\b(?:teh|recieve|seperate|enviroment|activites|Gaia[’']s Secret Agnets)\b", re.I)

def git(*args):
    return subprocess.check_output(["git", *args])

def fingerprint(item):
    return (item.tag, tuple(sorted(item.attrib.items())), (item.text or "").strip(),
            tuple(fingerprint(child) for child in item))

def parse(data, name):
    decoded = data.decode("utf-8-sig", errors="strict")
    declaration = re.match(r"""<\?xml[^>]*encoding=['"]([^'"]+)""", decoded, re.I)
    if declaration and declaration[1].lower() != "utf-8":
        raise ValueError(f"{name}: declare UTF-8")
    root = ET.fromstring(decoded)
    if root.tag != "rss" or root.get("version") != "2.0" or root.find("channel") is None:
        raise ValueError(f"{name}: invalid RSS channel")
    for elem in root.iter():
        for value in (elem.text or "", *elem.attrib.values()):
            if BAD.search(value):
                raise ValueError(f"{name}: suspect encoding or double escaping in {value[:120]!r}")
    return root.findall("channel/item")

def path_for(url):
    path = unquote(urlsplit(url).path).lstrip("/") or "index.html"
    if ".." in Path(path).parts:
        raise ValueError(f"Unsafe path in {url}")
    return path


class SocialMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.values = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            key = attrs.get("property") or attrs.get("name") or ""
            if key.lower() in {"description", "og:title", "og:description", "twitter:title", "twitter:description"}:
                self.values.append(attrs.get("content") or "")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.values.append(data)

def check_metadata(path):
    parser = SocialMetadata()
    source = Path(path).read_bytes().decode("utf-8-sig")
    parser.feed(source.partition("</head>")[0])
    parser.close()
    for value in parser.values:
        if BAD.search(value):
            raise ValueError(f"{path}: corrupt page/share metadata: {value[:120]!r}")

def verify_url(url):
    request = urllib.request.Request(url, headers={"User-Agent": "GSA feed validation"})
    with urllib.request.urlopen(request, timeout=15) as response:
        if urlsplit(response.geturl()).hostname != DOMAIN or response.headers.get_content_type() != "text/html":
            raise ValueError(f"Destination does not resolve to a claimed-domain page: {url}")
        response.read(512)

def check(base=None, live=False):
    seen = collections.defaultdict(dict)
    historical_assets = set()
    destinations = set()
    pages = {"index.html"}
    total = 0
    for name in FEEDS:
        items = parse(Path(name).read_bytes(), name)
        if items or name not in OPTIONAL:
            validate(Path(name))
        current = {i.findtext("guid"): i for i in items}
        old = {}
        if base:
            old = {i.findtext("guid"): i for i in parse(git("show", f"{base}:{name}"), name)}
            for guid, item in old.items():
                if guid not in current or fingerprint(item) != fingerprint(current[guid]):
                    raise ValueError(f"{name}: historical entry removed or changed: {guid}")
                historical_assets.add(path_for(item.find(MEDIA).get("url")))
        for guid, item in current.items():
            image = path_for(item.find(MEDIA).get("url"))
            link = item.findtext("link")
            pages.add(path_for(link))
            for field, value in (("GUID",guid),("image",image),("link",link),
                                 ("title"," ".join(item.findtext("title").casefold().split())),
                                 ("description"," ".join(item.findtext("description").casefold().split()))):
                if value in seen[field]:
                    raise ValueError(f"{name}: duplicate {field} on {guid} and {seen[field][value]}")
                seen[field][value] = guid
            if not Path(image).is_file():
                raise ValueError(f"{guid}: missing Pin image {image}")
            digest = hashlib.sha256(Path(image).read_bytes()).hexdigest()
            if digest in seen["bytes"]:
                raise ValueError(f"{guid}: image bytes already used by {seen['bytes'][digest]}")
            seen["bytes"][digest] = guid
            if guid not in old:
                for value in item.itertext():
                    if TYPOS.search(value):
                        raise ValueError(f"{guid}: possible spelling error in {value[:100]!r}")
                for path in (image, path_for(link)):
                    if not Path(path).is_file():
                        raise ValueError(f"{guid}: missing site file {path}")
                destinations.add(link)
            total += 1
    for path in sorted(pages):
        check_metadata(path)
    if base:
        changed = set(git("diff","--name-only","--no-renames","-z",base,"--").decode().split("\0"))
        if changed & historical_assets:
            raise ValueError(f"Historical Pin artwork changed: {sorted(changed & historical_assets)}")
    if live:
        for url in sorted(destinations):
            verify_url(url)
    print(f"PASS: {total} entries across {len(FEEDS)} feeds.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", help="Previous published commit to protect")
    parser.add_argument("--live", action="store_true", help="Check new destination URLs by HTTPS")
    args = parser.parse_args()
    try:
        check(args.base, args.live)
    except (OSError, ValueError, ET.ParseError, subprocess.CalledProcessError) as exc:
        print(f"Pinterest publication blocked: {exc}", file=sys.stderr)
        sys.exit(1)
