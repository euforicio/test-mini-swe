import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEmail, validatePasswordStrength, hashPassword, verifyPassword, signCookie, verifySignedCookie } from '../src/lib/security.js';

test('validateEmail works', () => {
  assert.equal(validateEmail('user@example.com'), true);
  assert.equal(validateEmail('bad-email'), false);
});

test('validatePasswordStrength enforces rules', () => {
  const weak = validatePasswordStrength('short');
  assert.equal(weak.valid, false);
  const strong = validatePasswordStrength('Str0ng-P@ss!');
  assert.equal(strong.valid, true);
});

test('password hashing and verification', async () => {
  const hash = await hashPassword('Str0ng-P@ss!');
  assert.equal(await verifyPassword('Str0ng-P@ss!', hash), true);
  assert.equal(await verifyPassword('wrong', hash), false);
});

test('signed cookies', () => {
  const signed = signCookie('abc123', 'secret');
  const valid = verifySignedCookie(signed, 'secret');
  assert.equal(valid, 'abc123');
  const invalid = verifySignedCookie(signed, 'wrongsecret');
  assert.equal(invalid, null);
});
