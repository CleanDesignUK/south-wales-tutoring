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
    # Distinguish obsolete advertised starting prices from individual tutor prices.
    # For example, Muskan's independently published rate of £25/hr is valid.
    marketing_text=re.sub(r'<article\b[^>]*class="[^"]*\btutor-card-new\b[^"]*"[^>]*>[\s\S]*?</article>', '', text)
    if file.name != 'our-tutors.html' and ('£20/hr' in marketing_text or '£25/hr' in marketing_text):
        ERRORS.append(f'{file.relative_to(ROOT)} contains obsolete general starting rate')
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
# Additional release invariants for the safeguarding and mobile UX update.
try:
    tutors=json.loads((ROOT/'data/tutors.json').read_text())['tutors']
    if any(t.get('name','').lower() in ('howard','mahima') for t in tutors):ERRORS.append('Former tutors included in public directory data')
    if len(tutors)!=37:ERRORS.append(f'Expected 37 tutor cards, found {len(tutors)}')
    zainab=[t for t in tutors if t.get('name')=='Zainab']
    if len(zainab)!=1 or zainab[0].get('publishedStartingRateGBP')!=28:
        ERRORS.append('Zainab must be listed at £28/hr')
    homepage=(ROOT/'index.html').read_text(encoding='utf-8')
    if 'data-name="muskan"' not in homepage or 'data-name="zainab"' in homepage:
        ERRORS.append('Homepage tutor showcase must feature Muskan instead of Zainab')
    directory=(ROOT/'our-tutors.html').read_text(encoding='utf-8')
    zainab_card=re.search(r'data-name="zainab"[\s\S]*?</article>', directory)
    if not zainab_card or 'From £28/hr' not in zainab_card.group(0):
        ERRORS.append('Tutor directory must show Zainab at £28/hr')
    if 'ZC247571' in (ROOT/'assets/js/components.js').read_text(encoding='utf-8'):
        ERRORS.append('Footer must not claim group ICO registration')
except Exception as e:ERRORS.append(f'Unable to read tutor data: {e}')
for candidate in ('safeguarding.html','assets/css/safeguarding.css','assets/js/safeguarding.js','assets/css/carousels.css','assets/js/carousels.js'):
    if not (ROOT/candidate).is_file():ERRORS.append(f'Missing {candidate}')
for file in pages:
    text=file.read_text(encoding='utf-8')
    if 'assets/css/carousels.css' not in text or 'assets/js/carousels.js' not in text:
        ERRORS.append(f'Missing mobile carousel assets on {file.relative_to(ROOT)}')
    if file.name=='our-tutors.html' and ('data-name="howard"' in text or 'data-name="mahima"' in text):
        ERRORS.append('Deprecated tutor cards still present')
if not (ROOT/'assets/brand/nwt-shield.png').exists():ERRORS.append('Missing NWT crest')
if not (ROOT/'assets/brand/nwt-shield-favicon.jpg').exists():ERRORS.append('Missing JPG favicon')
print(f'Validated {len(pages)} HTML pages and {len(list(ROOT.rglob("*.json")))} JSON files.')
for e in ERRORS:print('ERROR:',e)
sys.exit(bool(ERRORS))
