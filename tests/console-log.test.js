"use strict";
(function runTest() {
  const captured = [];
  const originalLog = console.log;
  console.log = (...args) => captured.push(args.join(" "));
  try {
    console.log("Hello from console.log test");
  } finally {
    console.log = originalLog;
  }
  const expected = "Hello from console.log test";
  if (captured.length !== 1 || captured[0] !== expected) {
    console.error(`Test failed: expected "${expected}", got "${captured.join("\n")}"`);
    process.exit(1);
  } else {
    console.log("Console.log test passed");
  }
})();
