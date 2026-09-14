import { maxRecommendedSlippage } from '../../stores/settings/createSettingsStore.js'
import { formatSlippage } from '../format.js'
import type { RouteIssue } from './types.js'

/** Aimed for when the backend named no figure of its own. */
export const fallbackTargetUsd = 1
export const fallbackSlippage = 0.5

const bufferPercent = { raise: 102n, lower: 98n }

const twoSignificantDigits = (roundingMode: 'ceil' | 'floor') =>
  new Intl.NumberFormat('en', {
    notation: 'standard',
    maximumSignificantDigits: 2,
    roundingMode,
    useGrouping: false,
  })

const suggestionFormatter = {
  raise: twoSignificantDigits('ceil'),
  lower: twoSignificantDigits('floor'),
}

const slippageFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  roundingMode: 'ceil',
  useGrouping: false,
})

/** A round number, trimmed away from the limit it has to clear. */
export const roundSuggestion = (
  amount: string,
  direction: 'raise' | 'lower'
): string => suggestionFormatter[direction].format(Number(amount))

/** The reported figure, moved clear of the limit that rejected it. */
export const bufferedReported = (issue: RouteIssue): bigint | undefined => {
  const required = issue.evidence?.requiredFromAmount
  if (required === undefined || required <= 0n) {
    return undefined
  }
  const direction = issue.evidence?.direction ?? 'raise'
  const buffered = (required * bufferPercent[direction]) / 100n
  return buffered > 0n ? buffered : undefined
}

// A backend slippage carries four digits at most, so twelve keeps every real
// one while dropping the tail that would round 0.35% a whole step up to 0.36%.
const withoutFloatTail = (value: number): number =>
  Number(value.toPrecision(12))

export const reportedSlippage = (issue: RouteIssue): string => {
  const required = issue.evidence?.requiredSlippage
  if (required === undefined) {
    return ''
  }
  return formatSlippage(
    slippageFormatter.format(withoutFloatTail(required * 100))
  )
}

/** With nothing reported, loosen past the current setting rather than guess. */
export const nextSlippage = (issue: RouteIssue, applied?: string): string => {
  const reported = reportedSlippage(issue)
  if (reported) {
    return reported
  }
  const current = Number(applied)
  const loosened =
    Number.isFinite(current) && current > fallbackSlippage
      ? current * 2
      : fallbackSlippage
  return formatSlippage(Math.min(loosened, maxRecommendedSlippage).toString())
}

export interface Suggestion {
  amount: bigint
  /** Set when the figure came from a USD bar rather than a reported amount. */
  usdBar?: number
}

/**
 * Two tools can state two different bars and clearing either one is enough, so
 * the gentler is what the user has to reach. `usdBar` is undefined when the USD
 * figure is only the invented floor, which never competes with a reported one.
 */
export const gentlerSuggestion = (
  reported: bigint | undefined,
  forUsd: bigint | undefined,
  usdBar: number | undefined
): Suggestion | undefined => {
  if (reported === undefined) {
    return forUsd === undefined ? undefined : { amount: forUsd, usdBar }
  }
  if (usdBar === undefined || forUsd === undefined || reported <= forUsd) {
    return { amount: reported }
  }
  return { amount: forUsd, usdBar }
}
