document.addEventListener(DOMContentLoaded, () => {
  const btn = document.getElementById(generateBtn);
  const display = document.getElementById(display);

  function generate() {
    // Generates an integer 1..10 inclusive
    const n = Math.floor(Math.random() * 10) + 1;
    display.textContent = String(n);
  }

  btn.addEventListener(click, generate);
});
