(function(){
  const $ = (sel) => document.querySelector(sel);

  const form = $('#contactForm');
  const nameInput = $('#name');
  const emailInput = $('#email');
  const messageInput = $('#message');

  const nameError = $('#nameError');
  const emailError = $('#emailError');
  const messageError = $('#messageError');
  const statusBox = $('#status');

  function setError(inputEl, errorEl, message){
    inputEl.setAttribute('aria-invalid','true');
    errorEl.textContent = message || '';
  }

  function clearError(inputEl, errorEl){
    inputEl.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  }

  function isValidEmail(email){
    // Simple, reasonable email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validate(){
    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg = messageInput.value.trim();

    if(name.length < 2){
      setError(nameInput, nameError, 'Please enter your name (at least 2 characters).');
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    if(!isValidEmail(email)){
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    if(msg.length < 10){
      setError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
      valid = false;
    } else {
      clearError(messageInput, messageError);
    }

    return valid;
  }

  function showSuccess(message){
    statusBox.textContent = message;
    statusBox.classList.add('success');
    statusBox.hidden = false;

    // Hide after 6 seconds
    setTimeout(() => {
      statusBox.hidden = true;
      statusBox.textContent = '';
      statusBox.classList.remove('success');
    }, 6000);
  }

  // Real-time validation on blur/input
  nameInput.addEventListener('input', () => {
    if(nameInput.value.trim().length >= 2) clearError(nameInput, nameError);
  });
  emailInput.addEventListener('input', () => {
    if(isValidEmail(emailInput.value.trim())) clearError(emailInput, emailError);
  });
  messageInput.addEventListener('input', () => {
    if(messageInput.value.trim().length >= 10) clearError(messageInput, messageError);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!validate()){
      // Focus first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if(firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate successful submission
    form.reset();
    showSuccess('Your message has been sent successfully!');
  });
})();
