/** @vitest-environment happy-dom */

import type * as LifiSdk from '@lifi/sdk'
import type { SDKClient, ToolsResponse } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * A host app and the widget that both build
 * their options from these factories, inside one QueryClient, send each
 * request once — whether they mount together or seconds apart.
 */

const mocks = vi.hoisted(() => ({
  getChains: vi.fn(),
  getTools: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getChains: mocks.getChains,
  getTools: mocks.getTools,
}))

import { getChainsQueryOptions } from './getChains.js'
import { getToolsQueryOptions } from './getTools.js'

const V1 = 'https://api.example/pipeline/v1'
const PRIVATE = 'https://api.example/pipeline/private/v1'
const clientFor = (apiUrl: string) =>
  ({ config: { apiUrl } }) as unknown as SDKClient

const TOOLS = {
  bridges: [{ key: 'across' }, { key: 'stargate' }],
  exchanges: [{ key: '1inch' }],
} as unknown as ToolsResponse

/** A host app: all chain types, its own refresh cadence. */
const Host = ({
  client,
  scopeKey,
}: {
  client: SDKClient
  scopeKey: string
}) => {
  useQuery(
    getChainsQueryOptions(client, {
      scopeKey,
      query: { staleTime: 300_000 },
    })
  )
  useQuery(
    getToolsQueryOptions(client, { scopeKey, query: { staleTime: 300_000 } })
  )
  return null
}

/** What the widget does: chain types in another order, a filtered tools view. */
const Widget = ({
  client,
  scopeKey,
}: {
  client: SDKClient
  scopeKey: string
}) => {
  useQuery(
    getChainsQueryOptions(client, {
      chainTypes: [
        ChainType.STL,
        ChainType.TVM,
        ChainType.MVM,
        ChainType.UTXO,
        ChainType.SVM,
        ChainType.EVM,
      ],
      scopeKey,
      query: { staleTime: 300_000 },
    })
  )
  useQuery(
    getToolsQueryOptions(client, {
      scopeKey,
      query: {
        staleTime: 180_000,
        select: (tools) => ({ ...tools, bridges: tools.bridges.slice(0, 1) }),
      },
    })
  )
  return null
}

let root: Root
let queryClient: QueryClient

const render = async (node: ReactNode) => {
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>
    )
  })
}

const settle = () =>
  vi.waitFor(() => {
    expect(queryClient.isFetching()).toBe(0)
  })

describe('shared chains and tools cache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getChains.mockResolvedValue([{ id: 1 }])
    mocks.getTools.mockResolvedValue(TOOLS)
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

  it('fetches once when the host and the widget mount together', async () => {
    const client = clientFor(V1)

    await render(
      <>
        <Host client={client} scopeKey="host" />
        <Widget client={client} scopeKey="host" />
      </>
    )
    await settle()

    expect(mocks.getChains).toHaveBeenCalledTimes(1)
    expect(mocks.getTools).toHaveBeenCalledTimes(1)
  })

  // A widget often mounts seconds after the host app. A later observer with a
  // staleTime reads the entry instead of refetching it.
  it('fetches once when the widget mounts after the host has settled', async () => {
    const client = clientFor(V1)

    await render(<Host client={client} scopeKey="host" />)
    await settle()
    await render(
      <>
        <Host client={client} scopeKey="host" />
        <Widget client={client} scopeKey="host" />
      </>
    )
    await settle()

    expect(mocks.getChains).toHaveBeenCalledTimes(1)
    expect(mocks.getTools).toHaveBeenCalledTimes(1)
  })

  it('also shares when the host and widget hold different client objects on the same base', async () => {
    await render(
      <>
        <Host client={clientFor(V1)} scopeKey="host" />
        <Widget client={clientFor(V1)} scopeKey="host" />
      </>
    )
    await settle()

    expect(mocks.getChains).toHaveBeenCalledTimes(1)
    expect(mocks.getTools).toHaveBeenCalledTimes(1)
  })

  it('keeps the raw tools response in the cache under a filtering select', async () => {
    const client = clientFor(V1)

    await render(<Widget client={client} scopeKey="host" />)
    await settle()

    const cached = queryClient.getQueryData<ToolsResponse>(
      getToolsQueryOptions(client, { scopeKey: 'host' }).queryKey
    )
    expect(cached?.bridges).toHaveLength(2)
  })

  // A partner's own queries and another integration's widget stay apart.
  it('does not share across scopes', async () => {
    const client = clientFor(V1)

    await render(
      <>
        <Host client={client} scopeKey="host" />
        <Widget client={client} scopeKey="partner" />
      </>
    )
    await settle()

    expect(mocks.getChains).toHaveBeenCalledTimes(2)
    expect(mocks.getTools).toHaveBeenCalledTimes(2)
  })

  // The variant bases return different chain and tool sets (69 / 15 / 38
  // chains measured on production), so they must never share an entry.
  it('does not share across API bases', async () => {
    await render(
      <>
        <Host client={clientFor(V1)} scopeKey="host" />
        <Widget client={clientFor(PRIVATE)} scopeKey="host" />
      </>
    )
    await settle()

    expect(mocks.getChains).toHaveBeenCalledTimes(2)
    expect(mocks.getTools).toHaveBeenCalledTimes(2)
  })
})
