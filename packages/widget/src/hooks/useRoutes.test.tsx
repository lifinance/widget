/** @vitest-environment happy-dom */

import { LiFiErrorCode } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WidgetEvent } from '../types/events.js'
import { useRoutes } from './useRoutes.js'

// The classifier is covered on its own. These cover the query around it: which
// quote paths explain an empty result, which rethrow, and what the hook lets
// through once a later request has failed.

const native = '0x0000000000000000000000000000000000000000'

const mocks = vi.hoisted(() => ({
  config: {} as Record<string, unknown>,
  fields: {} as Record<string, unknown>,
  account: {} as { address?: string },
  emit: vi.fn(),
  getRoutes: vi.fn(),
  getRelayerQuote: vi.fn(),
  getContractCallsQuote: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  getRoutes: mocks.getRoutes,
  getRelayerQuote: mocks.getRelayerQuote,
  getContractCallsQuote: mocks.getContractCallsQuote,
  convertQuoteToRoute: (quote: { id: string }) => ({ id: quote.id }),
}))
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ account: mocks.account }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useChainTypeFromAddress: () => ({ getChainTypeFromAddress: () => 'EVM' }),
  useEthereumContext: () => ({ disableMessageSigning: false }),
}))
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => ({ config: {} }),
}))
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => mocks.config,
}))
vi.mock('../stores/form/useFieldValues.js', () => ({
  useFieldValues: (...names: string[]) =>
    names.map((name) => mocks.fields[name]),
}))
vi.mock('./useDebouncedWatch.js', () => ({
  useDebouncedWatch: (_delay: number, ...names: string[]) =>
    names.map((name) => mocks.fields[name]),
}))
vi.mock('../stores/navigationTabs/useNavigationTabsStore.js', () => ({
  useNavigationTabsStore: (select: (state: { activeTab: string }) => unknown) =>
    select({ activeTab: 'swap' }),
}))
vi.mock('../stores/routes/useIntermediateRoutesStore.js', () => ({
  useIntermediateRoutesStore: () => ({
    getIntermediateRoutes: () => undefined,
    setIntermediateRoutes: () => {},
  }),
}))
vi.mock('../stores/routes/useSetExecutableRoute.js', () => ({
  useSetExecutableRoute: () => () => {},
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
vi.mock('./useChain.js', () => ({
  useChain: (chainId: number) => ({
    chain: {
      id: chainId,
      chainType: 'EVM',
      nativeToken: { address: native },
      // Everything the relayer path asks of the source chain.
      permit2: '0xpermit2',
      permit2Proxy: '0xpermit2proxy',
      relayerSupported: true,
    },
  }),
}))
vi.mock('./useToken.js', () => ({
  useToken: (chainId: number, address: string) => ({
    token: address
      ? { chainId, address, symbol: 'USDC', decimals: 6, priceUSD: '1' }
      : undefined,
  }),
}))
vi.mock('./useGasRefuel.js', () => ({
  useGasRefuel: () => ({ enabled: false }),
}))
vi.mock('./useIsBatchingSupported.js', () => ({
  useIsBatchingSupported: () => ({
    isBatchingSupported: false,
    isBatchingSupportedLoading: false,
  }),
}))
vi.mock('./useSwapOnly.js', () => ({ useSwapOnly: () => false }))
vi.mock('./useWidgetEvents.js', () => ({
  useWidgetEvents: () => ({ emit: mocks.emit }),
}))

/** Reads as `temporary`, which survives a quote with no send amount. */
const reasons = {
  filteredOut: [
    { overallPath: '(src)-(dest)', reason: 'Pod is currently overloaded.' },
  ],
  failed: [],
}

const sdkError = (code: number, responseBody?: unknown): Error =>
  Object.assign(new Error('request failed'), {
    code,
    cause: responseBody === undefined ? undefined : { responseBody },
  })

const contractCallMode = (): void => {
  mocks.config.mode = 'custom'
  mocks.fields.contractCalls = [{ toContractAddress: '0xcontract' }]
  mocks.fields.toAmount = '5'
}

let client: QueryClient
let container: HTMLDivElement
let root: Root
let latest: ReturnType<typeof useRoutes> | undefined

const Probe = (): null => {
  latest = useRoutes()
  return null
}

/** The latest render. Reset per test, so a stale one can never be read. */
const hook = (): ReturnType<typeof useRoutes> => {
  expect(latest).toBeDefined()
  return latest as ReturnType<typeof useRoutes>
}

const render = (): void => {
  act(() => {
    root.render(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>
    )
  })
}

const settled = async (): Promise<void> => {
  await vi.waitFor(() => {
    expect(hook().isFetching).toBe(false)
    expect(hook().isFetched).toBe(true)
  })
}

// Braced so act gets no promise back: an unawaited async act blocks every act
// after it, and the next test then never renders.
const refetch = (): void => {
  act(() => {
    hook().refetch()
  })
}

const emittedRoutes = (): unknown[] =>
  mocks.emit.mock.calls
    .filter(([event]) => event === WidgetEvent.AvailableRoutes)
    .map(([, routes]) => routes)

beforeEach(() => {
  vi.clearAllMocks()
  latest = undefined
  mocks.config = { mode: 'default', keyPrefix: 'test' }
  mocks.account = { address: '0xfrom' }
  mocks.fields = {
    fromChain: 1,
    fromToken: '0xusdc',
    toChain: 10,
    toToken: '0xusdc10',
    toAddress: '',
    fromAmount: '5',
    toAmount: '',
    contractCalls: undefined,
    validUntil: 0,
    partiallyFillable: false,
  }
  // The hook retries a failure three times; the client default would wait
  // seconds between them.
  client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  client.clear()
})

describe('an empty routes response', () => {
  it('explains itself and tells integrators the list is empty', async () => {
    mocks.getRoutes.mockResolvedValue({
      routes: [],
      unavailableRoutes: reasons,
    })
    render()
    await settled()
    expect(mocks.getRoutes).toHaveBeenCalledTimes(1)
    expect(hook().routes).toEqual([])
    expect(hook().issues.map((issue) => issue.bucket)).toEqual(['temporary'])
    expect(emittedRoutes()).toEqual([[]])
  })

  // React Query keeps the last payload through a failed refetch. Beside the
  // failure message, a card explaining the previous quote contradicts it.
  it('drops its reasons once a later request fails', async () => {
    mocks.getRoutes.mockResolvedValueOnce({
      routes: [],
      unavailableRoutes: reasons,
    })
    render()
    await settled()
    expect(hook().issues).toHaveLength(1)

    mocks.getRoutes.mockRejectedValue(sdkError(LiFiErrorCode.InternalError))
    refetch()
    await vi.waitFor(() => expect(hook().isError).toBe(true))
    expect(hook().issues).toEqual([])
  })

  // A 404 is the backend's answer rather than a failure to get one.
  it('keeps its reasons when a later request is a 404', async () => {
    mocks.getRoutes.mockResolvedValueOnce({
      routes: [],
      unavailableRoutes: reasons,
    })
    render()
    await settled()

    mocks.getRoutes.mockRejectedValue(sdkError(LiFiErrorCode.NotFound))
    refetch()
    await vi.waitFor(() => expect(hook().isError).toBe(true))
    expect(hook().issues.map((issue) => issue.bucket)).toEqual(['temporary'])
  })
})

describe('a contract-call quote', () => {
  beforeEach(contractCallMode)

  it('explains a 404 that carries diagnostics as an empty result', async () => {
    mocks.getContractCallsQuote.mockRejectedValue(
      sdkError(LiFiErrorCode.NotFound, { code: 1002, errors: reasons })
    )
    render()
    await settled()
    expect(mocks.getContractCallsQuote).toHaveBeenCalledTimes(1)
    expect(hook().isError).toBe(false)
    expect(hook().routes).toEqual([])
    expect(hook().issues.map((issue) => issue.bucket)).toEqual(['temporary'])
    expect(emittedRoutes()).toEqual([[]])
  })

  // Nothing to explain, so the error state and its retry have to stand.
  it.each([
    ['a 404 without diagnostics', sdkError(LiFiErrorCode.NotFound, {})],
    [
      'any other failure, diagnostics or not',
      sdkError(LiFiErrorCode.InternalError, { errors: reasons }),
    ],
  ])('rethrows %s', async (_label, error) => {
    mocks.getContractCallsQuote.mockRejectedValue(error)
    render()
    await vi.waitFor(() => expect(hook().isError).toBe(true))
    expect(mocks.getContractCallsQuote).toHaveBeenCalled()
    expect(hook().issues).toEqual([])
    expect(emittedRoutes()).toEqual([])
  })

  // The 404 path reports an empty list, so success has to report the refill or
  // an integrator's UI stays on "no routes".
  it('reports the route it found', async () => {
    mocks.getContractCallsQuote.mockResolvedValue({
      id: 'contract-route',
      action: {},
    })
    render()
    await settled()
    expect(hook().routes).toEqual([{ id: 'contract-route' }])
    expect(hook().issues).toEqual([])
    expect(emittedRoutes()).toEqual([[{ id: 'contract-route' }]])
  })
})

describe('an empty main result beside a relayer quote', () => {
  beforeEach(() => {
    mocks.config.useRelayerRoutes = true
    mocks.getRoutes.mockResolvedValue({
      routes: [],
      unavailableRoutes: reasons,
    })
  })

  // Reporting "no routes" before the relayer answers would hide a route the
  // user can take behind a card explaining why there is none.
  it('waits for the relayer and shows its route alone', async () => {
    mocks.getRelayerQuote.mockReturnValue(
      new Promise((resolve) =>
        setTimeout(() => resolve({ id: 'relayer-route' }), 20)
      )
    )
    render()
    await settled()
    expect(mocks.getRelayerQuote).toHaveBeenCalledTimes(1)
    expect(hook().routes).toEqual([{ id: 'relayer-route' }])
    expect(hook().issues).toEqual([])
    expect(emittedRoutes()).toEqual([[{ id: 'relayer-route' }]])
  })

  it('explains the empty result when the relayer has nothing either', async () => {
    mocks.getRelayerQuote.mockRejectedValue(new Error('no relayer quote'))
    render()
    await settled()
    expect(mocks.getRelayerQuote).toHaveBeenCalledTimes(1)
    expect(hook().routes).toEqual([])
    expect(hook().issues.map((issue) => issue.bucket)).toEqual(['temporary'])
    expect(emittedRoutes()).toEqual([[]])
  })
})
