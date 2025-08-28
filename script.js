(() => {
  'use strict';

  const coin = document.getElementById('coin');
  const flipBtn = document.getElementById('flipBtn');
  const results = document.getElementById('results');
  const headsEl = document.getElementById('headsCount');
  const tailsEl = document.getElementById('tailsCount');
  const totalEl = document.getElementById('totalCount');

  let heads = 0;
  let tails = 0;
  let total = 0;

  // Track rotation so each flip animates smoothly from current position
  let rotationY = 0;

  // Duration must match CSS transition duration on .coin
  const DURATION_MS = 700;

  let warnedFallback = false;

  function secureRandomBit() {
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      // Use lowest bit to decide heads/tails
      return (buf[0] & 1) === 1 ? 1 : 0;
    } else {
      if (!warnedFallback) {
        console.warn('window.crypto.getRandomValues is not available; falling back to Math.random().');
        warnedFallback = true;
      }
      return Math.random() < 0.5 ? 0 : 1;
    }
  }

  function setCounts() {
    headsEl.textContent = String(heads);
    tailsEl.textContent = String(tails);
    totalEl.textContent = String(total);
  }

  function announce(text) {
    results.textContent = text;
  }

  let busy = false;

  function flip() {
    if (busy) return;
    busy = true;
    flipBtn.disabled = true;

    const bit = secureRandomBit();
    const outcome = bit === 1 ? 'Heads' : 'Tails';

    // Compute target rotation: add at least 720deg plus final orientation
    const extraSpins = 720; // two full rotations
    const finalOrient = outcome === 'Heads' ? 0 : 180; // show H at 0deg, T at 180deg
    rotationY += extraSpins + finalOrient;

    // Trigger the CSS transition
    coin.style.transform = `rotateY(${rotationY}deg)`;

    // Update counters and announce after the flip finishes
    window.setTimeout(() => {
      if (outcome === 'Heads') heads += 1;
      else tails += 1;
      total += 1;
      setCounts();
      announce(`Result: ${outcome}`);
      flipBtn.disabled = false;
      busy = false;
    }, DURATION_MS);
  }

  // Initialize
  setCounts();
  announce('Press Flip to start.');

  flipBtn.addEventListener('click', flip);
  // Allow Enter/Space activation for additional accessibility contexts
  flipBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip();
    }
  });
})();
