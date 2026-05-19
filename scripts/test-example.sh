#!/usr/bin/env bash
# Run a full build → serve → test → kill cycle for a single example.
#
# Usage: bash scripts/test-example.sh <example-name>
#   e.g. bash scripts/test-example.sh vite
#        bash scripts/test-example.sh tanstack-router
#        bash scripts/test-example.sh nft-checkout
#
# The example name must match the `name` field in e2e/examples.config.ts.
# Run from the repository root.

set -euo pipefail

EXAMPLE="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_JSON="$SCRIPT_DIR/../e2e/examples.json"

if [ -z "$EXAMPLE" ]; then
  echo "Usage: $0 <example-name>" >&2
  exit 1
fi

# ── Lookup (reads e2e/examples.json) ─────────────────────────────────────────
Q='.[] | select(.name==$n)'
if ! jq -e --arg n "$EXAMPLE" "$Q | .name" "$EXAMPLES_JSON" > /dev/null 2>&1; then
  echo "Unknown example: '$EXAMPLE'" >&2
  echo "Available: $(jq -r '.[] | select(.status=="active") | .name' "$EXAMPLES_JSON" | tr '\n' ' ')" >&2
  exit 1
fi

PKG=$(jq -r      --arg n "$EXAMPLE" "$Q | .pkg"      "$EXAMPLES_JSON")
BUILD_CMD=$(jq -r --arg n "$EXAMPLE" "$Q | .buildCmd" "$EXAMPLES_JSON")
SERVE_CMD=$(jq -r --arg n "$EXAMPLE" "$Q | .serveCmd" "$EXAMPLES_JSON")
PORT=$(jq -r     --arg n "$EXAMPLE" "$Q | .port"     "$EXAMPLES_JSON")
SERVE_ENV=$(jq -r --arg n "$EXAMPLE" "$Q | .serveEnv // {} | to_entries | map(.key+\"=\"+.value) | join(\" \")" "$EXAMPLES_JSON")

echo "──────────────────────────────────────────────────────────"
echo "  Example : $EXAMPLE"
echo "  Package : $PKG"
echo "  Build   : $BUILD_CMD"
echo "  Serve   : $SERVE_CMD (port $PORT)"
echo "  Env     : ${SERVE_ENV:-<none>}"
echo "──────────────────────────────────────────────────────────"

# ── Cleanup on exit ──────────────────────────────────────────────────────────
SERVER_PID=""
SERVER_LOG=""
TEST_EXIT_CODE=0
cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  # Print server log on test failure so server-side errors are diagnosable
  if [ "$TEST_EXIT_CODE" != "0" ] && [ -n "$SERVER_LOG" ] && [ -s "$SERVER_LOG" ]; then
    echo "" >&2
    echo "Server log ($EXAMPLE):" >&2
    cat "$SERVER_LOG" >&2
  fi
  rm -f "$SERVER_LOG"
}
trap cleanup EXIT

# ── Step 1: Build ─────────────────────────────────────────────────────────────
echo ""
echo "▶ Building $PKG..."
if [ "$BUILD_CMD" = "vite-build" ]; then
  pnpm --filter "$PKG" exec vite build
else
  pnpm --filter "$PKG" build
fi

# ── Step 2: Free the port, then serve ─────────────────────────────────────────
echo ""
echo "▶ Starting server on port $PORT..."
EXISTING_PID="$(lsof -ti:$PORT 2>/dev/null || true)"
if [ -n "$EXISTING_PID" ]; then
  echo "  Port $PORT occupied (pid $EXISTING_PID) — killing before start..."
  echo "$EXISTING_PID" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

SERVER_LOG="$(mktemp /tmp/example-server-XXXX.log)"
if [ -n "$SERVE_ENV" ]; then
  env $SERVE_ENV pnpm --filter "$PKG" "$SERVE_CMD" > "$SERVER_LOG" 2>&1 &
else
  pnpm --filter "$PKG" "$SERVE_CMD" > "$SERVER_LOG" 2>&1 &
fi
SERVER_PID=$!

# ── Step 3: Wait for OUR server (verify PID is still alive) ──────────────────
URL="http://localhost:${PORT}"
echo "  Waiting for $URL (45s timeout)..."
READY=false
for i in $(seq 1 45); do
  # Bail early if the server process already died
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Error: server process exited unexpectedly" >&2
    echo "Server log:" >&2
    cat "$SERVER_LOG" >&2
    exit 1
  fi
  if curl -sf "$URL" > /dev/null 2>&1; then
    echo "  Server ready after ${i}s"
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" != "true" ]; then
  echo "Error: server failed to start within 45s at $URL" >&2
  echo "Server log:" >&2
  cat "$SERVER_LOG" >&2
  exit 1
fi

# ── Step 4: Run Playwright tests ──────────────────────────────────────────────
echo ""
echo "▶ Running Playwright tests for project '$EXAMPLE'..."
cd e2e
pnpm e2e:example "$EXAMPLE" || { TEST_EXIT_CODE=$?; exit $TEST_EXIT_CODE; }
