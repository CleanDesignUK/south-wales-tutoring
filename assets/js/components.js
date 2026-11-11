/* Shared navigation, footer, authentic parent-group reviews, cookies and WhatsApp. */
(() => {
  const BASE=document.querySelector('meta[name="site-base"]')?.content||'./';
  const link=p=>BASE+p;
  const file=location.pathname.split('/').pop()||'index.html';
  const icon=n=>`<i class="bi bi-${n}" aria-hidden="true"></i>`;
  const nav=[['index.html','Home'],['subjects.html','Subjects'],['locations.html','Areas'],['our-tutors.html','Find a tutor'],['blog.html','Blog'],['about.html','About']];
  class SiteHeader extends HTMLElement{
    connectedCallback(){
      this.innerHTML=`<a class="skip-link" href="#main">Skip to content</a><header class="site-header">
      <div class="announcement"><div class="container">Expert online tutoring across South Wales · GCSE from £23/hr · A-Level from £28/hr</div></div>
      <nav class="container nav-main d-flex align-items-center justify-content-between gap-3" aria-label="Main navigation">
        <a class="brand-link" href="${link('index.html')}" aria-label="South Wales Tutoring home"><img src="${link('assets/brand/nwt-shield.png')}" alt="North Wales Tutoring Group crest" width="64" height="72"><span class="brand-words"><strong>South Wales</strong><small>Tutoring</small></span></a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="main-nav" aria-expanded="false"><span class="menu-glyph" aria-hidden="true">☰</span></button>
        <ul class="nav-links" id="main-nav">${nav.slice(0,2).map(([p,t])=>`<li><a href="${link(p)}" ${file===p?'aria-current="page"':''}>${t}</a></li>`).join('')}
        <li class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="qualification-menu">GCSE &amp; A-Level ${icon('chevron-down')}</button><ul class="nav-submenu" id="qualification-menu"><li><a href="${link('gcse-tutoring-south-wales.html')}">GCSE tutoring</a></li><li><a href="${link('a-level-tutoring-south-wales.html')}">AS &amp; A-Level tutoring</a></li><li><a href="${link('wjec-tutoring-south-wales.html')}">WJEC exam preparation</a></li><li><a href="${link('primary-ks3-tutoring-south-wales.html')}">Primary &amp; KS3</a></li></ul></li>
        ${nav.slice(2).map(([p,t])=>`<li><a href="${link(p)}" ${file===p?'aria-current="page"':''}>${t}</a></li>`).join('')}
        <li><a class="btn-brand nav-book" href="${link('contact.html')}">Book a lesson</a></li></ul>
      </nav></header>`;
      const toggle=this.querySelector('.nav-toggle'),links=this.querySelector('.nav-links'),drop=this.querySelector('.nav-dropdown'),db=this.querySelector('.nav-dropdown-toggle');
      const closeDrop=()=>{drop.classList.remove('is-open');db.setAttribute('aria-expanded','false')};
      const close=()=>{links.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');closeDrop()};
      toggle.addEventListener('click',()=>{const o=links.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(o));toggle.setAttribute('aria-label',o?'Close menu':'Open menu')});
      db.addEventListener('click',()=>{const o=drop.classList.toggle('is-open');db.setAttribute('aria-expanded',String(o))});
      links.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
      document.addEventListener('click',e=>{if(!this.contains(e.target))closeDrop()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }
  }
  class SiteFooter extends HTMLElement {
    connectedCallback(){
      this.innerHTML=`<footer class="site-footer"><div class="container"><div class="row g-4 g-lg-5">
      <div class="col-lg-5 col-md-6"><a class="footer-brand" href="${link('index.html')}"><img src="${link('assets/brand/nwt-shield.png')}" alt="NWT Group crest" width="88" height="96" loading="lazy"><span><strong>South Wales Tutoring</strong><small>Delivering a better future</small></span></a>
        <p class="footer-description"><strong>South Wales Tutoring</strong>, part of North Wales Tutoring Group, matches families in <strong>Cardiff, Swansea, Newport, Bridgend, Caerphilly, Pontypridd, Merthyr Tydfil, Llanelli, Neath, Port Talbot, Barry</strong> and throughout South Wales with experienced online tutors. One-to-one <strong>Maths, Physics, Chemistry, Biology, Combined Science, English, Further Maths and Economics tutoring</strong> for Primary, KS3, <strong>GCSE, AS and A-Level</strong> learners, plus <strong>11+, 13+, SATs, TMUA and UCAT</strong> preparation subject to tutor availability. We support <strong>WJEC, Eduqas, AQA, Edexcel, OCR and CAIE</strong> syllabuses, including Welsh-medium Maths where available.</p>
        <a class="parent-lockup" href="https://nwttutoring.com/" target="_blank" rel="noopener">Part of <strong>North Wales Tutoring Group</strong></a>
      </div><div class="col-6 col-md-3 col-lg-2"><h3>Our tutoring</h3><ul class="footer-links">
      <li><a href="${link('maths-tutoring-south-wales.html')}">Maths tutoring</a></li><li><a href="${link('physics-tutoring-south-wales.html')}">Physics tutoring</a></li><li><a href="${link('science-tutoring-south-wales.html')}">Science tutoring</a></li><li><a href="${link('english-tutoring-south-wales.html')}">English tutoring</a></li><li><a href="${link('gcse-tutoring-south-wales.html')}">GCSE tutoring</a></li><li><a href="${link('a-level-tutoring-south-wales.html')}">A-Level tutoring</a></li><li><a href="${link('wjec-tutoring-south-wales.html')}">WJEC tutoring</a></li><li><a href="${link('our-tutors.html')}">Find a tutor</a></li></ul></div>
      <div class="col-6 col-md-3 col-lg-2"><h3>Exam preparation</h3><ul class="footer-links"><li><a href="${link('primary-ks3-tutoring-south-wales.html')}">Primary &amp; KS3</a></li><li><a href="${link('subjects.html')}">11+ &amp; 13+</a></li><li><a href="${link('subjects.html')}">SATs preparation</a></li><li><a href="${link('subjects.html')}">TMUA preparation</a></li><li><a href="${link('subjects.html')}">UCAT preparation</a></li><li><a href="${link('locations.html')}">Areas we cover</a></li><li><a href="${link('blog.html')}">Study advice</a></li></ul></div>
      <div class="col-lg-3 col-md-6"><h3>Get in touch</h3><ul class="footer-links"><li><a class="footer-contact" href="mailto:southwales@nwttutoring.com">${icon('envelope')} southwales@nwttutoring.com</a></li><li><a class="footer-contact" href="https://wa.me/447480231362" target="_blank" rel="noopener"><img src="${link('assets/icons/whatsapp.svg')}" alt="" width="17" height="17" class="whatsapp-inline"> WhatsApp: +44 7480 231362</a></li><li><a href="${link('contact.html')}">Enquire about a lesson</a></li></ul><div class="footer-social"><a href="https://www.facebook.com/southwalestutoring/" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a><a href="https://www.instagram.com/southwalestutoring/" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a></div><p class="footer-follow">@southwalestutoring</p><p class="small-note text-light">Online tutoring with no walk-in office or direct phone calls. Please send a WhatsApp message or enquiry.</p></div>
      </div><div class="footer-bottom"><div>© <span data-year></span> South Wales Tutoring. All rights reserved.<br>Part of <a href="https://nwttutoring.com/" target="_blank" rel="noopener">North Wales Tutoring Group</a> · Website designed with 💗 by <a href="https://cleandesignuk.com/" target="_blank" rel="noopener">Clean Design UK</a>.</div><div class="footer-legal"><a href="${link('privacy-policy.html')}">Privacy</a><a href="${link('cookie-policy.html')}">Cookies</a><button type="button" data-cookie-preferences>Cookie settings</button></div></div></div></footer>
      <a href="https://wa.me/447480231362?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20South%20Wales%20Tutoring" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Message South Wales Tutoring on WhatsApp"><img src="${link('assets/icons/whatsapp.svg')}" alt="" width="22" height="22"><span>Chat on WhatsApp</span></a>`;
      this.querySelector('[data-year]').textContent=new Date().getFullYear();
      this.querySelector('[data-cookie-preferences]').addEventListener('click',()=>window.SWTshowCookiePreferences?.());
    }
  }
  class SiteTestimonials extends HTMLElement{
    connectedCallback(){
      this.innerHTML=`<section class="section-pad reviews-section" aria-labelledby="review-heading"><div class="container"><div class="section-head"><span class="eyebrow">North Wales Tutoring Group reviews</span><h2 id="review-heading">Feedback from students and parents across our tutoring group</h2><p>Real outcomes and feedback from families supported by our wider group. Reviews relate to North Wales Tutoring Group, not necessarily the South Wales branch.</p></div><div class="row g-3">${REVIEWS.map(r=>`<div class="col-md-6 col-xl-3"><article class="review-card"><div class="review-highlight">${r.metric}</div><p class="review-topic">${r.topic}</p><p>${r.text}</p><div class="review-author">${r.author}</div></article></div>`).join('')}</div><p class="review-source">Find the original reviews on <a href="https://northwalestutoring.com/" target="_blank" rel="noopener">North Wales Tutoring</a> or <a href="https://g.co/kgs/ws3Yd5u" target="_blank" rel="noopener">Google Reviews</a>.</p></div></section>`;
    }
  }
  const REVIEWS=[{"metric": "2 A*s and 2 As", "topic": "A-Level results", "author": "Geverson, parent", "text": "Parent reported two A* grades in Maths and Further Maths, two A grades in Computer Science and Economics, and a place at Bath."}, {"metric": "5 → 7", "topic": "GCSE Maths progress", "author": "Sarah, parent", "text": "A parent described a GCSE Maths improvement from grade 5 to grade 7 following tailored tutoring and confidence building."}, {"metric": "U → C", "topic": "WJEC A-Level Economics", "author": "Ethan, student", "text": "Student reported improving from U to C in Economics, alongside E to D in Maths, after focused one-to-one sessions."}, {"metric": "First-choice veterinary school", "topic": "A-Level science results", "author": "Janine, parent", "text": "A parent reported A grades in Chemistry and Biology, alongside an offer for Liverpool veterinary school."}];
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
