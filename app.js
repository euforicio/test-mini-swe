/**
 * Returns a random integer from 1 to 10 inclusive.
 * Uses Math.random(), which is not cryptographically secure but sufficient here.
 */
function getRandomInt1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

/** Updates the UI with a new random integer. */
function updateNumber() {
  const out = document.getElementById('result');
  if (!out) return;
  const n = getRandomInt1to10();
  out.textContent = String(n);
}

// Initialize on first load and wire up events.
window.addEventListener('DOMContentLoaded', () => {
  updateNumber();
  const btn = document.getElementById('generateBtn');
  if (btn) {
    btn.addEventListener('click', updateNumber);
    // Button natively supports Enter/Space activation.
  }
});
