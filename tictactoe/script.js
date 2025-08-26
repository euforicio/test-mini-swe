// Simple Tic-Tac-Toe game logic (two players on one device)
// No external dependencies. Works by opening index.html in a browser.

(() => {
  const statusEl = document.getElementById('status');
  const boardEl = document.getElementById('board');
  const resetBtn = document.getElementById('reset');
  const cells = Array.from(boardEl.querySelectorAll('.cell'));

  // Board state: 9 cells initialized to null
  let board = Array(9).fill(null);
  let current = 'X';
  let gameOver = false;

  const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];

  function setStatus(text, tone = 'muted') {
    statusEl.textContent = text;
    statusEl.style.color =
      tone === 'win' ? 'var(--accent)' :
      tone === 'draw' ? 'var(--danger)' : 'var(--muted)';
  }

  function checkWinner() {
    for (const [a,b,c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a,b,c] };
      }
    }
    if (board.every(v => v)) return { draw: true };
    return null;
  }

  function endGame(result) {
    gameOver = true;
    cells.forEach(c => c.disabled = true);
    if (result.winner) {
      setStatus(`Player ${result.winner} wins!`, 'win');
      // Highlight winning cells
      result.line.forEach(i => cells[i].classList.add('winner'));
    } else if (result.draw) {
      setStatus(`It's a draw.`, 'draw');
    }
  }

  function handleClick(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (gameOver || board[idx]) return;

    board[idx] = current;
    e.currentTarget.textContent = current;
    e.currentTarget.setAttribute('aria-label', `Cell ${idx + 1}, ${current}`);
    e.currentTarget.disabled = true;

    const outcome = checkWinner();
    if (outcome) {
      endGame(outcome);
      return;
    }

    current = current === 'X' ? 'O' : 'X';
    setStatus(`Player ${current}'s turn`);
  }

  function reset() {
    board = Array(9).fill(null);
    current = 'X';
    gameOver = false;
    cells.forEach((c, i) => {
      c.textContent = '';
      c.disabled = false;
      c.classList.remove('winner');
      c.setAttribute('aria-label', `Cell ${i + 1}`);
    });
    setStatus(`Player X's turn`);
  }

  // Event listeners
  cells.forEach(cell => cell.addEventListener('click', handleClick));
  resetBtn.addEventListener('click', reset);

  // Initialize
  reset();
})();
