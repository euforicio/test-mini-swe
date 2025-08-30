const assert = require('assert');
const { add } = require('./math-utils');

assert.strictEqual(add(2, 3), 5, '2 + 3 should equal 5');
assert.strictEqual(add(-1, 1), 0, '-1 + 1 should equal 0');
assert.strictEqual(add(0, 0), 0, '0 + 0 should equal 0');

console.log('✅ math-utils add() basic tests passed.');
