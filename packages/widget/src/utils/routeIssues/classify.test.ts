import { beforeAll, describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import ethToSol from './fixtures/no-routes-eth-to-sol.json' with {
  type: 'json',
}
import type { ClassifyContext } from './types.js'

const context: ClassifyContext = {
  fromAmount: 1000n,
  fromChainId: 1,
  fromTokenSymbol: 'ETH',
  fromTokenDecimals: 18,
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

// Captured from the widget's own POST /v1/advanced/routes for 1000 wei ETH on
// Ethereum -> SOL on Solana. The `failed` side is capped at three errors per
// code; `filteredOut` is verbatim.
describe('a captured widget payload', () => {
  let issues: ReturnType<typeof classifyRouteIssues>

  beforeAll(() => {
    issues = classifyRouteIssues(ethToSol as never, context)
  })

  it('resolves the dust ETH -> SOL request to amount too low', () => {
    expect(issues[0]?.bucket).toBe('amountTooLow')
  })

  it('collapses 67 filtered reasons and 18 tool errors into a handful', () => {
    expect(ethToSol.filteredOut).toHaveLength(67)
    expect(issues.length).toBeLessThanOrEqual(5)
  })

  it('emits each bucket at most once', () => {
    const keys = issues.map((issue) => `${issue.bucket}:${issue.ruleId}`)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('suppresses the codes that dominate the payload', () => {
    expect(issues.map((issue) => issue.ruleId)).not.toContain(
      'code:TOOL_NOT_ALLOWED'
    )
    expect(issues.map((issue) => issue.ruleId)).not.toContain(
      'code:TOOL_SPECIFIC_ERROR'
    )
  })

  // The capture carries the same minimum twice — once as 'eth' on a path that
  // bridges the user's own token, once as 'weth' behind a swap — beside a
  // 0.01 ETH range minimum from another bridge. Clearing the gentlest of them
  // is enough, and only the 'eth' one is in a token we can size.
  it('takes its figure from the entry in the user own token', () => {
    const issue = issues[0]
    expect(issue?.evidence?.direction).toBe('raise')
    expect(issue?.evidence?.requiredFromAmount).toBe(410700000000000n)
    expect(issue?.evidence?.requiredFromAmount).toBeLessThan(10000000000000000n)
  })

  it('reports no gasless reason, because the widget never opts in', () => {
    expect(issues.map((issue) => issue.bucket)).not.toContain(
      'gaslessNotAvailable'
    )
  })
})
