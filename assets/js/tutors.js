(() => {
const search=document.getElementById('tutor-search'),level=document.getElementById('tutor-level'),subject=document.getElementById('tutor-subject');
if(!search||!level||!subject)return;
const cards=[...document.querySelectorAll('[data-tutor-card]')],count=document.getElementById('tutor-results'),empty=document.getElementById('tutor-empty');
const refresh=()=>{const q=search.value.toLowerCase().trim(),l=level.value.toLowerCase(),s=subject.value.toLowerCase();let shown=0;cards.forEach(card=>{const text=[card.dataset.name,card.dataset.subjects,card.textContent.toLowerCase()].join(' ');const visible=(!q||text.includes(q))&&(!l||card.dataset.levels.includes(l))&&(!s||card.dataset.subjects.includes(s));card.hidden=!visible;if(visible)shown++;});count.textContent=`Showing ${shown} of ${cards.length} online tutors`;empty.style.display=shown?'none':'block';document.dispatchEvent(new CustomEvent('swt:tutors-filtered'));};
[search,level,subject].forEach(el=>el.addEventListener(el===search?'input':'change',refresh));refresh();
})();
