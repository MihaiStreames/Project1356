#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS="$ROOT/scripts"
STATIC="$ROOT/static"

chrome() {
  chromium \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --virtual-time-budget=2000 \
    "$@"
}

echo "Rendering favicon..."
chrome \
  --window-size=512,512 \
  --screenshot="$STATIC/favicon.png" \
  "file://$SCRIPTS/favicon.html" >/dev/null

echo "Rendering og-image..."
chrome \
  --window-size=1200,630 \
  --screenshot="$STATIC/og-image.png" \
  "file://$SCRIPTS/og-image.html" >/dev/null

echo "Done"
