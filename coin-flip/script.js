(function () {
  const coinEl = document.getElementById('coin');
  const resultEl = document.getElementById('result');
  const flipBtn = document.getElementById('flipBtn');
  const headsCountEl = document.getElementById('headsCount');
  const tailsCountEl = document.getElementById('tailsCount');
  const totalCountEl = document.getElementById('totalCount');

  let heads = 0;
  let tails = 0;

  const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function secureRandomBit() {
    try {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return arr[0] & 1; // 0 or 1
    } catch (e) {
      // Fallback: not cryptographically strong, but keeps the app functional
      return Math.random() < 0.5 ? 0 : 1;
    }
  }

  function updateStats() {
    headsCountEl.textContent = String(heads);
    tailsCountEl.textContent = String(tails);
    totalCountEl.textContent = String(heads + tails);
  }

  function setResult(bit) {
    const isHeads = bit === 0; // 0=heads, 1=tails for consistency
    const label = isHeads ? 'Heads' : 'Tails';
    coinEl.textContent = isHeads ? 'H' : 'T';
    coinEl.setAttribute('data-side', isHeads ? 'H' : 'T');
    resultEl.textContent = label;
    if (isHeads) heads++; else tails++;
    updateStats();
  }

  function flip() {
    if (flipBtn.disabled) return;
    flipBtn.disabled = true;

    // Start animation if not reduced motion
    if (!prefersReducedMotion()) {
      coinEl.classList.remove('flipping');
      // Force reflow to restart animation
      void coinEl.offsetWidth; 
      coinEl.classList.add('flipping');
    }

    const bit = secureRandomBit();

    const finish = () => {
      setResult(bit);
      flipBtn.disabled = false;
      coinEl.classList.remove('flipping');
      flipBtn.focus({ preventScroll: true });
    };

    // Match animation duration if it’s running
    if (!prefersReducedMotion()) {
      setTimeout(finish, 700);
    } else {
      finish();
    }
  }

  // Wire up interactions
  flipBtn.addEventListener('click', flip);
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
      e.preventDefault();
      flip();
    }
  });

  // Initialize UI
  updateStats();
})();
