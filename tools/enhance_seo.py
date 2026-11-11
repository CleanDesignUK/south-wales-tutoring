#!/usr/bin/env python3
"""Build unique static metadata and factual online service-area JSON-LD for South Wales Tutoring.

Run from repository root: python tools/enhance_seo.py
Page copy stays unchanged. No fake premises, ratings, staff claims or availability.
"""
from __future__ import annotations

from pathlib import Path
from urllib.parse import urljoin
import json, re, html
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'site-config.json').read_text())
BASE = CONFIG['siteUrl'].rstrip('/') + '/'
ORG = BASE + '#organization'
WEBSITE = BASE + '#website'
SOCIAL = [CONFIG['facebook'],CONFIG['instagram']]
W= 'South Wales'
PLACE_NAMES = ['Cardiff','Swansea','Newport','Bridgend','Vale of Glamorgan','Rhondda Cynon Taf','Caerphilly','Merthyr Tydfil','Neath Port Talbot','Torfaen','Blaenau Gwent','Monmouthshire','Carmarthenshire']
NEARBY = {
    'areas/cardiff.html':['Cardiff','Roath','Llandaff','Whitchurch','Penarth'],
    'areas/swansea.html':['Swansea','Mumbles','Sketty','Uplands','Gower'],
    'areas/newport.html':['Newport','Caerleon','Rogerstone','Bettws','Risca'],
    'areas/bridgend.html':['Bridgend','Porthcawl','Maesteg','Pencoed'],
    'areas/valleys.html':['Rhondda Cynon Taf','Pontypridd','Aberdare','Merthyr Tydfil','Caerphilly','Ebbw Vale']
}

# All page titles and descriptions are reviewed by hand for page intent; no doorway templates.
PAGES = {
'index.html':{'title':'South Wales Tutoring | Online GCSE, Maths & A-Level Tutors','description':'Book one-to-one online tutoring across Cardiff, Swansea, Newport and South Wales. GCSE Maths, Physics, Science and English from £23/hr. WJEC and UK exam boards.','service':'Online GCSE, AS and A-Level tutoring'},
'maths-tutoring-south-wales.html':{'title':'Maths Tutors South Wales | WJEC GCSE & A-Level Online','description':'Online Maths tutoring across South Wales for WJEC GCSE Maths and Numeracy, A-Level Maths, algebra and exam practice. Personalised lessons from £23/hr.','service':'Online Maths tutoring for GCSE, Numeracy and A-Level','image':'assets/images/maths-study.webp'},
'physics-tutoring-south-wales.html':{'title':'Physics Tutors South Wales | WJEC GCSE & A-Level','description':'One-to-one online Physics tutors for Cardiff, Swansea, Newport and South Wales. WJEC GCSE and A-Level Physics, equations, electricity and exam revision.','service':'Online GCSE and A-Level Physics tutoring','image':'assets/images/physics-study.webp'},
'science-tutoring-south-wales.html':{'title':'Science Tutors South Wales | Biology, Chemistry & Physics','description':'Online GCSE Science tutors covering WJEC Biology, Chemistry, Physics and Combined Science. A-Level subject support for students across South Wales.','service':'Online Biology, Chemistry, Physics and Combined Science tutoring','image':'assets/images/learning-at-home.webp'},
'english-tutoring-south-wales.html':{'title':'English Tutors South Wales | GCSE, WJEC & A-Level','description':'Online English tutoring in South Wales for WJEC GCSE English Language, Literature, reading, essays and A-Level English. One-to-one help from UK tutors.','service':'Online GCSE and A-Level English tutoring'},
'gcse-tutoring-south-wales.html':{'title':'GCSE Tutors South Wales | WJEC Maths, Science & English','description':'Find online GCSE tutors in South Wales for Year 10, Year 11 and resits. WJEC Maths, Physics, Chemistry, Biology and English. Lessons from £23/hr.','service':'Online GCSE exam preparation and subject tutoring','image':'assets/images/gcse-revision.webp'},
'a-level-tutoring-south-wales.html':{'title':'A-Level Tutors South Wales | Maths, Physics & Chemistry','description':'One-to-one AS and A-Level tutoring online for South Wales students. Maths, Physics, Chemistry, Biology and English across WJEC, AQA, OCR and Edexcel. From £28/hr.','service':'Online AS and A-Level subject tutoring'},
'primary-ks3-tutoring-south-wales.html':{'title':'Primary & KS3 Tutors South Wales | Maths, English & Science','description':'Online Primary and Key Stage 3 tutoring across South Wales in Maths, English and Science. Build skills and confidence before GCSE with personalised lessons.','service':'Online Primary and Key Stage 3 tutoring'},
'wjec-tutoring-south-wales.html':{'title':'WJEC Tutors South Wales | GCSE Maths, Physics & Science','description':'Specialist online WJEC tutoring in South Wales for GCSE Maths, Numeracy, Biology, Chemistry, Physics, English and AS/A-Level exams. Check your specification.','service':'Online WJEC GCSE, AS and A-Level tuition'},
'about.html':{'title':'About South Wales Tutoring | Online Tuition & Our Approach','description':'Learn how South Wales Tutoring matches families with online tutors for GCSE, A-Level, Maths, Science and English across Cardiff, Swansea and South Wales.','service':'Online tutoring and tutor matching','image':'assets/images/about-personalised-learning.webp','type':'AboutPage'},
'subjects.html':{'title':'Our Courses | Maths, Science & Languages in South Wales','description':'Explore online tutoring courses in South Wales, from Maths, Physics, Chemistry and English to Welsh, French, Chinese and more. GCSE and A-Level support.','service':'Online subject tutoring across Maths, sciences, English and languages','type':'CollectionPage'},
'our-tutors.html':{'title':'Find an Online Tutor in South Wales | GCSE & A-Level','description':'Browse 37 online tutors offering Maths, Physics, Biology, Chemistry, English and other subjects in South Wales. See individual rates and enquire directly.','service':'Online tutor matching and one-to-one tutoring','type':'CollectionPage'},
'locations.html':{'title':'Online Tutors in Cardiff, Swansea, Newport & South Wales','description':'One-to-one online tutoring for Cardiff, Swansea, Newport, Bridgend, the Valleys and wider South Wales. Explore local coverage for GCSE and A-Level lessons.','service':'Online tutoring for families across South Wales','type':'CollectionPage'},
'areas/cardiff.html':{'title':'Cardiff Tutors Online | WJEC GCSE Maths, Science & A-Level','description':'Online GCSE and A-Level tutors for Cardiff, Roath, Llandaff, Whitchurch and Penarth. WJEC Maths, Physics, Science and English. Enquire about lessons.','service':'Online GCSE and A-Level tutoring for Cardiff'},
'areas/swansea.html':{'title':'Swansea Tutors Online | WJEC GCSE Maths & A-Level','description':'Find online GCSE Maths, Physics, Science, English and A-Level tutors in Swansea, Mumbles, Sketty, Uplands and Gower. WJEC-focused one-to-one lessons.','service':'Online GCSE and A-Level tutoring for Swansea'},
'areas/newport.html':{'title':'Newport Tutors Online | GCSE Maths, Physics & A-Level','description':'Online tutors for Newport, Caerleon and Rogerstone. Personalised WJEC GCSE Maths, Science, English and A-Level Physics, Chemistry and Biology support.','service':'Online GCSE and A-Level tutoring for Newport'},
'areas/bridgend.html':{'title':'Bridgend Tutors Online | WJEC GCSE & A-Level Support','description':'One-to-one online tutoring for Bridgend, Porthcawl, Maesteg and Pencoed. GCSE Maths, Physics, Science, English and AS/A-Level lessons for WJEC students.','service':'Online GCSE and A-Level tutoring for Bridgend'},
'areas/valleys.html':{'title':'South Wales Valleys Tutors | RCT, Caerphilly & Merthyr','description':'Online GCSE and A-Level tuition for Pontypridd, RCT, Caerphilly, Merthyr Tydfil and Ebbw Vale. WJEC Maths, Physics, Science and English support.','service':'Online GCSE and A-Level tutoring for the South Wales Valleys'},
'contact.html':{'title':'Book an Online Tutor | Contact South Wales Tutoring','description':'Ask about online GCSE Maths, Physics, Science, English and A-Level tutors across South Wales. Message us on WhatsApp or send an enquiry for tutor matching.','service':'Online tutoring enquiries and tutor matching','type':'ContactPage'},
'blog.html':{'title':'GCSE & A-Level Revision Advice | South Wales Tutoring Blog','description':'Read practical WJEC GCSE Maths, Physics and exam revision guides for South Wales families, plus advice on choosing online tutors in Cardiff and Swansea.','service':'Online exam preparation tutoring','type':'Blog'},
'blog/wjec-gcse-maths-numeracy-double-award-guide.html':{'title':'WJEC GCSE Maths & Numeracy Double Award | Parent Guide','description':'Understand the WJEC GCSE Mathematics and Numeracy Double Award, what to check on your child’s course and how to plan effective revision and online support.','service':'Online WJEC GCSE Maths and Numeracy tutoring','type':'BlogPosting','image':'assets/images/maths-study.webp'},
'blog/why-gcse-physics-equations-feel-hard.html':{'title':'GCSE Physics Equations Explained | Revision Advice','description':'Struggling with GCSE Physics equations? Learn how units, rearranging formulas and worked examples can improve understanding before WJEC and UK science exams.','service':'Online GCSE Physics tutoring','type':'BlogPosting','image':'assets/images/physics-study.webp'},
'blog/choosing-online-tutor-cardiff-swansea-newport.html':{'title':'Choosing an Online Tutor in Cardiff, Swansea or Newport','description':'How to choose an online GCSE or A-Level tutor in South Wales. Compare subject expertise, WJEC exam-board fit, lesson format and communication before booking.','service':'Online tutor matching for South Wales','type':'BlogPosting'},
'blog/gcse-mock-revision-plan-south-wales.html':{'title':'GCSE Mock Revision Plan | WJEC Exam Preparation Advice','description':'Use mock exam feedback to build a practical revision plan for WJEC GCSE Maths, Science and other subjects. Focus on gaps, practice and realistic routines.','service':'Online WJEC GCSE revision and mock preparation','type':'BlogPosting','image':'assets/images/gcse-revision.webp'},
'exam-preparation.html':{'title':'Exam Preparation South Wales | SATs, 11+, GCSE & UCAT','description':'Online exam preparation for SATs, 11+, 13+, GCSE, AS, A-Level, UCAT and TMUA across South Wales. Ask us about suitable tutors and subject availability.','service':'Online SATs, 11+, 13+, GCSE, A-Level, UCAT and TMUA preparation'},
'safeguarding.html':{'title':'Safeguarding & Child Protection | South Wales Tutoring','description':'Read our safeguarding and child protection policy for online tuition. Contact designated safeguarding lead Jesse or report concerns via our secure enquiry form.','service':'Online tutoring with safeguarding procedures','type':'WebPage'},
'privacy-policy.html':{'title':'Privacy Policy | South Wales Tutoring','description':'Learn how South Wales Tutoring handles personal information from tutoring and safeguarding enquiries, and your rights under UK data protection law.','service':'Online tutoring and enquiries','type':'WebPage'},
'cookie-policy.html':{'title':'Cookie Policy | South Wales Tutoring','description':'Find out how South Wales Tutoring uses essential storage, third-party resources and cookie choices on its website, and how you can change preferences.','service':'Online tutoring and enquiries','type':'WebPage'},
'404.html':{'title':'Page Not Found | South Wales Tutoring','description':'This page could not be found. Explore our online Maths, Physics, Science, English and GCSE or A-Level tutoring across South Wales.','service':'Online tutoring for South Wales','noindex':True},
 'thank-you.html':{'title':'Enquiry Confirmation | South Wales Tutoring','description':'Thank you for contacting South Wales Tutoring. Our team will review your tutoring enquiry and reply about suitable online lesson options.','service':'Online tutoring enquiries for South Wales','noindex':True}
}


def service_places(path):
    names=NEARBY.get(path)
    if names:
        # This describes where the ONLINE service is offered, not where offices are.
        return [{'@type':'Place','name':name+', Wales, United Kingdom' if name not in ['Gower','Rhondda Cynon Taf'] else name+', South Wales, United Kingdom', 'containedInPlace':{'@type':'AdministrativeArea','name':'Wales, United Kingdom'}} for name in names]
    return [{'@type':'AdministrativeArea','name':'South Wales, United Kingdom'}, *({'@type':'Place','name':x+', Wales, United Kingdom'} for x in PLACE_NAMES)]


def create_seo(path,meta,oldgraph):
    url=BASE if path=='index.html' else urljoin(BASE,path)
    img=urljoin(BASE,meta.get('image','assets/brand/nwt-shield-favicon.jpg'))
    organization={
        '@type':'EducationalOrganization','@id':ORG,'name':'South Wales Tutoring',
        'url':BASE, 'logo':{'@type':'ImageObject','url':urljoin(BASE,'assets/brand/nwt-shield.png')},
        'image':urljoin(BASE,'assets/brand/nwt-shield-favicon.jpg'),
        'description':'One-to-one online GCSE, AS-Level, A-Level, Primary and KS3 tutoring across South Wales. Subjects include Maths, Physics, Chemistry, Biology, English and languages, with WJEC and other UK exam board support.',
        'slogan':'Delivering a better future',
        'email':CONFIG['email'],
        'areaServed':service_places('index.html'),
        'sameAs':SOCIAL,
        'parentOrganization':{'@type':'Organization','name':'North Wales Tutoring Group','url':'https://nwttutoring.com/'},
        'contactPoint':{'@type':'ContactPoint','contactType':'tutoring enquiries','email':CONFIG['email'],'url':CONFIG['whatsapp'],'availableLanguage':['en-GB']},
        'knowsAbout':['WJEC GCSE Mathematics and Numeracy','GCSE Physics','GCSE Chemistry','GCSE Biology','GCSE English','A-Level Maths','A-Level Physics','11+ preparation','UCAT','TMUA']
    }
    website={'@type':'WebSite','@id':WEBSITE,'url':BASE,'name':'South Wales Tutoring','inLanguage':'en-GB','publisher':{'@id':ORG}}
    old={x.get('@type'):x for x in oldgraph if isinstance(x.get('@type'),str)}
    kind=meta.get('type','WebPage')
    page={
        '@type': 'WebPage' if kind=='BlogPosting' else kind,
        '@id':url+'#webpage','url':url,'name':meta['title'],'description':meta['description'],
        'isPartOf':{'@id':WEBSITE}, 'about':{'@id':ORG},'publisher':{'@id':ORG},
        'inLanguage':'en-GB', 'spatialCoverage':service_places(path),
        'image':img
    }
    if meta.get('noindex'):page['potentialAction']={'@type':'ReadAction','target':url}
    else: page['potentialAction']={'@type':'CommunicateAction','target':urljoin(BASE,'contact.html')}
    service_id = url+'#service'
    serve={
        '@type':'Service','@id':service_id,
        'name':meta['service']+(' in '+NEARBY[path][0] if path in NEARBY else ' across South Wales'),
        'description':meta['description'] if kind not in ('BlogPosting','WebPage') else 'One-to-one online GCSE, AS-Level, A-Level and exam preparation tutoring for students across South Wales.',
        'serviceType':meta['service'],
        'provider':{'@id':ORG},'areaServed':service_places(path),
        'availableChannel':{'@type':'ServiceChannel','serviceUrl':urljoin(BASE,'contact.html'),'availableLanguage':['en-GB']},
        'audience':{'@type':'EducationalAudience','educationalRole':'student'}
    }
    if kind not in ('BlogPosting','WebPage','Blog') and path not in ['contact.html','about.html','our-tutors.html']:
        serve['hasOfferCatalog']={
            '@type':'OfferCatalog','name':'Online tutoring lesson options',
            'itemListElement':[
                {'@type':'OfferCatalog','name':'GCSE subject tuition','itemListElement':[{'@type':'Offer','name':'GCSE one-to-one tutoring (starting rate)','priceCurrency':'GBP','price':'23','priceSpecification':{'@type':'UnitPriceSpecification','price':23,'priceCurrency':'GBP','unitCode':'HUR'},'url':urljoin(BASE,'contact.html')}]},
                {'@type':'OfferCatalog','name':'AS and A-Level subject tuition','itemListElement':[{'@type':'Offer','name':'A-Level one-to-one tutoring (starting rate)','priceCurrency':'GBP','price':'28','priceSpecification':{'@type':'UnitPriceSpecification','price':28,'priceCurrency':'GBP','unitCode':'HUR'},'url':urljoin(BASE,'contact.html')}]}
            ]
        }
    if kind not in ('BlogPosting','WebPage','Blog') and path not in ['about.html']:
        page['mainEntity']={'@id':service_id}
    if kind=='BlogPosting':
        article=old.get('BlogPosting',{}).copy()
        article.update({'@type':'BlogPosting','@id':url+'#article','headline':meta['title'],'description':meta['description'],'image':img,'isPartOf':{'@id':WEBSITE},'mainEntityOfPage':{'@id':page['@id']},'publisher':{'@id':ORG},'spatialCoverage':service_places(path)})
        page['mainEntity']={'@id':article['@id']}
    else: article=None
    graph=[organization,website,page]
    if old.get('BreadcrumbList'):graph.append(old['BreadcrumbList'])
    if old.get('FAQPage'):graph.append(old['FAQPage'])
    graph.append(serve)
    if article:graph.append(article)
    return {'@context':'https://schema.org','@graph':graph},url,img


def set_meta(soup,match_key,match_value,content):
    for tag in soup.find_all('meta',attrs={match_key:match_value}):tag.decompose()
    tag=soup.new_tag('meta',attrs={match_key:match_value,'content':content})
    soup.head.append(tag)


def apply(path,meta):
    file=ROOT/path
    source=file.read_text(encoding='utf-8')
    match=re.search(r'<head\b[^>]*>[\s\S]*?</head>',source,re.I)
    if not match:raise ValueError('No HTML head: '+path)
    head=BeautifulSoup(match.group(0),'html.parser')
    tag=head.find('script',attrs={'type':'application/ld+json'})
    if not tag:raise ValueError('Missing schema: '+path)
    old=json.loads(tag.string)
    graph,url,img=create_seo(path,meta,old.get('@graph',[]))
    tag.string=json.dumps(graph,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    head.title.string=meta['title']
    for old_meta in head.find_all('meta'):
        if old_meta.get('name') in ('description','robots','twitter:card','twitter:title','twitter:description','twitter:image','geo.region','geo.placename','author','theme-color') or old_meta.get('property') in ('og:type','og:site_name','og:locale','og:title','og:description','og:url','og:image','og:image:alt','article:published_time','article:modified_time'):
            old_meta.decompose()
    for link in head.find_all('link'):
        if 'canonical' in (link.get('rel') or []) or 'alternate' in (link.get('rel') or []):link.decompose()
    set_meta(head,'name','description',meta['description'])
    set_meta(head,'name','robots','noindex,follow' if meta.get('noindex') else 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
    set_meta(head,'name','theme-color','#070769')
    set_meta(head,'name','geo.region','GB-WLS')
    if path in NEARBY:place=NEARBY[path][0]
    else:place='South Wales'
    set_meta(head,'name','geo.placename',place)
    add=lambda name,attrs:head.head.append(head.new_tag(name,attrs=attrs))
    add('link',{'rel':'canonical','href':url})
    add('link',{'rel':'alternate','hreflang':'en-GB','href':url})
    social={'og:type':'article' if meta.get('type')=='BlogPosting' else 'website','og:site_name':'South Wales Tutoring','og:locale':'en_GB','og:title':meta['title'],'og:description':meta['description'],'og:url':url,'og:image':img,'og:image:alt':'South Wales Tutoring online tuition and revision'}
    for k,v in social.items():set_meta(head,'property',k,v)
    for k,v in {'twitter:card':'summary_large_image','twitter:title':meta['title'],'twitter:description':meta['description'],'twitter:image':img}.items():set_meta(head,'name',k,v)
    if meta.get('type')=='BlogPosting':
        original=next((x for x in old.get('@graph',[]) if x.get('@type')=='BlogPosting'),{})
        for k,property_name in [('datePublished','article:published_time'),('dateModified','article:modified_time')]:
            if original.get(k):set_meta(head,'property',property_name,original[k])
    updated=source[:match.start()]+head.head.decode(formatter='minimal')+source[match.end():]
    file.write_text(updated,encoding='utf-8')


def main():
    existing={str(p.relative_to(ROOT)) for p in ROOT.rglob('*.html')}
    assert existing==set(PAGES),(sorted(existing-set(PAGES)),sorted(set(PAGES)-existing))
    assert len(set(d['title'] for d in PAGES.values()))==len(PAGES)
    assert len(set(d['description'] for d in PAGES.values()))==len(PAGES)
    for path,meta in PAGES.items():
        if not (70<=len(meta['description'])<=190):print('Description length warning',path,len(meta['description']))
        apply(path,meta)
    with (ROOT/'data'/'seo-pages.json').open('w',encoding='utf-8') as f:json.dump(PAGES,f,indent=2,ensure_ascii=False);f.write('\n')
    print(f'Enhanced {len(PAGES)} HTML pages with unique metadata, UK service-area organization and page-specific services')

if __name__=='__main__':main()
