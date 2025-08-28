"use strict";
/*
  Vanilla JS Tic Tac Toe
  - Two-player (local) play with alternating turns
  - Prevents moves on occupied cells
  - Win detection across rows, columns, diagonals
  - Draw detection when board is full and no winner
  - Highlights winning cells; disables further moves until New Game
  - New Game resets board and state
  - No external dependencies
*/
(function () {
  const statusEl = document.getElementById("status");
  const scoreboardEl = document.getElementById("scoreboard");
  const cells = Array.from(document.querySelectorAll(".cell"));
  const newGameBtn = document.getElementById("newGame");

  const xWinsEl = document.getElementById("xWins");
  const oWinsEl = document.getElementById("oWins");
  const drawsEl = document.getElementById("draws");

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let board = Array(9).fill("");
  let currentPlayer = "X";
  let gameActive = true;
  let xWins = 0;
  let oWins = 0;
  let draws = 0;

  function updateHUD() {
    if (gameActive) {
      statusEl.textContent = `Turn: ${currentPlayer}`;
    }
    xWinsEl.textContent = String(xWins);
    oWinsEl.textContent = String(oWins);
    drawsEl.textContent = String(draws);
  }

  function setCellsEnabled(enabled) {
    cells.forEach((btn) => {
      btn.disabled = !enabled || btn.textContent.trim().length > 0;
    });
  }

  function clearHighlights() {
    cells.forEach((btn) => btn.classList.remove("win"));
  }

  function resetBoard() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    clearHighlights();
    cells.forEach((btn, i) => {
      btn.textContent = "";
      btn.setAttribute("aria-label", "Empty");
      btn.disabled = false;
    });
    statusEl.textContent = `Turn: ${currentPlayer}`;
  }

  function highlightWin(line) {
    line.forEach((idx) => cells[idx].classList.add("win"));
  }

  function checkWin(player) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return line;
      }
    }
    return null;
  }

  function checkDraw() {
    return board.every((v) => v !== "");
  }

  function endGame(message, winningLine = null) {
    gameActive = false;
    statusEl.textContent = message;
    setCellsEnabled(false);
    if (winningLine) highlightWin(winningLine);
  }

  function handleCellClick(e) {
    const btn = e.currentTarget;
    const idx = Number(btn.dataset.index);
    if (!gameActive) return;
    if (board[idx] !== "") return;

    board[idx] = currentPlayer;
    btn.textContent = currentPlayer;
    btn.setAttribute("aria-label", `Cell ${idx + 1}: ${currentPlayer}`);
    btn.disabled = true;

    const winningLine = checkWin(currentPlayer);
    if (winningLine) {
      if (currentPlayer === "X") xWins++;
      else oWins++;
      updateHUD();
      endGame(`Winner: ${currentPlayer}!`, winningLine);
      return;
    }

    if (checkDraw()) {
      draws++;
      updateHUD();
      endGame("It's a draw.");
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateHUD();
  }

  cells.forEach((btn) => btn.addEventListener("click", handleCellClick));
  newGameBtn.addEventListener("click", () => {
    resetBoard();
    updateHUD();
  });

  updateHUD();
  setCellsEnabled(true);
})();
