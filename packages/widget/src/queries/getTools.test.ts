import type * as LifiSdk from '@lifi/sdk'
import type { SDKClient, ToolsResponse } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getTools: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getTools: mocks.getTools,
}))

import { getToolsQueryKey, getToolsQueryOptions } from './getTools.js'

const API_URL = 'https://api.example/v1'
const client = { config: { apiUrl: API_URL } } as unknown as SDKClient
const TOOLS = {
  bridges: [{ key: 'across' }, { key: 'stargate' }],
  exchanges: [{ key: '1inch' }],
} as unknown as ToolsResponse

describe('getToolsQueryKey', () => {
  it('is [name, identity] with the API base and scope', () => {
    expect(getToolsQueryKey({ apiUrl: API_URL, scopeKey: 'host' })).toEqual([
      'tools',
      { apiUrl: API_URL, scopeKey: 'host' },
    ])
  })

  it('leaves scopeKey out of the key when it is not set', () => {
    const [, identity] = getToolsQueryKey({ apiUrl: API_URL })

    expect(identity).not.toHaveProperty('scopeKey')
  })
})

describe('getToolsQueryOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getTools.mockResolvedValue(TOOLS)
  })

  it('keys on the client API base', () => {
    expect(getToolsQueryOptions(client).queryKey).toEqual([
      'tools',
      { apiUrl: API_URL },
    ])
  })

  // The cache holds the raw response so every caller can share it. Filtering
  // by a widget's allow/deny config belongs in `select`, per caller.
  it('returns the raw, unfiltered response', async () => {
    const options = getToolsQueryOptions(client)

    const result = await (
      options.queryFn as (context: unknown) => Promise<ToolsResponse>
    )({ queryKey: options.queryKey, signal: new AbortController().signal })

    expect(result).toBe(TOOLS)
    expect(mocks.getTools).toHaveBeenCalledWith(client, undefined, {
      signal: expect.any(AbortSignal),
    })
  })

  it('applies caller behaviour to the options and keeps it out of the key', () => {
    const select = (tools: ToolsResponse) => tools.bridges
    const options = getToolsQueryOptions(client, {
      scopeKey: 'host',
      query: { staleTime: 180_000, select },
    })

    expect(options.staleTime).toBe(180_000)
    expect(options.select).toBe(select)
    expect(options.queryKey).toEqual([
      'tools',
      { apiUrl: API_URL, scopeKey: 'host' },
    ])
  })
})
