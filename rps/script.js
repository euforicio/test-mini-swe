(() => {
  'use strict';

  const MAX_WINS = 5;
  const CHOICES = ['rock', 'paper', 'scissors'];
  const LABELS = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };

  // DOM references
  const btnRock = document.getElementById('rock');
  const btnPaper = document.getElementById('paper');
  const btnScissors = document.getElementById('scissors');
  const btnReset = document.getElementById('reset');

  const elPlayerChoice = document.getElementById('player-choice');
  const elComputerChoice = document.getElementById('computer-choice');
  const elResult = document.getElementById('result');
  const elPlayerScore = document.getElementById('player-score');
  const elComputerScore = document.getElementById('computer-score');
  const elWinner = document.getElementById('winner');

  let playerScore = 0;
  let computerScore = 0;
  let gameOver = false;

  function getComputerChoice() {
    const idx = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[idx];
  }

  // Determine round outcome: 'win' | 'lose' | 'draw'
  function computeOutcome(player, computer) {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) return 'win';
    return 'lose';
  }

  function setChoiceDisabled(disabled) {
    [btnRock, btnPaper, btnScissors].forEach(b => {
      b.disabled = disabled;
      b.setAttribute('aria-disabled', String(disabled));
    });
  }

  function updateScores() {
    elPlayerScore.textContent = String(playerScore);
    elComputerScore.textContent = String(computerScore);
  }

  function announceResult(outcome, player, computer) {
    let text = '';
    switch (outcome) {
      case 'win':
        text = `${LABELS[player]} beats ${LABELS[computer]}. You win this round!`;
        break;
      case 'lose':
        text = `${LABELS[computer]} beats ${LABELS[player]}. You lose this round.`;
        break;
      default:
        text = `Both chose ${LABELS[player]}. It's a draw.`;
        break;
    }
    elResult.textContent = text;
  }

  function checkForGameOver() {
    if (playerScore >= MAX_WINS || computerScore >= MAX_WINS) {
      gameOver = true;
      setChoiceDisabled(true);
      const youWin = playerScore > computerScore;
      elWinner.textContent = youWin ? 'You won the game! 🎉' : 'Computer won the game. Try again!';
      // Move focus to Reset for accessibility
      btnReset.focus();
    }
  }

  function playRound(choice) {
    if (gameOver) return;

    const player = choice;
    const computer = getComputerChoice();

    elPlayerChoice.textContent = LABELS[player];
    elComputerChoice.textContent = LABELS[computer];

    const outcome = computeOutcome(player, computer);
    if (outcome === 'win') playerScore += 1;
    else if (outcome === 'lose') computerScore += 1;

    updateScores();
    announceResult(outcome, player, computer);
    checkForGameOver();
  }

  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;

    elPlayerChoice.textContent = '—';
    elComputerChoice.textContent = '—';
    elResult.textContent = 'Make your move!';
    elWinner.textContent = '';

    updateScores();
    setChoiceDisabled(false);
    btnRock.focus();
  }

  // Event listeners for buttons
  btnRock.addEventListener('click', () => playRound('rock'));
  btnPaper.addEventListener('click', () => playRound('paper'));
  btnScissors.addEventListener('click', () => playRound('scissors'));
  btnReset.addEventListener('click', resetGame);

  // Keyboard shortcuts: R, P, S (case-insensitive)
  document.addEventListener('keydown', (e) => {
    // Avoid typing in form fields
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (gameOver) return;

    const key = (e.key || '').toLowerCase();
    if (key === 'r') playRound('rock');
    else if (key === 'p') playRound('paper');
    else if (key === 's') playRound('scissors');
  });

  // Initialize UI state
  setChoiceDisabled(false);
  updateScores();

  // Expose tiny smoke-test helpers on window for quick console checks
  // Example: __rpsTest__.computeOutcome('rock','scissors') -> 'win'
  // Example: __rpsTest__.reset(); __rpsTest__.playRound('rock');
  window.__rpsTest__ = {
    computeOutcome,
    getComputerChoice,
    playRound,
    reset: resetGame,
  };
})();
