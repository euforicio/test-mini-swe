'use strict';

const assert = require('assert');
const { formatDate } = require('./date-utils');

function test(name, fn) {
  try {
    fn();
    console.log('PASS:', name);
  } catch (e) {
    console.error('FAIL:', name, '-', e && e.message ? e.message : e);
    process.exitCode = 1;
  }
}

test('pads month and day', () => {
  const d = new Date(2023, 0, 5); // Jan 5, 2023
  assert.strictEqual(formatDate(d), '2023-01-05');
});

test('handles double-digit month/day', () => {
  const d = new Date(1999, 10, 15); // Nov 15, 1999
  assert.strictEqual(formatDate(d), '1999-11-15');
});

test('throws on invalid input', () => {
  let threw = false;
  try { formatDate('not-a-date'); } catch (_) { threw = true; }
  assert.strictEqual(threw, true);
});
