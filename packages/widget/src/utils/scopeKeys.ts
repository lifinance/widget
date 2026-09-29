import type { WidgetConfig } from '../types/widget.js'

/**
 * Query scope for an integration that sets neither `queryScopeKey` nor
 * `keyPrefix`. Non-empty on purpose: an integration that configures nothing
 * does not share entries with a host that builds unscoped keys from the same
 * factories.
 */
export const defaultQueryScopeKey = 'li.fi'

type ScopeKeyConfig = Pick<
  WidgetConfig,
  'storageScopeKey' | 'queryScopeKey' | 'keyPrefix'
>

/**
 * Namespace for the widget's persisted state.
 *
 * `undefined` is meaningful: the stores then fall back to their historical
 * `li.fi-*` names, so an integration that never set anything keeps its data.
 */
export const resolveStorageScopeKey = (
  config: Partial<ScopeKeyConfig> | undefined
): string | undefined => config?.storageScopeKey ?? config?.keyPrefix

/** Scope of the chains and tools query keys inside the host's QueryClient. */
export const resolveQueryScopeKey = (
  config: Partial<ScopeKeyConfig> | undefined
): string => config?.queryScopeKey ?? config?.keyPrefix ?? defaultQueryScopeKey
