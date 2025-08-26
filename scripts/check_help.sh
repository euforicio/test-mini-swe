#!/usr/bin/env bash
set -euo pipefail
if grep -qiE '^[[:space:]]*#{1,6}[[:space:]]+help[[:space:]]*$' README.md; then
  echo "Help section found."
  exit 0
else
  echo "Help section missing."
  exit 1
fi
