import type { Token } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import en from '../../i18n/en.json' with { type: 'json' }
import { buildRouteIssueCard } from './card.js'
import { classifyRouteIssues } from './classify.js'
import payloads from './fixtures/live-payloads.json' with { type: 'json' }
import type { ClassifyContext } from './types.js'

// Real payloads from the API, collected by scripts/collect-route-issues.js.
// The widget only ever sees these, so replaying one reproduces its card
// exactly — which is what lets the sentence a user would read be asserted.

const lookup = (key: string): string =>
  key.split('.').reduce<any>((node, part) => node?.[part], en) ?? ''

const t = ((key: string, values?: Record<string, unknown>): string => {
  if (key === 'format.currency') {
    return `$${values?.value}`
  }
  return lookup(key).replace(/{{(\w+)}}/g, (_whole, name: string) =>
    String(values?.[name] ?? `{{${name}}}`)
  )
}) as unknown as TFunction

const usdValue = (request: (typeof payloads)[number]['request']): number =>
  (Number(request.fromAmount) / 10 ** request.fromTokenDecimals) *
  Number(request.fromTokenPriceUSD)

describe('cards built from real API payloads', () => {
  const report: string[] = []

  it.each(payloads)('$name', (entry) => {
    const { request } = entry
    const context: ClassifyContext = {
      fromAmount: BigInt(request.fromAmount),
      fromChainId: request.fromChainId,
      fromTokenSymbol: request.fromTokenSymbol,
      fromTokenDecimals: request.fromTokenDecimals,
      fromTokenPriceUSD: request.fromTokenPriceUSD,
      fromAddress: request.fromAddress,
      toAddress: request.toAddress,
    }
    // The card only exists when the quote came back empty. A payload that
    // still produced routes carries leftover reasons the user never sees, and
    // asserting on those would be measuring something the widget never renders.
    if (entry.routes > 0) {
      report.push(
        `${entry.name.padEnd(30)} — routes=${entry.routes}, no card shown`
      )
      return
    }

    const issues = classifyRouteIssues(
      entry.unavailableRoutes as never,
      context
    )
    const issue = issues[0]

    if (!issue) {
      // Telling these apart is the whole point: an empty payload leaves the
      // widget nothing to say, while reasons that produced no bucket are
      // reasons dropped on the floor, which is the bug this feature exists for.
      const u = entry.unavailableRoutes as {
        filteredOut?: unknown[]
        failed?: unknown[]
      }
      const reasonCount = (u.filteredOut?.length ?? 0) + (u.failed?.length ?? 0)
      report.push(
        `${entry.name.padEnd(30)} ${reasonCount === 0 ? 'no diagnostics from the API' : '*** REASONS DROPPED ***'}`
      )
      expect(reasonCount).toBe(0)
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

    report.push(
      `${entry.name.padEnd(30)} ${issue.bucket.padEnd(22)} ${(applied ?? '-').padEnd(14)} ${card.description.slice(0, 70)}`
    )

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
  })

  it('prints what a user would read', () => {
    console.warn(`\n${report.sort().join('\n')}`)
  })
})
