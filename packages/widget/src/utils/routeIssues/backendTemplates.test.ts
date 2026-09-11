import { describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import type { ClassifyContext, RouteIssue } from './types.js'

// The user sends 5 ETH on Ethereum; the path's first hop bridges that token.
const context: ClassifyContext = {
  fromAmount: 5_000_000_000_000_000_000n,
  fromChainId: 1,
  fromTokenSymbol: 'ETH',
}
const sameTokenPath = '1:ETH-stargate-137:USDC'

const fromFailure = (
  code: string,
  message: string,
  path = sameTokenPath
): RouteIssue[] =>
  classifyRouteIssues(
    {
      filteredOut: [],
      failed: [
        {
          overallPath: path,
          subpaths: {
            s: [
              {
                errorType: 'NO_QUOTE',
                code,
                tool: 't',
                message,
                action: {} as never,
              },
            ],
          },
        },
      ],
    } as never,
    context
  )

const fromReason = (reason: string, path = sameTokenPath): RouteIssue[] =>
  classifyRouteIssues(
    { filteredOut: [{ overallPath: path, reason }], failed: [] } as never,
    context
  )

describe('templates scouted from the backend', () => {
  it.each([
    // gnosis.ts / omni.ts — raw units of the leg's own token.
    [
      'AMOUNT_TOO_LOW',
      'Amount of Ether bridged must be at least 10000000000000000000.',
      'amountTooLow',
      10_000_000_000_000_000_000n,
    ],
    [
      'AMOUNT_TOO_HIGH',
      'Amount of Ether bridged must be smaller than 1000000000000000000.',
      'amountTooHigh',
      1_000_000_000_000_000_000n,
    ],
    // cbridge.ts — both bounds in one message; the code picks the side.
    [
      'AMOUNT_TOO_LOW',
      'The amount is too low or too high. The minimum is 9000000000000000000 and the maximum is 50000000000000000000',
      'amountTooLow',
      9_000_000_000_000_000_000n,
    ],
    [
      'AMOUNT_TOO_HIGH',
      'The amount is too low or too high. The minimum is 1000000000000000000 and the maximum is 2000000000000000000',
      'amountTooHigh',
      2_000_000_000_000_000_000n,
    ],
  ])('%s %s', (code, message, bucket, required) => {
    const [issue] = fromFailure(code, message)
    expect(issue?.bucket).toBe(bucket)
    expect(issue?.evidence?.requiredFromAmount).toBe(required)
  })

  it('refuses the figure when the path does not prove the leg holds the token', () => {
    const [issue] = fromFailure(
      'AMOUNT_TOO_LOW',
      'Amount of USD Coin bridged must be at least 10000000.',
      '1:ETH~1:USDC-1:USDC-stargate-137:USDC'
    )
    expect(issue?.bucket).toBe('amountTooLow')
    expect(issue?.evidence?.requiredFromAmount).toBeUndefined()
  })

  it('reads the 1inch USD floor', () => {
    const [issue] = fromFailure(
      'AMOUNT_TOO_LOW',
      'This DEX is only enabled for swaps >$25.'
    )
    expect(issue?.evidence?.minUsd).toBe(25)
  })

  it('reads chainflip percent slippage as a fraction', () => {
    const [issue] = fromFailure(
      'CANNOT_GUARANTEE_MIN_AMOUNT',
      'The recommended slippage tolerance 1.5 is higher than the requested slippage 0.5'
    )
    expect(issue?.bucket).toBe('slippageTooTight')
    expect(issue?.evidence?.requiredSlippage).toBeCloseTo(0.015, 10)
  })

  it('beats the catch-all code when the prose names a real reason', () => {
    const [issue] = fromFailure(
      'NO_POSSIBLE_ROUTE',
      'Slippage cannot be less than 0.005'
    )
    expect(issue?.bucket).toBe('slippageTooTight')
    expect(issue?.evidence?.requiredSlippage).toBe(0.005)
  })

  it('treats expensive gas as temporary', () => {
    expect(
      fromReason(
        'The gas costs for this route are higher than the max allowed costs of 12 USD'
      ).map((i) => i.bucket)
    ).toEqual(['temporary'])
  })

  it('never surfaces a route-shaping filter', () => {
    expect(
      fromReason(
        'Removing less used bridge step in favor of popular bridge steps'
      )
    ).toEqual([])
    expect(
      fromReason(
        'Skipping cross-token bridge step in favor of same-token bridge step'
      )
    ).toEqual([])
  })
})
