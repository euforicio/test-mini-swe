/* Coinflip - plain, accessible JS
   - Uses crypto.getRandomValues when available; falls back to Math.random
   - CSS-driven animation (~900ms)
   - Prevents double-flips while animating
   - Persists counts and last 10 history entries in localStorage
   - Keyboard: Enter or Space triggers flip
*/

(function () {
  "use strict";

  // DOM references
  const coin = document.getElementById("coin");
  const coinFace = document.getElementById("coinFace");
  const flipBtn = document.getElementById("flipBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultText = document.getElementById("resultText");
  const headsEl = document.getElementById("headsCount");
  const tailsEl = document.getElementById("tailsCount");
  const totalEl = document.getElementById("totalCount");
  const historyList = document.getElementById("historyList");

  // State
  const LS_COUNTS = "coinflip_counts_v1";
  const LS_HISTORY = "coinflip_history_v1";

  const defaultCounts = { heads: 0, tails: 0, total: 0 };
  let counts = loadJSON(LS_COUNTS, defaultCounts);
  let history = loadJSON(LS_HISTORY, []); // newest first; max 10

  let isFlipping = false;
  const ANIM_MS = 900;

  // Initialize UI
  updateUI();

  // Event: Flip button
  flipBtn.addEventListener("click", () => flip());

  // Event: Coin click (optional, acts like flip)
  coin.addEventListener("click", () => flip());

  // Keyboard shortcuts: Enter or Space flip
  window.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      flip();
    }
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    counts = { ...defaultCounts };
    history = [];
    saveState();
    updateUI();
    resultText.textContent = "Reset complete. Press Flip to start";
  });

  // Core: perform a flip
  function flip() {
    if (isFlipping) return; // guard double-activations during animation
    isFlipping = true;
    setButtonDisabled(true);

    // Start animation
    coin.classList.add("flipping");
    coin.setAttribute("aria-busy", "true");
    coinFace.textContent = "?";

    // After animation duration, decide and show result
    window.setTimeout(() => {
      const heads = fairCoin(); // true for heads, false for tails
      const label = heads ? "Heads" : "Tails";
      coin.classList.remove("flipping");
      coin.removeAttribute("aria-busy");

      coinFace.textContent = heads ? "H" : "T";
      resultText.textContent = `Result: ${label}`;

      // Update state
      if (heads) counts.heads += 1; else counts.tails += 1;
      counts.total += 1;

      history.unshift(label);
      if (history.length > 10) history = history.slice(0, 10);

      saveState();
      updateUI();

      // Allow flipping again
      isFlipping = false;
      setButtonDisabled(false);
      flipBtn.focus({ preventScroll: true });
    }, ANIM_MS);
  }

  // Utility: fair 50/50 coin using crypto when available
  function fairCoin() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === "function") {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        // Least significant bit is sufficiently fair for 32-bit cryptographic RNG
        return (arr[0] & 1) === 1;
      }
    } catch (e) {
      // Fallback to Math.random below
    }
    return Math.random() < 0.5;
  }

  // UI helpers
  function updateUI() {
    headsEl.textContent = String(counts.heads);
    tailsEl.textContent = String(counts.tails);
    totalEl.textContent = String(counts.total);

    // History list
    historyList.innerHTML = "";
    if (history.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No flips yet.";
      li.className = "muted";
      historyList.appendChild(li);
    } else {
      history.forEach((entry, i) => {
        const li = document.createElement("li");
        li.textContent = `#${counts.total - i}: ${entry}`;
        historyList.appendChild(li);
      });
    }
  }

  function setButtonDisabled(disabled) {
    flipBtn.disabled = disabled;
    flipBtn.setAttribute("aria-disabled", String(disabled));
  }

  // Persistence
  function saveState() {
    try {
      localStorage.setItem(LS_COUNTS, JSON.stringify(counts));
      localStorage.setItem(LS_HISTORY, JSON.stringify(history));
    } catch (e) {
      // Storage might be unavailable; fail silently.
    }
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }
})();
