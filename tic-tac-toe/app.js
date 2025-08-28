(() => {
  // State
  const board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;

  // Elements
  const statusEl = document.getElementById('status');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const resetBtn = document.getElementById('reset-btn');

  // Winning combinations (rows, columns, diagonals)
  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  function updateStatus(message) {
    statusEl.textContent = message;
  }

  function checkWin() {
    for (const [a, b, c] of WIN_COMBOS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo: [a, b, c] };
      }
    }
    return null;
  }

  function checkDraw() {
    return board.every(v => v !== '');
  }

  function setCellUI(index, value) {
    const cell = cells[index];
    cell.textContent = value;
    cell.classList.remove('x', 'o', 'win');
    if (value === 'X') cell.classList.add('x');
    if (value === 'O') cell.classList.add('o');
    if (value !== '') {
      cell.disabled = true; // disable filled cells
      cell.setAttribute('aria-disabled', 'true');
    } else {
      cell.disabled = false;
      cell.removeAttribute('aria-disabled');
    }
  }

  function endGame(winner, combo) {
    gameActive = false;
    if (combo && combo.length === 3) {
      combo.forEach(i => {
        cells[i].classList.add('win');
      });
    }
    // Disable all cells
    cells.forEach(c => { c.disabled = true; c.setAttribute('aria-disabled', 'true'); });
    if (winner) {
      updateStatus(`Player ${winner} wins!`);
    } else {
      updateStatus(`Draw! No more moves available.`);
    }
  }

  function handleCellClick(index) {
    if (!gameActive) return;
    if (board[index] !== '') return;

    board[index] = currentPlayer;
    setCellUI(index, currentPlayer);

    const win = checkWin();
    if (win) {
      endGame(win.winner, win.combo);
      return;
    }

    if (checkDraw()) {
      endGame(null, null);
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }

  function onCellClick(e) {
    const index = Number(e.currentTarget.dataset.index);
    handleCellClick(index);
  }

  function onCellKeydown(e) {
    // Buttons already handle Enter/Space by default, but ensure consistency
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  function resetGame() {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
      setCellUI(i, '');
    }
    currentPlayer = 'X';
    gameActive = true;
    updateStatus(`Player ${currentPlayer}'s turn`);
    // Focus the first cell for convenience
    cells[0].focus();
  }

  // Event listeners
  cells.forEach(cell => {
    cell.addEventListener('click', onCellClick);
    cell.addEventListener('keydown', onCellKeydown);
  });
  resetBtn.addEventListener('click', resetGame);

  // Initial status
  updateStatus(`Player ${currentPlayer}'s turn`);
})();
