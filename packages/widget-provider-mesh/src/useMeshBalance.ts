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
  /**
   * Raw token balance in base units (no decimal scaling). BigInt is used so
   * comparisons against `parseUnits(amount, decimals)` are precision-safe
   * for tokens with up to 18 decimals.
   */
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
  const { onrampSessionApiUrl } = useCheckoutConfig()
  const userId = useCheckoutUserId()

  const [result, setResult] = useState<MeshBalanceResult>(EMPTY)

  const lastKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const apiUrl = onrampSessionApiUrl?.replace(/\/$/, '')
    if (!apiUrl || !tokenAddress || !chainId || !userId) {
      // Only clear state if we were previously holding a value for a
      // different key — avoids re-setting EMPTY on unrelated renders and
      // discarding any in-flight fetch result.
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

    // TODO: remove stub and uncomment the fetch block below once Core ships
    // the `/v1/checkout/cex/balance` endpoint. Compare in raw BigInt units
    // against `parseUnits(amount, decimals)` to avoid float precision loss.
    setResult(EMPTY)

    /*
    setResult({ rawBalance: null, decimals: null, isLoading: true, error: null })

    const params = new URLSearchParams({
      tokenAddress,
      chainId: String(chainId),
      userId,
    })

    fetch(`${apiUrl}/v1/checkout/cex/balance?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setResult({
            rawBalance: null,
            decimals: null,
            isLoading: false,
            error: `HTTP ${res.status}`,
          })
          return
        }
        const data = (await res.json()) as MeshBalanceResponse
        setResult({
          rawBalance: BigInt(data.balance),
          decimals: data.decimals,
          isLoading: false,
          error: null,
        })
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Network error fetching balance.'
        setResult({
          rawBalance: null,
          decimals: null,
          isLoading: false,
          error: msg,
        })
      })
    */
  }, [userId, tokenAddress, chainId, onrampSessionApiUrl])

  return result
}
