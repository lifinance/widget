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

const bucketFor = (reason: string): string | undefined =>
  fromReason(reason)[0]?.bucket

describe('pinned reason fragments', () => {
  it.each([
    [
      'gaslessMinTradeSize',
      'Gasless: the trade is worth 0.12 USD, below the gasless minimum of 5 USD on chain 1',
      'amountTooLow',
    ],
    [
      'fromTokenValueFloor',
      'Bridge from ETH with fromToken value less than 100 USD',
      'amountTooLow',
    ],
    [
      'integratorMinDestination',
      'Min destination amount too low for integrator (min: 10): jumper.exchange',
      'amountTooLow',
    ],
    [
      'gaslessFeeExceedsInput',
      'GASLESS_FEE_EXCEEDS_INPUT: the gasless relay fee cannot be charged for this request — fee exceeds input',
      'amountTooLow',
    ],
    [
      'btcCanaryCap',
      'BTC smart deposits amount exceeds the per-intent canary cap of 100000 sats',
      'amountTooHigh',
    ],
    [
      'slippageTooTight',
      'Path requires a slippage of 0.03 but 0.005 is applied',
      'slippageTooTight',
    ],
    [
      'priceImpact',
      'Price impact of 12.5% is higher than the max allowed 10%',
      'liquidity',
    ],
    [
      'stellarUnfunded',
      'Stellar receiver account is not funded',
      'destinationAccountNotReady',
    ],
    [
      'stellarTrustline',
      'Receiver GA123 does not have a trustline open for USDC',
      'destinationAccountNotReady',
    ],
    [
      'stellarReserve',
      'Receiver must keep 1.5 XLM as its account reserve',
      'destinationAccountNotReady',
    ],
    [
      'lighterAccount',
      'No Lighter account registered for receiver address 0xabc',
      'destinationAccountNotReady',
    ],
    [
      'seiLink',
      'Address 0xabc not linked to the original SEI address, see https://app.sei.io',
      'destinationAccountNotReady',
    ],
    [
      'solAccountRent',
      'SOL balance insufficient to cover temporary token account creation',
      'destinationAccountNotReady',
    ],
    [
      'contractRecipient',
      'EVM contract destination addresses are not currently supported by mayanMCTP',
      'recipientNotSupported',
    ],
    [
      'differentRecipient',
      'Destination address different from source address is not supported',
      'recipientNotSupported',
    ],
    [
      'multistepDifferentAddress',
      'Multistep transactions with different sending/receiving addresses are not supported',
      'recipientNotSupported',
    ],
    [
      'gaslessDeniedTool',
      'relay is denied for gasless requests on chain 1',
      'gaslessNotAvailable',
    ],
    [
      'gaslessDelegation',
      '0xabc is an undelegated EOA and chain 137 cannot delegate it',
      'gaslessNotAvailable',
    ],
    [
      'destinationSignature',
      'Path requires a signature on the destination chain, but the request did not allow it',
      'blockedBySettings',
    ],
    [
      'stablecoinPreset',
      'Token USDX is not a stablecoin but preset requires stablecoin-only paths',
      'blockedBySettings',
    ],
    [
      'executionType',
      'Route does not match requested type transaction',
      'blockedBySettings',
    ],
    [
      'toolDisabled',
      'Tool relay is currently disabled for this action. Relay is under maintenance until 14:00 UTC.',
      'temporary',
    ],
    ['toolNotApplied', 'Tool relay not applied.', 'temporary'],
    [
      'routeTimingTimeout',
      'The route estimation did not complete before the route timing strategy stopped waiting for results',
      'temporary',
    ],
    ['podOverloaded', 'Pod is currently overloaded.', 'temporary'],
    [
      'tronSameChain',
      'Same-chain operations on Tron are not yet supported',
      'pairNotSupported',
    ],
    [
      'solWrap',
      'wSOL/SOL wrap/unwrap operations are not supported',
      'pairNotSupported',
    ],
    [
      'rwaBlocked',
      'Path contains RWA token(s) and integrator policy blocks RWA',
      'pairNotSupported',
    ],
  ])('%s maps to its bucket', (_id, reason, bucket) => {
    expect(bucketFor(reason)).toBe(bucket)
  })

  it('extracts the required slippage as a fraction', () => {
    const [issue] = fromReason(
      'Path requires a slippage of 0.03 but 0.005 is applied'
    )
    expect(issue.evidence?.requiredSlippage).toBe(0.03)
  })

  it('extracts the public note appended to a disabled tool', () => {
    const [issue] = fromReason(
      'Tool relay is currently disabled for this action. Relay is under maintenance until 14:00 UTC.'
    )
    expect(issue.evidence?.note).toBe(
      'Relay is under maintenance until 14:00 UTC.'
    )
  })

  it('leaves the note undefined when the backend appended none', () => {
    const [issue] = fromReason(
      'Tool relay is currently disabled for this action.'
    )
    expect(issue.evidence?.note).toBeUndefined()
  })

  it('derives a ratio from the gasless USD minimum', () => {
    const [issue] = fromReason(
      'Gasless: the trade is worth 2 USD, below the gasless minimum of 5 USD on chain 1'
    )
    expect(issue.evidence?.amountBounds).toEqual({
      current: 2000000n,
      required: 5000000n,
      direction: 'raise',
    })
  })

  it('reports a USD floor with no current value as minUsd', () => {
    const [issue] = fromReason(
      'Bridge from ETH with fromToken value less than 100 USD'
    )
    expect(issue.evidence?.minUsd).toBe(100)
    expect(issue.evidence?.amountBounds).toBeUndefined()
  })
})

describe('suppressed reasons', () => {
  it.each([
    'Path filtered due to low historical volume',
    'Could not find bridge definition for someTool',
    'Deposit-address bridges only support single-step routes',
    'Positive price impact too high for blue chip route',
    'Price impact filtering returned with an error',
  ])('never surfaces %s', (reason) => {
    expect(fromReason(reason)).toEqual([])
  })

  it('never surfaces TOOL_NOT_ALLOWED', () => {
    const result = classifyRouteIssues(
      {
        filteredOut: [],
        failed: [
          {
            overallPath: 'p',
            subpaths: {
              s: [
                {
                  errorType: 'NO_QUOTE',
                  code: 'TOOL_NOT_ALLOWED',
                  tool: 'someDex',
                  message:
                    'The tool in this quote is not allowed by LI.FI contracts.',
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
})

describe('tool error codes', () => {
  const fromCode = (code: string): RouteIssue[] =>
    classifyRouteIssues(
      {
        filteredOut: [],
        failed: [
          {
            overallPath: 'p',
            subpaths: {
              s: [
                {
                  errorType: 'NO_QUOTE',
                  code,
                  tool: 'someTool',
                  message: 'default message',
                  action: {} as never,
                },
              ],
            },
          },
        ],
      },
      context
    )

  it.each([
    ['AMOUNT_TOO_LOW', 'amountTooLow'],
    ['FEES_HIGHER_THAN_AMOUNT', 'amountTooLow'],
    ['AMOUNT_TOO_HIGH', 'amountTooHigh'],
    ['CANNOT_GUARANTEE_MIN_AMOUNT', 'slippageTooTight'],
    ['DIFFERENT_RECIPIENT_NOT_SUPPORTED', 'recipientNotSupported'],
    ['INSUFFICIENT_LIQUIDITY', 'liquidity'],
    ['PRICE_IMPACT_TOO_HIGH', 'liquidity'],
    ['RATE_LIMIT_EXCEEDED', 'temporary'],
    ['TOOL_TIMEOUT', 'temporary'],
    ['RPC_ERROR', 'temporary'],
    ['NO_POSSIBLE_ROUTE', 'pairNotSupported'],
  ])('%s maps to %s', (code, bucket) => {
    expect(fromCode(code)[0]?.bucket).toBe(bucket)
  })
})

describe('ranking', () => {
  it('puts the most actionable bucket first', () => {
    const issues = classifyRouteIssues(
      {
        filteredOut: [
          {
            overallPath: 'a',
            reason: 'Same-chain operations on Tron are not yet supported',
          },
          { overallPath: 'b', reason: 'Pod is currently overloaded.' },
          {
            overallPath: 'c',
            reason:
              'Transferred amount (100) out of acceptable range (min: 500, max: Infinity)',
          },
        ],
        failed: [],
      },
      context
    )
    expect(issues.map((issue) => issue.bucket)).toEqual([
      'amountTooLow',
      'temporary',
      'pairNotSupported',
    ])
  })
})
