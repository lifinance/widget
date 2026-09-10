import { describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import type { ClassifyContext, RouteIssue } from './types.js'

const context: ClassifyContext = {
  fromAmount: 1000n,
  fromTokenDecimals: 18,
  fromTokenPriceUSD: '2500',
}

const fromReason = (reason: string): RouteIssue[] =>
  classifyRouteIssues(
    { filteredOut: [{ overallPath: 'p', reason }], failed: [] },
    context
  )

describe('transferRange rule', () => {
  it('reports amountTooLow when the amount is under the minimum', () => {
    const [issue] = fromReason(
      'Transferred amount (1000000) out of acceptable range (min: 2000000, max: Infinity)'
    )
    expect(issue.bucket).toBe('amountTooLow')
    expect(issue.ruleId).toBe('transferRange')
    expect(issue.evidence?.amountBounds).toEqual({
      current: 1000000n,
      required: 2000000n,
      direction: 'raise',
    })
  })

  it('reports amountTooHigh when the amount is over the maximum', () => {
    const [issue] = fromReason(
      'Transferred amount (9000000) out of acceptable range (min: 100, max: 5000000)'
    )
    expect(issue.bucket).toBe('amountTooHigh')
    expect(issue.evidence?.amountBounds).toEqual({
      current: 9000000n,
      required: 5000000n,
      direction: 'lower',
    })
  })

  it('keeps full precision on an 18-decimal amount', () => {
    const [issue] = fromReason(
      'Transferred amount (1000000000000000001) out of acceptable range (min: 2000000000000000003, max: Infinity)'
    )
    expect(issue.evidence?.amountBounds?.current).toBe(1000000000000000001n)
    expect(issue.evidence?.amountBounds?.required).toBe(2000000000000000003n)
  })

  it('emits no bounds when the amount is inside the range', () => {
    expect(
      fromReason(
        'Transferred amount (300) out of acceptable range (min: 100, max: 5000)'
      )
    ).toEqual([])
  })

  it('emits no bounds when a captured number is not an integer', () => {
    expect(
      fromReason(
        'Transferred amount (1e21) out of acceptable range (min: 2e21, max: Infinity)'
      )
    ).toEqual([])
  })

  it('keeps the gentlest requirement when several minimums collapse', () => {
    const [issue] = classifyRouteIssues(
      {
        filteredOut: [
          {
            overallPath: 'a',
            reason:
              'Transferred amount (100) out of acceptable range (min: 900, max: Infinity)',
          },
          {
            overallPath: 'b',
            reason:
              'Transferred amount (100) out of acceptable range (min: 300, max: Infinity)',
          },
        ],
        failed: [],
      },
      context
    )
    expect(issue.count).toBe(2)
    expect(issue.evidence?.amountBounds?.required).toBe(300n)
  })
})
