(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const playerScoreEl = $('#player-score');
  const computerScoreEl = $('#computer-score');
  const resultTextEl = $('#result-text');
  const resetBtn = $('#reset');
  const choiceButtons = $$('button[data-choice]');

  const choices = ['rock', 'paper', 'scissors'];
  let playerScore = 0;
  let computerScore = 0;

  const randomChoice = () => choices[Math.floor(Math.random() * choices.length)];

  // Returns 'win' | 'lose' | 'draw'
  function decide(player, computer) {
    if (player === computer) return 'draw';
    const wins = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };
    return wins[player] === computer ? 'win' : 'lose';
  }

  function updateScores() {
    playerScoreEl.textContent = String(playerScore);
    computerScoreEl.textContent = String(computerScore);
  }

  function setResultText(text) {
    resultTextEl.textContent = text;
  }

  function playRound(player) {
    const computer = randomChoice();
    const outcome = decide(player, computer);

    let status = `You chose ${player}, computer chose ${computer}. `;
    if (outcome === 'win') {
      playerScore++;
      status += 'You win this round! 🎉';
    } else if (outcome === 'lose') {
      computerScore++;
      status += 'You lose this round. 😅';
    } else {
      status += "It's a draw. 🤝";
    }

    updateScores();
    setResultText(status);
  }

  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScores();
    setResultText('Scores reset. Make your move!');
  }

  // Wire up events
  choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      if (choices.includes(choice)) playRound(choice);
    });
  });

  resetBtn.addEventListener('click', resetGame);

  // Initial state
  updateScores();
  setResultText('Make your move!');
})();
