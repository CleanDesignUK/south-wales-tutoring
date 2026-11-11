/* Shared navigation, footer, authentic parent-group reviews, cookies and WhatsApp. */
(() => {
  const BASE=document.querySelector('meta[name="site-base"]')?.content||'./';
  const link=p=>BASE+p;
  const file=location.pathname.split('/').pop()||'index.html';
  const icon=n=>`<i class="bi bi-${n}" aria-hidden="true"></i>`;
  const courses=[
    ['Core subjects',[['Maths','maths'],['Further Maths','further-maths'],['English Language','english-language'],['English Literature','english-literature'],['Biology','biology'],['Chemistry','chemistry'],['Physics','physics'],['Combined Science','combined-science']]],
    ['Languages & humanities',[['Welsh','welsh'],['French','french'],['Spanish','spanish'],['Chinese','chinese'],['History','history'],['Geography','geography'],['Religious Studies','religious-studies'],['Psychology','psychology'],['Sociology','sociology']]],
    ['More courses',[['Economics','economics'],['Business Studies','business'],['Computer Science','computer-science'],['Art & Design','art-design'],['Media & Film','media-film'],['Health & Social Care','health-social-care'],['Childcare','childcare'],['Child Development','child-development'],['Travel & Tourism','travel-tourism'],['Primary Maths & English','primary'],['Functional Skills','functional-skills'],['ESOL / EFL','esol'],['Music','music']]]
  ];
  const exams=[
    ['School examinations',[['SATs','sats'],['11+','11-plus'],['13+','13-plus'],['GCSE','gcse'],['IGCSE','igcse'],['AS-Level','as-level'],['A-Level','a-level'],['WJEC','wjec']]],
    ['Admissions & specialist',[['UCAT','ucat'],['TMUA','tmua'],['GMAT','gmat'],['IB','ib'],['AP','ap'],['University Maths','university-maths'],['Functional Skills','functional-skills']]]
  ];
  const menu=(groups,page,key)=>groups.map(([title,items])=>`<li class="menu-group"><span class="menu-heading">${title}</span><ul>${items.map(([label,anchor])=>`<li><a href="${link(page)}#${key}-${anchor}">${label}</a></li>`).join('')}</ul></li>`).join('');
  class SiteHeader extends HTMLElement{
    connectedCallback(){
      this.innerHTML=`<a class="skip-link" href="#main">Skip to content</a><header class="site-header">
      <div class="announcement"><div class="container">One-to-one online tutoring across South Wales · GCSE from £23/hr · A-Level from £28/hr</div></div>
      <nav class="container nav-main d-flex align-items-center justify-content-between gap-3" aria-label="Main navigation">
        <a class="brand-link" href="${link('index.html')}" aria-label="South Wales Tutoring home"><img src="${link('assets/brand/nwt-shield.png')}" alt="North Wales Tutoring Group crest" width="64" height="72"><span class="brand-words"><strong>South Wales</strong><small>Tutoring</small></span></a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="main-nav" aria-expanded="false"><span class="menu-glyph" aria-hidden="true">☰</span></button>
        <ul class="nav-links" id="main-nav">
          <li><a href="${link('index.html')}" ${file==='index.html'?'aria-current="page"':''}>Home</a></li>
          <li class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="courses-menu">Our Courses ${icon('chevron-down')}</button><ul class="nav-submenu nav-submenu--mega" id="courses-menu"><li class="menu-view-all"><a href="${link('subjects.html')}">View all courses</a></li>${menu(courses,'subjects.html','course')}</ul></li>
          <li class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="exams-menu">Exam Preparation ${icon('chevron-down')}</button><ul class="nav-submenu nav-submenu--mega nav-submenu--exam" id="exams-menu"><li class="menu-view-all"><a href="${link('exam-preparation.html')}">View exam preparation</a></li>${menu(exams,'exam-preparation.html','exam')}</ul></li>
          <li><a href="${link('our-tutors.html')}" ${file==='our-tutors.html'?'aria-current="page"':''}>Find a Tutor</a></li>
          <li><a href="${link('blog.html')}" ${file==='blog.html'?'aria-current="page"':''}>Blog</a></li>
          <li><a href="${link('about.html')}" ${file==='about.html'?'aria-current="page"':''}>About</a></li>
          <li><a class="btn-brand nav-book" href="${link('contact.html')}">Book a Lesson</a></li>
        </ul>
      </nav></header>`;
      const toggle=this.querySelector('.nav-toggle'),links=this.querySelector('.nav-links');
      const dropdowns=[...this.querySelectorAll('.nav-dropdown')];
      const closeDrop=(except)=>dropdowns.forEach(d=>{if(d===except)return;d.classList.remove('is-open');d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded','false')});
      const close=()=>{links.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');closeDrop()};
      toggle.addEventListener('click',()=>{const o=links.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(o));toggle.setAttribute('aria-label',o?'Close menu':'Open menu');if(!o)closeDrop()});
      dropdowns.forEach(d=>{const b=d.querySelector('button');b.addEventListener('click',()=>{const o=!d.classList.contains('is-open');closeDrop(d);d.classList.toggle('is-open',o);b.setAttribute('aria-expanded',String(o))})});
      links.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
      document.addEventListener('click',e=>{if(!this.contains(e.target))closeDrop()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }
  }
  class SiteFooter extends HTMLElement {
    connectedCallback(){
      this.innerHTML=`<footer class="site-footer"><div class="container"><div class="row g-4 g-lg-5">
      <div class="col-lg-5 col-md-6"><a class="footer-brand" href="${link('index.html')}"><img src="${link('assets/brand/nwt-shield-favicon.jpg')}" alt="North Wales Tutoring Group crest on white" width="88" height="88" loading="lazy"><span><strong>South Wales Tutoring</strong><small>Delivering a better future</small></span></a>
        <p class="footer-description"><strong>South Wales Tutoring</strong>, part of North Wales Tutoring Group, matches families in <strong>Cardiff, Swansea, Newport, Bridgend, Caerphilly, Pontypridd, Merthyr Tydfil, Llanelli, Neath, Port Talbot, Barry</strong> and throughout South Wales with experienced online tutors. One-to-one <strong>Maths, Physics, Chemistry, Biology, Combined Science, English, Further Maths and Economics tutoring</strong> for Primary, KS3, <strong>GCSE, AS and A-Level</strong> learners, plus <strong>11+, 13+, SATs, TMUA and UCAT</strong> preparation subject to tutor availability. We support <strong>WJEC, Eduqas, AQA, Edexcel, OCR and CAIE</strong> syllabuses, including Welsh-medium Maths where available.</p>
        <a class="parent-lockup" href="https://nwttutoring.com/" target="_blank" rel="noopener">Part of <strong>North Wales Tutoring Group</strong></a>
      </div><div class="col-6 col-md-3 col-lg-2"><h3>Our tutoring</h3><ul class="footer-links">
      <li><a href="${link('maths-tutoring-south-wales.html')}">Maths tutoring</a></li><li><a href="${link('physics-tutoring-south-wales.html')}">Physics tutoring</a></li><li><a href="${link('science-tutoring-south-wales.html')}">Science tutoring</a></li><li><a href="${link('english-tutoring-south-wales.html')}">English tutoring</a></li><li><a href="${link('gcse-tutoring-south-wales.html')}">GCSE tutoring</a></li><li><a href="${link('a-level-tutoring-south-wales.html')}">A-Level tutoring</a></li><li><a href="${link('wjec-tutoring-south-wales.html')}">WJEC tutoring</a></li><li><a href="${link('our-tutors.html')}">Find a tutor</a></li></ul></div>
      <div class="col-6 col-md-3 col-lg-2"><h3>Exam preparation</h3><ul class="footer-links"><li><a href="${link('primary-ks3-tutoring-south-wales.html')}">Primary &amp; KS3</a></li><li><a href="${link('exam-preparation.html')}#exam-11-plus">11+ &amp; 13+</a></li><li><a href="${link('exam-preparation.html')}#exam-sats">SATs preparation</a></li><li><a href="${link('exam-preparation.html')}#exam-tmua">TMUA preparation</a></li><li><a href="${link('exam-preparation.html')}#exam-ucat">UCAT preparation</a></li><li><a href="${link('locations.html')}">Areas we cover</a></li><li><a href="${link('areas/cardiff.html')}">Cardiff</a></li><li><a href="${link('areas/swansea.html')}">Swansea</a></li><li><a href="${link('areas/newport.html')}">Newport</a></li><li><a href="${link('areas/bridgend.html')}">Bridgend</a></li><li><a href="${link('areas/valleys.html')}">South Wales Valleys</a></li><li><a href="${link('blog.html')}">Study advice</a></li></ul></div>
      <div class="col-lg-3 col-md-6"><h3>Get in touch</h3><ul class="footer-links"><li><a class="footer-contact" href="mailto:southwales@nwttutoring.com">${icon('envelope')} southwales@nwttutoring.com</a></li><li><a class="footer-contact" href="https://wa.me/447480231362" target="_blank" rel="noopener"><img src="${link('assets/icons/whatsapp.svg')}" alt="" width="17" height="17" class="whatsapp-inline"> WhatsApp: +44 7480 231362</a></li><li><a href="${link('contact.html')}">Enquire about a lesson</a></li></ul><div class="footer-social"><a href="https://www.facebook.com/southwalestutoring/" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a><a href="https://www.instagram.com/southwalestutoring/" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a></div><p class="footer-follow">@southwalestutoring</p></div>
      </div><div class="footer-bottom"><div>© <span data-year></span> South Wales Tutoring. All rights reserved.<br>Part of <a href="https://nwttutoring.com/" target="_blank" rel="noopener">North Wales Tutoring Group</a> · Website designed with 💗 by <a href="https://cleandesignuk.com/" target="_blank" rel="noopener">Clean Design UK</a>.</div><div class="footer-legal"><a href="${link('safeguarding.html')}">Safeguarding</a><a href="${link('privacy-policy.html')}">Privacy</a><a href="${link('cookie-policy.html')}">Cookies</a><button type="button" data-cookie-preferences>Cookie settings</button></div></div></div></footer>
      <a href="https://wa.me/447480231362?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20South%20Wales%20Tutoring" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Message South Wales Tutoring on WhatsApp"><img src="${link('assets/icons/whatsapp.svg')}" alt="" width="22" height="22"><span>Chat on WhatsApp</span></a>`;
      this.querySelector('[data-year]').textContent=new Date().getFullYear();
      this.querySelector('[data-cookie-preferences]').addEventListener('click',()=>window.SWTshowCookiePreferences?.());
    }
  }
  class SiteTestimonials extends HTMLElement{
    connectedCallback(){
      this.innerHTML=`<section class="section-pad reviews-section" aria-labelledby="review-heading"><div class="container"><div class="section-head"><span class="eyebrow">Student &amp; parent feedback</span><h2 id="review-heading">Testimonials</h2></div><div class="row g-4">${REVIEWS.map(r=>`<div class="col-md-6 col-xl-4"><article class="review-card"><div class="review-highlight">${r.metric}</div><p class="review-topic">${r.topic}</p><blockquote class="review-quote">“${r.text}”</blockquote><div class="review-author">${r.author}</div></article></div>`).join('')}</div></div></section>`;
    }
  }
  const REVIEWS=[{"metric": "2 A*s + 2 As", "topic": "A-Level Results · University of Bath", "author": "Geverson · Parent", "text": "Everything’s very good here, thank you! My son got 2 A*s in Maths and Further Maths, and 2 As in Computer Science and Economics. And he got into Bath!! We’re absolutely delighted and very proud of him. Thank you so much for all your help and support along the way. It’s really appreciated and definitely helped him get to this point."}, {"metric": "A, A, B & A*", "topic": "A-Level Results · Liverpool Vet School", "author": "Janine · Parent", "text": "Great news! She had an A in Chemistry, A in Biology, B in French and A* in Welsh Baccalaureate, so she’s thrilled. She’s going to vet school at Liverpool University, her first choice. Many thanks to you and Emmanuel for all the support last academic year."}, {"metric": "A* Psychology", "topic": "A-Level Result", "author": "Nicole · Parent", "text": "She had an A* in Psychology 🎉"}, {"metric": "GCSE Maths 5 → 7", "topic": "Student Progress", "author": "Sarah · Parent", "text": "We can’t thank Jesse enough for his maths tuition. He tutored my daughter in the run up to her GCSEs and she went from a 5 to a 7 in a short space of time. Jesse’s ability to identify gaps and personalise the tuition allowed my daughter to reach her potential. Jesse was supportive and patient, and helped to build her confidence along the way. I would highly recommend to others."}, {"metric": "GCSE Maths", "topic": "Confidence & Progress", "author": "Kristina · Parent", "text": "Jesse is extremely organised and his approach to tutoring is solid, from a goal setting but more importantly a plan setting perspective. He is currently preparing my son for GCSE and greatly helped him understand complex maths concepts and overcome his confusion. Jesse’s clear explanation and patient guidance made a noticeable difference in my son’s confidence and performance. I truly appreciate Jesse’s dedication and teaching style. Highly recommended."}];
  class CookieConsent extends HTMLElement{
    connectedCallback(){
      this.innerHTML=`<section id="cookie-banner" class="cookie-banner" aria-label="Cookie preferences" aria-live="polite"><h2>We respect your privacy</h2><p>We use essential storage to remember your preference. Optional analytics are not enabled here. Read our <a href="${link('cookie-policy.html')}">cookie policy</a>.</p><div class="cookie-actions"><button type="button" class="cookie-accept" data-accept>Accept</button><button type="button" class="cookie-decline" data-decline>Decline</button></div></section>`;
      const b=this.querySelector('#cookie-banner'),key='swt-cookie-consent-v1',hide=()=>b.classList.remove('is-visible'),show=()=>b.classList.add('is-visible');
      const save=v=>{try{localStorage.setItem(key,v)}catch(e){}hide()};
      this.querySelector('[data-accept]').addEventListener('click',()=>save('accepted'));
      this.querySelector('[data-decline]').addEventListener('click',()=>save('declined'));
      window.SWTshowCookiePreferences=show;
      let prior=null;try{prior=localStorage.getItem(key)}catch(e){}
      if(!prior)requestAnimationFrame(()=>setTimeout(show,450));
    }
  }
  customElements.define('site-header',SiteHeader);
  customElements.define('site-footer',SiteFooter);
  customElements.define('site-testimonials',SiteTestimonials);
  customElements.define('cookie-consent',CookieConsent);
})();
