/**
 * Rock–Paper–Scissors
 * - Pure JS, no dependencies.
 * - Score persists for the current tab session (sessionStorage).
 * - Accessible announcements via aria-live region.
 */
(() => {
  'use strict';

  const ICONS = { rock: '✊', paper: '✋', scissors: '✌️' };
  const LABELS = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };
  const STORAGE_KEY = 'rpsScore';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const resultEl = $('#result');
  const playerEl = $('#player-score');
  const computerEl = $('#computer-score');
  const tiesEl = $('#ties-score');
  const resetBtn = $('#reset-btn');
  const choiceButtons = $$('.choice-btn');

  // Helpers for storage
  const hasSessionStorage = (() => {
    try {
      const k = '__test__'; sessionStorage.setItem(k, '1'); sessionStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })();

  const loadScore = () => {
    if (!hasSessionStorage) return { player: 0, computer: 0, ties: 0 };
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { player: 0, computer: 0, ties: 0 };
    } catch {
      return { player: 0, computer: 0, ties: 0 };
    }
  };

  const saveScore = (score) => {
    if (!hasSessionStorage) return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(score)); } catch {}
  };

  let score = loadScore();

  const getComputerChoice = () => {
    const keys = Object.keys(ICONS);
    return keys[Math.floor(Math.random() * keys.length)];
  };

  const judge = (player, computer) => {
    if (player === computer) return 'tie';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) return 'win';
    return 'lose';
  };

  const renderScore = () => {
    playerEl.textContent = String(score.player);
    computerEl.textContent = String(score.computer);
    tiesEl.textContent = String(score.ties);
  };

  const setResult = (player, computer, outcome) => {
    resultEl.classList.remove('win', 'lose', 'tie');
    if (outcome) resultEl.classList.add(outcome);

    const detail = player && computer
      ? `You chose ${ICONS[player]} ${LABELS[player]} • Computer chose ${ICONS[computer]} ${LABELS[computer]}`
      : 'Make your move to start the game.';

    const statusText = outcome === 'win' ? 'You win!' : outcome === 'lose' ? 'You lose!' : outcome === 'tie' ? 'Tie!' : '';
    resultEl.innerHTML = `
      <div class="detail">${detail}</div>
      ${statusText ? `<div class="status ${outcome}">${statusText}</div>` : ''}
    `;
  };

  const onChoice = (player) => {
    const computer = getComputerChoice();
    const outcome = judge(player, computer);

    if (outcome === 'win') score.player += 1;
    else if (outcome === 'lose') score.computer += 1;
    else score.ties += 1;

    saveScore(score);
    renderScore();
    setResult(player, computer, outcome);
  };

  const reset = () => {
    score = { player: 0, computer: 0, ties: 0 };
    saveScore(score);
    renderScore();
    setResult(null, null, null);
    // Announce reset for assistive tech
    resultEl.textContent = 'Score reset. Make your move to start the game.';
    resultEl.classList.remove('win', 'lose', 'tie');
  };

  // Wire up events
  choiceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      if (!['rock', 'paper', 'scissors'].includes(choice)) return;
      onChoice(choice);
    });
  });

  resetBtn.addEventListener('click', reset);

  // Initial render
  renderScore();
  setResult(null, null, null);
})();
