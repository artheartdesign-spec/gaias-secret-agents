#!/usr/bin/env python3
"""Validate the authoritative feed without rewriting or dropping promotions."""
from collections import Counter
from email.utils import parsedate_to_datetime
from pathlib import Path
import sys
from urllib.parse import urlsplit, parse_qs
import xml.etree.ElementTree as ET

MEDIA = '{http://search.yahoo.com/mrss/}content'
DOMAIN = 'gaiassecretagents.com'
MIMES = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}

def validate(path):
    root = ET.parse(path).getroot()
    if root.tag != 'rss' or root.get('version') != '2.0':
        raise ValueError('Expected RSS 2.0')
    channel = root.find('channel')
    if channel is None:
        raise ValueError('Missing channel')
    items = channel.findall('item')
    if not items:
        raise ValueError('Feed must contain at least one promotion')
    seen, images = set(), Counter()
    for item in items:
        fields = {name: (item.findtext(name) or '').strip() for name in ('guid', 'title', 'description', 'link', 'pubDate')}
        if not all(fields.values()):
            raise ValueError(f'Missing required field: {fields["guid"]}')
        guid = fields['guid']
        if guid in seen:
            raise ValueError(f'Duplicate GUID: {guid}')
        seen.add(guid)
        if item.find('guid').get('isPermaLink') != 'false':
            raise ValueError(f'Use stable non-permalink GUID: {guid}')
        if len(fields['title']) > 100 or len(fields['description']) > 500:
            raise ValueError(f'Pin copy exceeds title/description limit: {guid}')
        destination = urlsplit(fields['link'])
        if destination.scheme != 'https' or destination.hostname != DOMAIN:
            raise ValueError(f'Destination must use the claimed domain: {guid}')
        query = parse_qs(destination.query)
        if query.get('utm_source') != ['pinterest'] or not query.get('utm_campaign'):
            raise ValueError(f'Missing Pinterest attribution: {guid}')
        date = parsedate_to_datetime(fields['pubDate'])
        if date.tzinfo is None:
            raise ValueError(f'Publication date must have a timezone: {guid}')
        media = item.find(MEDIA)
        if media is None:
            raise ValueError(f'Missing image: {guid}')
        url = urlsplit(media.get('url', ''))
        expected_mime = MIMES.get(Path(url.path).suffix.lower())
        if url.scheme != 'https' or url.hostname != DOMAIN or not expected_mime:
            raise ValueError(f'Invalid image URL: {guid}')
        if media.get('type') != expected_mime or media.get('medium') != 'image':
            raise ValueError(f'Incorrect image media type: {guid}')
        images[media.get('url')] += 1
    print(f'PASS: {len(items)} items, unique stable GUIDs, valid copy, dates, domain and image metadata.')
    print(f'Creative inventory: {len(images)} unique images for {len(items)} items. Reusing images is not fresh creative.')
    print('This validates the feed only; it does not confirm Pinterest import or publication.')
    return len(items)

if __name__ == '__main__':
    validate(Path(sys.argv[1] if len(sys.argv) > 1 else 'pinterest-rss.xml'))
