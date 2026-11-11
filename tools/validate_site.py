#!/usr/bin/env python3
"""Dependency-free pre-deployment validation for the static South Wales Tutoring site."""
from html.parser import HTMLParser
from pathlib import Path
import json, re, sys, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
ERRORS=[]
class LinkScanner(HTMLParser):
    def __init__(self): super().__init__();self.links=[];self.scripts=[];self.forms=[];self._jsonld=False;self._buf=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('a','link','img','script'):
            url=a.get('href') or a.get('src')
            if url:self.links.append(url)
        if tag=='script' and a.get('type')=='application/ld+json':self._jsonld=True;self._buf=''
        if tag=='form':self.forms.append(a)
    def handle_data(self,d):
        if self._jsonld:self._buf+=d
    def handle_endtag(self,tag):
        if tag=='script' and self._jsonld:self._jsonld=False;self.scripts.append(self._buf)

pages=sorted(ROOT.rglob('*.html'))
for file in pages:
    text=file.read_text(encoding='utf-8')
    scanner=LinkScanner();scanner.feed(text)
    for link in scanner.links:
        path=link.split('#',1)[0].split('?',1)[0]
        if path.startswith(('./','../')) and not (file.parent/path).exists():ERRORS.append(f'{file.relative_to(ROOT)} missing {link}')
    for item in scanner.scripts:
        try:json.loads(item)
        except Exception as e:ERRORS.append(f'{file.relative_to(ROOT)} invalid JSON-LD: {e}')
    if 'Robert' in text or 'Ashley' in text:ERRORS.append(f'{file.relative_to(ROOT)} contains obsolete tutor')
    if file.name != 'our-tutors.html' and ('£20/hr' in text or '£25/hr' in text):ERRORS.append(f'{file.relative_to(ROOT)} contains obsolete rate')
    if '<site-header' not in text or '<site-footer' not in text:ERRORS.append(f'{file.relative_to(ROOT)} missing shared component')
    if 'nwt-shield-favicon.jpg' not in text:ERRORS.append(f'{file.relative_to(ROOT)} missing JPG favicon')
    if 'https://southwalestutoring.com/' in text:ERRORS.append(f'{file.relative_to(ROOT)} uses unconfigured custom domain')
    if scanner.forms:
        for f in scanner.forms:
            if f.get('data-web3form') is None:continue
            # data-web3form attribute exists even with empty value
        if re.search(r'<select[^>]+name="(?:level|area|enquiry_subject)"',text):ERRORS.append(f'{file.relative_to(ROOT)} obsolete form dropdown')
try:ET.parse(ROOT/'sitemap.xml')
except Exception as e:ERRORS.append(f'sitemap.xml: {e}')
for j in ROOT.rglob('*.json'):
    try:json.loads(j.read_text())
    except Exception as e:ERRORS.append(f'{j.relative_to(ROOT)}: {e}')
if not (ROOT/'assets/brand/nwt-shield.png').exists():ERRORS.append('Missing NWT crest')
if not (ROOT/'assets/brand/nwt-shield-favicon.jpg').exists():ERRORS.append('Missing JPG favicon')
print(f'Validated {len(pages)} HTML pages and {len(list(ROOT.rglob("*.json")))} JSON files.')
for e in ERRORS:print('ERROR:',e)
sys.exit(bool(ERRORS))
