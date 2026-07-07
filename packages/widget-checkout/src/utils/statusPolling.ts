const ROOT = 'checkout-status' as const

export function depositAddressQueryKey(
  depositAddress: string | null | undefined,
  fromChain: number | null | undefined
): readonly unknown[] {
  return [ROOT, 'deposit', depositAddress ?? null, fromChain ?? null]
}

export function txHashQueryKey(
  transactionHash: string | null | undefined
): readonly unknown[] {
  return [ROOT, 'hash', transactionHash ?? null]
}

export function simulateQueryKey(
  simulate: string | null | undefined,
  substatus?: string | null
): readonly unknown[] {
  return [ROOT, 'sim', simulate ?? null, substatus ?? null]
}

/**
 * Most transfers take minutes, not seconds. Poll fast for the first 30 s
 * (when users are most likely watching), then back off so a 5-minute
 * deposit doesn't fire 60 requests at the API.
 */
export function computeBackoffInterval(startMs: number): number {
  const elapsed = Date.now() - startMs
  if (elapsed < 30_000) {
    return 5_000
  }
  if (elapsed < 120_000) {
    return 15_000
  }
  return 30_000
}
