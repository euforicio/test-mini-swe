'use strict';

/**
 * Basic math utilities.
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function square(a) {
  return a * a;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  square,
};
