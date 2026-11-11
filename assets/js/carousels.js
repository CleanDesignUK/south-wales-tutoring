/* Progressive enhancement: card grids become touch carousels on small screens only. */
(() => {
  const cardSelector = ':scope > div > :is(.feature-card,.subject-card,.location-card,.review-card,.blog-card,.step-card,.pricing-card,.tutor-card-new,.exam-card,.stat-card,.course-card,.service-card)';
  const narrow=window.matchMedia('(max-width:767.98px)');
  const decks=[];
  const create=(row,index)=>{
    const columns=[...row.children].filter(el=>el.nodeType===1);
    const directory=row.classList.contains('course-directory');
    if(columns.length<2 || !columns.every(el=>directory?el.classList.contains('course-directory-card'):!!el.querySelector(cardSelector.replace(':scope > div > ',''))))return;
    const shell=document.createElement('div');shell.className='mobile-swipe-shell';
    const viewport=document.createElement('div');viewport.className='mobile-swipe-viewport';
    viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-roledescription','carousel');
    const parentSection=row.closest('section');
    const title=parentSection?.querySelector('h2')?.textContent?.trim()||'Cards';
    viewport.setAttribute('aria-label',title+' - swipe to browse cards');
    row.parentNode.insertBefore(shell,row);shell.appendChild(viewport);viewport.appendChild(row);row.classList.add('mobile-swipe-track');
    const actions=document.createElement('div');actions.className='mobile-swipe-actions';
    const progress=document.createElement('span');progress.className='mobile-swipe-count';progress.setAttribute('aria-live','polite');
    const prev=document.createElement('button');prev.type='button';prev.className='mobile-swipe-control';prev.setAttribute('aria-label',`Previous ${title} card`);prev.textContent='‹';
    const next=document.createElement('button');next.type='button';next.className='mobile-swipe-control';next.setAttribute('aria-label',`Next ${title} card`);next.textContent='›';
    actions.append(progress,prev,next);shell.appendChild(actions);
    const visible=()=>columns.filter(el=>!el.hidden && getComputedStyle(el).display!=='none');
    const activeIndex=items=>{
      if(!narrow.matches)return 0;
      let closest=0,delta=Infinity;
      items.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-viewport.scrollLeft-row.offsetLeft);if(d<delta){delta=d;closest=i}});
      return closest;
    };
    const update=()=>{
      const items=visible();const i=activeIndex(items);
      progress.textContent=items.length?`${i+1} / ${items.length}`:'0 / 0';
      prev.disabled=items.length<2||i<=0;next.disabled=items.length<2||i>=items.length-1;
      actions.hidden=items.length<2;
    };
    const move=delta=>{
      const items=visible();if(!items.length)return;
      const i=Math.max(0,Math.min(items.length-1,activeIndex(items)+delta));
      viewport.scrollTo({left:items[i].offsetLeft-row.offsetLeft,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
      window.setTimeout(update,300);
    };
    prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    viewport.addEventListener('scroll',()=>window.requestAnimationFrame(update),{passive:true});
    viewport.addEventListener('keydown',e=>{if(!narrow.matches)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
    decks.push({update,reset:()=>{viewport.scrollLeft=0;update()}});
    update();
  };
  function init(){
    [...document.querySelectorAll('.row,.course-directory')].forEach((row,i)=>{
      if(row.closest('.mobile-swipe-track,.mobile-swipe-shell'))return;
      create(row,i);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  document.addEventListener('swt:tutors-filtered',()=>decks.forEach(d=>d.reset()));
  window.addEventListener('resize',()=>decks.forEach(d=>d.update()),{passive:true});
})();
