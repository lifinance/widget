import { describe, expect, it } from 'vitest'
import {
  bufferedReported,
  nextSlippage,
  reportedSlippage,
  roundSuggestion,
} from './suggestions.js'
import type { RouteIssue } from './types.js'

const issue = (evidence: RouteIssue['evidence']): RouteIssue => ({
  bucket: 'amountTooLow',
  ruleId: 'test',
  evidence,
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

  it('rounding up never lands under the value it must clear', () => {
    for (const value of [0.0079, 1.0001, 999.9, 0.000000123, 7]) {
      expect(roundSuggestion(value, 'raise')).toBeGreaterThanOrEqual(value)
    }
  })

  it('rounding down never lands over the value it must stay under', () => {
    for (const value of [0.0079, 1.0001, 999.9, 0.000000123, 7]) {
      expect(roundSuggestion(value, 'lower')).toBeLessThanOrEqual(value)
    }
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'refuses %s',
    (value) => {
      expect(Number.isNaN(roundSuggestion(value, 'raise'))).toBe(true)
    }
  )
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

  it('doubles a setting already looser than the fallback', () => {
    expect(nextSlippage(issue({}), '0.8')).toBe('1.6')
    expect(nextSlippage(issue({}), '3')).toBe('6')
  })

  it('never proposes more than the widget allows', () => {
    expect(nextSlippage(issue({}), '80')).toBe('100')
  })
})
