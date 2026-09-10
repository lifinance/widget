import { maxRecommendedSlippage } from '../../stores/settings/createSettingsStore.js'
import { formatSlippage } from '../format.js'
import type { RouteIssue } from './types.js'

/** Aimed for when the backend named no figure of its own. */
export const fallbackTargetUsd = 1
export const fallbackSlippage = 0.5

const suggestionDigits = 2

const buffer = {
  raise: { numerator: 102n, denominator: 100n },
  lower: { numerator: 98n, denominator: 100n },
}

/**
 * A suggestion should read as a round number, so trim it to two significant
 * digits — away from the limit it has to clear, which also clears it.
 */
export const roundSuggestion = (
  value: number,
  direction: 'raise' | 'lower'
): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return Number.NaN
  }
  const exponent = Math.floor(Math.log10(value))
  const factor = 10 ** (suggestionDigits - 1 - exponent)
  if (!Number.isFinite(factor) || factor <= 0) {
    return value
  }
  const scaled = value * factor
  const rounded = direction === 'raise' ? Math.ceil(scaled) : Math.floor(scaled)
  // Dividing by the factor reintroduces a binary tail (1e6 came back as
  // 999999.9999999999); an exponent literal is parsed exactly.
  return Number(`${rounded}e${exponent - suggestionDigits + 1}`)
}

/** The reported figure, moved clear of the limit that rejected it. */
export const bufferedReported = (issue: RouteIssue): bigint | undefined => {
  const required = issue.evidence?.requiredFromAmount
  if (required === undefined || required <= 0n) {
    return undefined
  }
  const { numerator, denominator } =
    buffer[issue.evidence?.direction ?? 'raise']
  const raw = (required * numerator) / denominator
  return raw > 0n ? raw : undefined
}

// Snap the binary error away before rounding up, or 0.0079 * 1e6 lands on
// 7900.000000000001 and ceil turns 0.79% into 0.7901%.
export const reportedSlippage = (issue: RouteIssue): string => {
  const required = issue.evidence?.requiredSlippage
  if (required === undefined) {
    return ''
  }
  const snapped = Number((required * 1e6).toFixed(3))
  return formatSlippage((Math.ceil(snapped) / 1e4).toString())
}

/** With nothing reported, loosen past the current setting rather than guess. */
export const nextSlippage = (issue: RouteIssue, applied?: string): string => {
  const reported = reportedSlippage(issue)
  if (reported) {
    return reported
  }
  const current = Number(applied)
  const doubled =
    Number.isFinite(current) && current > fallbackSlippage
      ? current * 2
      : fallbackSlippage
  return formatSlippage(Math.min(doubled, maxRecommendedSlippage).toString())
}
