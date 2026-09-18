import { writeFileSync } from 'node:fs'
import type { Token } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, it } from 'vitest'
import { buildRouteIssueCard } from './card.js'
import { classifyRouteIssues } from './classify.js'
import raw from './fixtures/live-payloads.json' with { type: 'json' }
import type { ClassifyContext } from './types.js'

const t = ((key: string) => key) as unknown as TFunction

// Feeds `node scripts/collect-route-issues.js --verify`, which re-requests at
// each suggested amount to see whether applying it actually finds a route.
// Off unless asked for, so CI never writes a file.
describe.skipIf(!process.env.DUMP_SUGGESTIONS)('dump', () => {
  it('writes the amount suggestions', () => {
    const out: { name: string; suggested: string; sent: string }[] = []
    for (const entry of raw as any[]) {
      if (entry.routes > 0) {
        continue
      }
      const r = entry.request
      const context: ClassifyContext = {
        fromAmount: BigInt(r.fromAmount),
        fromChainId: r.fromChainId,
        fromTokenSymbol: r.fromTokenSymbol,
        fromTokenDecimals: r.fromTokenDecimals,
        fromTokenPriceUSD: r.fromTokenPriceUSD,
        fromAddress: r.fromAddress,
        toAddress: r.toAddress,
      }
      const issue = classifyRouteIssues(entry.unavailableRoutes, context)[0]
      if (!issue) {
        continue
      }
      let applied: string | undefined
      const card = buildRouteIssueCard(issue, {
        t,
        token: {
          symbol: r.fromTokenSymbol,
          decimals: r.fromTokenDecimals,
          priceUSD: r.fromTokenPriceUSD,
        } as Token,
        slippage: String(r.slippage * 100),
        amountLocked: false,
        receiverHidden: false,
        toAddress: r.toAddress,
        sameEcosystem: r.fromChainId === r.toChainId,
        applyAmount: (v) => {
          applied = v
        },
        applySlippage: () => {},
        clearReceiver: () => {},
        retry: () => {},
      })
      card.action?.run()
      if (applied) {
        out.push({ name: entry.name, suggested: applied, sent: r.fromAmount })
      }
    }
    writeFileSync(
      '/tmp/claude-501/-Users-eugene-Projects/71d17826-4937-4a23-828e-04f08fcb6e62/scratchpad/suggestions.json',
      JSON.stringify(out, null, 2)
    )
    console.warn(`wrote ${out.length} amount suggestions`)
  })
})
