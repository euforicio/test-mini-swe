/**
 * Rock–Paper–Scissors
 * - Dependency-free, accessible, first to 5 wins
 * - Keyboard shortcuts: R (rock), P (paper), S (scissors)
 * - Buttons disabled after game over until Reset
 *
 * Exposed smoke-test helpers (in browser console):
 *   window.__rpsDetermineWinner('rock','scissors') // 'win'
 *   window.__rpsSmokeTest() // quick demonstration
 */
(() => {
  'use strict';

  /** @type {'rock'|'paper'|'scissors'} */
  const choices = ['rock', 'paper', 'scissors'];

  // Cache DOM elements
  const btns = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.btn.choice'));
  const resetBtn = /** @type {HTMLButtonElement} */ (document.getElementById('resetBtn'));
  const selectionsEl = document.getElementById('selections');
  const resultEl = document.getElementById('result');
  const scoreboardEl = document.getElementById('scoreboard');

  let playerScore = 0;
  let computerScore = 0;
  let gameOver = false;

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function getComputerChoice() {
    const idx = Math.floor(Math.random() * choices.length);
    return choices[idx];
  }

  /**
   * Determine round outcome from player's and computer's moves.
   * @param {'rock'|'paper'|'scissors'} player
   * @param {'rock'|'paper'|'scissors'} computer
   * @returns {'win'|'lose'|'draw'}
   */
  function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    const beats = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };
    return beats[player] === computer ? 'win' : 'lose';
  }

  function setButtonsDisabled(disabled) {
    btns.forEach(b => {
      b.disabled = disabled;
      b.setAttribute('aria-disabled', String(disabled));
    });
  }

  function updateScoreboard() {
    scoreboardEl.textContent = `Player ${playerScore} — ${computerScore} Computer`;
  }

  function updateSelections(player, computer) {
    selectionsEl.textContent = `You: ${player ? capitalize(player) : '—'} | Computer: ${computer ? capitalize(computer) : '—'}`;
  }

  function announceResult(outcome, player, computer) {
    resultEl.classList.remove('win', 'lose', 'draw');
    if (!outcome) {
      resultEl.textContent = 'Make your move!';
      return;
    }
    resultEl.classList.add(outcome);
    const detail = `${capitalize(player)} vs ${capitalize(computer)}.`;
    if (outcome === 'win') {
      resultEl.textContent = `You win the round! ${detail}`;
    } else if (outcome === 'lose') {
      resultEl.textContent = `You lose the round. ${detail}`;
    } else {
      resultEl.textContent = `It’s a draw. ${detail}`;
    }
  }

  function checkGameOver() {
    if (playerScore >= 5 || computerScore >= 5) {
      gameOver = true;
      setButtonsDisabled(true);
      const winner = playerScore > computerScore ? 'You win the game! 🏆' : 'Computer wins the game. 🤖';
      // Keep previous class to show final outcome color aligned with last round (optional),
      // or override to a neutral emphasis. We'll append a note:
      resultEl.textContent = `${winner} Press Reset to play again.`;
    }
  }

  function handleChoice(choice) {
    if (gameOver) return;

    const player = choice;
    const computer = getComputerChoice();
    const outcome = determineWinner(player, computer);

    if (outcome === 'win') playerScore += 1;
    else if (outcome === 'lose') computerScore += 1;

    updateSelections(player, computer);
    announceResult(outcome, player, computer);
    updateScoreboard();
    checkGameOver();
  }

  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;
    updateSelections(null, null);
    resultEl.classList.remove('win', 'lose', 'draw');
    announceResult(null);
    updateScoreboard();
    setButtonsDisabled(false);
    // Focus first button for convenience
    const first = /** @type {HTMLButtonElement} */ (document.querySelector('.btn.choice'));
    if (first) first.focus();
  }

  // Event listeners for buttons
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      if (choice) handleChoice(choice);
    });
  });

  // Keyboard shortcuts: R, P, S (case-insensitive)
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    const key = e.key.toLowerCase();
    if (key === 'r') handleChoice('rock');
    else if (key === 'p') handleChoice('paper');
    else if (key === 's') handleChoice('scissors');
  });

  // Reset button
  resetBtn.addEventListener('click', resetGame);

  // Initialize UI
  resetGame();

  // Expose light smoke tests to the console (optional requirement)
  window.__rpsDetermineWinner = determineWinner;
  window.__rpsSmokeTest = function __rpsSmokeTest() {
    const samples = [
      ['rock','scissors','win'],
      ['rock','paper','lose'],
      ['paper','rock','win'],
      ['paper','scissors','lose'],
      ['scissors','paper','win'],
      ['scissors','rock','lose'],
      ['rock','rock','draw'],
    ];
    const ok = samples.every(([p,c,exp]) => determineWinner(p,c) === exp);
    const msg = ok ? 'Smoke test passed ✅' : 'Smoke test failed ❌';
    console.log(msg);
    return { ok, samples };
  };
})();
