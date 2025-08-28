'use strict';

(function () {
  const statusEl = document.getElementById('status');
  const boardEl = document.getElementById('board');
  const resetBtn = document.getElementById('resetBtn');
  const cells = Array.from(document.querySelectorAll('.cell'));

  // Game state
  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;

  const winningPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function updateStatus() {
    if (gameActive) {
      setStatus(`Player ${currentPlayer}'s turn`);
    }
  }

  function setCellAria(index) {
    const cell = cells[index];
    const pos = index + 1;
    const value = board[index];
    const label = value ? `Cell ${pos} ${value}` : `Cell ${pos} empty`;
    cell.setAttribute('aria-label', label);
    cell.setAttribute('aria-pressed', value ? 'true' : 'false');
  }

  function highlightWin(pattern) {
    pattern.forEach(i => cells[i].classList.add('win'));
  }

  function checkWin() {
    for (const [a, b, c] of winningPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], pattern: [a, b, c] };
      }
    }
    return null;
  }

  function checkDraw() {
    return board.every(v => v !== null);
  }

  function placeMark(index) {
    if (!gameActive) return;
    if (board[index] !== null) return;

    board[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    setCellAria(index);

    const result = checkWin();
    if (result) {
      gameActive = false;
      highlightWin(result.pattern);
      setStatus(`Player ${result.winner} wins!`);
      return;
    }
    if (checkDraw()) {
      gameActive = false;
      setStatus('It’s a draw!');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }

  function handleCellClick(event) {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    placeMark(index);
  }

  function handleCellKeydown(event) {
    const key = event.key;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar' || event.code === 'Space') {
      event.preventDefault();
      const index = Number(event.currentTarget.getAttribute('data-index'));
      placeMark(index);
    }
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach((cell, i) => {
      cell.textContent = '';
      cell.classList.remove('X', 'O', 'win');
      setCellAria(i);
    });
    updateStatus();
  }

  // Initialize
  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('keydown', handleCellKeydown);
  });
  resetBtn.addEventListener('click', resetGame);

  // Initial status and ARIA
  cells.forEach((_, i) => setCellAria(i));
  updateStatus();
})();
