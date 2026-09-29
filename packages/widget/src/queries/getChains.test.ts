import type * as LifiSdk from '@lifi/sdk'
import type { ExtendedChain, SDKClient } from '@lifi/sdk'
import { ChainType } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getChains: vi.fn(),
  setChains: vi.fn(),
}))

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof LifiSdk>()),
  getChains: mocks.getChains,
}))

import {
  getChainsQueryKey,
  getChainsQueryOptions,
  supportedChainTypes,
} from './getChains.js'

const API_URL = 'https://api.example/pipeline/v1'
const client = {
  config: { apiUrl: API_URL },
  setChains: mocks.setChains,
} as unknown as SDKClient
const CHAINS = [{ id: 1 }] as ExtendedChain[]

const runQueryFn = (
  options: ReturnType<typeof getChainsQueryOptions>,
  queryKey = options.queryKey
) =>
  (options.queryFn as (context: unknown) => Promise<ExtendedChain[]>)({
    queryKey,
    signal: new AbortController().signal,
  })

describe('getChainsQueryKey', () => {
  it('is [name, identity] with the API base, chain types and scope', () => {
    expect(
      getChainsQueryKey({
        apiUrl: API_URL,
        chainTypes: [ChainType.EVM, ChainType.SVM],
        scopeKey: 'host',
      })
    ).toEqual([
      'chains',
      {
        apiUrl: API_URL,
        chainTypes: [ChainType.EVM, ChainType.SVM],
        scopeKey: 'host',
      },
    ])
  })

  // Array order is significant to react-query's hash, object key order is not.
  // Two callers asking for the same set must never split the cache.
  it('puts chain types in one canonical order', () => {
    const shuffled = getChainsQueryKey({
      apiUrl: API_URL,
      chainTypes: [ChainType.STL, ChainType.UTXO, ChainType.EVM],
    })
    const ordered = getChainsQueryKey({
      apiUrl: API_URL,
      chainTypes: [ChainType.EVM, ChainType.UTXO, ChainType.STL],
    })

    expect(shuffled).toEqual(ordered)
  })

  it('leaves scopeKey out of the key when it is not set', () => {
    const [, identity] = getChainsQueryKey({
      apiUrl: API_URL,
      chainTypes: [ChainType.EVM],
    })

    expect(identity).not.toHaveProperty('scopeKey')
  })
})

describe('getChainsQueryOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getChains.mockResolvedValue(CHAINS)
  })

  it('keys on the client API base and requests every chain type by default', () => {
    const { queryKey } = getChainsQueryOptions(client)

    expect(queryKey).toEqual([
      'chains',
      { apiUrl: API_URL, chainTypes: [...supportedChainTypes] },
    ])
  })

  // wagmi's rule: the queryFn is a pure function of the key, so anything that
  // changes the response has to be in the key.
  it('reads its parameters from the key, not from the options it was built with', async () => {
    const options = getChainsQueryOptions(client, {
      chainTypes: [ChainType.EVM],
    })
    const otherKey = getChainsQueryKey({
      apiUrl: API_URL,
      chainTypes: [ChainType.SVM],
    })

    await runQueryFn(options, otherKey)

    // No abort signal, as before this change: a scope switch while the first
    // fetch runs must not cancel the request the new entry shares.
    expect(mocks.getChains).toHaveBeenCalledWith(client, {
      chainTypes: [ChainType.SVM],
    })
  })

  it('returns the chains and has no side effects', async () => {
    await expect(runQueryFn(getChainsQueryOptions(client))).resolves.toBe(
      CHAINS
    )
    // Populating the client's storage is the caller's job, so it still happens
    // when the data came from a cache another caller filled.
    expect(mocks.setChains).not.toHaveBeenCalled()
  })

  it('applies caller behaviour to the options and keeps it out of the key', () => {
    const select = (chains: ExtendedChain[]) => chains.length
    const options = getChainsQueryOptions(client, {
      scopeKey: 'host',
      query: { staleTime: 300_000, select },
    })

    expect(options.staleTime).toBe(300_000)
    expect(options.select).toBe(select)
    expect(options.queryKey[1]).toEqual({
      apiUrl: API_URL,
      chainTypes: [...supportedChainTypes],
      scopeKey: 'host',
    })
  })
})
