import type { UnavailableRoutes } from '@lifi/sdk'
import { formatUnits } from '@lifi/sdk'
import { bucketRank, routeIssueRules, sendWorthLessThanFloor } from './rules.js'
import type {
  ClassifyContext,
  RouteIssue,
  RouteIssueBucket,
  RouteIssueEvidence,
  RouteIssueRule,
} from './types.js'

interface RawEntry {
  text: string
  code?: string
  path?: string
}

const collectEntries = (unavailableRoutes: UnavailableRoutes): RawEntry[] => {
  const entries: RawEntry[] = []

  const filteredOut = unavailableRoutes.filteredOut
  if (Array.isArray(filteredOut)) {
    for (const item of filteredOut) {
      if (typeof item?.reason === 'string') {
        entries.push({ text: item.reason, path: item.overallPath })
      }
    }
  }

  const failed = unavailableRoutes.failed
  if (Array.isArray(failed)) {
    for (const route of failed) {
      const subpaths = route?.subpaths
      if (!subpaths || typeof subpaths !== 'object') {
        continue
      }
      for (const toolErrors of Object.values(subpaths)) {
        if (!Array.isArray(toolErrors)) {
          continue
        }
        for (const toolError of toolErrors) {
          const code =
            typeof toolError?.code === 'string' ? toolError.code : undefined
          const text =
            typeof toolError?.message === 'string' ? toolError.message : ''
          if (code || text) {
            entries.push({ text, code, path: route.overallPath })
          }
        }
      }
    }
  }

  return entries
}

const ruleByCode = new Map(
  routeIssueRules.flatMap((rule) =>
    'code' in rule.match ? [[rule.match.code, rule] as const] : []
  )
)

const fragmentRules = routeIssueRules.flatMap((rule) =>
  'fragment' in rule.match
    ? [{ rule, fragment: rule.match.fragment } as const]
    : []
)

const matchFragment = (
  text: string,
  bucket?: RouteIssueBucket
): { rule: RouteIssueRule; match: RegExpExecArray } | undefined => {
  for (const { rule, fragment } of text ? fragmentRules : []) {
    // A rule that derives its bucket from the amount decides for itself, so the
    // code's label must not filter it out: those rules read which bound was
    // actually crossed, and their `extract` returns null when neither was.
    if (bucket && !rule.bucketFrom && rule.bucket !== bucket) {
      continue
    }
    const match = fragment.exec(text)
    if (match) {
      return { rule, match }
    }
  }
  return undefined
}

const findRule = (
  entry: RawEntry
):
  | {
      rule: RouteIssueRule
      match?: RegExpExecArray
      /** What the code named, for prose that turns out to refine nothing. */
      fallback?: RouteIssueRule
    }
  | undefined => {
  const byCode = entry.code ? ruleByCode.get(entry.code) : undefined
  // A code the widget maps decides the bucket, and prose that lands in the same
  // bucket may still carry the figure the code omits. `pairNotSupported` is the
  // catch-all, so there any prose that names a real reason is the better answer.
  if (byCode && !byCode.suppressed) {
    const refinable =
      byCode.bucket === 'pairNotSupported' ? undefined : byCode.bucket
    const refined = matchFragment(entry.text, refinable)
    // Only the catch-all runs unfiltered, so only there can a suppressed rule
    // match. Suppressed prose says nothing worth showing, which is no reason to
    // lose the bucket the code named beside it.
    return refined && !refined.rule.suppressed
      ? { ...refined, fallback: byCode }
      : { rule: byCode }
  }
  return matchFragment(entry.text) ?? (byCode ? { rule: byCode } : undefined)
}

const isGentler = (
  candidate: RouteIssueEvidence,
  incumbent: RouteIssueEvidence
): boolean => {
  const a = candidate.requiredFromAmount
  const b = incumbent.requiredFromAmount
  if (a === undefined || a <= 0n) {
    return false
  }
  if (b === undefined) {
    return true
  }
  // The size decides first: the user has to clear one tool's bar, and a scaled
  // figure that asks for far less is still the gentler ask. `estimated` only
  // separates two figures that ask for the same thing, where the stated one is
  // worth more than the derived one.
  if (a !== b) {
    return (candidate.direction ?? 'raise') === 'raise' ? a < b : a > b
  }
  return !!incumbent.estimated && !candidate.estimated
}

// The user has to clear one tool's bar, not every tool's — so the gentlest of
// each kind is the one to aim for: the lowest floor, and the highest ceiling.
const smaller = (a?: number, b?: number): number | undefined =>
  a === undefined || b === undefined ? (a ?? b) : Math.min(a, b)

const larger = (a?: number, b?: number): number | undefined =>
  a === undefined || b === undefined ? (a ?? b) : Math.max(a, b)

const foldEvidence = (
  incumbent: RouteIssueEvidence | undefined,
  candidate: RouteIssueEvidence | undefined,
  /** `requiredSlippage` is a floor to clear in one bucket and a cap in the
   * other, so which way it folds depends on where it landed. */
  bucket: RouteIssueBucket
): RouteIssueEvidence | undefined => {
  if (!incumbent || !candidate) {
    return incumbent ?? candidate
  }
  const withAmount =
    isGentler(candidate, incumbent) ||
    incumbent.requiredFromAmount === undefined
      ? candidate
      : incumbent
  return {
    direction: incumbent.direction ?? candidate.direction,
    requiredFromAmount: withAmount.requiredFromAmount,
    estimated: withAmount.estimated,
    requiredSlippage: (bucket === 'slippageTooLoose' ? larger : smaller)(
      incumbent.requiredSlippage,
      candidate.requiredSlippage
    ),
    minUsd: smaller(incumbent.minUsd, candidate.minUsd),
    maxUsd: larger(incumbent.maxUsd, candidate.maxUsd),
    note: incumbent.note ?? candidate.note,
  }
}

// A bar stated in dollars produces a suggestion just as a token figure does, so
// leaving it out let a USD-only ceiling lose the tie-break every time and the
// card advise the opposite of what the payload said.
const hasFigure = (issue: RouteIssue): boolean =>
  issue.evidence?.requiredFromAmount !== undefined ||
  issue.evidence?.requiredSlippage !== undefined ||
  issue.evidence?.minUsd !== undefined ||
  issue.evidence?.maxUsd !== undefined

// Only the leading issue is shown, and the rank is what says which one blocks
// the route. Carrying a figure must not promote a lesser reason above it: a
// slippage the user can loosen is no help while the amount is still refused.
const compareIssues = (a: RouteIssue, b: RouteIssue): number =>
  bucketRank[a.bucket] - bucketRank[b.bucket]

const collect = (
  collected: Map<string, RouteIssue>,
  entry: RawEntry,
  context: ClassifyContext
): void => {
  const found = findRule(entry)
  if (!found || found.rule.suppressed) {
    return
  }
  const { match, fallback } = found
  const refined = match
    ? found.rule.extract?.(match, context, entry.path)
    : undefined
  // Rejecting the prose is a refusal to refine, not a verdict on the entry: the
  // code still named a cause, and dropping it left the tool error unexplained.
  if (refined === null && !fallback) {
    return
  }
  const rule = refined === null ? (fallback as RouteIssueRule) : found.rule
  const extracted = refined === null ? undefined : refined
  const evidence = extracted ?? undefined
  const named = rule.bucketFrom?.(evidence ?? {}) ?? rule.bucket
  // A send worth almost nothing exhausts any pool and trips every value-loss
  // check, whichever rule reports it — the code the tool returns as much as the
  // prose. The cure is a larger amount, never the smaller one the liquidity
  // card advises, so the whole bucket turns on the size of the send.
  const bucket =
    named === 'liquidity' && sendWorthLessThanFloor(context)
      ? 'amountTooLow'
      : named
  const incumbent = collected.get(bucket)
  if (incumbent) {
    incumbent.evidence = foldEvidence(incumbent.evidence, evidence, bucket)
    return
  }
  collected.set(bucket, {
    bucket,
    ruleId: rule.id,
    evidence,
    fromAmount: context.fromAmount,
  })
}

/**
 * Whether the send is actually on the wrong side of the bar this issue states.
 * A floor the send already clears, or a ceiling it already sits under, refutes
 * its own bucket — the card would advise moving the amount the wrong way.
 * Without a figure there is nothing to check, so the issue stands.
 */
const barStands = (issue: RouteIssue, context: ClassifyContext): boolean => {
  const { requiredFromAmount, minUsd, maxUsd } = issue.evidence ?? {}
  const low = issue.bucket === 'amountTooLow'
  if (requiredFromAmount !== undefined) {
    return low
      ? requiredFromAmount > issue.fromAmount
      : requiredFromAmount < issue.fromAmount
  }
  const bar = low ? minUsd : maxUsd
  const price = Number.parseFloat(context.fromTokenPriceUSD ?? '')
  if (bar === undefined || !(price > 0)) {
    return true
  }
  const sentUsd =
    Number(formatUnits(issue.fromAmount, context.fromTokenDecimals)) * price
  return low ? bar > sentUsd : bar < sentUsd
}

/**
 * Amount reasons whose bar the send has already cleared. A lone one is as wrong
 * as a losing one: it outranks every other bucket, and `dropUnsupportedNoise`
 * then deletes the truthful reason beside it as request-level noise.
 */
const dropRefutedAmounts = (
  issues: RouteIssue[],
  context: ClassifyContext
): RouteIssue[] =>
  // With no send amount there is nothing to refute a bar with; the conflict
  // resolver below answers that case on its own.
  context.fromAmount <= 0n
    ? issues
    : issues.filter(
        (issue) =>
          (issue.bucket !== 'amountTooLow' &&
            issue.bucket !== 'amountTooHigh') ||
          barStands(issue, context)
      )

const resolveAmountConflict = (
  issues: RouteIssue[],
  context: ClassifyContext
): RouteIssue[] => {
  const low = issues.find((issue) => issue.bucket === 'amountTooLow')
  const high = issues.find((issue) => issue.bucket === 'amountTooHigh')
  if (!low || !high) {
    return issues
  }
  // A receive-driven quote classifies with no send amount, so neither bar can
  // be checked against anything and the tie-break would be a coin toss that
  // bucketRank always calls "too low". Answering the wrong one tells the user
  // to move their amount the wrong way, so answer with neither and let a
  // lower-ranked reason, or the generic sentence, stand instead.
  if (context.fromAmount <= 0n) {
    return issues.filter((issue) => issue !== low && issue !== high)
  }
  // A bar the send has already cleared cannot be the reason, whichever bucket
  // states it, so it loses before the figure tie-break is even reached.
  const lowStands = barStands(low, context)
  const highStands = barStands(high, context)
  // Both refuted: the send sits above the floor and below the ceiling, so
  // neither direction is supported and keeping either would advise a move the
  // evidence contradicts — the same answer as having no send amount at all.
  if (!lowStands && !highStands) {
    return issues.filter((issue) => issue !== low && issue !== high)
  }
  const drop =
    lowStands !== highStands
      ? lowStands
        ? high
        : low
      : hasFigure(high) && !hasFigure(low)
        ? low
        : high
  return issues.filter((issue) => issue !== drop)
}

// Only meaningful for a receiver the user chose that differs from them.
const dropInapplicableReceiver = (
  issues: RouteIssue[],
  context: ClassifyContext
): RouteIssue[] => {
  const custom =
    !!context.toAddress &&
    context.toAddress.toLowerCase() !== context.fromAddress?.toLowerCase()
  return custom
    ? issues
    : issues.filter((issue) => issue.bucket !== 'recipientNotSupported')
}

// A Record so a new bucket has to declare which kind of reason it is.
const aboutTheRequest: Record<RouteIssueBucket, boolean> = {
  amountTooLow: true,
  amountTooHigh: true,
  slippageTooTight: true,
  slippageTooLoose: true,
  destinationAccountNotReady: true,
  recipientNotSupported: true,
  gaslessNotAvailable: true,
  blockedBySettings: true,
  liquidity: false,
  temporary: false,
  pairNotSupported: false,
}

// `NO_POSSIBLE_ROUTE` is emitted per tool. Beside a reason about the request it
// is untrue — the pair works, this request does not. Beside a tool's own
// trouble it is the more complete answer, so it stays.
const dropUnsupportedNoise = (issues: RouteIssue[]): RouteIssue[] =>
  issues.some((issue) => aboutTheRequest[issue.bucket])
    ? issues.filter((issue) => issue.bucket !== 'pairNotSupported')
    : issues

const classify = (
  unavailableRoutes: UnavailableRoutes,
  context: ClassifyContext
): RouteIssue[] => {
  const collected = new Map<string, RouteIssue>()

  for (const entry of collectEntries(unavailableRoutes)) {
    try {
      collect(collected, entry, context)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Route issue rule failed:', error)
      }
    }
  }

  const ranged = resolveAmountConflict(
    dropRefutedAmounts([...collected.values()], context),
    context
  )
  const applicable = dropInapplicableReceiver(ranged, context)
  return dropUnsupportedNoise(applicable).sort(compareIssues)
}

export function classifyRouteIssues(
  unavailableRoutes: UnavailableRoutes | undefined,
  context: ClassifyContext
): RouteIssue[] {
  if (!unavailableRoutes) {
    return []
  }
  try {
    const issues = classify(unavailableRoutes, context)
    if (process.env.NODE_ENV === 'development' && !issues.length) {
      const unmatched = collectEntries(unavailableRoutes)
        .slice(0, 5)
        .map((entry) => entry.code ?? entry.text)
        .filter(Boolean)
      if (unmatched.length) {
        console.warn('No route issue rule matched:', unmatched)
      }
    }
    return issues
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Route issue classification failed:', error)
    }
    return []
  }
}
