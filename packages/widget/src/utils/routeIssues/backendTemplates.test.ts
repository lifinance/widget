import { describe, expect, it } from 'vitest'
import { classifyRouteIssues } from './classify.js'
import type { ClassifyContext, RouteIssue } from './types.js'

// The user sends 5 ETH on Ethereum; the path's first hop bridges that token.
const context: ClassifyContext = {
  fromAmount: 5_000_000_000_000_000_000n,
  fromChainId: 1,
  fromTokenSymbol: 'ETH',
  fromTokenDecimals: 18,
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

  // mayan and garden cap slippage instead of demanding one, and both report it
  // under NO_POSSIBLE_ROUTE — which read as "this pair is not supported".
  it.each([
    ['Slippage is too high. Max slippage is 0.03', 0.03],
    ['Slippage is too high. Max slippage is 0.1', 0.1],
  ])('reads a bridge slippage cap from %s', (message, expected) => {
    const [issue] = fromFailure('NO_POSSIBLE_ROUTE', message)
    expect(issue?.bucket).toBe('slippageTooLoose')
    expect(issue?.evidence?.requiredSlippage).toBe(expected)
  })

  // The figure is in sats, and nothing in the message says so. Reading it as
  // BTC would be off by 1e8, so this reason must stay figure-free.
  it('never reads a sats cap as an amount', () => {
    const [issue] = classifyRouteIssues(
      {
        filteredOut: [
          {
            overallPath: sameTokenPath,
            reason:
              'BTC smart deposits amount exceeds the per-intent canary cap of 100000 sats',
          },
        ],
        failed: [],
      } as never,
      { ...context, fromTokenSymbol: 'BTC', fromTokenDecimals: 8 }
    )
    expect(issue?.bucket).toBe('amountTooHigh')
    expect(issue?.evidence?.requiredFromAmount).toBeUndefined()
  })

  // Reported: 0.000001 USDC to SOL said "Not enough liquidity … a smaller
  // amount may work better". There is no smaller amount than one unit.
  describe('price impact', () => {
    const impact = 'Price impact of 99.99% is higher than the max allowed 10%'
    const usdc = {
      fromChainId: 42161,
      fromTokenSymbol: 'USDC',
      fromTokenDecimals: 6,
      fromTokenPriceUSD: '1',
    }
    const bucketFor = (context: ClassifyContext) =>
      classifyRouteIssues(
        {
          filteredOut: [{ overallPath: sameTokenPath, reason: impact }],
        } as never,
        context
      )[0]?.bucket

    it('reads a dust send as too low', () => {
      expect(bucketFor({ ...usdc, fromAmount: 1n })).toBe('amountTooLow')
    })

    it('still reads a large send as illiquid', () => {
      expect(bucketFor({ ...usdc, fromAmount: 100_000_000_000_000n })).toBe(
        'liquidity'
      )
    })

    // Without a price there is nothing to measure the send against, and
    // calling every impact a dust send would be worse than saying nothing.
    it('stays with liquidity when the token has no price', () => {
      expect(
        bucketFor({ ...usdc, fromAmount: 1n, fromTokenPriceUSD: undefined })
      ).toBe('liquidity')
      expect(
        bucketFor({ ...usdc, fromAmount: 1n, fromTokenPriceUSD: '0' })
      ).toBe('liquidity')
    })
  })

  // Seen live: a maximum in scientific notation. `toBigInt` rejected it, and
  // because the range rule needs every limit it dropped the reason whole, so a
  // refused amount showed the generic sentence instead.
  it('reads a range limit written in scientific notation', () => {
    const [issue] = fromReason(
      'Transferred amount (7097232079488999000000000000) out of acceptable range (min: 0, max: 1.8921633406219466e+23)'
    )
    expect(issue?.bucket).toBe('amountTooHigh')
  })

  it('treats a USD value difference like a price impact', () => {
    const [issue] = fromReason(
      'USD value difference exceeds 40% ($100000000.00 in vs $54395971.18 out).'
    )
    expect(issue?.bucket).toBe('liquidity')
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

describe('a tool minimum that names its own token', () => {
  // Reported: 0.2 USDC Ethereum -> USDC Polygon with auto slippage. Only the
  // slippage reason carried a figure, so it outranked the amount — and raising
  // slippage would not have helped, since the bridges also failed on amount.
  const usdc: ClassifyContext = {
    fromAmount: 199_500n,
    fromChainId: 1,
    fromTokenSymbol: 'USDC',
    fromTokenDecimals: 6,
  }
  const reported = classifyRouteIssues(
    {
      filteredOut: [
        {
          overallPath: '1:USDC~1:WETH-1:WETH-mayan-137:USDC',
          reason: 'Path requires a slippage of 0.005 but 0.001 is applied',
        },
      ],
      failed: [
        {
          overallPath: '1:USDC~1:USDC-1:USDC-mayan-137:USDC',
          subpaths: {
            a: [
              {
                errorType: 'NO_QUOTE',
                code: 'AMOUNT_TOO_LOW',
                tool: 'mayan',
                message: 'amount too small (min ~1.3 usdc)',
                action: {} as never,
              },
            ],
          },
        },
        {
          overallPath: '1:USDC~1:USDC-1:USDC-mayanMCTP-137:USDC',
          subpaths: {
            b: [
              {
                errorType: 'NO_QUOTE',
                code: 'AMOUNT_TOO_LOW',
                tool: 'mayanMCTP',
                message: 'amount too small (min ~0.5345 usdc)',
                action: {} as never,
              },
            ],
          },
        },
        {
          overallPath: '1:USDC~1:USDC-1:USDC~1:USDT-1:USDT-mayan-137:USDC',
          subpaths: {
            c: [
              {
                errorType: 'NO_QUOTE',
                code: 'AMOUNT_TOO_LOW',
                tool: 'mayan',
                message: 'amount too small (min ~1.3 usdt)',
                action: {} as never,
              },
            ],
          },
        },
      ],
    } as never,
    usdc
  )

  it('leads with the amount, not the slippage that cannot fix it', () => {
    expect(reported[0]?.bucket).toBe('amountTooLow')
  })

  it('takes the gentlest minimum stated in the user own token', () => {
    expect(reported[0]?.evidence?.requiredFromAmount).toBe(534_500n)
  })

  it('ignores a minimum stated in another token', () => {
    const [issue] = classifyRouteIssues(
      {
        filteredOut: [],
        failed: [
          {
            overallPath: '1:USDC~1:USDT-1:USDT-mayan-137:USDC',
            subpaths: {
              c: [
                {
                  errorType: 'NO_QUOTE',
                  code: 'AMOUNT_TOO_LOW',
                  tool: 'mayan',
                  message: 'amount too small (min ~1.3 usdt)',
                  action: {} as never,
                },
              ],
            },
          },
        ],
      } as never,
      usdc
    )
    expect(issue?.bucket).toBe('amountTooLow')
    expect(issue?.evidence?.requiredFromAmount).toBeUndefined()
  })
})
