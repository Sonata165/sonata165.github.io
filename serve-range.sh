#!/usr/bin/env bash
# Local dev server with correct HTTP Range support for <audio>/<video>.
#
# `jekyll serve`'s built-in WEBrick server handles Range requests and aborted
# media connections poorly, which breaks audio/video playback on page refresh
# in local dev only (see Readme.md). This script rebuilds the site on change
# with `jekyll build --watch`, and serves _site/ with Caddy instead.
#
# Requires: brew install caddy
# Usage:    ./serve-range.sh

set -euo pipefail
cd "$(dirname "$0")"

PORT=4000

cleanup() {
  [[ -n "${JEKYLL_PID:-}" ]] && kill "$JEKYLL_PID" 2>/dev/null || true
  [[ -n "${BANNER_PID:-}" ]] && kill "$BANNER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Print the URL only once Caddy is actually answering, so it lands at the
# bottom of the console instead of being buried under Jekyll's build output.
{
  until curl -sf -o /dev/null "http://localhost:${PORT}/" 2>/dev/null; do
    sleep 0.2
  done
  sleep 1
  printf '\n\033[1;32m➜  Serving _site/ at http://localhost:%s\033[0m  (Range-aware, via Caddy)\n\n' "$PORT"
} &
BANNER_PID=$!

bundle exec jekyll build --watch &
JEKYLL_PID=$!

caddy run --config Caddyfile.dev --adapter caddyfile
