/* Rock Paper Scissors - zero dependency.
   - Random computer move
   - Determine round winner
   - Update DOM and running score
   - Accessible announcements via aria-live
*/
(() => {
  'use strict';

  const MOVES = ['rock', 'paper', 'scissors'];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const statusEl = $('#status');
  const playerScoreEl = $('#player-score');
  const computerScoreEl = $('#computer-score');
  const resetBtn = $('#reset-btn');
  const moveButtons = $$('[data-move]');

  let playerScore = 0;
  let computerScore = 0;

  function getComputerMove() {
    const i = Math.floor(Math.random() * MOVES.length);
    return MOVES[i];
  }

  // Returns 'win' | 'lose' | 'draw'
  function compare(player, computer) {
    if (player === computer) return 'draw';
    const winsAgainst = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    return winsAgainst[player] === computer ? 'win' : 'lose';
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function updateScores() {
    playerScoreEl.textContent = String(playerScore);
    computerScoreEl.textContent = String(computerScore);
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function playRound(playerMove) {
    if (!MOVES.includes(playerMove)) return;
    const computerMove = getComputerMove();
    const outcome = compare(playerMove, computerMove);

    let msg;
    if (outcome === 'draw') {
      msg = `Draw! You both chose ${capitalize(playerMove)}.`;
    } else if (outcome === 'win') {
      playerScore++;
      msg = `You win! ${capitalize(playerMove)} beats ${capitalize(computerMove)}.`;
    } else {
      computerScore++;
      msg = `You lose! ${capitalize(computerMove)} beats ${capitalize(playerMove)}.`;
    }

    updateScores();
    setStatus(msg);
  }

  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScores();
    setStatus('Scores reset. Make your move to start!');
  }

  // Wire up events
  moveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const move = btn.getAttribute('data-move');
      playRound(move);
    }, { passive: true });
  });

  resetBtn.addEventListener('click', resetGame, { passive: true });

  // Initial state
  updateScores();
  setStatus('Make your move to start!');
})();
