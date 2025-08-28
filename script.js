(function () {
  'use strict';

  const FLIP_DURATION_MS = 800; // must match CSS --flip-duration
  const STORAGE_KEY = 'coinflip.v1';

  // DOM elements
  const coinEl = document.getElementById('coin');
  const flipBtn = document.getElementById('flipBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultEl = document.getElementById('result');
  const headsCountEl = document.getElementById('headsCount');
  const tailsCountEl = document.getElementById('tailsCount');
  const totalCountEl = document.getElementById('totalCount');
  const historyListEl = document.getElementById('historyList');

  // App state
  let state = {
    heads: 0,
    tails: 0,
    total: 0,
    history: [] // newest at end; display last 10 most recent first
  };

  let isFlipping = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data !== 'object' || !data) return;
      state.heads = Number.isFinite(data.heads) ? data.heads : 0;
      state.tails = Number.isFinite(data.tails) ? data.tails : 0;
      state.total = Number.isFinite(data.total) ? data.total : (state.heads + state.tails);
      state.history = Array.isArray(data.history) ? data.history.slice(-200).filter(v => v === 'H' || v === 'T') : [];
    } catch {
      // ignore malformed storage
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage might be unavailable (private mode), fail silently
    }
  }

  function updateStatsUI() {
    headsCountEl.textContent = String(state.heads);
    tailsCountEl.textContent = String(state.tails);
    totalCountEl.textContent = String(state.total);
  }

  function updateHistoryUI() {
    historyListEl.innerHTML = '';
    const last10 = state.history.slice(-10).reverse(); // newest first
    for (const item of last10) {
      const li = document.createElement('li');
      const isHeads = item === 'H';
      li.className = isHeads ? 'heads' : 'tails';
      li.textContent = isHeads ? 'Heads' : 'Tails';
      li.setAttribute('aria-label', isHeads ? 'Heads' : 'Tails');
      historyListEl.appendChild(li);
    }
  }

  function setCoinFace(face) {
    coinEl.setAttribute('data-face', face); // "heads" | "tails"
    coinEl.setAttribute('aria-label', `Coin showing ${face === 'heads' ? 'Heads' : 'Tails'}`);
  }

  function fairFlip() {
    try {
      const u32 = new Uint32Array(1);
      crypto.getRandomValues(u32);
      // Use least significant bit for a uniform 50/50 outcome
      return (u32[0] & 1) === 1; // true => Heads
    } catch {
      // Fallback
      return Math.random() >= 0.5;
    }
  }

  function beginFlipAnimation(targetFace) {
    // Compute start and delta rotations so final orientation matches targetFace
    const currentFace = coinEl.getAttribute('data-face') === 'tails' ? 'tails' : 'heads';
    const startDeg = currentFace === 'tails' ? 180 : 0;
    const endDeg = targetFace === 'tails' ? 180 : 0;
    let delta = endDeg - startDeg; // -180, 0, or 180

    // Configure CSS variables for animation
    coinEl.style.setProperty('--start-rot', `${startDeg}deg`);
    coinEl.style.setProperty('--delta-rot', `${delta}deg`);
    coinEl.style.setProperty('--spins', '3');

    // Trigger animation
    coinEl.classList.add('flipping');
  }

  function endFlipAnimation() {
    coinEl.classList.remove('flipping');
    // Clean up CSS vars (optional)
    coinEl.style.removeProperty('--start-rot');
    coinEl.style.removeProperty('--delta-rot');
    coinEl.style.removeProperty('--spins');
  }

  function flip() {
    if (isFlipping) return;

    isFlipping = true;
    flipBtn.disabled = true;
    flipBtn.setAttribute('aria-disabled', 'true');
    resultEl.textContent = 'Flipping...';
    resultEl.setAttribute('aria-busy', 'true');

    const heads = fairFlip(); // true => Heads, false => Tails
    const targetFace = heads ? 'heads' : 'tails';

    // Animate
    beginFlipAnimation(targetFace);

    // Complete after duration
    window.setTimeout(() => {
      // Update the static face and UI
      setCoinFace(targetFace);
      if (heads) {
        state.heads += 1;
      } else {
        state.tails += 1;
      }
      state.total += 1;
      state.history.push(heads ? 'H' : 'T');
      // Keep history reasonable
      if (state.history.length > 500) {
        state.history = state.history.slice(-300);
      }

      updateStatsUI();
      updateHistoryUI();
      resultEl.textContent = heads ? 'Heads' : 'Tails';
      resultEl.removeAttribute('aria-busy');

      saveState();
      endFlipAnimation();

      flipBtn.disabled = false;
      flipBtn.setAttribute('aria-disabled', 'false');
      isFlipping = false;
    }, FLIP_DURATION_MS);
  }

  function resetAll() {
    if (isFlipping) return;
    state = { heads: 0, tails: 0, total: 0, history: [] };
    setCoinFace('heads');
    resultEl.textContent = 'Press Flip to start';
    updateStatsUI();
    updateHistoryUI();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // Keyboard shortcuts: Space / Enter trigger flip
  function onKeydown(e) {
    const key = e.key || e.code;
    if (key === ' ' || key === 'Spacebar' || key === 'Space' || key === 'Enter') {
      e.preventDefault();
      flip();
    }
  }

  // Initialize
  function init() {
    loadState();

    // Set initial UI
    setCoinFace((state.heads || state.tails) ? (state.history[state.history.length - 1] === 'T' ? 'tails' : 'heads') : 'heads');
    updateStatsUI();
    updateHistoryUI();

    flipBtn.addEventListener('click', flip);
    resetBtn.addEventListener('click', resetAll);
    document.addEventListener('keydown', onKeydown, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
