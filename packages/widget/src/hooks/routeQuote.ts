/** How long a quoted route stays fresh before the widget asks again. */
export const routeRefetchTime = 60_000

/**
 * Delay until the next quote fetch. Zero means this quote is due for refresh.
 * A quote with no timestamp is not due. Once the window has passed, the next
 * fetch is immediate. A future timestamp waits at most one full window.
 */
export const msUntilRouteRefresh = (
  dataUpdatedAt: number,
  now: number = Date.now()
): number => {
  if (dataUpdatedAt <= 0) {
    return routeRefetchTime
  }
  const age = now - dataUpdatedAt
  if (age >= routeRefetchTime) {
    return 0
  }
  return Math.min(routeRefetchTime - age, routeRefetchTime)
}

/** True once a quoted route is at or past the refresh window. */
export const isRouteExpired = (
  dataUpdatedAt: number,
  now: number = Date.now()
): boolean => dataUpdatedAt > 0 && msUntilRouteRefresh(dataUpdatedAt, now) === 0

/**
 * True when a quote has no fetch time, or that time is still inside the
 * window. Checkout does not pass a fetch time. It freezes quotes on its
 * own timer.
 */
export const isExecutableQuote = (
  quotedAt: number | undefined,
  now: number = Date.now()
): boolean => quotedAt == null || !isRouteExpired(quotedAt, now)

/**
 * A quote response belongs to the request that started it. Aborting the
 * signal is how a newer request retires the previous one.
 */
export const isCurrentQuoteRequest = (signal: AbortSignal): boolean =>
  !signal.aborted
