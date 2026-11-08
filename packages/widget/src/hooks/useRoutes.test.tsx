/** @vitest-environment happy-dom */

import type { Route } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntermediateRoutesStore } from '../stores/routes/useIntermediateRoutesStore.js'
import {
  isCurrentQuoteRequest,
  isRouteExpired,
  routeRefetchTime,
} from './routeQuote.js'
import { useRoutes } from './useRoutes.js'

;(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true

const mocks = vi.hoisted(() => ({
  form: {
    fromChain: 1,
    fromToken: '0xfrom',
    toAddress: undefined as string | undefined,
    toChain: 10,
    toToken: '0xto',
    contractCalls: undefined as unknown,
    validUntil: 1_800,
    partiallyFillable: false,
    fromAmount: '1',
    toAmount: '',
  },
  getRoutes: vi.fn(),
  getContractCallsQuote: vi.fn(),
  getRelayerQuote: vi.fn(),
  setExecutableRoute: vi.fn(),
  emit: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@lifi/sdk')>()),
  getRoutes: mocks.getRoutes,
  getContractCallsQuote: mocks.getContractCallsQuote,
  getRelayerQuote: mocks.getRelayerQuote,
}))

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    account: {
      address: '0x1111111111111111111111111111111111111111',
      isConnected: true,
    },
  }),
}))

vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: () => true }),
  useEthereumContext: () => ({
    isGaslessStep: () => false,
    disableMessageSigning: false,
  }),
}))

vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => ({ config: {} }),
}))

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ mode: 'swap' }),
}))

vi.mock('../stores/settings/useSettings.js', () => ({
  useSettings: () => ({
    disabledBridges: [],
    disabledExchanges: [],
    enabledBridges: [],
    enabledExchanges: [],
    enabledAutoRefuel: false,
    routePriority: 'CHEAPEST',
    slippage: '0.5',
  }),
}))

vi.mock('../stores/form/useFieldValues.js', () => ({
  useFieldValues: (...names: (keyof typeof mocks.form)[]) =>
    names.map((name) => mocks.form[name]),
}))

vi.mock('./useDebouncedWatch.js', () => ({
  useDebouncedWatch: (_delay: number, name: keyof typeof mocks.form) => [
    mocks.form[name],
  ],
}))

vi.mock('./useToken.js', () => ({
  useToken: (chainId?: number, address?: string) => ({
    token: address
      ? {
          chainId,
          address,
          decimals: address === '0xfrom' ? 18 : 6,
          symbol: 'TKN',
          name: 'Token',
          priceUSD: '1',
        }
      : undefined,
  }),
}))

vi.mock('./useChain.js', () => ({
  useChain: (chainId?: number) => ({
    chain: chainId
      ? {
          id: chainId,
          chainType: 'EVM',
          nativeToken: {
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          },
        }
      : undefined,
  }),
}))

vi.mock('./useGasRefuel.js', () => ({
  useGasRefuel: () => ({ enabled: false, fromAmount: undefined }),
}))

vi.mock('./useIsBatchingSupported.js', () => ({
  useIsBatchingSupported: () => ({
    isBatchingSupported: false,
    isBatchingSupportedLoading: false,
  }),
}))

vi.mock('./useSwapOnly.js', () => ({
  useSwapOnly: () => false,
}))

vi.mock('../stores/navigationTabs/useNavigationTabsStore.js', () => ({
  useNavigationTabsStore: (
    selector: (state: { activeTab: string }) => unknown
  ) => selector({ activeTab: 'swap' }),
}))

vi.mock('./useWidgetEvents.js', () => ({
  useWidgetEvents: () => ({ emit: mocks.emit }),
}))

vi.mock('../stores/routes/useSetExecutableRoute.js', () => ({
  useSetExecutableRoute: () => mocks.setExecutableRoute,
}))

type PendingQuote = {
  signal: AbortSignal
  resolve: (value: { routes: Route[] }) => void
}

const pending: PendingQuote[] = []
const seen: { current: ReturnType<typeof useRoutes> | null } = {
  current: null,
}

const quote = (id: string): Route =>
  ({
    id,
    fromChainId: 1,
    toChainId: 10,
    fromAmount: '1000000000000000000',
    toAmount: '1000000',
    toAmountMin: '990000',
    fromAmountUSD: '1',
    toAmountUSD: '1',
    fromToken: {
      chainId: 1,
      address: '0xfrom',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
      priceUSD: '1',
    },
    toToken: {
      chainId: 10,
      address: '0xto',
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      priceUSD: '1',
    },
    steps: [],
    insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
  }) as Route

const Probe = () => {
  seen.current = useRoutes()
  return null
}

let root: Root
let queryClient: QueryClient
let container: HTMLDivElement

const render = async () => {
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <Probe />
      </QueryClientProvider>
    )
  })
}

const settle = async (request: PendingQuote, id: string) => {
  await act(async () => {
    request.resolve({ routes: [quote(id)] })
  })
}

const currentRoutes = () => seen.current?.routes

describe('quote refresh window', () => {
  it('treats the request as current only while its signal is live', () => {
    const controller = new AbortController()
    expect(isCurrentQuoteRequest(controller.signal)).toBe(true)
    controller.abort()
    expect(isCurrentQuoteRequest(controller.signal)).toBe(false)
  })

  it('is expired exactly when the refresh delay hits zero', () => {
    const updatedAt = 1_700_000_000_000
    expect(isRouteExpired(updatedAt, updatedAt + routeRefetchTime - 1)).toBe(
      false
    )
    expect(isRouteExpired(updatedAt, updatedAt + routeRefetchTime)).toBe(true)
    expect(isRouteExpired(0, updatedAt)).toBe(false)
  })
})

describe('useRoutes quote refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pending.length = 0
    mocks.form.fromAmount = '1'
    seen.current = null
    useIntermediateRoutesStore.setState({ intermediateRoutes: {} })
    mocks.getRoutes.mockImplementation(
      (_client: unknown, _request: unknown, options: { signal: AbortSignal }) =>
        new Promise((resolve) => {
          pending.push({ signal: options.signal, resolve })
        })
    )
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, refetchOnWindowFocus: false },
      },
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    queryClient.clear()
  })

  it('does not let a stale quote replace a newer in-flight request', async () => {
    await render()
    await vi.waitFor(() => expect(pending).toHaveLength(1))
    await settle(pending[0]!, 'first')
    await vi.waitFor(() => expect(currentRoutes()?.[0]?.id).toBe('first'))

    await act(async () => {
      seen.current?.refetch()
    })
    await vi.waitFor(() => expect(pending).toHaveLength(2))
    await act(async () => {
      seen.current?.refetch()
    })
    await vi.waitFor(() => expect(pending).toHaveLength(3))

    expect(isCurrentQuoteRequest(pending[1]!.signal)).toBe(false)
    expect(isCurrentQuoteRequest(pending[2]!.signal)).toBe(true)

    await settle(pending[1]!, 'stale')
    expect(currentRoutes()?.[0]?.id).toBe('first')

    await settle(pending[2]!, 'fresh')
    await vi.waitFor(() => expect(currentRoutes()?.[0]?.id).toBe('fresh'))
  })

  it('cancels the previous request when a quote parameter changes', async () => {
    await render()
    await vi.waitFor(() => expect(pending).toHaveLength(1))

    mocks.form.fromAmount = '2'
    await render()
    await vi.waitFor(() => expect(pending).toHaveLength(2))

    expect(isCurrentQuoteRequest(pending[0]!.signal)).toBe(false)
    expect(isCurrentQuoteRequest(pending[1]!.signal)).toBe(true)

    await settle(pending[1]!, 'fresh')
    await vi.waitFor(() => expect(currentRoutes()?.[0]?.id).toBe('fresh'))
    await settle(pending[0]!, 'stale')
    expect(currentRoutes()?.[0]?.id).toBe('fresh')
  })

  it('treats a quote at the end of the refresh window as expired', async () => {
    await render()
    await vi.waitFor(() => expect(pending).toHaveLength(1))
    await settle(pending[0]!, 'old')
    await vi.waitFor(() => expect(currentRoutes()?.[0]?.id).toBe('old'))

    const updatedAt = Date.now() - routeRefetchTime
    const now = updatedAt + routeRefetchTime
    vi.spyOn(Date, 'now').mockReturnValue(now)
    try {
      queryClient.setQueryData(seen.current!.queryKey, currentRoutes(), {
        updatedAt,
      })

      const query = queryClient.getQueryCache().find({
        queryKey: seen.current!.queryKey,
      })!
      const refetchInterval = query.observers[0]?.options.refetchInterval
      expect(typeof refetchInterval).toBe('function')
      expect(isRouteExpired(query.state.dataUpdatedAt, now)).toBe(true)
      expect(query.isStale()).toBe(true)
      if (typeof refetchInterval === 'function') {
        expect(refetchInterval(query)).toBe(0)
      }
    } finally {
      vi.mocked(Date.now).mockRestore()
    }

    await act(async () => {
      seen.current?.refetch()
    })
    await vi.waitFor(() => expect(pending).toHaveLength(2))
    await settle(pending[1]!, 'fresh')
    await vi.waitFor(() => expect(currentRoutes()?.[0]?.id).toBe('fresh'))
  })
})
