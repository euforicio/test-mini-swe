'use strict';

const assert = require('assert');
const math = require('./math-utils');

// Addition
assert.strictEqual(math.add(2, 3), 5);
assert.strictEqual(math.add(-1, -4), -5);
assert.strictEqual(math.add(10, -3), 7);

// Subtraction
assert.strictEqual(math.subtract(10, 3), 7);
assert.strictEqual(math.subtract(-5, -5), 0);
assert.strictEqual(math.subtract(-2, 3), -5);

// Multiplication
assert.strictEqual(math.multiply(4, 3), 12);
assert.strictEqual(math.multiply(-4, 2), -8);
assert.strictEqual(math.multiply(-3, -3), 9);

// Division
assert.strictEqual(math.divide(10, 2), 5);
assert.strictEqual(math.divide(-9, 3), -3);
assert.throws(() => math.divide(1, 0), /Division by zero/);

// Square
assert.strictEqual(math.square(5), 25);
assert.strictEqual(math.square(-4), 16);
assert.strictEqual(math.square(0), 0);

console.log('All math-utils tests passed!');
