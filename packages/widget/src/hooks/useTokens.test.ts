import { ChainId, ChainType, type TokenExtended } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTokens } from './useTokens.js'

const mocks = vi.hoisted(() => ({
  getTokens: vi.fn(),
  getToken: vi.fn(),
  getChainTypeFromTokenAddress: vi.fn(),
  useQuery: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@lifi/sdk')>()),
  getTokens: mocks.getTokens,
  getToken: mocks.getToken,
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
}))

vi.mock('@lifi/widget-provider', () => ({
  useChainTypeFromAddress: () => ({
    getChainTypeFromTokenAddress: mocks.getChainTypeFromTokenAddress,
  }),
}))

vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => sdkClient,
}))

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({}),
}))

vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({ chains: [] }),
}))

const sdkClient = { name: 'sdk-client' }
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
// The search index matches names too, so a token that embeds the real
// address in its name comes back for an address query.
const impersonator: TokenExtended = {
  chainId: baseChainId,
  address: '0x7DAAad2659eb9Cd4e78985117F218a58992a2eEa',
  symbol: 'LAPTOP',
  name: `Hunter Biden's Laptop ${laptopAddress}`,
  decimals: 18,
  priceUSD: '0',
}

/** The options of the search query, picked by its key rather than its call order. */
const searchQueryOptions = () =>
  mocks.useQuery.mock.calls
    .map(([options]) => options)
    .find((options) => String(options.queryKey[0]).includes('tokens-search'))

/** Renders the hook and runs the search query's fetcher. */
const runSearch = async (
  search: string,
  chainId?: number,
  signal: AbortSignal = new AbortController().signal
) => {
  const result = useTokens('to', search, chainId)
  const options = searchQueryOptions()
  const tokens = await options.queryFn({ queryKey: options.queryKey, signal })
  return { ...result, tokens }
}

describe('useTokens search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useQuery.mockReturnValue({ data: undefined, isLoading: false })
    mocks.getChainTypeFromTokenAddress.mockImplementation((address: string) =>
      // The Ethereum provider accepts a token address in any letter case.
      address.toLowerCase() === laptopAddress.toLowerCase()
        ? ChainType.EVM
        : undefined
    )
    mocks.getToken.mockResolvedValue(laptop)
  })

  it('flags an address query for the list filter', () => {
    expect(useTokens('to', laptopAddress, baseChainId).isAddressSearch).toBe(
      true
    )
    expect(useTokens('to', 'laptop', baseChainId).isAddressSearch).toBe(false)
  })

  describe('with a selected chain', () => {
    it('fetches the token by address when the index returns only name matches', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator] },
      })

      const { tokens } = await runSearch(laptopAddress, baseChainId)

      expect(mocks.getToken).toHaveBeenCalledWith(
        sdkClient,
        baseChainId,
        laptopAddress,
        expect.anything()
      )
      // Appended, not replacing: the impersonators stay in the response and
      // the address filter is what hides them.
      expect(tokens[baseChainId]).toEqual([impersonator, laptop])
    })

    it('finds the index token when the pasted address differs in letter case', async () => {
      // The index answers with the checksummed address; a paste often is not.
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator, laptop] },
      })

      await runSearch(laptopAddress.toLowerCase(), baseChainId)

      expect(mocks.getToken).not.toHaveBeenCalled()
    })

    it('does not fetch by address when the index has the token at that address', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator, laptop] },
      })

      const { tokens } = await runSearch(laptopAddress, baseChainId)

      expect(mocks.getToken).not.toHaveBeenCalled()
      expect(tokens[baseChainId]).toEqual([impersonator, laptop])
    })

    it('does not fetch by address for a text query with results', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator] },
      })

      await runSearch('laptop', baseChainId)

      expect(mocks.getToken).not.toHaveBeenCalled()
    })

    it('fetches by address when the index returns nothing for the chain', async () => {
      mocks.getTokens.mockResolvedValue({ tokens: {} })

      const { tokens } = await runSearch(laptopAddress, baseChainId)

      expect(tokens[baseChainId]).toEqual([laptop])
    })
  })

  describe('in all networks', () => {
    it('keeps the token the index found on another chain without a lookup', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator, laptop] },
      })

      const { tokens } = await runSearch(laptopAddress)

      expect(mocks.getToken).not.toHaveBeenCalled()
      expect(tokens).toEqual({ [baseChainId]: [impersonator, laptop] })
    })

    it('keeps the index results when the lookup on the guessed chain fails', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [impersonator] },
      })
      mocks.getToken.mockRejectedValue(new Error('HTTP 400'))

      const { tokens } = await runSearch(laptopAddress)

      expect(mocks.getToken).toHaveBeenCalledWith(
        sdkClient,
        ChainId.ETH,
        laptopAddress,
        expect.anything()
      )
      expect(tokens).toEqual({ [baseChainId]: [impersonator] })
    })

    it('rethrows when the lookup is aborted', async () => {
      mocks.getTokens.mockResolvedValue({ tokens: {} })
      mocks.getToken.mockRejectedValue(new Error('aborted'))
      const controller = new AbortController()
      controller.abort()

      await expect(
        runSearch(laptopAddress, undefined, controller.signal)
      ).rejects.toThrow('aborted')
    })
  })

  describe('query text', () => {
    it('trims the query before it reaches the API', async () => {
      mocks.getTokens.mockResolvedValue({
        tokens: { [baseChainId]: [laptop] },
      })

      useTokens('to', `  ${laptopAddress}\n`, baseChainId)
      const options = searchQueryOptions()
      await options.queryFn({
        queryKey: options.queryKey,
        signal: new AbortController().signal,
      })

      expect(options.queryKey[1]).toBe(laptopAddress)
      expect(mocks.getTokens).toHaveBeenCalledWith(
        sdkClient,
        expect.objectContaining({ search: laptopAddress }),
        expect.anything()
      )
    })

    it('does not query for a whitespace-only search', () => {
      useTokens('to', '   ', baseChainId)

      expect(searchQueryOptions().enabled).toBe(false)
    })
  })
})
