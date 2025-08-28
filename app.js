// Expose a pure function for flipping a fair coin.
// Uses crypto.getRandomValues if available; falls back to Math.random().
function flipCoin() {
  let r;
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    // Normalize to [0,1)
    r = buf[0] / (0xFFFFFFFF + 1);
  } else {
    r = Math.random();
  }
  return r < 0.5 ? "Heads" : "Tails";
}

// Make available for testing in console
if (typeof window !== "undefined") {
  window.flipCoin = flipCoin;
}

(function init() {
  if (typeof document === "undefined") return;

  const el = {
    coin: document.getElementById("coin"),
    resultWord: document.getElementById("resultWord"),
    resultAnnounce: document.getElementById("resultAnnounce"),
    total: document.getElementById("totalCount"),
    heads: document.getElementById("headsCount"),
    tails: document.getElementById("tailsCount"),
    history: document.getElementById("historyList"),
    flipBtn: document.getElementById("flipBtn"),
    resetBtn: document.getElementById("resetBtn"),
  };

  const state = {
    total: 0,
    heads: 0,
    tails: 0,
    history: [], // most recent first: { ts: number, result: "Heads"|"Tails" }
  };

  function formatTs(ts) {
    try {
      return new Date(ts).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return new Date(ts).toString();
    }
  }

  function renderStats() {
    el.total.textContent = String(state.total);
    el.heads.textContent = String(state.heads);
    el.tails.textContent = String(state.tails);
  }

  function renderHistory() {
    const list = el.history;
    list.innerHTML = "";
    if (!state.history.length) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "No history yet";
      list.appendChild(li);
      return;
    }
    state.history.slice(0, 10).forEach((entry) => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      left.textContent = entry.result;
      left.setAttribute("aria-label", `Result: ${entry.result}`);
      const right = document.createElement("time");
      right.dateTime = new Date(entry.ts).toISOString();
      right.textContent = formatTs(entry.ts);
      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  function announce(result) {
    el.resultAnnounce.textContent = `Result: ${result}`;
  }

  function setCoinSide(result) {
    // Update visual coin face indicator
    if (el.coin) {
      el.coin.setAttribute("data-side", result === "Heads" ? "H" : "T");
    }
  }

  function updateResult(result) {
    el.resultWord.textContent = result;
    announce(result);
    setCoinSide(result);
  }

  function pushHistory(result) {
    state.history.unshift({ ts: Date.now(), result });
    if (state.history.length > 10) {
      state.history.length = 10;
    }
  }

  function handleFlip() {
    // Trigger CSS animation
    el.coin.classList.remove("flip"); // restart animation if clicking fast
    // Force reflow to allow re-adding class for animation restart
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.coin.offsetWidth;
    el.coin.classList.add("flip");

    // Delay result to align with animation
    const ANIM_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600;
    window.setTimeout(() => {
      const result = flipCoin();
      state.total += 1;
      if (result === "Heads") state.heads += 1;
      else state.tails += 1;
      pushHistory(result);
      updateResult(result);
      renderStats();
      renderHistory();
    }, ANIM_MS);
  }

  function handleReset() {
    state.total = 0;
    state.heads = 0;
    state.tails = 0;
    state.history = [];
    el.resultWord.textContent = "—";
    el.resultAnnounce.textContent = "Stats and history reset";
    setCoinSide(""); // clear
    renderStats();
    renderHistory();
  }

  // Init defaults
  setCoinSide("");
  renderStats();
  renderHistory();

  // Events
  el.flipBtn.addEventListener("click", handleFlip);
  el.resetBtn.addEventListener("click", handleReset);

  // Ensure keyboard focus visibility is obvious (handled in CSS)
})();
