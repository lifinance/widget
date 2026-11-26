import type { FeeCost, LiFiStep, RouteExtended, Token } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getQueryKey } from '../utils/queries.js'
import { useGasSufficiency } from './useGasSufficiency.js'

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  getTokenBalancesWithRetry: vi.fn(),
}))

const ethChain = {
  id: 1,
  chainType: ChainType.EVM,
  name: 'Ethereum',
} as const

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
}))

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    account: {
      address: '0x000000000000000000000000000000000000dEaD',
      chainType: ChainType.EVM,
    },
    accounts: [
      {
        isConnected: true,
        address: '0x000000000000000000000000000000000000dEaD',
        chainType: ChainType.EVM,
      },
    ],
  }),
}))

vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => ({ config: { apiUrl: 'https://li.quest/v1' } }),
}))

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ storageScopeKey: 'test', hiddenUI: {} }),
}))

vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({
    getChainById: (chainId: number) => (chainId === 1 ? ethChain : undefined),
  }),
}))

vi.mock('./useIsContractAddress.js', () => ({
  useIsContractAddress: () => ({ isContractAddress: false, isLoading: false }),
}))

vi.mock('./useTokenBalance.js', () => ({
  getTokenBalancesWithRetry: mocks.getTokenBalancesWithRetry,
}))

const ETH = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  symbol: 'ETH',
  decimals: 18,
  priceUSD: '2000',
} as Token

const makeStep = (estimate: {
  gasCosts?: { amount: string; token: Token }[]
  feeCosts?: FeeCost[]
}): LiFiStep =>
  ({
    action: {
      fromChainId: 1,
      toChainId: 56,
      fromToken: ETH,
      toToken: ETH,
    },
    includedSteps: [],
    estimate: {
      ...estimate,
      feeCosts: estimate.feeCosts ?? [],
    },
  }) as unknown as LiFiStep

const makeRoute = (steps: LiFiStep[]): RouteExtended =>
  ({
    id: 'route-test',
    fromChainId: 1,
    toChainId: 56,
    fromToken: ETH,
    fromAmount: '1000000000000000000',
    steps,
  }) as unknown as RouteExtended

const gasSufficiencyQueryOptions = () => {
  const options = mocks.useQuery.mock.calls
    .map(([queryOptions]) => queryOptions)
    .find((queryOptions) =>
      String(queryOptions.queryKey[0]).includes(
        getQueryKey('gas-sufficiency-check', 'test')
      )
    )
  if (!options) {
    throw new Error('gas sufficiency query was not registered')
  }
  return options
}

const runGasSufficiency = async (route: RouteExtended) => {
  useGasSufficiency(route)
  const options = gasSufficiencyQueryOptions()
  return options.queryFn({
    queryKey: options.queryKey,
    signal: new AbortController().signal,
  })
}

describe('useGasSufficiency amount reducers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useQuery.mockReturnValue({ data: undefined, isLoading: false })
    mocks.getTokenBalancesWithRetry.mockResolvedValue([
      {
        chainId: 1,
        address: ETH.address,
        amount: 0n,
        symbol: 'ETH',
        decimals: 18,
      },
    ])
  })

  it('keeps gas costs above 2^53 exact', async () => {
    const route = makeRoute([
      makeStep({ gasCosts: [{ amount: '188437049834009001', token: ETH }] }),
    ])

    const insufficientGas = await runGasSufficiency(route)

    expect(insufficientGas).toHaveLength(1)
    expect(insufficientGas[0].gasAmount).toBe(188437049834009001n)
  })

  it('accepts gas amount strings above the toFixed threshold', async () => {
    const route = makeRoute([
      makeStep({
        gasCosts: [{ amount: '2500000000000000000000000', token: ETH }],
      }),
    ])

    const insufficientGas = await runGasSufficiency(route)

    expect(insufficientGas).toHaveLength(1)
    expect(insufficientGas[0].gasAmount).toBe(2500000000000000000000000n)
  })

  it('keeps non-included fee amounts above 2^53 exact', async () => {
    const fee: FeeCost = {
      name: 'Network fee',
      amount: '9007199254740993',
      included: false,
      token: ETH,
    } as FeeCost
    const route = makeRoute([makeStep({ feeCosts: [fee] })])

    const insufficientGas = await runGasSufficiency(route)

    expect(insufficientGas).toHaveLength(1)
    expect(insufficientGas[0].gasAmount).toBe(9007199254740993n)
  })

  it('accepts non-included fee amount strings above the toFixed threshold', async () => {
    const fee: FeeCost = {
      name: 'Network fee',
      amount: '2500000000000000000000000',
      included: false,
      token: ETH,
    } as FeeCost
    const route = makeRoute([makeStep({ feeCosts: [fee] })])

    const insufficientGas = await runGasSufficiency(route)

    expect(insufficientGas).toHaveLength(1)
    expect(insufficientGas[0].gasAmount).toBe(2500000000000000000000000n)
  })
})
