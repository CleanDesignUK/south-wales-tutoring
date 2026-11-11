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
    # Only general advertised prices are checked here, not individual tutors' rates.
    marketing_text=re.sub(r'<article\b[^>]*class="[^"]*\btutor-card-new\b[^"]*"[^>]*>[\s\S]*?</article>', '', text)
    if file.name != 'our-tutors.html' and ('£20/hr' in marketing_text or '£25/hr' in marketing_text):
        ERRORS.append(f'{file.relative_to(ROOT)} contains obsolete general starting rate')
    if '<site-header' not in text or '<site-footer' not in text:ERRORS.append(f'{file.relative_to(ROOT)} missing shared component')
    if 'nwt-shield-favicon.jpg' not in text:ERRORS.append(f'{file.relative_to(ROOT)} missing JPG favicon')
    if 'https://cleandesignuk.github.io/south-wales-tutoring/' in text:ERRORS.append(f'{file.relative_to(ROOT)} uses outdated canonical URL')
    if 'https://southwalestutoring.com/assets/brand/nwt-social-preview.jpg' not in text:ERRORS.append(f'{file.relative_to(ROOT)} missing share image metadata')
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
# Analytics integration safety checks: only one GTM container, opted in via global cookie component.
component=(ROOT/'assets/js/components.js').read_text(encoding='utf-8')
if component.count('GTM-5ZWJ8M27')!=1:ERRORS.append('Unexpected Google Tag Manager container configuration')
if 'swt-cookie-consent-v2' not in component or 'startOptInAnalytics()' not in component:ERRORS.append('Missing analytics consent gate')
if 'GTM-P8K6CF2Z' in component:ERRORS.append('Duplicate Analytics-provided container detected')
for document in pages:
    page_html=document.read_text(encoding='utf-8')
    if 'googletagmanager.com/gtm.js' in page_html or 'GTM-P8K6CF2Z' in page_html:
        ERRORS.append(f'{document.relative_to(ROOT)} embeds tracking outside the consent gate')

if not (ROOT/'assets/brand/nwt-shield.png').exists():ERRORS.append('Missing NWT crest')
if not (ROOT/'assets/brand/nwt-shield-favicon.jpg').exists():ERRORS.append('Missing JPG favicon')
# SEO and service-area schema checks on all HTML pages.
from html import unescape
try:
    seo_pages = json.loads((ROOT/'data/seo-pages.json').read_text())
    site_url = json.loads((ROOT/'site-config.json').read_text())['siteUrl'].rstrip('/') + '/'
    expected_pages = {str(p.relative_to(ROOT)) for p in pages}
    if set(seo_pages) != expected_pages:
        ERRORS.append(f'SEO metadata catalogue mismatch: {sorted(set(seo_pages)^expected_pages)}')
    titles=set(); descriptions=set()
    for page in pages:
        path=str(page.relative_to(ROOT))
        markup=page.read_text(encoding='utf-8')
        scanner=LinkScanner();scanner.feed(markup)
        data=json.loads(scanner.scripts[0]) if scanner.scripts else {}
        graph=data.get('@graph',[])
        items={v.get('@type'):v for v in graph if isinstance(v.get('@type'),str)}
        org=items.get('EducationalOrganization',{})
        service=items.get('Service',{})
        web=items.get('WebPage') or items.get('AboutPage') or items.get('CollectionPage') or items.get('ContactPage') or items.get('Blog') or {}
        expected_url=site_url if path=='index.html' else site_url+path
        def metas(attr,value):
            return re.findall(r'<meta\s+[^>]*'+attr+r'=["\']'+re.escape(value)+r'["\'][^>]*>',markup,flags=re.I)
        canonical=re.findall(r'<link[^>]*rel=["\']canonical["\'][^>]*>',markup,flags=re.I)
        if len(canonical)!=1 or f'href="{expected_url}"' not in canonical[0]:
            ERRORS.append(f'{path}: missing or wrong canonical link')
        match=re.search(r'<title>(.*?)</title>',markup,re.I|re.S)
        title=unescape(match.group(1).strip()) if match else ''
        if not title or title in titles:ERRORS.append(f'{path}: blank or duplicated page title')
        titles.add(title)
        if title != seo_pages[path]['title']:ERRORS.append(f'{path}: title not aligned to SEO catalog')
        desc_meta=metas('name','description')
        if len(desc_meta)!=1:ERRORS.append(f'{path}: expected one description meta')
        desc=unescape(re.search(r'content="([^"]*)"',desc_meta[0]).group(1)) if len(desc_meta)==1 else ''
        if not desc or desc in descriptions:ERRORS.append(f'{path}: blank or duplicated description')
        descriptions.add(desc)
        if desc != seo_pages[path]['description']:ERRORS.append(f'{path}: description not aligned to SEO catalog')
        for key in ('og:title','og:description','og:image','og:url','og:site_name'):
            if len(metas('property',key)) != 1:ERRORS.append(f'{path}: expected exactly one {key}')
        for key in ('twitter:card','twitter:title','twitter:description','twitter:image'):
            if len(metas('name',key)) != 1:ERRORS.append(f'{path}: expected exactly one {key}')
        if len(metas('name','robots'))!=1:ERRORS.append(f'{path}: missing robots meta')
        if web.get('url') != expected_url or web.get('name')!=title:
            ERRORS.append(f'{path}: WebPage structured data does not match page title or canonical URL')
        if org.get('@id') != site_url+'#organization':ERRORS.append(f'{path}: inconsistent organisation schema ID')
        if not org.get('areaServed') or not service.get('areaServed'):
            ERRORS.append(f'{path}: missing local service coverage markup')
        if service.get('provider',{}).get('@id') != org.get('@id'):
            ERRORS.append(f'{path}: service provider is not connected to organisation')
        if service.get('availableChannel',{}).get('serviceUrl') != site_url+'contact.html':
            ERRORS.append(f'{path}: no valid online contact channel in service schema')
        if any('LocalBusiness' in str(v.get('@type','')) for v in graph):
            ERRORS.append(f'{path}: do not imply a physical LocalBusiness location')
        if 'ZC247571' in markup:ERRORS.append(f'{path}: old ICO registration claim')
        if path in ('404.html','thank-you.html'):
            if 'noindex' not in markup:ERRORS.append(f'{path}: utility page should remain noindex')
        else:
            if 'noindex' in markup:ERRORS.append(f'{path}: indexable page is marked noindex')
        if path.startswith('areas/'):
            target={'cardiff':'Cardiff','swansea':'Swansea','newport':'Newport','bridgend':'Bridgend','valleys':'Rhondda Cynon Taf'}[page.stem]
            if not any(target in v.get('name','') for v in service['areaServed']):
                ERRORS.append(f'{path}: location-specific service area missing {target}')
    # Sitemap URLs must match the real canonical, indexable set.
    root=ET.parse(ROOT/'sitemap.xml').getroot()
    sitemap_urls={v.text for v in root.iter() if v.tag.endswith('loc')}
    expected_sitemap={site_url if path=='index.html' else site_url+path for path in seo_pages if path not in ('404.html','thank-you.html')}
    if sitemap_urls!=expected_sitemap:
        ERRORS.append('Sitemap differs from the list of indexable canonical URLs')
except Exception as error:
    ERRORS.append(f'SEO schema validation failed: {error}')

if not (ROOT/'assets/brand/nwt-social-preview.jpg').exists():ERRORS.append('Missing landscape social share JPG')
if (ROOT/'CNAME').read_text(encoding='utf-8').strip()!='southwalestutoring.com':ERRORS.append('Incorrect custom domain')
print(f'Validated {len(pages)} HTML pages and {len(list(ROOT.rglob("*.json")))} JSON files.')
for e in ERRORS:print('ERROR:',e)
sys.exit(bool(ERRORS))
