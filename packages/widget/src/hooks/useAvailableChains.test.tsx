/** @vitest-environment happy-dom */

import type * as LifiSdk from '@lifi/sdk'
import { ChainType, type ExtendedChain, type SDKClient } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../types/widget.js'

/**
 * The chains entry is shared with the host app through
 * `getChainsQueryOptions`, keyed by the client's API base, the requested chain
 * types and the widget's `queryScopeKey`. The widget's own SDK client still
 * gets the chains, whoever filled the entry.
 */

const API_URL = 'https://api.example/v1'

const mocks = vi.hoisted(() => ({
  getChains: vi.fn(),
  setChains: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getChains: mocks.getChains,
}))

let widgetConfig: Partial<WidgetConfig> = {}

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => widgetConfig,
}))

const client = {
  config: { apiUrl: API_URL },
  setChains: mocks.setChains,
} as unknown as SDKClient
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => client,
}))

import { getChainsQueryKey } from '../queries/getChains.js'
import { useAvailableChains } from './useAvailableChains.js'

const CHAINS = [{ id: 1, name: 'Ethereum' }] as ExtendedChain[]

let root: Root
let queryClient: QueryClient
let externalConfig: WidgetConfig | undefined

const Probe = () => {
  useAvailableChains(undefined, externalConfig)
  return null
}

const render = async () => {
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <Probe />
      </QueryClientProvider>
    )
  })
}

const evmKey = getChainsQueryKey({
  apiUrl: API_URL,
  chainTypes: [ChainType.EVM],
  scopeKey: 'host',
})

describe('useAvailableChains', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getChains.mockResolvedValue(CHAINS)
    widgetConfig = {
      queryScopeKey: 'host',
      chains: { types: { allow: [ChainType.EVM] } },
    }
    externalConfig = undefined
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    queryClient.clear()
  })

  it('fetches the allowed chain types under the widget scope and hands them to the client', async () => {
    await render()

    await vi.waitFor(() => {
      expect(mocks.setChains).toHaveBeenCalledWith(CHAINS)
    })
    expect(mocks.getChains).toHaveBeenCalledWith(client, {
      chainTypes: [ChainType.EVM],
    })
    expect(queryClient.getQueryData(evmKey)).toBe(CHAINS)
  })

  it('reads an entry the host filled, and still hands the chains to the client', async () => {
    queryClient.setQueryData(evmKey, CHAINS)

    await render()

    await vi.waitFor(() => {
      expect(mocks.setChains).toHaveBeenCalledWith(CHAINS)
    })
    expect(mocks.getChains).not.toHaveBeenCalled()
  })

  it('hands the chains to the client again after a refetch with equal data', async () => {
    // Structural sharing keeps the data reference on an equal refetch. The
    // client's own chain storage expires, so every fetch must refresh it.
    await render()
    await vi.waitFor(() => {
      expect(mocks.setChains).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      await queryClient.refetchQueries({ queryKey: evmKey })
    })

    await vi.waitFor(() => {
      expect(mocks.setChains).toHaveBeenCalledTimes(2)
    })
  })

  it('refreshes the chains every five minutes', async () => {
    await render()
    await vi.waitFor(() => {
      expect(queryClient.getQueryData(evmKey)).toBe(CHAINS)
    })

    const [observer] = queryClient
      .getQueryCache()
      .find({ queryKey: evmKey })!.observers
    expect(observer.options.refetchInterval).toBe(300_000)
    expect(observer.options.staleTime).toBe(300_000)
  })

  it('uses the API base and scope of an external widget config', async () => {
    externalConfig = {
      integrator: 'partner',
      keyPrefix: 'partner',
      sdkConfig: { apiUrl: 'https://partner.example/v1' },
      chains: { types: { allow: [ChainType.SVM] } },
    }

    await render()

    const partnerKey = getChainsQueryKey({
      apiUrl: 'https://partner.example/v1',
      chainTypes: [ChainType.SVM],
      scopeKey: 'partner',
    })
    await vi.waitFor(() => {
      expect(queryClient.getQueryData(partnerKey)).toBe(CHAINS)
    })
    // The external config's own client, not the widget's.
    expect(mocks.getChains.mock.calls[0][0]).not.toBe(client)
  })
})
