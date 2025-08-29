const assert = require('assert');
const { sayHello } = require('../hello');

assert.strictEqual(sayHello(), 'Hello, World!');
console.log('All tests passed: sayHello() returns Hello, World!');
