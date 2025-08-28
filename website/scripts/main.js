(function(){
  // Mobile nav toggle
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.nav-drawer');
  if(btn && nav && drawer){
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      if(open) drawer.querySelector('a')?.focus();
    });
  }

  // Smooth-scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id && id.length>1){
        const el = document.querySelector(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  // Simple client-side validation for contact form
  const form = document.querySelector('form[data-validate="simple"]');
  if(form){
    const status = document.getElementById('form-status');
    form.addEventListener('submit', (e)=>{
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let ok = true;
      [name,email,message].forEach(f=>{
        f.setAttribute('aria-invalid','false');
        f.classList.remove('has-error');
      });
      if(!name.value.trim()){ok=false; name.setAttribute('aria-invalid','true');}
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if(!emailOk){ok=false; email.setAttribute('aria-invalid','true');}
      if(message.value.trim().length<5){ok=false; message.setAttribute('aria-invalid','true');}
      if(!ok){
        e.preventDefault();
        if(status){status.textContent='Please correct the highlighted fields.'; status.className='error';}
      }else{
        if(status){status.textContent='Looks good! Your message will be handled by your email client if configured.'; status.className='success';}
      }
    });
  }
})();
