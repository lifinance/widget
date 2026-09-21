import type { Token } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import en from '../../i18n/en.json' with { type: 'json' }
import { buildRouteIssueCard } from './card.js'
import type {
  RouteIssue,
  RouteIssueBucket,
  RouteIssueEvidence,
} from './types.js'

// The card picks its copy from the bucket, the evidence and the applied
// slippage, so a bucket missing one of its variants only shows up on the
// combination that asks for it — as the raw key, in front of a user. The live
// payloads cover the combinations the API has produced so far; this covers the
// ones it has not.

const buckets: RouteIssueBucket[] = [
  'amountTooLow',
  'amountTooHigh',
  'slippageTooTight',
  'slippageTooLoose',
  'destinationAccountNotReady',
  'recipientNotSupported',
  'gaslessNotAvailable',
  'blockedBySettings',
  'liquidity',
  'temporary',
  'pairNotSupported',
]

const evidences: (RouteIssueEvidence | undefined)[] = [
  undefined,
  { requiredFromAmount: 2_000_000n },
  { requiredFromAmount: 500_000n, direction: 'lower' },
  { minUsd: 5 },
  { maxUsd: 5 },
  // Under the widget's own floor, so the bar is ours and must not be quoted.
  { minUsd: 0.5 },
  { requiredSlippage: 0.03 },
  { requiredFromAmount: 2_000_000n, estimated: true },
  { note: 'maintenance until 14:00' },
]

const token = { symbol: 'USDC', decimals: 6, priceUSD: '1' } as Token

const lookup = (key: string): unknown =>
  key.split('.').reduce<any>((node, part) => node?.[part], en)

const t = ((key: string, values?: Record<string, unknown>): string => {
  if (key.startsWith('format.')) {
    return '1'
  }
  const found = lookup(key)
  return String(found ?? `MISSING:${key}`).replace(
    /{{(\w+)}}/g,
    (_whole, name: string) => String(values?.[name] ?? `{{${name}}}`)
  )
}) as unknown as TFunction

describe('every card the builder can produce', () => {
  it('asks only for copy that exists, and fills every placeholder', () => {
    for (const bucket of buckets) {
      for (const evidence of evidences) {
        for (const slippage of [undefined, '0.5', '3']) {
          for (const fromAmount of [0n, 1_000_000n]) {
            const issue: RouteIssue = {
              bucket,
              ruleId: 'matrix',
              evidence,
              fromAmount,
            }
            const card = buildRouteIssueCard(issue, {
              t,
              token,
              slippage,
              amountLocked: false,
              receiverHidden: false,
              receiverRequired: false,
              spendable: 0n,
              toAddress: '0xabc',
              sameEcosystem: true,
              applyAmount: () => {},
              applySlippage: () => {},
              clearReceiver: () => {},
              retry: () => {},
            })
            const where = `${bucket} ${JSON.stringify(evidence, (_k, v) =>
              typeof v === 'bigint' ? `${v}n` : v
            )} slippage=${slippage} sent=${fromAmount}`
            expect(card.title, where).not.toContain('MISSING:')
            expect(card.description, where).not.toContain('MISSING:')
            expect(card.description, where).not.toContain('{{')
            expect(card.action?.label ?? '', where).not.toContain('MISSING:')
          }
        }
      }
    }
  })
})
