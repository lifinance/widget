import { fetchCryptoCurrencies } from './transak.js'
import type { TransakCryptoCurrency } from './types.js'

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

// Transak staging API uses testnet chain IDs
// Map mainnet chain IDs to their corresponding testnet chain IDs
const MAINNET_TO_TESTNET_CHAIN_ID: Record<number, number> = {
  1: 11155111, // Ethereum mainnet → Sepolia
  137: 80002, // Polygon mainnet → Amoy
  42161: 421614, // Arbitrum One → Arbitrum Sepolia
  10: 11155420, // Optimism → Optimism Sepolia
  8453: 84532, // Base → Base Sepolia
}

let cryptoCurrencies: TransakCryptoCurrency[] = []
let lastFetchedAt = 0
let pendingLoad: Promise<void> | null = null

const FALLBACK_CRYPTO_CURRENCIES: TransakCryptoCurrency[] = [
  {
    coinId: 'usdc-ethereum',
    symbol: 'USDC',
    name: 'USD Coin',
    isAllowed: true,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    network: { name: 'ethereum', chainId: '1' },
    uniqueId: 'usdc-ethereum',
  },
  {
    coinId: 'usdt-ethereum',
    symbol: 'USDT',
    name: 'Tether USD',
    isAllowed: true,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    network: { name: 'ethereum', chainId: '1' },
    uniqueId: 'usdt-ethereum',
  },
  {
    coinId: 'eth-ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    isAllowed: true,
    address: '0x0000000000000000000000000000000000000000',
    network: { name: 'ethereum', chainId: '1' },
    uniqueId: 'eth-ethereum',
  },
  {
    coinId: 'steth-ethereum',
    symbol: 'stETH',
    name: 'Lido Staked Ether',
    isAllowed: true,
    address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    network: { name: 'ethereum', chainId: '1' },
    uniqueId: 'steth-ethereum',
  },
  {
    coinId: 'usdc-polygon',
    symbol: 'USDC',
    name: 'USD Coin',
    isAllowed: true,
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    network: { name: 'polygon', chainId: '137' },
    uniqueId: 'usdc-polygon',
  },
  {
    coinId: 'matic-polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    isAllowed: true,
    address: '0x0000000000000000000000000000000000000000',
    network: { name: 'polygon', chainId: '137' },
    uniqueId: 'matic-polygon',
  },
  {
    coinId: 'usdc-arbitrum',
    symbol: 'USDC',
    name: 'USD Coin',
    isAllowed: true,
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    network: { name: 'arbitrum', chainId: '42161' },
    uniqueId: 'usdc-arbitrum',
  },
  {
    coinId: 'eth-arbitrum',
    symbol: 'ETH',
    name: 'Ethereum',
    isAllowed: true,
    address: '0x0000000000000000000000000000000000000000',
    network: { name: 'arbitrum', chainId: '42161' },
    uniqueId: 'eth-arbitrum',
  },
  {
    coinId: 'usdc-optimism',
    symbol: 'USDC',
    name: 'USD Coin',
    isAllowed: true,
    address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    network: { name: 'optimism', chainId: '10' },
    uniqueId: 'usdc-optimism',
  },
  {
    coinId: 'eth-optimism',
    symbol: 'ETH',
    name: 'Ethereum',
    isAllowed: true,
    address: '0x0000000000000000000000000000000000000000',
    network: { name: 'optimism', chainId: '10' },
    uniqueId: 'eth-optimism',
  },
]

export async function loadCryptoCurrencies(): Promise<void> {
  try {
    const fromApi = await fetchCryptoCurrencies()
    cryptoCurrencies = mergeFallbackIntoCatalog(fromApi)
    lastFetchedAt = Date.now()
    console.warn(
      `Loaded ${fromApi.length} crypto currencies from Transak API (${cryptoCurrencies.length} after merging checkout fallbacks)`
    )
  } catch (err) {
    console.warn(
      'Failed to fetch crypto currencies from Transak API, using fallback data:',
      err instanceof Error ? err.message : err
    )
    cryptoCurrencies = FALLBACK_CRYPTO_CURRENCIES
    lastFetchedAt = Date.now()
  }
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

const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

function isNativeToken(address: string): boolean {
  return address.toLowerCase() === NATIVE_TOKEN_ADDRESS
}

function matchesTokenAddress(
  currency: { address: string | null },
  tokenAddress: string
): boolean {
  const tokenLower = tokenAddress.toLowerCase()
  const currencyAddressLower = currency.address?.toLowerCase()

  if (isNativeToken(tokenAddress)) {
    return !currency.address || currencyAddressLower === NATIVE_TOKEN_ADDRESS
  }

  return currencyAddressLower === tokenLower
}

/**
 * Transak's public catalog can omit assets we support in checkout (e.g. mainnet stETH)
 * or only list testnet chain IDs. Append fallback rows when the API did not already
 * define the same token on the same chain (address + chainId).
 */
function mergeFallbackIntoCatalog(
  fromApi: TransakCryptoCurrency[]
): TransakCryptoCurrency[] {
  const merged = [...fromApi]
  for (const fb of FALLBACK_CRYPTO_CURRENCIES) {
    const chainIdStr = String(fb.network?.chainId ?? '')
    const already = merged.some(
      (c) =>
        c.isAllowed &&
        matchesTokenAddress(c, fb.address ?? NATIVE_TOKEN_ADDRESS) &&
        String(c.network?.chainId) === chainIdStr
    )
    if (!already) {
      merged.push(fb)
    }
  }
  return merged
}

export async function resolveTokenToTransak(
  tokenAddress: string,
  chainId: number
): Promise<{ cryptoCurrencyCode: string; network: string }> {
  await ensureFresh()

  // Try both the original chainId and its testnet equivalent (for staging API)
  const chainIdsToTry = [chainId]
  const testnetChainId = MAINNET_TO_TESTNET_CHAIN_ID[chainId]
  if (testnetChainId) {
    chainIdsToTry.push(testnetChainId)
  }

  for (const tryChainId of chainIdsToTry) {
    const chainIdStr = String(tryChainId)

    const match = cryptoCurrencies.find(
      (c) =>
        c.isAllowed &&
        matchesTokenAddress(c, tokenAddress) &&
        String(c.network?.chainId) === chainIdStr
    )

    if (match?.network) {
      return {
        cryptoCurrencyCode: match.symbol,
        network: match.network.name,
      }
    }
  }

  throw new ResolveError(
    `No Transak crypto currency found for token ${tokenAddress} on chain ${chainId}`
  )
}

export class ResolveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResolveError'
  }
}
