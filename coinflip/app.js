(function(){
  'use strict';

  const hasLocalStorage = (() => {
    try {
      const t = '__cf_test__';
      window.localStorage.setItem(t, t);
      window.localStorage.removeItem(t);
      return true;
    } catch { return false; }
  })();

  const storageKey = 'coinflip:stats:v1';

  const defaultStats = () => ({ total: 0, heads: 0, tails: 0 });
  let stats = defaultStats();

  function loadStats(){
    if(!hasLocalStorage) return;
    try{
      const raw = window.localStorage.getItem(storageKey);
      if(raw){
        const parsed = JSON.parse(raw);
        if(typeof parsed?.total === 'number' && typeof parsed?.heads === 'number' && typeof parsed?.tails === 'number'){
          stats = parsed;
        }
      }
    }catch{}
  }
  function saveStats(){
    if(!hasLocalStorage) return;
    try{
      window.localStorage.setItem(storageKey, JSON.stringify(stats));
    }catch{}
  }

  function getRandomBit(){
    // Prefer Web Crypto. If unavailable, fall back to Math.random.
    if(typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues){
      const a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] & 1;
    }
    // Fallback: unbiased bit using Math.random rejection sampling.
    // Generate 0..3 and use only 0 or 1; retry on 2 or 3.
    while(true){
      const r = Math.floor(Math.random() * 4); // 0..3
      if(r < 2) return r; // 0 or 1
    }
  }

  function flip(){
    const bit = getRandomBit();
    const isHeads = bit === 1;
    stats.total += 1;
    if(isHeads) stats.heads += 1; else stats.tails += 1;
    saveStats();
    return isHeads ? 'Heads' : 'Tails';
  }

  // DOM
  const $ = (id) => document.getElementById(id);
  const resultEl = $('result');
  const totalEl = $('totalCount');
  const headsEl = $('headsCount');
  const tailsEl = $('tailsCount');
  const flipBtn = $('flipBtn');
  const resetBtn = $('resetBtn');

  function updateStatsUI(){
    totalEl.textContent = String(stats.total);
    headsEl.textContent = String(stats.heads);
    tailsEl.textContent = String(stats.tails);
  }

  function showResult(text){
    // Use emojis for clearer feedback.
    const emoji = text === 'Heads' ? '🪙' : '🪙';
    resultEl.textContent = `${text} ${emoji}`;
  }

  function resetStats(){
    stats = defaultStats();
    saveStats();
    updateStatsUI();
    resultEl.textContent = 'Ready to flip.';
  }

  function init(){
    loadStats();
    updateStatsUI();
    resultEl.textContent = 'Ready to flip.';
    flipBtn.addEventListener('click', () => {
      const res = flip();
      showResult(res);
      updateStatsUI();
    });
    resetBtn.addEventListener('click', resetStats);
    // Keyboard accessibility: Enter/Space handled by button elements natively.
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
