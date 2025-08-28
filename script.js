(() => {
  function getRandomInt1to10() {
    return Math.floor(Math.random() * 10) + 1;
  }

  function renderNewNumber() {
    const n = getRandomInt1to10();
    const display = document.getElementById('number');
    if (display) display.textContent = String(n);
  }

  function onReady() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
      // Mouse/touch/Enter activation (native click)
      btn.addEventListener('click', renderNewNumber);
      // Ensure Space key also activates consistently
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          renderNewNumber();
        }
      });
    }
    // Initial render on load
    renderNewNumber();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
