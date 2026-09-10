import type { UnavailableRoutes } from '@lifi/sdk'
import { bucketOrder, routeIssueRules } from './rules.js'
import type {
  ClassifyContext,
  RouteIssue,
  RouteIssueEvidence,
  RouteIssueRule,
} from './types.js'

interface RawEntry {
  text: string
  code?: string
}

const collectEntries = (unavailableRoutes: UnavailableRoutes): RawEntry[] => {
  const entries: RawEntry[] = []

  const filteredOut = unavailableRoutes.filteredOut
  if (Array.isArray(filteredOut)) {
    for (const item of filteredOut) {
      if (typeof item?.reason === 'string') {
        entries.push({ text: item.reason })
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
          if (typeof toolError?.code === 'string') {
            entries.push({
              text:
                typeof toolError.message === 'string' ? toolError.message : '',
              code: toolError.code,
            })
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
  for (const rule of routeIssueRules) {
    if ('code' in rule.match) {
      if (entry.code === rule.match.code) {
        return { rule }
      }
      continue
    }
    if (!entry.text) {
      continue
    }
    const match = new RegExp(rule.match.fragment).exec(entry.text)
    if (match) {
      return { rule, match }
    }
  }
  return undefined
}

// Both ratios are required/current. Cross-multiply so no division is needed and
// no precision is lost on 18-decimal integers.
const isGentler = (
  candidate: RouteIssueEvidence,
  incumbent: RouteIssueEvidence
): boolean => {
  const a = candidate.amountBounds
  const b = incumbent.amountBounds
  if (!a) {
    return false
  }
  if (!b) {
    return true
  }
  const left = a.required * b.current
  const right = b.required * a.current
  return a.direction === 'raise' ? left < right : left > right
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
    amountBounds: isGentler(candidate, incumbent)
      ? candidate.amountBounds
      : (incumbent.amountBounds ?? candidate.amountBounds),
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

const classify = (
  unavailableRoutes: UnavailableRoutes,
  context: ClassifyContext
): RouteIssue[] => {
  const collected = new Map<string, RouteIssue>()

  for (const entry of collectEntries(unavailableRoutes)) {
    const found = findRule(entry)
    if (!found || found.rule.suppressed) {
      continue
    }
    const { rule, match } = found
    const evidence = match ? rule.extract?.(match, context) : undefined
    if (rule.extract && !evidence) {
      continue
    }
    const bucket = rule.bucketFrom?.(evidence ?? {}) ?? rule.bucket
    const key = `${bucket}:${rule.id}`
    const incumbent = collected.get(key)
    if (incumbent) {
      incumbent.count += 1
      incumbent.evidence = foldEvidence(incumbent.evidence, evidence)
      continue
    }
    collected.set(key, { bucket, ruleId: rule.id, count: 1, evidence })
  }

  return [...collected.values()].sort(
    (a, b) => bucketOrder.indexOf(a.bucket) - bucketOrder.indexOf(b.bucket)
  )
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
      const unmatched = (unavailableRoutes.filteredOut ?? [])
        .slice(0, 3)
        .map((item) => item?.reason)
        .filter(Boolean)
      if (unmatched.length) {
        console.warn('No route issue rule matched:', unmatched)
      }
    }
    return issues
  } catch {
    return []
  }
}
