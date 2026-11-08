/** How long a quoted route stays fresh before the widget asks again. */
export const routeRefetchTime = 60_000

/**
 * Delay until the next quote fetch. Zero means this quote is due for refresh.
 * The delay is the remaining window, capped at one full window.
 */
export const msUntilRouteRefresh = (
  dataUpdatedAt: number,
  now: number = Date.now()
): number =>
  Math.min(Math.abs(routeRefetchTime - (now - dataUpdatedAt)), routeRefetchTime)

/** True when the refresh delay has elapsed and a new quote is due. */
export const isRouteExpired = (
  dataUpdatedAt: number,
  now: number = Date.now()
): boolean => dataUpdatedAt > 0 && msUntilRouteRefresh(dataUpdatedAt, now) === 0

/**
 * A quote response belongs to the request that started it. Aborting the
 * signal is how a newer request retires the previous one.
 */
export const isCurrentQuoteRequest = (signal: AbortSignal): boolean =>
  !signal.aborted
