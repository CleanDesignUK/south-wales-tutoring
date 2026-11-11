/* Dedicated safeguarding reporting form, separate from standard tutoring enquiries. */
(() => {
  const form=document.getElementById('safeguarding-form');
  if(!form)return;
  const button=form.querySelector('[type="submit"]');
  const status=form.querySelector('[role="status"]');
  const opened=Date.now();
  const setStatus=(message,level)=>{status.textContent=message;status.dataset.status=level||''};
  const fallback='Please contact safeguarding@nwttutoring.com directly. If somebody is in immediate danger, call 999.';
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    const body=new FormData(form);
    if(body.get('botcheck')||body.get('website'))return;
    if(Date.now()-opened<950){setStatus('Please review your report and submit again.','error');return}
    if(String(body.get('concern_details')||'').trim().length<20){setStatus('Please add some detail about your concern.','error');return}
    const immediate=body.get('immediate_danger');
    if(immediate==='Yes'){
      const warning='If someone is in immediate danger, call 999 now. Submitting a report is not a substitute for emergency help.';
      setStatus(warning,'error');
      if(window.Swal?.fire){const choice=await window.Swal.fire({icon:'warning',title:'Immediate danger',text:warning,showCancelButton:true,confirmButtonText:'I have contacted emergency services',cancelButtonText:'Return to form',confirmButtonColor:'#070769'});if(!choice.isConfirmed)return}
      else if(!window.confirm(warning+' Continue sending this report?'))return;
    }
    button.disabled=true;const label=button.textContent;button.textContent='Sending securely…';setStatus('Sending your safeguarding concern…');
    try{
      const response=await fetch('https://api.web3forms.com/submit',{method:'POST',body,headers:{Accept:'application/json'}});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.success)throw new Error('Submission failed');
      setStatus('Your report has been submitted to our safeguarding team.','success');form.reset();
      if(window.Swal?.fire)await window.Swal.fire({icon:'success',title:'Report submitted',text:'Thank you for telling us. Your safeguarding concern has been submitted. For immediate danger, call 999.',confirmButtonText:'Close',confirmButtonColor:'#070769'});
      else window.alert('Your safeguarding concern has been submitted.');
    }catch(error){setStatus('The form could not send your report. '+fallback,'error');if(window.Swal?.fire)await window.Swal.fire({icon:'error',title:'Submission unsuccessful',text:fallback,confirmButtonColor:'#070769'});}
    finally{button.disabled=false;button.textContent=label}
  });
})();
