import { maxRecommendedSlippage } from '../../stores/settings/createSettingsStore.js'
import { formatSlippage } from '../format.js'
import type { RouteIssue } from './types.js'

/** Aimed for when the backend named no figure of its own. */
export const fallbackTargetUsd = 1
export const fallbackSlippage = 0.5

const bufferPercent = { raise: 102n, lower: 98n }

const decimalPattern = /^(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i

/**
 * `value` cut to `digits` significant or fractional digits, rounded up or down.
 *
 * Done on the decimal digits rather than through Intl.NumberFormat's
 * `roundingMode`: an engine without that option (Chrome < 106, Safari < 15.4,
 * Firefox < 116) rounds half-way instead, which put a raised figure under the
 * bar it had to clear. Anything that is not a plain positive decimal comes back
 * as it was, for the caller to reject.
 */
const roundDecimal = (
  value: string,
  digits: number,
  kind: 'significant' | 'fraction',
  up: boolean
): string => {
  const parts = decimalPattern.exec(value.trim())
  if (!parts) {
    return value
  }
  const fraction = parts[2] ?? ''
  let units = BigInt(parts[1] + fraction)
  let scale = fraction.length - Number(parts[3] ?? 0)
  if (scale < 0) {
    units *= 10n ** BigInt(-scale)
    scale = 0
  }
  const dropped =
    kind === 'fraction' ? scale - digits : units.toString().length - digits
  if (units > 0n && dropped > 0) {
    const step = 10n ** BigInt(dropped)
    const floored = (units / step) * step
    units = up && floored !== units ? floored + step : floored
  }
  const padded = units.toString().padStart(scale + 1, '0')
  const whole = padded.slice(0, padded.length - scale)
  const fractional = padded.slice(padded.length - scale).replace(/0+$/, '')
  return fractional ? `${whole}.${fractional}` : whole
}

/** A round number, trimmed away from the limit it has to clear. */
export const roundSuggestion = (
  amount: string,
  direction: 'raise' | 'lower'
): string => roundDecimal(amount, 2, 'significant', direction === 'raise')

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
  // A floor has to be cleared and a cap has to be stayed under, so each rounds
  // away from the bar rather than onto it: rounding a 1.2345% cap up to 1.24%
  // writes back a value the bridge refuses for the same reason.
  const rounded = roundDecimal(
    String(withoutFloatTail(required * 100)),
    2,
    'fraction',
    issue.bucket !== 'slippageTooLoose'
  )
  // A cap under 0.005% floors to zero, and zero slippage is not a setting.
  return Number.parseFloat(rounded) > 0 ? formatSlippage(rounded) : ''
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
  const target = Math.min(loosened, maxRecommendedSlippage)
  // The widget warns about an unusual slippage rather than blocking it, so the
  // applied value can already sit above the cap. Advising a smaller number on a
  // card titled "too tight" contradicts the card and cannot be acted on.
  return Number.isFinite(current) && target <= current
    ? ''
    : formatSlippage(target.toString())
}

export interface Suggestion {
  amount: bigint
  /** Set when the figure came from a USD bar rather than a reported amount. */
  usdBar?: number
  /** The figure is the invented floor, so no tool ever named it. */
  estimated?: boolean
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
    if (forUsd === undefined) {
      return undefined
    }
    return usdBar === undefined
      ? { amount: forUsd, estimated: true }
      : { amount: forUsd, usdBar }
  }
  if (usdBar === undefined || forUsd === undefined || reported <= forUsd) {
    return { amount: reported }
  }
  return { amount: forUsd, usdBar }
}
