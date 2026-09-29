import type { ExtendedChain, SDKClient } from '@lifi/sdk'
import { ChainType, getChains } from '@lifi/sdk'
import type {
  FactoryQueryOptions,
  QueryParameter,
  ScopeKeyParameter,
} from './types.js'

/** Every chain type the widget supports, in the order keys are built in. */
export const supportedChainTypes: readonly ChainType[] = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
  ChainType.TVM,
  ChainType.STL,
]

export type GetChainsQueryFnData = ExtendedChain[]

export type GetChainsQueryKeyParameters = {
  /** API base the client talks to. Different bases return different chains. */
  apiUrl: string
  chainTypes: readonly ChainType[]
} & ScopeKeyParameter

export type GetChainsQueryKey = readonly [
  'chains',
  { apiUrl: string; chainTypes: ChainType[]; scopeKey?: string },
]

const rank = (type: ChainType): number => {
  const index = supportedChainTypes.indexOf(type)
  return index === -1 ? supportedChainTypes.length : index
}

/** The key alone — to read, set or invalidate the entry. */
export function getChainsQueryKey(
  parameters: GetChainsQueryKeyParameters
): GetChainsQueryKey {
  // Array order is part of react-query's hash; object key order is not. A
  // canonical order keeps every caller that asks for the same set on one entry.
  const chainTypes = [...new Set(parameters.chainTypes)].sort(
    (a, b) => rank(a) - rank(b) || a.localeCompare(b)
  )
  return [
    'chains',
    {
      apiUrl: parameters.apiUrl,
      chainTypes,
      ...(parameters.scopeKey === undefined
        ? {}
        : { scopeKey: parameters.scopeKey }),
    },
  ]
}

export type GetChainsOptions<selectData = GetChainsQueryFnData> = {
  /** Chain types to request, in any order. Defaults to every supported type. */
  chainTypes?: readonly ChainType[] | undefined
} & ScopeKeyParameter &
  QueryParameter<GetChainsQueryFnData, selectData, GetChainsQueryKey>

export type GetChainsQueryOptions<selectData = GetChainsQueryFnData> =
  FactoryQueryOptions<GetChainsQueryFnData, selectData, GetChainsQueryKey>

/**
 * Query options for the chain list of one API base.
 *
 * The key is `['chains', { apiUrl, chainTypes, scopeKey }]`: the API base and
 * the requested types decide the response, the scope isolates integrations.
 * The widget and a host app that build their options here, with the same
 * scope, therefore share one cache entry and one request.
 *
 * The query has no side effects. A caller that needs the chains in its SDK
 * client's storage calls `client.setChains` on the data — the entry may have
 * been filled by another caller, so a `queryFn` cannot be relied on to run.
 */
export function getChainsQueryOptions<selectData = GetChainsQueryFnData>(
  client: SDKClient,
  options: GetChainsOptions<selectData> = {}
): GetChainsQueryOptions<selectData> {
  return {
    ...options.query,
    queryKey: getChainsQueryKey({
      apiUrl: client.config.apiUrl,
      chainTypes: options.chainTypes ?? supportedChainTypes,
      scopeKey: options.scopeKey,
    }),
    // Reads its parameters from the key, never from a closure, so anything
    // that changes the response has to be part of the key. No abort signal,
    // as before: the request is small, and its data still lands in the cache
    // when the last observer leaves mid-fetch.
    queryFn: ({ queryKey: [, { chainTypes }] }) =>
      getChains(client, { chainTypes }),
  }
}
