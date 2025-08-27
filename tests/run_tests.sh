#!/usr/bin/env bash
set -euo pipefail
expected="Tiny test artifact"
file="tests/tiny_test_artifact.txt"
if [ ! -f "$file" ]; then
  echo "Missing test artifact: $file" >&2
  exit 1
fi
if ! grep -q "$expected" "$file"; then
  echo "Expected content not found in $file" >&2
  exit 1
fi
echo "All tests passed."
