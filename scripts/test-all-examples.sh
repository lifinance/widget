#!/usr/bin/env bash
# Run the full build → serve → test → kill cycle for every active example.
#
# Usage: bash scripts/test-all-examples.sh
#
# Runs examples sequentially. Failures are collected and reported at the end.
# Exit code is 0 only when every example passes.
# Run from the repository root.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ACTIVE_EXAMPLES=(
  vite
  connectkit
  privy
  privy-ethers
  rainbowkit
  reown
  svelte
  zustand-widget-config
  vue
  nextjs
  nextjs15
  remix
  react-router-7
  tanstack-router
  vite-iframe
  vite-iframe-wagmi
  nft-checkout
)

PASSED=()
FAILED=()

for EXAMPLE in "${ACTIVE_EXAMPLES[@]}"; do
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  [${#PASSED[@]} passed / ${#FAILED[@]} failed]  →  $EXAMPLE"
  echo "════════════════════════════════════════════════════════════"

  if bash "$REPO_ROOT/scripts/test-example.sh" "$EXAMPLE"; then
    PASSED+=("$EXAMPLE")
  else
    FAILED+=("$EXAMPLE")
    echo "::warning:: $EXAMPLE FAILED — continuing with remaining examples"
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Results: ${#PASSED[@]} passed, ${#FAILED[@]} failed"
echo "════════════════════════════════════════════════════════════"

if [ ${#PASSED[@]} -gt 0 ]; then
  echo ""
  echo "  ✅ Passed:"
  for name in "${PASSED[@]}"; do
    echo "     $name"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "  ❌ Failed:"
  for name in "${FAILED[@]}"; do
    echo "     $name"
  done
  echo ""
  exit 1
fi

echo ""
