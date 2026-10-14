import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query'

export type ScopeKeyParameter = {
  /**
   * Scopes the entry inside a shared `QueryClient`, like wagmi's `scopeKey`.
   * Callers that pass the same value share the cached data; a widget passes
   * its `queryScopeKey`.
   */
  scopeKey?: string | undefined
}

/**
 * Behaviour the caller owns — `staleTime`, `refetchInterval`, `select`,
 * `enabled`, … It is spread into the options and never becomes part of the
 * key, so callers with different behaviour still share one entry.
 */
export type QueryParameter<queryFnData, data, queryKey extends QueryKey> = {
  query?:
    | Omit<
        UseQueryOptions<queryFnData, Error, data, queryKey>,
        'queryKey' | 'queryFn'
      >
    | undefined
}

/** Options ready for `useQuery`, `fetchQuery` or `prefetchQuery`. */
export type FactoryQueryOptions<
  queryFnData,
  data,
  queryKey extends QueryKey,
> = UseQueryOptions<queryFnData, Error, data, queryKey> & {
  queryKey: queryKey
  queryFn: QueryFunction<queryFnData, queryKey>
}
