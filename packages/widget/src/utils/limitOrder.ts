import { formatInputAmount } from './format.js'

/**
 * High-precision formatter for derived limit-order values. Mirrors the
 * approach used by `priceToTokenAmount` — these are display-level derivations;
 * the route request re-parses amounts via `parseUnits`.
 */
const preciseFormatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  roundingPriority: 'morePrecision',
  maximumSignificantDigits: 20,
  maximumFractionDigits: 20,
  useGrouping: false,
})

function parsePositive(value?: string): number | undefined {
  if (!value) {
    return undefined
  }
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined
  }
  return parsed
}

/**
 * Derive the receive amount: `receiveAmount = sendAmount × limitPrice`.
 * Returns an empty string when either input is missing or invalid.
 */
export function deriveReceiveAmount(
  sendAmount?: string,
  limitPrice?: string,
  toDecimals?: number
): string {
  const send = parsePositive(sendAmount)
  const price = parsePositive(limitPrice)
  if (send === undefined || price === undefined) {
    return ''
  }
  return formatInputAmount(
    preciseFormatter.format(send * price),
    toDecimals ?? null
  )
}

/**
 * Derive the limit price: `limitPrice = receiveAmount ÷ sendAmount`.
 * Returns an empty string when either input is missing or invalid.
 */
export function deriveLimitPrice(
  sendAmount?: string,
  receiveAmount?: string
): string {
  const send = parsePositive(sendAmount)
  const receive = parsePositive(receiveAmount)
  if (send === undefined || receive === undefined) {
    return ''
  }
  return preciseFormatter.format(receive / send)
}

/** Invert a price for display flipping: `1 ÷ price`. */
export function invertPrice(price?: string): string {
  const parsed = parsePositive(price)
  if (parsed === undefined) {
    return ''
  }
  return preciseFormatter.format(1 / parsed)
}

/**
 * Apply a percentage offset to a price, e.g. `percent = 2` → `price × 1.02`.
 * Used by the quick-set buttons (+2%, +5%).
 */
export function applyPriceOffset(
  price: string | undefined,
  percent: number
): string {
  const parsed = parsePositive(price)
  if (parsed === undefined) {
    return ''
  }
  return preciseFormatter.format(parsed * (1 + percent / 100))
}

/**
 * Format a price for display: 4 decimals for values ≥ 1, 6 below — covers the
 * typical stablecoin ↔ asset pair (e.g. 2227.17 ↔ 0.000449) without per-token
 * branching. Returns an empty string for non-positive/invalid input.
 */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return ''
  }
  return value >= 1 ? value.toFixed(4) : value.toFixed(6)
}

/**
 * Signed percentage distance of a price from a market reference, e.g. a price
 * 5% above market returns `5`. Returns `NaN` when inputs are missing/invalid.
 */
export function proximityPercent(price?: string, market?: number): number {
  const parsed = parsePositive(price)
  if (parsed === undefined || !market || market <= 0) {
    return Number.NaN
  }
  return ((parsed - market) / market) * 100
}
