import type { SDKClient, ToolsResponse } from '@lifi/sdk'
import { getTools } from '@lifi/sdk'
import type {
  FactoryQueryOptions,
  QueryParameter,
  ScopeKeyParameter,
} from './types.js'

export type GetToolsQueryFnData = ToolsResponse

export type GetToolsQueryKeyParameters = {
  /** API base the client talks to. Different bases return different tools. */
  apiUrl: string
} & ScopeKeyParameter

export type GetToolsQueryKey = readonly [
  'tools',
  { apiUrl: string; scopeKey?: string },
]

/** The key alone — to read, set or invalidate the entry. */
export function getToolsQueryKey(
  parameters: GetToolsQueryKeyParameters
): GetToolsQueryKey {
  return [
    'tools',
    {
      apiUrl: parameters.apiUrl,
      ...(parameters.scopeKey === undefined
        ? {}
        : { scopeKey: parameters.scopeKey }),
    },
  ]
}

export type GetToolsOptions<selectData = GetToolsQueryFnData> =
  ScopeKeyParameter &
    QueryParameter<GetToolsQueryFnData, selectData, GetToolsQueryKey>

export type GetToolsQueryOptions<selectData = GetToolsQueryFnData> =
  FactoryQueryOptions<GetToolsQueryFnData, selectData, GetToolsQueryKey>

/**
 * Query options for the bridges and exchanges of one API base.
 *
 * The key is `['tools', { apiUrl, scopeKey }]`. The cache holds the raw,
 * unfiltered response so every caller can share it; narrow it per caller with
 * `query.select`, never in the `queryFn`.
 */
export function getToolsQueryOptions<selectData = GetToolsQueryFnData>(
  client: SDKClient,
  options: GetToolsOptions<selectData> = {}
): GetToolsQueryOptions<selectData> {
  return {
    ...options.query,
    queryKey: getToolsQueryKey({
      apiUrl: client.config.apiUrl,
      scopeKey: options.scopeKey,
    }),
    queryFn: ({ signal }) => getTools(client, undefined, { signal }),
  }
}
