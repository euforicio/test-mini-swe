(function () {
  'use strict';

  // ---------- Storage ----------
  const STORAGE_KEY = 'coinFlipState.v1';
  const defaultState = Object.freeze({
    heads: 0,
    tails: 0,
    total: 0,
    // store strings 'H' or 'T', newest first
    history: []
  });

  function isValidState(obj) {
    try {
      if (!obj || typeof obj !== 'object') return false;
      const { heads, tails, total, history } = obj;
      const isNum = (n) => Number.isFinite(n) && n >= 0;
      if (!isNum(heads) || !isNum(tails) || !isNum(total)) return false;
      if (!Array.isArray(history) || history.length > 10) return false;
      if (!history.every((x) => x === 'H' || x === 'T')) return false;
      if (heads + tails !== total) return false;
      return true;
    } catch {
      return false;
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) return { ...parsed };
      console.warn('Coin Flip: Detected corrupted state in localStorage. Resetting.');
      localStorage.removeItem(STORAGE_KEY);
      return { ...defaultState };
    } catch (e) {
      console.warn('Coin Flip: Failed to load state, resetting.', e);
      return { ...defaultState };
    }
  }

  function saveState(state) {
    try {
      const clean = {
        heads: state.heads | 0,
        tails: state.tails | 0,
        total: state.total | 0,
        history: state.history.slice(0, 10)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (e) {
      // Swallow storage errors; app should still function
      console.warn('Coin Flip: Failed to save state.', e);
    }
  }

  // ---------- RNG ----------
  function getRandomBit() {
    // Use crypto.getRandomValues when available; fallback to Math.random
    try {
      const cryptoObj = (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) ? window.crypto : null;
      if (cryptoObj) {
        const arr = new Uint32Array(1);
        cryptoObj.getRandomValues(arr);
        return arr[0] % 2; // 0 or 1
      }
    } catch (e) {
      // fall through to Math.random
    }
    return Math.random() < 0.5 ? 0 : 1;
  }

  // ---------- UI ----------
  const $ = (sel) => document.querySelector(sel);

  const els = {
    emoji: $('#resultEmoji'),
    text: $('#resultText'),
    headsCount: $('#headsCount'),
    tailsCount: $('#tailsCount'),
    totalCount: $('#totalCount'),
    headsPct: $('#headsPct'),
    tailsPct: $('#tailsPct'),
    historyList: $('#historyList'),
    btnFlip: $('#flipBtn'),
    btnReset: $('#resetBtn')
  };

  let state = loadState();

  function formatPct(n, total) {
    if (!total) return '0.0';
    return ((n / total) * 100).toFixed(1);
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setResultVisual(side) {
    // side: 'H' | 'T' | null
    if (!side) {
      els.emoji.textContent = '—';
      els.text.textContent = 'Press Flip to begin';
      return;
    }
    const isHeads = side === 'H';
    els.emoji.textContent = isHeads ? '🙂' : '🦊';
    els.emoji.setAttribute('aria-label', isHeads ? 'Heads' : 'Tails');
    els.text.textContent = isHeads ? 'Heads' : 'Tails';

    if (!prefersReducedMotion) {
      els.emoji.classList.remove('animate');
      // Force reflow to restart animation
      void els.emoji.offsetWidth;
      els.emoji.classList.add('animate');
    }
  }

  function render() {
    setResultVisual(state.history[0] || null);

    els.headsCount.textContent = String(state.heads);
    els.tailsCount.textContent = String(state.tails);
    els.totalCount.textContent = String(state.total);
    els.headsPct.textContent = formatPct(state.heads, state.total);
    els.tailsPct.textContent = formatPct(state.tails, state.total);

    // History
    const frag = document.createDocumentFragment();
    state.history.forEach((s, idx) => {
      const li = document.createElement('li');
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = s;
      const text = document.createElement('span');
      text.textContent = (s === 'H' ? 'Heads' : 'Tails') + ' · #' + (state.total - idx);
      li.appendChild(badge);
      li.appendChild(text);
      frag.appendChild(li);
    });
    els.historyList.innerHTML = '';
    els.historyList.appendChild(frag);
  }

  function flip() {
    const bit = getRandomBit();
    const side = bit === 0 ? 'H' : 'T';
    if (side === 'H') state.heads += 1;
    else state.tails += 1;
    state.total += 1;
    state.history.unshift(side);
    if (state.history.length > 10) state.history.length = 10;

    saveState(state);
    render();
  }

  function reset() {
    state = { heads: 0, tails: 0, total: 0, history: [] };
    saveState(state);
    render();
  }

  function attachEvents() {
    els.btnFlip.addEventListener('click', flip);
    els.btnReset.addEventListener('click', () => {
      if (state.total === 0 || confirm('Reset all stats and history?')) {
        reset();
      }
    });

    // Keyboard accessibility: Enter/Space on focused buttons already works by default in browsers.
    // Provide quick key: 'f' to flip, 'r' to reset (not to hijack when typing in inputs — none exist)
    document.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLButtonElement) return; // let native behavior pass
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); flip(); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); reset(); }
    });
  }

  // Initialize
  attachEvents();
  render();
})();
