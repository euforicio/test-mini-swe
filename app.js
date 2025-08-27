(() => {
  const statusEl = document.getElementById('status');
  const boardEl = document.getElementById('board');
  const restartBtn = document.getElementById('restart');
  const cells = Array.from(document.querySelectorAll('.cell'));

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let winningLine = null;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function coords(i) {
    return { row: Math.floor(i / 3), col: i % 3 };
  }

  function updateCellAria(i) {
    const { row, col } = coords(i);
    const cell = cells[i];
    if (board[i]) {
      cell.setAttribute('aria-label', `${board[i]} at row ${row + 1} column ${col + 1}`);
      cell.setAttribute('aria-disabled', 'true');
    } else if (gameActive) {
      cell.setAttribute('aria-label', `Empty, row ${row + 1} column ${col + 1}. Press Enter or Space to place ${currentPlayer}`);
      cell.removeAttribute('aria-disabled');
    } else {
      cell.setAttribute('aria-label', `Empty, row ${row + 1} column ${col + 1}. Game over`);
      cell.setAttribute('aria-disabled', 'true');
    }
  }

  function render() {
    cells.forEach((cell, i) => {
      const val = board[i];
      cell.textContent = val ? val : '';
      cell.removeAttribute('data-player');
      cell.classList.remove('win');
      if (val) cell.setAttribute('data-player', val);
      if (winningLine && winningLine.includes(i)) cell.classList.add('win');
      updateCellAria(i);
    });
  }

  function checkWinner() {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  }

  function isDraw() {
    return board.every(Boolean);
  }

  function handleMove(i) {
    if (!gameActive || board[i]) return;

    board[i] = currentPlayer;

    const result = checkWinner();
    if (result) {
      winningLine = result.line;
      gameActive = false;
      render();
      setStatus(`${result.winner} wins!`);
      return;
    }

    if (isDraw()) {
      winningLine = null;
      gameActive = false;
      render();
      setStatus('Draw.');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    winningLine = null;
    render();
    setStatus(`Turn: ${currentPlayer}`);
  }

  function restart() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    winningLine = null;
    setStatus('Turn: X');
    render();
    // Return focus to top-left for predictable keyboard flow
    cells[0].focus();
  }

  // Mouse/tap
  cells.forEach((btn, i) => {
    btn.addEventListener('click', () => handleMove(i));
  });

  // Per-cell keyboard: Enter/Space to place
  cells.forEach((btn, i) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMove(i);
      }
    });
  });

  // Grid-level keyboard: arrows to navigate, R to restart
  boardEl.addEventListener('keydown', (e) => {
    const key = e.key;
    const activeIndex = cells.indexOf(document.activeElement);
    if (activeIndex === -1) return;

    const { row, col } = coords(activeIndex);
    let target = activeIndex;

    if (key === 'ArrowUp') {
      e.preventDefault();
      if (row > 0) target = activeIndex - 3;
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      if (row < 2) target = activeIndex + 3;
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      if (col > 0) target = activeIndex - 1;
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      if (col < 2) target = activeIndex + 1;
    } else if (key === 'r' || key === 'R') {
      e.preventDefault();
      restartBtn.focus();
      restartBtn.click();
      return;
    } else {
      return; // ignore other keys
    }

    if (target !== activeIndex) {
      cells[target].focus();
    }
  });

  restartBtn.addEventListener('click', restart);

  // Initialize
  setStatus('Turn: X');
  render();
})();
