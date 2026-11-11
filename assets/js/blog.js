/* Blog is independent of the main site scripts and has static SEO-ready articles. */
(() => {
  const buttons=[...document.querySelectorAll('[data-blog-filter]')],cards=[...document.querySelectorAll('[data-blog-category]')];
  const empty=document.querySelector('#blog-empty');
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.blogFilter;
    buttons.forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button))});
    let count=0;
    cards.forEach(card=>{const visible=filter==='All'||card.dataset.blogCategory===filter;card.hidden=!visible;if(visible)count++});
    if(empty)empty.style.display=count?'none':'block';
  }));
})();
