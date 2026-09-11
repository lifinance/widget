import type { TokenExtended } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTokenBalances } from './useTokenBalances.js'

const mocks = vi.hoisted(() => ({
  useTokens: vi.fn(),
  useTokenBalancesQueries: vi.fn(),
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
}))

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({}),
}))

vi.mock('../stores/pinnedTokens/PinnedTokensStore.js', () => ({
  usePinnedTokensStore: <T>(
    selector: (state: { pinnedTokens: Record<number, string[]> }) => T
  ) => selector({ pinnedTokens: {} }),
}))

vi.mock('../stores/settings/useSettings.js', () => ({
  useSettings: () => ({ smallBalanceThreshold: undefined }),
}))

vi.mock('./useAccountsBalancesData.js', () => ({
  useAccountsBalancesData: () => ({ data: undefined, isLoading: false }),
}))

vi.mock('./useTokenBalancesQueries.js', () => ({
  useTokenBalancesQueries: mocks.useTokenBalancesQueries,
}))

vi.mock('./useTokens.js', () => ({
  useTokens: mocks.useTokens,
}))

const baseChainId = 8453
const laptopAddress = '0xB095274743941e953c746F9C228DA9c18Bb6ec29'
const laptop: TokenExtended = {
  chainId: baseChainId,
  address: laptopAddress,
  symbol: 'LAPTOP',
  name: 'LAPTOP',
  decimals: 18,
  priceUSD: '0.001',
}
// An impersonator from the search index: the real address sits in its name.
const impersonator: TokenExtended = {
  chainId: baseChainId,
  address: '0x7DAAad2659eb9Cd4e78985117F218a58992a2eEa',
  symbol: 'LAPTOP',
  name: `Hunter Biden's Laptop ${laptopAddress}`,
  decimals: 18,
  priceUSD: '0',
}
const usdc: TokenExtended = {
  chainId: baseChainId,
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  priceUSD: '1',
}

const addressesOf = (tokens: { address: string }[]) =>
  tokens.map((token) => token.address)

describe('useTokenBalances search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useTokenBalancesQueries.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })
    mocks.useTokens.mockReturnValue({
      allTokens: { [baseChainId]: [usdc, impersonator, laptop] },
      isLoading: false,
      isSearchLoading: false,
      isAddressSearch: false,
    })
  })

  it('lists only the token at the searched address', () => {
    mocks.useTokens.mockReturnValue({
      allTokens: { [baseChainId]: [usdc, impersonator, laptop] },
      isLoading: false,
      isSearchLoading: false,
      isAddressSearch: true,
    })

    const { tokens } = useTokenBalances(baseChainId, 'to', false, laptopAddress)

    expect(addressesOf(tokens)).toEqual([laptopAddress])
  })

  it('hides an impersonator at the searched address even when the wallet holds it', () => {
    mocks.useTokens.mockReturnValue({
      allTokens: { [baseChainId]: [usdc, impersonator, laptop] },
      isLoading: false,
      isSearchLoading: false,
      isAddressSearch: true,
    })
    mocks.useTokenBalancesQueries.mockReturnValue({
      data: [
        { ...impersonator, amount: 5_000_000_000_000_000_000n },
        { ...laptop, amount: 1_000_000_000_000_000_000n },
      ],
      isLoading: false,
      isError: false,
    })

    const { tokens } = useTokenBalances(baseChainId, 'to', false, laptopAddress)

    expect(addressesOf(tokens)).toEqual([laptopAddress])
  })

  it('keeps name and symbol matches for a text search', () => {
    const { tokens } = useTokenBalances(baseChainId, 'to', false, 'laptop')

    expect(new Set(addressesOf(tokens))).toEqual(
      new Set([impersonator.address, laptopAddress])
    )
  })
})
