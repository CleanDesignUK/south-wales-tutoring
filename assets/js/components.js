/* Shared light-DOM Web Components. All pages use one header, footer and consent UI.
   No JavaScript templating of page body: core page content stays in crawlable HTML. */
(() => {
  const BASE = document.querySelector('meta[name="site-base"]')?.content || './';
  const link = path => BASE + path;
  const current = location.pathname.split('/').pop() || 'index.html';
  const navItems = [
    ['index.html','Home'],['subjects.html','Subjects'],['gcse-tutoring-south-wales.html','GCSE'],
    ['a-level-tutoring-south-wales.html','A-Level'],['locations.html','Areas'],
    ['our-tutors.html','Our tutors'],['blog.html','Blog'],['about.html','About']
  ];
  const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
  class SiteHeader extends HTMLElement {
    connectedCallback(){
      this.innerHTML = `<a class="skip-link" href="#main">Skip to main content</a>
        <header class="site-header">
          <div class="announcement"><div class="container">WJEC, GCSE &amp; A-Level tutors online across South Wales &nbsp;·&nbsp; Lessons from £20/hour</div></div>
          <nav class="container nav-main d-flex align-items-center justify-content-between gap-3" aria-label="Main navigation">
            <a class="brand-link" href="${link('index.html')}" aria-label="South Wales Tutoring homepage"><img src="${link('assets/brand/swt-logo.svg')}" alt="South Wales Tutoring" width="244" height="54"></a>
            <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">${icon('list')}</button>
            <ul class="nav-links" id="main-nav">${navItems.map(([href,label])=>`<li><a href="${link(href)}" ${current===href?'aria-current="page"':''}>${label}</a></li>`).join('')}<li><a class="btn-brand" href="${link('contact.html')}">Book a lesson ${icon('arrow-up-right')}</a></li></ul>
          </nav>
        </header>`;
      const b=this.querySelector('.nav-toggle'), n=this.querySelector('#main-nav');
      const close=()=>{n.classList.remove('is-open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open navigation');};
      b.addEventListener('click',()=>{const open=n.classList.toggle('is-open');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
      n.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
      document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }
  }
  class SiteFooter extends HTMLElement {
    connectedCallback(){
      this.innerHTML=`<footer class="site-footer">
        <div class="container"><div class="row g-4 g-xl-5">
          <div class="col-lg-5 col-md-6"><a href="${link('index.html')}" aria-label="South Wales Tutoring home"><img class="footer-logo" src="${link('assets/brand/swt-logo-light.svg')}" alt="South Wales Tutoring logo" width="260" height="58" loading="lazy"></a>
            <p class="footer-description"><strong>South Wales Tutoring</strong> provides personalised one-to-one <strong>online Maths, Physics, Chemistry, Biology, English and Science tutoring</strong> for Primary, KS3, <strong>WJEC GCSE, GCSE resits, AS and A-Level</strong> students across <strong>Cardiff, Swansea, Newport, Bridgend, Caerphilly, the Vale of Glamorgan, Rhondda Cynon Taf, Neath Port Talbot, Merthyr Tydfil, Torfaen</strong> and wider South Wales. Support for <strong>WJEC, Eduqas, AQA, Edexcel, OCR and CAIE</strong> exam boards. Part of the North Wales Tutoring Group. <strong>Delivering a better future.</strong></p>
            <a class="parent-lockup" href="https://nwttutoring.com/" target="_blank" rel="noopener"><img src="${link('assets/images/nwt-group-logo.png')}" loading="lazy" alt="North Wales Tutoring Group badge"> <span>Part of <strong>North Wales Tutoring Group</strong> ${icon('arrow-up-right')}</span></a>
          </div>
          <div class="col-6 col-md-3 col-lg-2"><h3>Explore</h3><ul class="footer-links"><li><a href="${link('subjects.html')}">Subjects</a></li><li><a href="${link('maths-tutoring-south-wales.html')}">Maths tutoring</a></li><li><a href="${link('physics-tutoring-south-wales.html')}">Physics tutoring</a></li><li><a href="${link('science-tutoring-south-wales.html')}">Science tutoring</a></li><li><a href="${link('gcse-tutoring-south-wales.html')}">GCSE tutoring</a></li><li><a href="${link('a-level-tutoring-south-wales.html')}">A-Level tutoring</a></li><li><a href="${link('wjec-tutoring-south-wales.html')}">WJEC tutors</a></li><li><a href="${link('our-tutors.html')}">Meet tutors</a></li></ul></div>
          <div class="col-6 col-md-3 col-lg-2"><h3>South Wales</h3><ul class="footer-links"><li><a href="${link('areas/cardiff.html')}">Cardiff</a></li><li><a href="${link('areas/swansea.html')}">Swansea</a></li><li><a href="${link('areas/newport.html')}">Newport</a></li><li><a href="${link('areas/bridgend.html')}">Bridgend</a></li><li><a href="${link('areas/valleys.html')}">The Valleys</a></li><li><a href="${link('locations.html')}">All covered areas</a></li><li><a href="${link('blog.html')}">Study guides</a></li><li><a href="${link('about.html')}">About us</a></li></ul></div>
          <div class="col-lg-3 col-md-6"><h3>Enquire and book</h3><ul class="footer-links"><li><a class="footer-contact" href="mailto:southwales@nwttutoring.com">${icon('envelope')} southwales@nwttutoring.com</a></li><li><a class="footer-contact" href="tel:+447480231362">${icon('telephone')} +44 7480 231362</a></li><li><a href="${link('contact.html')}">Ask about availability</a></li><li><a href="https://wa.me/447480231362" target="_blank" rel="noopener">Message on WhatsApp</a></li></ul>
          <div class="footer-social"><a href="https://www.facebook.com/southwalestutoring/" aria-label="South Wales Tutoring on Facebook" target="_blank" rel="noopener">${icon('facebook')}</a><a href="https://www.instagram.com/southwalestutoring/" aria-label="South Wales Tutoring on Instagram" target="_blank" rel="noopener">${icon('instagram')}</a></div><p style="font-size:.78rem;margin-top:-6px"><a href="https://www.instagram.com/southwalestutoring/" target="_blank" rel="noopener" style="color:#fdb4df">@southwalestutoring</a></p>
          <p style="font-size:.8rem;color:#c8c9e6">Online-only tutoring. Learn from home, anywhere in South Wales.</p></div>
        </div><div class="footer-bottom"><div>© <span data-year></span> South Wales Tutoring. All rights reserved.<br><span>Part of <a href="https://nwttutoring.com/" target="_blank" rel="noopener">North Wales Tutoring Group</a> · Website designed with <span class="footer-love" aria-label="love">💗</span> by <a href="https://cleandesignuk.com/" target="_blank" rel="noopener">Clean Design UK</a>.</span></div><div class="footer-legal"><a href="${link('privacy-policy.html')}">Privacy</a><a href="${link('cookie-policy.html')}">Cookies</a><button type="button" data-cookie-preferences>Cookie settings</button></div></div></div>
      </footer><div class="mobile-lead-bar" aria-label="Quick booking links"><a class="btn-outline-brand" href="https://wa.me/447480231362" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a><a class="btn-brand" href="${link('contact.html')}">${icon('calendar2-check')} Book a lesson</a></div>`;
      this.querySelector('[data-year]').textContent=new Date().getFullYear();
      this.querySelector('[data-cookie-preferences]').addEventListener('click',()=>window.SWTshowCookiePreferences?.());
    }
  }
  class CookieConsent extends HTMLElement {
    connectedCallback(){
      this.innerHTML=`<section id="cookie-banner" class="cookie-banner" aria-label="Cookie preferences" aria-live="polite"><h2>We respect your privacy</h2><p>We use essential storage to remember your choice. Optional analytics are not enabled on this website. Read our <a href="${link('cookie-policy.html')}">cookie policy</a>.</p><div class="cookie-actions"><button class="cookie-accept" type="button" data-cookie-accept>Accept</button><button class="cookie-decline" type="button" data-cookie-decline>Decline</button></div></section>`;
      const el=this.querySelector('#cookie-banner'), KEY='swt-cookie-consent-v1';
      const hide=()=>el.classList.remove('is-visible'), show=()=>el.classList.add('is-visible');
      const save=v=>{try{localStorage.setItem(KEY,v)}catch(e){}hide()};
      this.querySelector('[data-cookie-accept]').addEventListener('click',()=>save('accepted'));
      this.querySelector('[data-cookie-decline]').addEventListener('click',()=>save('declined'));
      this.addEventListener('keydown',e=>{if(e.key==='Escape')save('declined')});
      window.SWTshowCookiePreferences=show;
      let stored=null;try{stored=localStorage.getItem(KEY)}catch(e){}
      if(!stored)requestAnimationFrame(()=>setTimeout(show,450));
    }
  }
  customElements.define('site-header',SiteHeader);
  customElements.define('site-footer',SiteFooter);
  customElements.define('cookie-consent',CookieConsent);
})();
