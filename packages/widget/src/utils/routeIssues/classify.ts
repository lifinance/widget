import type { UnavailableRoutes } from '@lifi/sdk'
import { bucketRank, routeIssueRules } from './rules.js'
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
    if (bucket && rule.bucket !== bucket) {
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
): { rule: RouteIssueRule; match?: RegExpExecArray } | undefined => {
  const byCode = entry.code ? ruleByCode.get(entry.code) : undefined
  // A code the widget maps decides the bucket. Prose may still carry the figure
  // the code omits, so it refines the code where it agrees, and never reclassifies.
  if (byCode && !byCode.suppressed) {
    return matchFragment(entry.text, byCode.bucket) ?? { rule: byCode }
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
  if (!!candidate.estimated !== !!incumbent.estimated) {
    return !candidate.estimated
  }
  return (candidate.direction ?? 'raise') === 'raise' ? a < b : a > b
}

const smaller = (a?: number, b?: number): number | undefined =>
  a === undefined || b === undefined ? (a ?? b) : Math.min(a, b)

const foldEvidence = (
  incumbent: RouteIssueEvidence | undefined,
  candidate: RouteIssueEvidence | undefined
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
    requiredSlippage: smaller(
      incumbent.requiredSlippage,
      candidate.requiredSlippage
    ),
    minUsd: smaller(incumbent.minUsd, candidate.minUsd),
    note: incumbent.note ?? candidate.note,
  }
}

// Only the leading issue is shown, so one the widget can act on has to win.
const hasFigure = (issue: RouteIssue): boolean =>
  issue.evidence?.requiredFromAmount !== undefined ||
  issue.evidence?.requiredSlippage !== undefined

const compareIssues = (a: RouteIssue, b: RouteIssue): number =>
  Number(hasFigure(b)) - Number(hasFigure(a)) ||
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
  const { rule, match } = found
  const extracted = match
    ? rule.extract?.(match, context, entry.path)
    : undefined
  if (extracted === null) {
    return
  }
  const evidence = extracted ?? undefined
  const bucket = rule.bucketFrom?.(evidence ?? {}) ?? rule.bucket
  const incumbent = collected.get(bucket)
  if (incumbent) {
    incumbent.evidence = foldEvidence(incumbent.evidence, evidence)
    return
  }
  collected.set(bucket, {
    bucket,
    ruleId: rule.id,
    evidence,
    fromAmount: context.fromAmount,
  })
}

// Bridges disagree on range, so both can fire. Keep the one with a figure.
const resolveAmountConflict = (issues: RouteIssue[]): RouteIssue[] => {
  const low = issues.find((issue) => issue.bucket === 'amountTooLow')
  const high = issues.find((issue) => issue.bucket === 'amountTooHigh')
  if (!low || !high) {
    return issues
  }
  const drop = hasFigure(high) && !hasFigure(low) ? low : high
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

// Emitted per tool, so beside a real reason it is both noise and untrue.
const dropUnsupportedNoise = (issues: RouteIssue[]): RouteIssue[] =>
  issues.length > 1
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

  const ranged = resolveAmountConflict([...collected.values()])
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
