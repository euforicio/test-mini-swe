(function () {
  "use strict";

  const CELL = 28;           // pixels per cell
  const GRID = 20;           // 20x20 grid
  const FPS  = 10;           // 10 frames per second
  const TICK = Math.floor(1000 / FPS);
  const CANVAS_SIZE = CELL * GRID;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const scoreEl = document.getElementById("score");
  const overlayEl = document.getElementById("overlay");

  // Game state
  let snake, dir, nextDir, food, score, paused, gameOver, loop;

  function reset() {
    snake = [
      { x: 10, y: 10 },
      { x: 9,  y: 10 },
      { x: 8,  y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    paused = false;
    gameOver = false;
    scoreEl.textContent = "Score: " + score;
    hideOverlay();

    spawnFood();
    if (loop) clearInterval(loop);
    loop = setInterval(tick, TICK);
    draw(); // initial draw
  }

  function posKey(p){ return p.x + "," + p.y; }

  function spawnFood() {
    const occupied = new Set(snake.map(posKey));
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID);
      y = Math.floor(Math.random() * GRID);
    } while (occupied.has(x + "," + y));
    food = { x, y };
  }

  function setOverlay(title, message) {
    overlayEl.innerHTML = "<div class=\"panel\"><h2>"+title+"</h2><p>"+message+"</p></div>";
    overlayEl.classList.remove("hidden");
  }
  function hideOverlay(){ overlayEl.classList.add("hidden"); }

  function draw() {
    // Background
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Optional subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      const p = i * CELL + 0.5;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(CANVAS_SIZE, p); ctx.stroke();
    }

    // Food
    const pad = 3;
    ctx.fillStyle = "#e53935";
    ctx.fillRect(food.x * CELL + pad, food.y * CELL + pad, CELL - pad*2, CELL - pad*2);

    // Snake
    snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? "#2e7d32" : "#4caf50";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }

  function tick() {
    if (paused || gameOver) return;

    // Apply nextDir safely
    if (!isOpposite(dir, nextDir)) {
      dir = { x: nextDir.x, y: nextDir.y };
    }

    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Collisions: walls
    if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
      endGame();
      return;
    }
    // Collisions: self
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
        endGame();
        return;
      }
    }

    // Move
    snake.unshift(newHead);

    // Food
    if (newHead.x === food.x && newHead.y === food.y) {
      score += 1;
      scoreEl.textContent = "Score: " + score;
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function endGame() {
    gameOver = true;
    setOverlay(
      "Game Over",
      "Final score: " + score + "<br/>Press Enter to restart"
    );
    draw();
  }

  function isOpposite(a, b) {
    return (a.x + b.x === 0 && a.y + b.y === 0);
  }

  // Controls
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    let handled = false;
    if (k === "arrowup" || k === "w")      { nextDir = { x: 0, y: -1 }; handled = true; }
    else if (k === "arrowdown" || k === "s"){ nextDir = { x: 0, y:  1 }; handled = true; }
    else if (k === "arrowleft" || k === "a"){ nextDir = { x: -1, y: 0 }; handled = true; }
    else if (k === "arrowright"|| k === "d"){ nextDir = { x:  1, y: 0 }; handled = true; }
    else if (k === " ") {
      if (!gameOver) {
        paused = !paused;
        if (paused) {
          setOverlay("Paused", "Press Space to resume");
        } else {
          hideOverlay();
        }
      }
      handled = true;
    } else if (k === "enter") {
      if (gameOver) {
        reset();
      }
      handled = true;
    }
    // Prevent reversing directly into self
    if (handled && (k.startsWith("arrow") || "wasd".includes(k))) {
      if (isOpposite(dir, nextDir)) {
        // ignore reversal
        nextDir = { x: dir.x, y: dir.y };
      }
    }
    if (handled) {
      e.preventDefault();
    }
  }, { passive: false });

  // Start game
  reset();
})();
