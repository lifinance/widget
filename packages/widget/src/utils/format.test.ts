import { describe, expect, it } from 'vitest'
import { formatInputAmount, formatSlippage } from './format.js'

describe('formatInputAmount', () => {
  it('should handle empty input', () => {
    expect(formatInputAmount('')).toBe('')
  })

  it('should handle whitespace input', () => {
    expect(formatInputAmount('   ')).toBe('')
  })

  it('should limit decimals', () => {
    expect(formatInputAmount('123.456789', 2, true)).toBe('123.45')
    expect(formatInputAmount('123.456789', 2, false)).toBe('123.45')
  })

  it('should handle leading and trailing zeros', () => {
    expect(formatInputAmount('00123', 2, true)).toBe('00123')
    expect(formatInputAmount('00123', 2, false)).toBe('123')
    expect(formatInputAmount('123.45000', 6, true)).toBe('123.45000')
    expect(formatInputAmount('123.45000', 6, false)).toBe('123.45')
  })

  it('should handle invalid input', () => {
    expect(formatInputAmount('abc')).toBe('')
    expect(formatInputAmount('-')).toBe('')
    expect(formatInputAmount('123.456789abc', 2, true)).toBe('123.45')
    expect(formatInputAmount('123.456789abc', 2, false)).toBe('123.45')
  })

  it('should normalize input (trim, commas, multiple dots)', () => {
    expect(formatInputAmount('  1,23  ', null, true)).toBe('1.23')
    expect(formatInputAmount('  1,23  ', null, false)).toBe('1.23')
    expect(formatInputAmount('1.2.3', null, true)).toBe('1.23')
    expect(formatInputAmount('1.2.3', null, false)).toBe('1.23')
    expect(formatInputAmount('..5', null, true)).toBe('.5')
    expect(formatInputAmount('..5', null, false)).toBe('0.5')
  })

  it('should handle zero input', () => {
    expect(formatInputAmount('0', null, true)).toBe('0')
    expect(formatInputAmount('00', null, true)).toBe('00')
    expect(formatInputAmount('0.00', 2, true)).toBe('0.00')
    expect(formatInputAmount('.0', 2, true)).toBe('.0')
    expect(formatInputAmount('0..', 2, true)).toBe('0.')
    expect(formatInputAmount('0', null, false)).toBe('')
    expect(formatInputAmount('00', null, false)).toBe('')
    expect(formatInputAmount('0.00', 2, false)).toBe('')
    expect(formatInputAmount('.0', 2, false)).toBe('')
    expect(formatInputAmount('0..', 2, false)).toBe('')
  })
})

describe('formatSlippage', () => {
  it('should handle empty input', () => {
    expect(formatSlippage('')).toBe('')
  })

  it('should pass through plain dot-decimal values', () => {
    expect(formatSlippage('0.5', '0.5', false)).toBe('0.5')
    expect(formatSlippage('1.5', '0.5', false)).toBe('1.5')
    expect(formatSlippage('5', '0.5', false)).toBe('5')
  })

  // Regression: a comma decimal separator (the default in many non-en-US
  // locales) used to be silently truncated instead of normalized, e.g.
  // '0,5' -> '0' (10x-off or zero slippage depending on the call site),
  // mirroring the comma handling formatInputAmount already has.
  it('should normalize a comma decimal separator', () => {
    expect(formatSlippage('0,5', '0.5', false)).toBe('0.5')
    expect(formatSlippage('1,5', '0.5', false)).toBe('1.5')
    expect(formatSlippage('0,25', '0.5', false)).toBe('0.25')
  })

  it('should normalize a comma decimal separator while typing (returnInitial)', () => {
    // Simulates typing '0,5' one keystroke at a time with returnInitial=true,
    // as the widget's onChange handler does.
    expect(formatSlippage('0', '0.5', true)).toBe('0')
    expect(formatSlippage('0,', '0.5', true)).toBe('0.')
    expect(formatSlippage('0,5', '0.5', true)).toBe('0.5')
  })

  it('should clamp to 100', () => {
    expect(formatSlippage('150', '0.5', false)).toBe('100')
    expect(formatSlippage('150,5', '0.5', false)).toBe('100')
  })

  it('should take the absolute value of a negative input', () => {
    expect(formatSlippage('-3', '0.5', false)).toBe('3')
    expect(formatSlippage('-3,5', '0.5', false)).toBe('3.5')
  })

  it('should fall back to defaultValue on unparseable input', () => {
    expect(formatSlippage('abc', '0.5', false)).toBe('0.5')
  })

  // The comma-decimal normalization is intentionally narrow: it only fires
  // for an unambiguous single comma with no existing dot. Anything more
  // ambiguous (multiple commas, or a comma alongside a dot, e.g.
  // thousands-style '1,234.5') is left untouched rather than guessed at, so
  // these all keep exactly their pre-fix behavior (verified against the
  // unmodified function) instead of being mangled through multiple dots.
  it('should not attempt to normalize ambiguous separator combinations', () => {
    expect(formatSlippage('1,,5', '0.5', false)).toBe('1')
    expect(formatSlippage('1,234.5', '0.5', false)).toBe('1')
    expect(formatSlippage('150,,5', '0.5', false)).toBe('150')
    expect(formatSlippage('-150,,5', '0.5', false)).toBe('-150')
  })
})
