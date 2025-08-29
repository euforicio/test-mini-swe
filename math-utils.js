'use strict';

function assertNumber(n, name) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError(`${name} must be a valid number`);
  }
}

function add(a, b) {
  assertNumber(a, 'a'); assertNumber(b, 'b');
  return a + b;
}

function subtract(a, b) {
  assertNumber(a, 'a'); assertNumber(b, 'b');
  return a - b;
}

function multiply(a, b) {
  assertNumber(a, 'a'); assertNumber(b, 'b');
  return a * b;
}

function divide(a, b) {
  assertNumber(a, 'a'); assertNumber(b, 'b');
  if (b === 0) throw new RangeError('Cannot divide by zero');
  return a / b;
}

function square(x) {
  assertNumber(x, 'x');
  return x * x;
}

module.exports = { add, subtract, multiply, divide, square };
