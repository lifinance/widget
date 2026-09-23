import type { Token } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import en from '../../i18n/en.json' with { type: 'json' }
import { maxRecommendedSlippage } from '../../stores/settings/createSettingsStore.js'
import { compactNumberFormatter } from '../compactNumberFormatter.js'
import { buildRouteIssueCard } from './card.js'
import { classifyRouteIssues } from './classify.js'
import rawPayloads from './fixtures/live-payloads.json' with { type: 'json' }
import { bucketRank, routeIssueRules } from './rules.js'
import type { ClassifyContext, RouteIssueBucket } from './types.js'

// Real payloads from the API, collected by scripts/collect-route-issues.js.
// The widget only ever sees these, so replaying one reproduces its card
// exactly — which is what lets the sentence a user would read be asserted.

interface LivePayload {
  name: string
  request: {
    fromChainId: number
    fromTokenSymbol: string
    fromTokenDecimals: number
    fromTokenPriceUSD: string
    fromAmount: string
    toChainId: number
    fromAddress?: string
    toAddress?: string
    slippage: number
    bridges?: string[]
    exchanges?: string[]
  }
  routes: number
  unavailableRoutes: {
    filteredOut?: { reason: string; overallPath?: string }[]
    failed?: unknown[]
  }
}

const payloads = rawPayloads as unknown as LivePayload[]

const lookup = (key: string): string =>
  key.split('.').reduce<any>((node, part) => node?.[part], en) ?? ''

// The real formatter, so the grouped figure in the sentence is the one a user
// sees. A stub that returned the raw value would let the agreement check below
// pass without ever exercising the formatting.
const formatTokenAmount = compactNumberFormatter('en', {})

const t = ((key: string, values?: Record<string, unknown>): string => {
  if (key === 'format.currency') {
    return `$${values?.value}`
  }
  if (key === 'format.tokenAmount') {
    return formatTokenAmount(String(values?.value))
  }
  return lookup(key).replace(/{{(\w+)}}/g, (_whole, name: string) =>
    String(values?.[name] ?? `{{${name}}}`)
  )
}) as unknown as TFunction

const suppressedCodes = new Set(
  routeIssueRules.flatMap((rule) =>
    rule.suppressed && 'code' in rule.match ? [rule.match.code] : []
  )
)

const isSuppressed = (text: string, code?: string): boolean =>
  (code !== undefined && suppressedCodes.has(code)) ||
  routeIssueRules.some(
    (rule) =>
      rule.suppressed &&
      'fragment' in rule.match &&
      rule.match.fragment.test(text)
  )

/**
 * Reasons that produced no bucket and were not deliberately suppressed. An
 * empty payload leaves the widget nothing to say, and a suppressed one says
 * nothing worth repeating; a dropped reason is the bug this feature exists to
 * prevent, so only that fails.
 */
const unexplained = (entry: LivePayload): string[] => {
  const seen: { text: string; code?: string }[] = []
  for (const item of entry.unavailableRoutes.filteredOut ?? []) {
    seen.push({ text: item.reason })
  }
  for (const route of (entry.unavailableRoutes.failed ?? []) as {
    subpaths?: Record<string, { code?: string; message?: string }[]>
  }[]) {
    for (const errors of Object.values(route.subpaths ?? {})) {
      for (const error of errors) {
        seen.push({ text: error.message ?? '', code: error.code })
      }
    }
  }
  return seen
    .filter(({ text, code }) => !isSuppressed(text, code))
    .map(({ text, code }) => `${code ?? 'reason'}: ${text}`)
}

/** Reasons the user can act on, as opposed to a tool's own trouble. */
const requestLevel = new Set([
  'amountTooLow',
  'amountTooHigh',
  'slippageTooTight',
  'slippageTooLoose',
  'destinationAccountNotReady',
  'recipientNotSupported',
  'gaslessNotAvailable',
  'blockedBySettings',
])

const usdValue = (request: LivePayload['request']): number =>
  (Number(request.fromAmount) / 10 ** request.fromTokenDecimals) *
  Number(request.fromTokenPriceUSD)

const contextFor = (request: LivePayload['request']): ClassifyContext => ({
  fromAmount: BigInt(request.fromAmount),
  fromChainId: request.fromChainId,
  fromTokenSymbol: request.fromTokenSymbol,
  fromTokenDecimals: request.fromTokenDecimals,
  fromTokenPriceUSD: request.fromTokenPriceUSD,
  fromAddress: request.fromAddress,
  toAddress: request.toAddress,
})

/**
 * Buckets no collected request shows as its card, each with the reason. A
 * bucket pinned only by hand-written prose goes quiet the day the backend
 * rewords it, so a new one has to be captured or named here.
 */
const neverTheCard: Partial<Record<RouteIssueBucket, string>> = {
  // Every request that tripped it found another path, so no card was needed.
  recipientNotSupported: 'captured beside a route only',
  // Transient, and ranked to lead only when nothing else survived.
  temporary: 'captured beside a higher-ranked reason only',
  gaslessNotAvailable: 'not captured',
}

// Needs a gasless request, which the public routes endpoint does not take.
const neverCaptured: RouteIssueBucket[] = ['gaslessNotAvailable']

const allBuckets = Object.keys(bucketRank) as RouteIssueBucket[]

const issuesOf = (entry: LivePayload) =>
  classifyRouteIssues(
    entry.unavailableRoutes as never,
    contextFor(entry.request)
  )

describe('captured coverage', () => {
  it('shows every bucket as a card from a real payload, bar the named ones', () => {
    const shown = new Set(
      payloads
        .filter((entry) => entry.routes === 0)
        .map((entry) => issuesOf(entry)[0]?.bucket)
    )
    expect(allBuckets.filter((bucket) => !shown.has(bucket))).toEqual(
      allBuckets.filter((bucket) => neverTheCard[bucket])
    )
  })

  it('pins real prose for every bucket, bar the one never captured', () => {
    const found = new Set(
      payloads.flatMap((entry) => issuesOf(entry).map((issue) => issue.bucket))
    )
    expect(allBuckets.filter((bucket) => !found.has(bucket))).toEqual(
      neverCaptured
    )
  })
})

describe('cards built from real API payloads', () => {
  it.each(payloads)('$name', (entry) => {
    const { request } = entry
    const context = contextFor(request)
    // The card only exists when the quote came back empty. A payload that
    // still produced routes carries leftover reasons the user never sees, and
    // asserting on those would be measuring something the widget never renders.
    if (entry.routes > 0) {
      return
    }

    const issues = classifyRouteIssues(
      entry.unavailableRoutes as never,
      context
    )
    const issue = issues[0]

    if (!issue) {
      expect(unexplained(entry)).toEqual([])
      return
    }

    const token = {
      symbol: request.fromTokenSymbol,
      decimals: request.fromTokenDecimals,
      priceUSD: request.fromTokenPriceUSD,
    } as Token

    let applied: string | undefined
    const card = buildRouteIssueCard(issue, {
      t,
      token,
      slippage: String(request.slippage * 100),
      amountLocked: false,
      receiverHidden: false,
      receiverRequired: false,
      spendable: 0n,
      toAddress: request.toAddress,
      sameEcosystem: request.fromChainId === request.toChainId,
      applyAmount: (value) => {
        applied = value
      },
      applySlippage: (value) => {
        applied = `slippage:${value}`
      },
      clearReceiver: () => {},
      retry: () => {},
    })
    card.action?.run()

    // Every placeholder must have been given a value.
    expect(card.description).not.toContain('{{')
    expect(card.title).not.toContain('{{')

    // A suggestion has to move the amount the way the card says it does.
    const sent = Number(request.fromAmount) / 10 ** request.fromTokenDecimals
    if (applied !== undefined && !applied.startsWith('slippage:')) {
      const suggested = Number(applied)
      expect(Number.isFinite(suggested)).toBe(true)
      if (issue.bucket === 'amountTooLow') {
        expect(suggested).toBeGreaterThan(sent)
      }
      if (issue.bucket === 'amountTooHigh') {
        expect(suggested).toBeLessThan(sent)
      }
    }

    // "A smaller amount may work better" is not advice a send of one unit can
    // act on. Below the floor the shortfall is the size of the send itself.
    if (issue.bucket === 'liquidity') {
      expect(usdValue(request)).toBeGreaterThanOrEqual(1)
    }

    // The button and the sentence have to name the same figure. Reported as
    // "I receive a quote for $11 but it suggests less". The sentence carries the
    // grouped rendering, so compare against that rather than the raw value.
    if (applied !== undefined && !applied.startsWith('slippage:')) {
      expect(card.description).toContain(formatTokenAmount(applied))
    }

    // A minimum the backend stated is a floor, so a suggestion under it asks
    // the user to retry an amount already refused.
    const minUsd = issue.evidence?.minUsd
    if (
      minUsd !== undefined &&
      applied !== undefined &&
      !applied.startsWith('slippage:')
    ) {
      const suggestedUsd = Number(applied) * Number(request.fromTokenPriceUSD)
      expect(suggestedUsd).toBeGreaterThanOrEqual(minUsd * 0.99)
    }

    // A slippage fix moves toward the bar and no further. A floor is cleared by
    // raising, but loosening past what the widget itself calls unusual is not a
    // fix; a cap is met by lowering, whatever the setting was.
    if (applied?.startsWith('slippage:')) {
      const target = Number(applied.slice('slippage:'.length))
      const current = request.slippage * 100
      expect(target).toBeGreaterThan(0)
      if (issue.bucket === 'slippageTooLoose') {
        expect(target).toBeLessThan(current)
      } else {
        expect(target).toBeGreaterThan(current)
        expect(target).toBeLessThanOrEqual(maxRecommendedSlippage)
      }
    }

    // "This pair is not supported" is untrue beside a reason about the request,
    // and it must never be what the user is left reading.
    const buckets = issues.map((entry) => entry.bucket)
    if (buckets.some((bucket) => requestLevel.has(bucket))) {
      expect(buckets).not.toContain('pairNotSupported')
      expect(issue.bucket).not.toBe('temporary')
    }
  })
})
