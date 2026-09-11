import { formatUnits, parseUnits } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  bufferedReported,
  nextSlippage,
  reportedSlippage,
  roundSuggestion,
  toDecimalString,
} from './suggestions.js'
import type { RouteIssue } from './types.js'

const issue = (evidence: RouteIssue['evidence']): RouteIssue => ({
  bucket: 'amountTooLow',
  ruleId: 'test',
  evidence,
  fromAmount: 1000n,
})

describe('roundSuggestion', () => {
  // A figure a user reads back is worth more than one that is exact.
  it.each([
    [0.000492134057317213, 0.0005],
    [0.0102, 0.011],
    [5.34, 5.4],
    [1234.5, 1300],
    [1, 1],
  ])('rounds %s up to %s', (value, expected) => {
    expect(roundSuggestion(value, 'raise')).toBeCloseTo(expected, 12)
  })

  it.each([
    [0.0102, 0.01],
    [5.36, 5.3],
    [1299, 1200],
  ])('rounds %s down to %s', (value, expected) => {
    expect(roundSuggestion(value, 'lower')).toBeCloseTo(expected, 12)
  })

  // A narrow sample missed that dividing by the factor put 1e6 at
  // 999999.9999999999 — under the very limit it had to clear.
  const spread = [
    1e-9, 1.23e-8, 0.000000123, 0.0000079, 0.0079, 0.0102, 0.5, 1, 1.0001, 7,
    99.5, 999.9, 1000, 12345, 1e6, 1020000, 1.5e7, 1e9, 9.87e11, 1e12,
  ]

  it('rounding up never lands under the value it must clear', () => {
    for (const value of spread) {
      expect(roundSuggestion(value, 'raise')).toBeGreaterThanOrEqual(value)
    }
  })

  it('rounding down never lands over the value it must stay under', () => {
    for (const value of spread) {
      expect(roundSuggestion(value, 'lower')).toBeLessThanOrEqual(value)
    }
  })

  // The figure is rendered verbatim, so a binary tail becomes user-visible.
  it('never produces more than two significant digits', () => {
    for (const value of spread) {
      for (const direction of ['raise', 'lower'] as const) {
        const result = roundSuggestion(value, direction)
        expect(Number(result.toPrecision(2))).toBe(result)
      }
    }
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'refuses %s',
    (value) => {
      expect(Number.isNaN(roundSuggestion(value, 'raise'))).toBe(true)
    }
  )
})

describe('toDecimalString', () => {
  it.each([
    [0.011, '0.011'],
    [0.0005, '0.0005'],
    [1.1e-8, '0.000000011'],
    [1e-9, '0.000000001'],
    [1300, '1300'],
    [1e6, '1000000'],
    [9.9e11, '990000000000'],
    [5.4, '5.4'],
  ])('writes %s as %s', (value, expected) => {
    expect(toDecimalString(value)).toBe(expected)
  })

  // The whole point: a suggestion must survive parseUnits without a tail.
  it('round-trips every rounded suggestion through parseUnits', () => {
    const values = [
      1e-9, 1.23e-8, 0.0000079, 0.0079, 0.0102, 0.5, 1, 7, 99.5, 1000, 1e6,
      1.5e7, 9.87e11,
    ]
    for (const value of values) {
      for (const direction of ['raise', 'lower'] as const) {
        const rounded = roundSuggestion(value, direction)
        const text = toDecimalString(rounded)
        expect(text).not.toMatch(/e/)
        expect(formatUnits(parseUnits(text, 18), 18)).toBe(text)
      }
    }
  })
})

describe('bufferedReported', () => {
  it('moves a minimum up and away from the limit', () => {
    expect(
      bufferedReported(issue({ direction: 'raise', requiredFromAmount: 1000n }))
    ).toBe(1020n)
  })

  it('moves a maximum down and away from the limit', () => {
    expect(
      bufferedReported(issue({ direction: 'lower', requiredFromAmount: 1000n }))
    ).toBe(980n)
  })

  it('has nothing to offer without a figure', () => {
    expect(bufferedReported(issue({ direction: 'raise' }))).toBeUndefined()
    expect(bufferedReported(issue(undefined))).toBeUndefined()
  })
})

describe('reportedSlippage', () => {
  // 0.0079 * 1e6 is 7900.000000000001, which a bare ceil turns into 0.7901%.
  it.each([
    [0.0079, '0.79'],
    [0.029, '2.9'],
    [0.007, '0.7'],
    [0.0158, '1.58'],
    [0.005, '0.5'],
  ])('renders %s as %s%%', (fraction, expected) => {
    expect(reportedSlippage(issue({ requiredSlippage: fraction }))).toBe(
      expected
    )
  })

  it('is empty when the backend reported none', () => {
    expect(reportedSlippage(issue({}))).toBe('')
  })
})

describe('nextSlippage', () => {
  it('prefers what the backend asked for', () => {
    expect(nextSlippage(issue({ requiredSlippage: 0.012 }), '0.5')).toBe('1.2')
  })

  it('falls back to 0.5% from a stricter setting', () => {
    expect(nextSlippage(issue({}), '0.1')).toBe('0.5')
    expect(nextSlippage(issue({}), undefined)).toBe('0.5')
  })

  // Doubling is the intent, but never past the band the widget itself warns
  // about — a one-click 90% slippage is not a fix.
  it('doubles a setting already looser than the fallback, up to the band', () => {
    expect(nextSlippage(issue({}), '0.4')).toBe('0.5')
    expect(nextSlippage(issue({}), '0.8')).toBe('1')
    expect(nextSlippage(issue({}), '3')).toBe('1')
  })

  it('never proposes more than the widget calls reasonable', () => {
    expect(Number(nextSlippage(issue({}), '80'))).toBeLessThanOrEqual(1)
  })
})
