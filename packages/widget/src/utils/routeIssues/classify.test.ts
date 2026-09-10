import { describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import type { ClassifyContext } from './types.js'

const context: ClassifyContext = {
  fromAmount: 1000n,
  fromTokenDecimals: 18,
  fromTokenPriceUSD: '2500',
}

describe('classifyRouteIssues safety', () => {
  it('returns an empty list when the payload is undefined', () => {
    expect(classifyRouteIssues(undefined, context)).toEqual([])
  })

  it('returns an empty list when both sides are empty', () => {
    expect(
      classifyRouteIssues({ filteredOut: [], failed: [] }, context)
    ).toEqual([])
  })

  it('returns an empty list for a reason string no rule knows', () => {
    const result = classifyRouteIssues(
      {
        filteredOut: [
          {
            overallPath: '1:ETH-relay-1151111081099710:SOL',
            reason: 'Quantum flux capacitor misaligned for this path',
          },
        ],
        failed: [],
      },
      context
    )
    expect(result).toEqual([])
  })

  it('returns an empty list for a tool error code no rule knows', () => {
    const result = classifyRouteIssues(
      {
        filteredOut: [],
        failed: [
          {
            overallPath: '1:ETH-relay-1151111081099710:SOL',
            subpaths: {
              'sub-1': [
                {
                  errorType: 'NO_QUOTE',
                  code: 'BRAND_NEW_FUTURE_CODE',
                  tool: 'someTool',
                  message: 'Something the widget has never seen',
                  action: {} as never,
                },
              ],
            },
          },
        ],
      },
      context
    )
    expect(result).toEqual([])
  })

  it('survives a malformed payload without throwing', () => {
    const malformed = {
      filteredOut: null,
      failed: [{ overallPath: 'x', subpaths: null }],
    } as never
    expect(() => classifyRouteIssues(malformed, context)).not.toThrow()
    expect(classifyRouteIssues(malformed, context)).toEqual([])
  })

  it('ignores entries whose reason is missing', () => {
    const payload = {
      filteredOut: [{ overallPath: 'x' }],
      failed: [],
    } as never
    expect(classifyRouteIssues(payload, context)).toEqual([])
  })
})
