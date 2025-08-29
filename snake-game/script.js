/* Snake Game - Vanilla JS
   - 20x20 grid on a 400x400 canvas (each cell 20px)
   - Arrow keys and WASD for controls, ignoring instant 180° reversals
   - Food spawning, growth, score tracking
   - Game over on wall or self-collision
   - Restart functionality
   - Clean and commented code (no build tools)
*/

(() => {
  // Canvas and context
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  // DOM elements
  const scoreEl = document.getElementById('score');
  const restartBtn = document.getElementById('restart');

  // Grid/canvas constants
  const GRID_CELLS = 20;     // 20x20 grid
  const CELL = 20;           // 20px per cell
  const CANVAS_SIZE = GRID_CELLS * CELL; // 400

  // Game state
  let snake;          // array of segments, head at index 0: [{x, y}, ...]
  let direction;      // current direction vector {x, y}
  let nextDirection;  // buffered direction to apply at next tick
  let food;           // {x, y} grid position
  let score;          // integer
  let loopId = null;  // interval id

  // Settings
  const TICK_MS = 120; // speed of the snake in milliseconds per move

  // Utility: random integer [0, n)
  const rand = (n) => Math.floor(Math.random() * n);

  // Utility: compare two grid positions
  const eq = (a, b) => a.x === b.x && a.y === b.y;

  // Utility: check if dirA is opposite of dirB
  const isOpposite = (a, b) => a && b && (a.x + b.x === 0) && (a.y + b.y === 0);

  // Initialize / reset the game state
  function resetGame() {
    // Start snake roughly centered, moving right
    const startX = Math.floor(GRID_CELLS / 2);
    const startY = Math.floor(GRID_CELLS / 2);
    snake = [
      { x: startX,     y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    direction = { x: 1, y: 0 }; // moving right
    nextDirection = { ...direction };
    score = 0;
    updateScore();
    placeFood();

    stopLoop();
    draw(); // paint initial state
    startLoop();
  }

  function startLoop() {
    loopId = setInterval(tick, TICK_MS);
  }

  function stopLoop() {
    if (loopId) {
      clearInterval(loopId);
      loopId = null;
    }
  }

  // Place food at a random empty cell
  function placeFood() {
    let candidate;
    do {
      candidate = { x: rand(GRID_CELLS), y: rand(GRID_CELLS) };
    } while (snake.some(seg => eq(seg, candidate)));
    food = candidate;
  }

  function updateScore() {
    scoreEl.textContent = String(score);
  }

  // One game tick: advance snake, handle collisions, draw
  function tick() {
    // Apply the buffered direction (prevents mid-tick 180° reversal)
    if (nextDirection && !isOpposite(nextDirection, direction)) {
      direction = nextDirection;
    }

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Wall collision -> game over
    if (head.x < 0 || head.x >= GRID_CELLS || head.y < 0 || head.y >= GRID_CELLS) {
      return gameOver();
    }

    // Self collision -> game over
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      return gameOver();
    }

    // Move: add new head
    snake.unshift(head);

    // Eat food? Grow; else remove tail
    if (eq(head, food)) {
      score += 1;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  // Render the entire frame
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Optional: very subtle grid background
    drawGrid();

    // Draw food
    drawCell(food.x, food.y, '#ef4444'); // red

    // Draw snake (head brighter)
    snake.forEach((seg, i) => {
      const color = i === 0 ? '#22c55e' : '#16a34a'; // head vs body
      drawCell(seg.x, seg.y, color);
    });
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    for (let i = 1; i < GRID_CELLS; i++) {
      // vertical line
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, CANVAS_SIZE);
      ctx.stroke();
      // horizontal line
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(CANVAS_SIZE, i * CELL + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCell(x, y, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
  }

  function gameOver() {
    stopLoop();
    // Draw overlay
    draw(); // draw final state under overlay
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 18);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Press Restart to play again', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 14);
    ctx.restore();
  }

  // Input handling: Arrow keys and WASD
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    let desired = null;
    if (k === 'arrowup' || k === 'w') desired = { x: 0, y: -1 };
    else if (k === 'arrowdown' || k === 's') desired = { x: 0, y: 1 };
    else if (k === 'arrowleft' || k === 'a') desired = { x: -1, y: 0 };
    else if (k === 'arrowright' || k === 'd') desired = { x: 1, y: 0 };

    if (desired) {
      // Prevent page from scrolling with arrow keys
      e.preventDefault();

      // Ignore instant 180° reversals relative to current direction
      // Use current direction to gate, buffer the desired move
      if (!isOpposite(desired, direction)) {
        nextDirection = desired;
      }
    }
  }, { passive: false });

  // Restart button
  restartBtn.addEventListener('click', () => {
    resetGame();
  });

  // Kick off
  resetGame();
})();
