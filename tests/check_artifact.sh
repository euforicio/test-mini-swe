#!/usr/bin/env bash
set -e
FILE="tests/tiny_artifact_202508270041.txt"
if [ -f "$FILE" ]; then
  echo "Artifact present: $FILE"
  echo "Preview:"
  head -n 4 "$FILE" || true
  exit 0
else
  echo "Artifact missing: $FILE" >&2
  exit 1
fi
