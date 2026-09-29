/**
 * Query option factories for LI.FI server data, shared by the widget and its
 * host. Published as `@lifi/widget/queries`; it depends only on
 * `@lifi/sdk` and on `@tanstack/react-query` types, so importing it does not
 * pull in the widget itself.
 *
 * Keys follow wagmi's `@wagmi/core/query` convention: `[name, parameters]`,
 * where the parameters hold everything that changes the response plus an
 * optional `scopeKey`.
 */
export {
  type GetChainsOptions,
  type GetChainsQueryFnData,
  type GetChainsQueryKey,
  type GetChainsQueryKeyParameters,
  type GetChainsQueryOptions,
  getChainsQueryKey,
  getChainsQueryOptions,
  supportedChainTypes,
} from './getChains.js'
export {
  type GetToolsOptions,
  type GetToolsQueryFnData,
  type GetToolsQueryKey,
  type GetToolsQueryKeyParameters,
  type GetToolsQueryOptions,
  getToolsQueryKey,
  getToolsQueryOptions,
} from './getTools.js'
export type { QueryParameter, ScopeKeyParameter } from './types.js'
