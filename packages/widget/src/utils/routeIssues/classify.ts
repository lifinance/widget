import type { UnavailableRoutes } from '@lifi/sdk'
import { bucketRank, routeIssueRules } from './rules.js'
import type {
  ClassifyContext,
  RouteIssue,
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

const findRule = (
  entry: RawEntry
): { rule: RouteIssueRule; match?: RegExpExecArray } | undefined => {
  const byCode = entry.code
    ? routeIssueRules.find(
        (rule) => 'code' in rule.match && rule.match.code === entry.code
      )
    : undefined
  // A code the widget maps is authoritative; its prose must not outrank it.
  if (byCode && !byCode.suppressed) {
    return { rule: byCode }
  }
  if (entry.text) {
    for (const rule of routeIssueRules) {
      if ('code' in rule.match) {
        continue
      }
      const match = rule.match.fragment.exec(entry.text)
      if (match) {
        return { rule, match }
      }
    }
  }
  return byCode ? { rule: byCode } : undefined
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

const foldEvidence = (
  incumbent: RouteIssueEvidence | undefined,
  candidate: RouteIssueEvidence | undefined
): RouteIssueEvidence | undefined => {
  if (!incumbent) {
    return candidate
  }
  if (!candidate) {
    return incumbent
  }
  return {
    direction: incumbent.direction ?? candidate.direction,
    ...(isGentler(candidate, incumbent)
      ? {
          requiredFromAmount: candidate.requiredFromAmount,
          estimated: candidate.estimated,
        }
      : {
          requiredFromAmount:
            incumbent.requiredFromAmount ?? candidate.requiredFromAmount,
          estimated: incumbent.requiredFromAmount
            ? incumbent.estimated
            : candidate.estimated,
        }),
    requiredSlippage:
      incumbent.requiredSlippage === undefined
        ? candidate.requiredSlippage
        : candidate.requiredSlippage === undefined
          ? incumbent.requiredSlippage
          : Math.min(incumbent.requiredSlippage, candidate.requiredSlippage),
    minUsd:
      incumbent.minUsd === undefined
        ? candidate.minUsd
        : candidate.minUsd === undefined
          ? incumbent.minUsd
          : Math.min(incumbent.minUsd, candidate.minUsd),
    note: incumbent.note ?? candidate.note,
  }
}

// An issue the widget can act on leads, so the one-click fix is never the one
// hidden behind the "other reasons" toggle.
const hasFigure = (issue: RouteIssue): boolean =>
  issue.evidence?.requiredFromAmount !== undefined ||
  issue.evidence?.requiredSlippage !== undefined

const compareIssues = (a: RouteIssue, b: RouteIssue): number =>
  Number(hasFigure(b)) - Number(hasFigure(a)) ||
  bucketRank[a.bucket] - bucketRank[b.bucket]

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

  return [...collected.values()].sort(compareIssues)
}

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
  collected.set(bucket, { bucket, ruleId: rule.id, evidence })
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
