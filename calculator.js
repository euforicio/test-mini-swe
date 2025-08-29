(function (global) {
  'use strict';

  function toNumber(x) {
    const n = typeof x === 'number' ? x : parseFloat(x);
    if (Number.isNaN(n)) throw new Error('Invalid number');
    return n;
  }

  function add(a, b) {
    return toNumber(a) + toNumber(b);
  }

  function subtract(a, b) {
    return toNumber(a) - toNumber(b);
  }

  function multiply(a, b) {
    return toNumber(a) * toNumber(b);
  }

  function divide(a, b) {
    const denom = toNumber(b);
    if (denom === 0) throw new Error('Division by zero');
    return toNumber(a) / denom;
  }

  const api = { add, subtract, multiply, divide };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.Calculator = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
