/* Ajax Web3Forms with local SweetAlert confirmation. No redirect. */
(() => {
  const params=new URLSearchParams(location.search);
  const forms=[...document.querySelectorAll('form[data-web3form]')];
  const clean=s=>String(s||'').trim();
  forms.forEach(form=>{
    const initial=Date.now(),status=form.querySelector('[role="status"]'),button=form.querySelector('[type="submit"]');
    const set=(s,k)=>{if(status){status.textContent=s;status.dataset.status=k||''}};
    const tutor=clean(params.get('tutor'));
    const hint=clean(params.get('subject')||params.get('enquiry_subject'));
    const level=clean(params.get('level'));
    if(tutor){const ta=form.elements.namedItem('message');if(ta&&!ta.value){ta.placeholder=`I'd like to enquire about ${tutor}. For example: Year 10 GCSE Maths Higher Tier WJEC tutoring in Welsh medium.`;}}
    if((hint||level)&&!tutor){const ta=form.elements.namedItem('message');if(ta)ta.placeholder=`${hint?hint+' tutoring. ':''}${level?level+'. ':''}For example: Year 10 GCSE Maths Higher Tier WJEC tutoring in Welsh medium.`;}
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form),email=clean(data.get('email')),phone=clean(data.get('phone'));
      const name=clean(data.get('name')),message=clean(data.get('message'));
      const digits=phone.replace(/\D/g,'');
      if(name.length<2){set('Please enter your name.','error');return;}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){set('Please check your email address.','error');return;}
      if(digits.length<8||digits.length>15){set('Please check your WhatsApp/phone number.','error');return;}
      if(message.length<12){set('Please tell us a little about the student and tutoring needed.','error');return;}
      if(data.get('botcheck')||data.get('website')){set('Please contact us on WhatsApp.','error');return;}
      if(Date.now()-initial<900){set('Please check the details and try again.','error');return;}
      if(tutor)data.append('requested_tutor',tutor);
      if(hint)data.append('interest_subject',hint);
      if(level)data.append('interest_level',level);
      button.disabled=true;const old=button.innerHTML;button.textContent='Sending your enquiry…';set('Sending securely…');
      try{
        const response=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data,headers:{Accept:'application/json'}});
        let result;try{result=await response.json()}catch(_){result={};}
        if(!response.ok||!result.success)throw new Error(result.message||'The message could not be sent.');
        set('Thank you! Our team will contact you shortly.','success');form.reset();
        if(window.__swtGtmLoaded && Array.isArray(window.dataLayer)){window.dataLayer.push({event:'swt_enquiry_success',form_location:form.id||'contact_page'});}
        if(window.Swal?.fire){await window.Swal.fire({icon:'success',title:'Thank you!',text:'Our team will contact you shortly.',confirmButtonText:'Great!',confirmButtonColor:'#070769',background:'#ffffff',color:'#070769'});}
        else{window.alert('Thank you! Our team will contact you shortly.');}
      }catch(err){set('We could not send your enquiry. Please WhatsApp +44 7480 231362 or email southwales@nwttutoring.com.','error');}
      finally{button.disabled=false;button.innerHTML=old;}
    });
  });
})();
