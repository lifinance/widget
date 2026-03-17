import { fetchCryptoCurrencies } from './transak.js'
import type { TransakCryptoCurrency } from './types.js'

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

let cryptoCurrencies: TransakCryptoCurrency[] = []
let lastFetchedAt = 0
let pendingLoad: Promise<void> | null = null

export async function loadCryptoCurrencies(): Promise<void> {
  cryptoCurrencies = await fetchCryptoCurrencies()
  lastFetchedAt = Date.now()
}

async function ensureFresh(): Promise<void> {
  if (
    cryptoCurrencies.length === 0 ||
    Date.now() - lastFetchedAt > REFRESH_INTERVAL_MS
  ) {
    if (pendingLoad) {
      return pendingLoad
    }
    pendingLoad = loadCryptoCurrencies().finally(() => {
      pendingLoad = null
    })
    return pendingLoad
  }
}

export async function resolveTokenToTransak(
  tokenAddress: string,
  chainId: number
): Promise<{ cryptoCurrencyCode: string; network: string }> {
  await ensureFresh()

  const chainIdStr = String(chainId)
  const addressLower = tokenAddress.toLowerCase()

  const match = cryptoCurrencies.find(
    (c) =>
      c.isAllowed &&
      c.address?.toLowerCase() === addressLower &&
      c.network?.chainId === chainIdStr
  )

  if (!match || !match.network) {
    throw new ResolveError(
      `No Transak crypto currency found for token ${tokenAddress} on chain ${chainId}`
    )
  }

  return {
    cryptoCurrencyCode: match.cryptoCurrencyCode,
    network: match.network.name,
  }
}

export class ResolveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResolveError'
  }
}
