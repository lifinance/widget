import type { Route } from '@lifi/sdk'

export interface HashStatusHints {
  bridge?: string
  fromChain?: number
  toChain?: number
}

// `getStatus({ txHash })` needs `bridge` (and the chains) to resolve a
// cross-chain transfer by hash; without them the API can stay NOT_FOUND. Derive
// them from the frozen route. Same-chain swaps have no `cross` step, so `bridge`
// is omitted and the hash poll resolves on its own.
export function extractStatusHints(
  route: Route | undefined | null
): HashStatusHints {
  if (!route) {
    return {}
  }
  const bridge = (route.steps ?? [])
    .flatMap((step) => step.includedSteps ?? [])
    .find((included) => included.type === 'cross')?.toolDetails?.key
  const hints: HashStatusHints = {
    fromChain: route.fromChainId,
    toChain: route.toChainId,
  }
  if (bridge) {
    hints.bridge = bridge
  }
  return hints
}
