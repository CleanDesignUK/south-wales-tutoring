/* Form qualification + Web3Forms integration. JS-enhanced; native POST fallback.
   No invisible marketing opt-in, no automatic analytics scripts, no visible checkbox. */
(() => {
  const forms=[...document.querySelectorAll('form[data-web3form]')];
  const params=new URLSearchParams(location.search);
  forms.forEach(form=>{
    const started=Date.now(), status=form.querySelector('[role="status"]');
    for(const field of ['enquiry_subject','level','area']){
      const input=form.elements.namedItem(field);
      if(input&&params.has(field)){
        const candidate=params.get(field);if([...input.options||[]].some(o=>o.value===candidate))input.value=candidate;
        else if(input.tagName==='INPUT')input.value=candidate;
      }
    }
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const submit=form.querySelector('[type="submit"]');
      const set=(message,kind)=>{if(status){status.textContent=message;status.dataset.status=kind||'';}};
      if(!form.reportValidity())return;
      const data=new FormData(form);
      const email=String(data.get('email')||'').trim();
      const phone=String(data.get('phone')||'').trim();
      const message=String(data.get('message')||'').trim();
      const name=String(data.get('name')||'').trim();
      const phoneDigits=phone.replace(/\D/g,'');
      if(name.length<2){set('Please enter your name.','error');return}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){set('Please enter a valid email address.','error');return}
      if(phoneDigits.length<8||phoneDigits.length>15||/(\d)\1{5,}/.test(phoneDigits)){set('Please enter a valid phone number.','error');return}
      if(message.length<12){set('Please add at least 12 characters about the tutoring required.','error');return}
      if(data.get('botcheck')||data.get('website')){set('We could not send this enquiry. Please email us directly.','error');return}
      if(Date.now()-started<2300){set('Please review the details and try submitting again.','error');return}
      if(submit){submit.disabled=true;submit.dataset.oldLabel=submit.innerHTML;submit.textContent='Sending your enquiry…'}
      set('Sending securely…','');
      try{
        const response=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data,headers:{Accept:'application/json'}});
        const result=await response.json();
        if(response.ok&&result.success){
          try{sessionStorage.setItem('swt-enquiry-sent','1')}catch(e){}
          window.location.assign(form.dataset.successUrl||'thank-you.html');
        } else {
          throw new Error(result.message||'The form service did not accept the message.');
        }
      }catch(error){set('Your message could not be sent. Please email southwales@nwttutoring.com or WhatsApp +44 7480 231362.','error');}
      finally{if(submit){submit.disabled=false;submit.innerHTML=submit.dataset.oldLabel||'Send enquiry';}}
    });
  });
})();
