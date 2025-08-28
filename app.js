(() => {
  'use strict';

  // Constants
  const STORAGE_KEY = 'coin-flip-state-v1';
  const MAX_HISTORY = 10;

  // DOM elements
  let els = {};

  // State shape
  const defaultState = () => ({
    heads: 0,
    tails: 0,
    total: 0,
    // 'H' | 'T', most recent first
    history: []
  });

  // RNG: crypto.getRandomValues, fallback to Math.random
  function rng() {
    try {
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return arr[0] % 2; // 0 or 1
      }
    } catch (_) {
      // ignore and fallback
    }
    // Fallback
    return Math.random() < 0.5 ? 0 : 1;
  }

  // Load from localStorage, validate, and normalize
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const s = defaultState();

      if (parsed && typeof parsed === 'object') {
        if (Number.isFinite(parsed.heads) && parsed.heads >= 0) s.heads = Math.floor(parsed.heads);
        if (Number.isFinite(parsed.tails) && parsed.tails >= 0) s.tails = Math.floor(parsed.tails);
        // total is authoritative as recomputed value
        s.total = s.heads + s.tails;

        if (Array.isArray(parsed.history)) {
          const cleaned = parsed.history
            .map(x => (x === 'H' || x === 'T') ? x : null)
            .filter(Boolean)
            .slice(0, MAX_HISTORY);
          s.history = cleaned;
        }
      }
      return s;
    } catch (_) {
      // Corrupted data; reset
      return defaultState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Storage may be full or blocked; fail silently
    }
  }

  function percentage(count, total) {
    if (!total) return 0;
    return Math.round((count / total) * 1000) / 10; // one decimal
  }

  function render(state) {
    // Result
    const latest = state.history[0] || null;
    let text = 'Press Flip to begin';
    let emoji = '🪙';
    if (latest === 'H') {
      text = 'Heads';
      emoji = '🪙';
    } else if (latest === 'T') {
      text = 'Tails';
      emoji = '🪙';
    }
    els.resultEmoji.textContent = emoji;
    els.resultText.textContent = text;

    // Announce for screen readers when there is a new result
    if (latest) {
      els.liveRegion.textContent = `Result: ${text}`;
    } else {
      els.liveRegion.textContent = '';
    }

    // Stats
    els.headsCount.textContent = state.heads;
    els.tailsCount.textContent = state.tails;
    els.totalCount.textContent = state.total;

    els.headsPct.textContent = percentage(state.heads, state.total).toFixed(1).replace(/\.0$/, '');
    els.tailsPct.textContent = percentage(state.tails, state.total).toFixed(1).replace(/\.0$/, '');

    // History
    els.historyList.innerHTML = '';
    state.history.forEach((h, i) => {
      const li = document.createElement('li');
      li.textContent = (h === 'H') ? '🪙 Heads' : '🪙 Tails';
      li.setAttribute('aria-label', `Flip ${i + 1}: ${h === 'H' ? 'Heads' : 'Tails'}`);
      els.historyList.appendChild(li);
    });
  }

  function onFlip(state) {
    const bit = rng(); // 0 or 1
    const res = bit === 0 ? 'H' : 'T';
    if (res === 'H') state.heads += 1;
    else state.tails += 1;
    state.total = state.heads + state.tails;
    state.history.unshift(res);
    if (state.history.length > MAX_HISTORY) state.history.pop();

    saveState(state);
    render(state);

    // Subtle animation on change
    els.result.classList.remove('result-pop');
    // force reflow to restart animation
    void els.result.offsetWidth;
    els.result.classList.add('result-pop');
  }

  function onReset(state) {
    const newState = defaultState();
    // Preserve array identity for simplicity by copying fields
    state.heads = newState.heads;
    state.tails = newState.tails;
    state.total = newState.total;
    state.history = newState.history;
    saveState(state);
    render(state);
    // return focus to flip
    els.flipBtn.focus();
  }

  function bind() {
    els.flipBtn.addEventListener('click', () => onFlip(els.state));
    els.resetBtn.addEventListener('click', () => onReset(els.state));

    // Keyboard is supported by default for buttons; add key hints if desired
  }

  function init() {
    els = {
      result: document.getElementById('result'),
      resultEmoji: document.getElementById('result-emoji'),
      resultText: document.getElementById('result-text'),
      liveRegion: document.getElementById('live-region'),

      headsCount: document.getElementById('heads-count'),
      tailsCount: document.getElementById('tails-count'),
      totalCount: document.getElementById('total-count'),
      headsPct: document.getElementById('heads-pct'),
      tailsPct: document.getElementById('tails-pct'),

      historyList: document.getElementById('history-list'),

      flipBtn: document.getElementById('flip-btn'),
      resetBtn: document.getElementById('reset-btn'),

      state: loadState()
    };

    render(els.state);
    bind();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
