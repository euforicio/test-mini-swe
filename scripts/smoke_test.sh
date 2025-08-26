#!/usr/bin/env bash
set -e
echo "Running smoke test..."
if [ -f "tests/tiny_artifact_202508262344.txt" ]; then
  echo "Found tiny test artifact."
  echo "OK"
  exit 0
else
  echo "Missing test artifact!" >&2
  exit 1
fi
