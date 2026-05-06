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

if [ -z "$EXAMPLE" ]; then
  echo "Usage: $0 <example-name>" >&2
  exit 1
fi

# ── Lookup (mirrors e2e/examples.config.ts) ──────────────────────────────────
# resolve_example <name>  →  sets PKG BUILD_CMD SERVE_CMD PORT SERVE_ENV
resolve_example() {
  case "$1" in
    vite)                PKG="vite-project";           BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    connectkit)          PKG="connectkit";              BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    privy)               PKG="privy";                   BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    privy-ethers)        PKG="privy-ethers-example";   BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    rainbowkit)          PKG="rainbowkit";              BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    reown)               PKG="reown";                   BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    svelte)              PKG="svelte";                  BUILD_CMD="build";      SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    zustand-widget-config) PKG="zustand-widget-config"; BUILD_CMD="build";     SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    vue)                 PKG="vue";                     BUILD_CMD="build";      SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    nextjs)              PKG="nextjs";                  BUILD_CMD="build";      SERVE_CMD="start";   PORT=3000; SERVE_ENV="" ;;
    nextjs15)            PKG="nextjs15";                BUILD_CMD="build";      SERVE_CMD="start";   PORT=3000; SERVE_ENV="" ;;
    remix)               PKG="remix";                   BUILD_CMD="build";      SERVE_CMD="start";   PORT=4173; SERVE_ENV="PORT=4173" ;;
    react-router-7)      PKG="react-router-7";          BUILD_CMD="build";      SERVE_CMD="start";   PORT=4173; SERVE_ENV="PORT=4173" ;;
    tanstack-router)     PKG="tanstack-router-example"; BUILD_CMD="build";      SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    vite-iframe)         PKG="vite-iframe";             BUILD_CMD="vite-build"; SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    vite-iframe-wagmi)   PKG="vite-iframe-wagmi";       BUILD_CMD="build";      SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    nft-checkout)        PKG="nft-checkout";            BUILD_CMD="build";      SERVE_CMD="preview"; PORT=4173; SERVE_ENV="" ;;
    *)
      echo "Unknown example: '$1'" >&2
      echo "Available: vite connectkit privy privy-ethers rainbowkit reown svelte" >&2
      echo "           zustand-widget-config vue nextjs nextjs15 remix react-router-7" >&2
      echo "           tanstack-router vite-iframe vite-iframe-wagmi nft-checkout" >&2
      exit 1
      ;;
  esac
}

resolve_example "$EXAMPLE"

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
