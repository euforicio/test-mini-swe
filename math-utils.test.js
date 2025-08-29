'use strict';

const assert = require('assert');
const { add, subtract, multiply, divide, square } = require('./math-utils');

function test(name, fn) {
  try {
    fn();
    console.log('PASS:', name);
  } catch (err) {
    console.error('FAIL:', name, '-' , err && err.message ? err.message : err);
    process.exitCode = 1;
  }
}

// Happy paths
test('add(2, 3) === 5', () => assert.strictEqual(add(2, 3), 5));
test('subtract(5, 3) === 2', () => assert.strictEqual(subtract(5, 3), 2));
test('multiply(4, 3) === 12', () => assert.strictEqual(multiply(4, 3), 12));
test('divide(10, 2) === 5', () => assert.strictEqual(divide(10, 2), 5));
test('square(4) === 16', () => assert.strictEqual(square(4), 16));

// Edge cases
test('operations with negative numbers', () => {
  assert.strictEqual(add(-2, -3), -5);
  assert.strictEqual(subtract(-5, -3), -2);
  assert.strictEqual(multiply(-4, 3), -12);
  assert.strictEqual(divide(-10, 2), -5);
  assert.strictEqual(square(-4), 16);
});

// Error handling
test('divide by zero throws', () => {
  assert.throws(() => divide(1, 0), /divide by zero/i);
});

test('non-number inputs throw for add', () => {
  assert.throws(() => add('2', 3), /valid number/);
  assert.throws(() => add(2, NaN), /valid number/);
});

test('non-number inputs throw for square', () => {
  assert.throws(() => square('4'), /valid number/);
});
