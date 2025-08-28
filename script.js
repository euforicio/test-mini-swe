(function () {
  'use strict';
  function generateRandom() {
    // Ensures an integer between 1 and 10 inclusive
    return Math.floor(Math.random() * 10) + 1;
  }
  function update() {
    var el = document.getElementById('random-number');
    if (el) el.textContent = String(generateRandom());
  }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('generate-btn');
    if (btn) btn.addEventListener('click', update);
    // Generate an initial value for better UX
    update();
  });
})();
