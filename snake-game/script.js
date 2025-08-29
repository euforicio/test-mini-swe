// Simple Snake game in vanilla JS.
// - 20x20 grid on a 400x400 canvas (each cell 20px).
// - Arrow keys or WASD to control direction; immediate 180° reversal is disallowed.
// - Snake grows by 1 per food; score increments by 1 per food.
// - Food is placed randomly and never overlaps the snake.
// - Game over on wall or self collision; shows a message and allows restart.
// - Fixed tick rate ~10 FPS.
// - Works when opened directly in the browser (no server or build tools required).

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });

  // Grid config
  const gridSize = 20;   // 20x20 cells
  const cell = 20;       // 20px per cell (canvas 400x400)
  const tickMs = 100;    // ~10 FPS

  // DOM elements
  const scoreEl = document.getElementById('score');
  const messageEl = document.getElementById('message');
  const restartBtn = document.getElementById('restart');

  // Game state
  let snake, dir, nextDir, food, score, running, timer;

  // Direction helpers
  const DIRS = {
    ArrowUp:    { x: 0,  y: -1 },
    ArrowDown:  { x: 0,  y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x: 1,  y:  0 },
    KeyW:       { x: 0,  y: -1 },
    KeyS:       { x: 0,  y:  1 },
    KeyA:       { x: -1, y:  0 },
    KeyD:       { x: 1,  y:  0 },
  };

  function sameCell(a, b) { return a.x === b.x && a.y === b.y; }

  function resetGame() {
    // Start centered, length 3, moving right.
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    running = true;
    updateScore();
    clearMessage();
    placeFood();
    if (timer) clearInterval(timer);
    timer = setInterval(tick, tickMs);
    draw(); // draw initial frame
  }

  function updateScore() {
    scoreEl.textContent = String(score);
  }

  function showMessage(text) {
    messageEl.textContent = text;
  }

  function clearMessage() {
    messageEl.textContent = '';
  }

  // Place food on a random empty cell (not overlapping the snake)
  function placeFood() {
    const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
    let x, y, attempts = 0;
    do {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
      attempts++;
      if (attempts > 1000) break; // safety, though shouldn't happen
    } while (occupied.has(`${x},${y}`));
    food = { x, y };
  }

  // Check if a point collides with the snake.
  // If includeTail is false, ignore the last segment (useful when the tail moves this tick).
  function collidesWithSnake(point, includeTail = true) {
    const len = snake.length;
    const maxIndex = includeTail ? len - 1 : Math.max(0, len - 2);
    for (let i = 0; i <= maxIndex; i++) {
      if (snake[i].x === point.x && snake[i].y === point.y) return true;
    }
    return false;
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    showMessage('Game Over! Press Restart or Enter to play again.');
    // Subtle overlay on canvas
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    // Text overlay
    ctx.fillStyle = '#c62828';
    ctx.font = 'bold 24px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  }

  function tick() {
    if (!running) return;

    // Apply the buffered direction, disallowing 180° reversal relative to current dir
    if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) {
      dir = { ...nextDir };
    }

    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
      draw(); // draw last valid frame before overlay
      gameOver();
      return;
    }

    // Will we grow this tick?
    const willGrow = sameCell(newHead, food);

    // Self collision (ignore tail if not growing, since it moves away this tick)
    const collide = collidesWithSnake(newHead, /*includeTail=*/willGrow);
    if (collide) {
      draw();
      gameOver();
      return;
    }

    // Move: add head
    snake.unshift(newHead);

    if (willGrow) {
      score += 1;
      updateScore();
      placeFood();
    } else {
      // Remove tail
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

    // Draw snake body
    for (let i = snake.length - 1; i >= 1; i--) {
      const s = snake[i];
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(s.x * cell, s.y * cell, cell, cell);
    }

    // Draw snake head
    const head = snake[0];
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(head.x * cell, head.y * cell, cell, cell);
  }

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    const key = e.code;
    if (key === 'Enter' && !running) {
      resetGame();
      return;
    }
    const nd = DIRS[key];
    if (!nd) return;

    // Buffer the next direction; prevent immediate 180° reversal vs current dir
    if (nd.x === -dir.x && nd.y === -dir.y) return;
    nextDir = nd;
    e.preventDefault();
  }, { passive: false });

  // Restart button
  restartBtn.addEventListener('click', () => {
    resetGame();
  });

  // Initialize
  resetGame();
})();
