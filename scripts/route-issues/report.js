/**
 * Replays every collected payload through the classifier and the card builder,
 * exactly as the widget would, and reports what comes out. Not part of the unit
 * suite; run it from the repository root with
 *
 *   pnpm --filter @lifi/widget exec vitest run -c ../../scripts/route-issues/vitest.config.js
 *
 * It prints the card a user would read for each payload, and writes each amount
 * suggestion to SUGGESTIONS_FILE (default: the OS temp directory), which
 * `node scripts/collect-route-issues.js --verify` re-requests to see whether
 * applying it actually finds a route.
 */
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import en from '../../packages/widget/src/i18n/en.json' with { type: 'json' }
import { compactNumberFormatter } from '../../packages/widget/src/utils/compactNumberFormatter.js'
import { buildRouteIssueCard } from '../../packages/widget/src/utils/routeIssues/card.js'
import { classifyRouteIssues } from '../../packages/widget/src/utils/routeIssues/classify.js'
import payloads from '../../packages/widget/src/utils/routeIssues/fixtures/live-payloads.json' with {
  type: 'json',
}

const suggestionsFile =
  process.env.SUGGESTIONS_FILE ?? join(tmpdir(), 'route-issue-suggestions.json')

const formatTokenAmount = compactNumberFormatter('en', {})

const lookup = (key) =>
  key.split('.').reduce((node, part) => node?.[part], en) ?? ''

const t = (key, values) => {
  if (key === 'format.currency') {
    return `$${values?.value}`
  }
  if (key === 'format.tokenAmount') {
    return formatTokenAmount(String(values?.value))
  }
  return lookup(key).replace(/{{(\w+)}}/g, (_whole, name) =>
    String(values?.[name] ?? `{{${name}}}`)
  )
}

it('reports what a user would read', () => {
  const lines = []
  const suggestions = []
  for (const entry of payloads) {
    // The card only exists when the quote came back empty.
    if (entry.routes > 0) {
      continue
    }
    const request = entry.request
    const issue = classifyRouteIssues(entry.unavailableRoutes, {
      fromAmount: BigInt(request.fromAmount),
      fromChainId: request.fromChainId,
      fromTokenSymbol: request.fromTokenSymbol,
      fromTokenDecimals: request.fromTokenDecimals,
      fromTokenPriceUSD: request.fromTokenPriceUSD,
      fromAddress: request.fromAddress,
      toAddress: request.toAddress,
    })[0]
    if (!issue) {
      lines.push(`${entry.name.padEnd(30)} no card, generic copy`)
      continue
    }
    let applied
    const card = buildRouteIssueCard(issue, {
      t,
      token: {
        symbol: request.fromTokenSymbol,
        decimals: request.fromTokenDecimals,
        priceUSD: request.fromTokenPriceUSD,
      },
      slippage: String(request.slippage * 100),
      amountLocked: false,
      receiverHidden: false,
      receiverRequired: false,
      spendable: 0n,
      toAddress: request.toAddress,
      sameEcosystem: request.fromChainId === request.toChainId,
      applyAmount: (value) => {
        applied = value
        suggestions.push({
          name: entry.name,
          suggested: value,
          sent: request.fromAmount,
        })
      },
      applySlippage: (value) => {
        applied = `slippage:${value}`
      },
      clearReceiver: () => {},
      retry: () => {},
    })
    card.action?.run()
    lines.push(
      `${entry.name.padEnd(30)} ${issue.bucket.padEnd(22)} ${(applied ?? '-').padEnd(14)} ${card.description}`
    )
  }
  writeFileSync(suggestionsFile, JSON.stringify(suggestions, null, 2))
  console.warn(
    `\n${lines.sort().join('\n')}\n\nwrote ${suggestions.length} amount suggestions to ${suggestionsFile}`
  )
})
