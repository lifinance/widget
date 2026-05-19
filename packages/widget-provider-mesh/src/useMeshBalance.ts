'use client'
import {
  useCheckoutConfig,
  useCheckoutUserId,
} from '@lifi/widget-provider/checkout'
import { useEffect, useRef, useState } from 'react'

/**
 * Expected shape returned by `GET /v1/checkout/cex/balance`.
 *
 * TODO: confirm exact field names with Core once the endpoint ships.
 * The assumed shape is:
 *   { balance: string; decimals: number }
 * where `balance` is the raw integer amount as a decimal string (e.g. "1500000" for 1.5 USDC with 6 decimals).
 */
export interface MeshBalanceResponse {
  /** Raw token balance as a decimal-string integer (unscaled by decimals). */
  balance: string
  decimals: number
}

export interface MeshBalanceResult {
  /** Base-unit balance (no decimal scaling); compare against `parseUnits(amount, decimals)`. */
  rawBalance: bigint | null
  decimals: number | null
  isLoading: boolean
  error: string | null
}

interface FetchKey {
  account: string
  tokenAddress: string
  chainId: number
}

function keyOf(k: FetchKey): string {
  return `${k.account}:${k.tokenAddress}:${k.chainId}`
}

const EMPTY: MeshBalanceResult = {
  rawBalance: null,
  decimals: null,
  isLoading: false,
  error: null,
}

/**
 * Fetch-once hook that retrieves the user's Mesh exchange balance for a
 * specific token/chain combination. Re-fetches only when (account, token,
 * chain) changes.
 *
 * Uses `GET /v1/checkout/cex/balance?tokenAddress=&chainId=&userId=`.
 *
 * TODO: replace stub with real fetch once Core ships the balance endpoint.
 * Until then the hook returns the empty result so callers never show a false
 * insufficient-funds alert.
 */
export function useMeshBalance(
  tokenAddress: string | undefined,
  chainId: number | undefined
): MeshBalanceResult {
  const { apiUrl } = useCheckoutConfig()
  const userId = useCheckoutUserId()

  const [result, setResult] = useState<MeshBalanceResult>(EMPTY)

  const lastKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!apiUrl || !tokenAddress || !chainId || !userId) {
      if (lastKeyRef.current !== null) {
        lastKeyRef.current = null
        setResult(EMPTY)
      }
      return
    }

    const key = keyOf({ account: userId, tokenAddress, chainId })
    if (key === lastKeyRef.current) {
      return
    }
    lastKeyRef.current = key

    // TODO: replace stub once Core ships `/v1/checkout/cex/balance`. Normalize
    // `apiUrl` the same way `sessionClient.ts` does to avoid a doubled `/v1`.
    setResult(EMPTY)
  }, [userId, tokenAddress, chainId, apiUrl])

  return result
}
