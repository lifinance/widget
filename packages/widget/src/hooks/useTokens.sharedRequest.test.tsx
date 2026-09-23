/** @vitest-environment happy-dom */

import type { TokensExtendedResponse } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `getTokens` in `@lifi/sdk` deduplicates in-flight requests by query and
 * binds the shared request to the first caller's signal. When that caller is
 * cancelled, every caller sharing the request fails with an AbortError. The
 * mock wraps a fake request in the SDK's real `withDedupe` the same way.
 */

const ARBITRUM = 42161
const response = {
  tokens: {
    [ARBITRUM]: [
      {
        chainId: ARBITRUM,
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        priceUSD: '4000',
      },
    ],
  },
} as unknown as TokensExtendedResponse

let requests = 0

/** Stands in for the HTTP request; it aborts with the signal it is given. */
const fakeRequest = (signal?: AbortSignal) => {
  requests++
  return new Promise<TokensExtendedResponse>((resolve, reject) => {
    const timer = setTimeout(() => resolve(response), 20)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('signal is aborted without reason', 'AbortError'))
    })
  })
}

vi.mock('@lifi/sdk', async (importOriginal) => {
  const sdk = await importOriginal<typeof import('@lifi/sdk')>()
  return {
    ...sdk,
    getTokens: (
      _client: unknown,
      params: unknown,
      options?: { signal?: AbortSignal }
    ) =>
      sdk.withDedupe(() => fakeRequest(options?.signal), {
        id: `getTokens.${JSON.stringify(params)}`,
      }),
  }
})

const sdkClient = {}
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => sdkClient,
}))

let keyPrefix = 'scheduled'
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ keyPrefix }),
}))

const chainTypeFromAddress = {
  getChainTypeFromTokenAddress: () => undefined,
}
vi.mock('@lifi/widget-provider', () => ({
  useChainTypeFromAddress: () => chainTypeFromAddress,
}))

const availableChains = { chains: [] }
vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => availableChains,
}))

const { useTokens } = await import('./useTokens.js')

let result: ReturnType<typeof useTokens> | undefined

const Probe = (): null => {
  result = useTokens('from')
  return null
}

let root: Root
let queryClient: QueryClient

const render = (strict = false) => {
  const tree = (
    <QueryClientProvider client={queryClient}>
      <Probe />
    </QueryClientProvider>
  )
  act(() => {
    root.render(strict ? <StrictMode>{tree}</StrictMode> : tree)
  })
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60))
  })

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  requests = 0
  keyPrefix = 'scheduled'
  result = undefined
  // Without retries a failed first attempt stays failed, which is what makes
  // the shared abort visible here; the widget retries and only shows it late.
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => root.unmount())
  queryClient.clear()
})

describe('useTokens with a request shared by the SDK', () => {
  it('loads the tokens when the key prefix changes mid-request', async () => {
    render()
    keyPrefix = 'advanced'
    render()
    await settle()

    expect(result?.allTokens?.[ARBITRUM]).toHaveLength(1)
    expect(requests).toBe(1)
  })

  it('loads the tokens when StrictMode remounts mid-request', async () => {
    render(true)
    await settle()

    expect(result?.allTokens?.[ARBITRUM]).toHaveLength(1)
    expect(requests).toBe(1)
  })
})
