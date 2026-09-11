import { describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import codes from './fixtures/backend-codes.json' with { type: 'json' }
import reasons from './fixtures/backend-reasons.json' with { type: 'json' }
import { routeIssueRules } from './rules.js'
import type { ClassifyContext } from './types.js'

// Every `filteredOut.reason` template lifted from lifi-backend, with its
// placeholders filled. A reason the widget neither buckets nor deliberately
// suppresses would reach a user as the generic no-routes sentence.
const context: ClassifyContext = {
  fromAmount: 1_000_000n,
  fromChainId: 1,
  fromTokenSymbol: 'USDC',
  fromTokenDecimals: 6,
  fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  toAddress: '0xBD55C2F306C97Fd1d3E7A023f7c4834a2F472834',
}

const suppressedBy = (reason: string): string | undefined =>
  routeIssueRules.find(
    (rule) =>
      rule.suppressed &&
      'fragment' in rule.match &&
      rule.match.fragment.test(reason)
  )?.id

const bucketOf = (reason: string): string | undefined =>
  classifyRouteIssues(
    {
      filteredOut: [{ overallPath: '1:USDC-stargate-137:USDC', reason }],
      failed: [],
    } as never,
    context
  )[0]?.bucket

// A path overwrite carries a reason only when an operator published a note.
const operatorConfig = /is currently disabled for this action/

describe('every backend filter reason', () => {
  it.each(reasons)('%s', (reason) => {
    const disposition =
      bucketOf(reason) ??
      suppressedBy(reason) ??
      (operatorConfig.test(reason) ? 'operator config' : undefined)
    expect(disposition).toBeDefined()
  })
})

// The `code` enum the API documents, plus the internal TOOL_NOT_ALLOWED it also
// emits. A code with no rule falls through to the generic no-routes sentence.
describe('every backend error code', () => {
  const suppressedCodes = new Set(
    routeIssueRules.flatMap((rule) =>
      rule.suppressed && 'code' in rule.match ? [rule.match.code] : []
    )
  )

  it.each(codes)('%s', (code) => {
    const bucket = classifyRouteIssues(
      {
        filteredOut: [],
        failed: [
          {
            overallPath: '1:USDC-stargate-137:USDC',
            subpaths: {
              s: [{ errorType: 'NO_QUOTE', code, tool: 'stargate' }],
            },
          },
        ],
      } as never,
      context
    )[0]?.bucket

    expect(
      bucket ?? (suppressedCodes.has(code) ? 'suppressed' : undefined)
    ).toBeDefined()
  })
})
