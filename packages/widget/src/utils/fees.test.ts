import type { FeeCost, RouteExtended, Token } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { getAccumulatedFeeCostsBreakdown, parseAmountToBigInt } from './fees.js'

const mockToken = (overrides: Partial<Token> = {}): Token =>
  ({
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    chainId: 1,
    symbol: 'SHIB',
    decimals: 18,
    name: 'Shiba Inu',
    priceUSD: '0.000005185205517',
    ...overrides,
  }) as Token

const mockFeeCost = (
  amount: string,
  included: boolean,
  token: Token = mockToken()
): FeeCost =>
  ({
    name: 'LIFI Fixed Fee',
    description: 'Fixed LIFI fee',
    token,
    amount,
    amountUSD: '0',
    percentage: '0.0025',
    included,
  }) as FeeCost

const mockRoute = (feeCosts: FeeCost[]): RouteExtended =>
  ({
    steps: [
      {
        estimate: {
          feeCosts,
          gasCosts: [],
        },
      },
    ],
  }) as unknown as RouteExtended

describe('parseAmountToBigInt', () => {
  it('parses a real LI.FI production fee amount above the toFixed(0) exponential-notation threshold (1e21)', () => {
    // Real amount observed from a live GET https://li.quest/v1/quote
    // (SHIB -> USDT, chain 1 -> 56): "LIFI Fixed Fee", 2.5e24 wei.
    expect(parseAmountToBigInt('2500000000000000000000000')).toBe(
      2500000000000000000000000n
    )
  })

  it('does not throw for the exact value that crashes Number(...).toFixed(0)', () => {
    // Number('1250000000000000000000000').toFixed(0) === '1.25e+24', and
    // BigInt('1.25e+24') throws SyntaxError. Confirm the old failure mode
    // for documentation, then confirm the new parser is unaffected by it.
    expect(() =>
      BigInt(Number('1250000000000000000000000').toFixed(0))
    ).toThrow(SyntaxError)
    expect(parseAmountToBigInt('1250000000000000000000000')).toBe(
      1250000000000000000000000n
    )
  })

  it('preserves exact precision above Number.MAX_SAFE_INTEGER (2^53)', () => {
    // A real Polygon gas cost observed above 2^53 (9007199254740992).
    const wei = '188437049834009000'
    expect(parseAmountToBigInt(wei)).toBe(188437049834009000n)
    // The old Number-based path drifts by design - document the delta so a
    // future revert of this fix is caught by a failing assertion here too.
    expect(Number(wei).toFixed(0)).not.toBe(wei)
  })

  it('returns 0n for an empty or missing amount', () => {
    expect(parseAmountToBigInt('')).toBe(0n)
  })

  it('truncates a decimal string at the integer part', () => {
    expect(parseAmountToBigInt('123.456')).toBe(123n)
  })

  it('handles small integer amounts unchanged', () => {
    expect(parseAmountToBigInt('42')).toBe(42n)
    expect(parseAmountToBigInt('0')).toBe(0n)
  })
})

describe('getAccumulatedFeeCostsBreakdown', () => {
  it('does not throw for a route carrying a real above-1e21 included fee', () => {
    // This is the exact shape returned by a live LI.FI quote where the old
    // `BigInt(Number(feeCost.amount).toFixed(0))` line threw
    // "Cannot convert 1.25e+24 to a BigInt" inside getStepFeeCostsBreakdown.
    const route = mockRoute([mockFeeCost('2500000000000000000000000', true)])
    expect(() => getAccumulatedFeeCostsBreakdown(route, true)).not.toThrow()
    const { feeCosts } = getAccumulatedFeeCostsBreakdown(route, true)
    expect(feeCosts[0]?.amount).toBe(2500000000000000000000000n)
  })

  it('still returns zero fees for the default included=false path when only an included fee is present', () => {
    const route = mockRoute([mockFeeCost('2500000000000000000000000', true)])
    const { feeCosts, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
    expect(feeCosts).toHaveLength(0)
    expect(feeCostUSD).toBe(0)
  })
})
