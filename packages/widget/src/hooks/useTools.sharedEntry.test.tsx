/** @vitest-environment happy-dom */

import type * as LifiSdk from '@lifi/sdk'
import type { SDKClient, ToolsResponse } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../types/widget.js'

/**
 * The tools entry is shared with the host app through
 * `getToolsQueryOptions`, keyed by the client's API base and the widget's
 * `queryScopeKey`. When the host fetched first, the widget must read that entry
 * — no request of its own — and still seed its settings store from the
 * filtered view.
 */

const API_URL = 'https://api.example/v1'

const mocks = vi.hoisted(() => ({
  getTools: vi.fn(),
  initializeTools: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getTools: mocks.getTools,
}))

let widgetConfig: Partial<WidgetConfig> = {}

vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => widgetConfig,
}))

const client = { config: { apiUrl: API_URL } } as unknown as SDKClient
vi.mock('../providers/SDKClientProvider.js', () => ({
  useSDKClient: () => client,
}))

const settingsStore = {
  getState: () => ({ initializeTools: mocks.initializeTools }),
}
vi.mock('../stores/settings/SettingsStore.js', () => ({
  useSettingsStoreContext: () => settingsStore,
}))

import { getToolsQueryKey } from '../queries/getTools.js'
import { useTools } from './useTools.js'

const TOOLS = {
  bridges: [{ key: 'across' }, { key: 'stargate' }, { key: 'hop' }],
  exchanges: [{ key: '1inch' }, { key: 'paraswap' }],
} as unknown as ToolsResponse

const Probe = () => {
  useTools()
  return null
}

let root: Root
let queryClient: QueryClient

const render = async () => {
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <Probe />
      </QueryClientProvider>
    )
  })
}

describe('useTools with a shared tools entry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getTools.mockResolvedValue(TOOLS)
    widgetConfig = {
      integrator: 'test',
      queryScopeKey: 'host',
      bridges: { allow: ['across', 'hop'] },
      exchanges: { deny: ['paraswap'] },
    }
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

  it('initialises the settings store when the host already fetched the tools', async () => {
    // The host app fetched first and filled the shared entry.
    queryClient.setQueryData(
      getToolsQueryKey({ apiUrl: API_URL, scopeKey: 'host' }),
      TOOLS
    )

    await render()

    await vi.waitFor(() => {
      expect(mocks.initializeTools).toHaveBeenCalledWith('Bridges', [
        'across',
        'hop',
      ])
    })
    expect(mocks.initializeTools).toHaveBeenCalledWith('Exchanges', ['1inch'])
    // The widget read the host's entry instead of sending its own request.
    expect(mocks.getTools).not.toHaveBeenCalled()
  })

  it('initialises the settings store when the widget fetched the tools itself', async () => {
    await render()

    await vi.waitFor(() => {
      expect(mocks.initializeTools).toHaveBeenCalledWith('Bridges', [
        'across',
        'hop',
      ])
    })
    expect(mocks.getTools).toHaveBeenCalledTimes(1)
  })

  it('initialises with the filtered view while the cache keeps the raw list', async () => {
    await render()

    await vi.waitFor(() => {
      expect(mocks.initializeTools).toHaveBeenCalled()
    })
    const cached = queryClient.getQueryData<ToolsResponse>(
      getToolsQueryKey({ apiUrl: API_URL, scopeKey: 'host' })
    )
    expect(cached?.bridges).toHaveLength(3)
    expect(cached?.exchanges).toHaveLength(2)
  })

  it('refreshes the tools every three minutes', async () => {
    await render()
    await vi.waitFor(() => {
      expect(mocks.initializeTools).toHaveBeenCalled()
    })

    const [observer] = queryClient.getQueryCache().find({
      queryKey: getToolsQueryKey({ apiUrl: API_URL, scopeKey: 'host' }),
    })!.observers
    expect(observer.options.refetchInterval).toBe(180_000)
    expect(observer.options.staleTime).toBe(180_000)
  })
})
