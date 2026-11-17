import { describe, expect, it, vi } from 'vitest'
import {
  formatInputAmount,
  formatSlippage,
  parseAmountToBigInt,
} from './format.js'

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

describe('parseAmountToBigInt', () => {
  it('should convert integer amounts exactly', () => {
    expect(parseAmountToBigInt('0')).toBe(0n)
    expect(parseAmountToBigInt('21000')).toBe(21000n)
    expect(parseAmountToBigInt(' 21000 ')).toBe(21000n)
    expect(parseAmountToBigInt('-21000')).toBe(-21000n)
  })

  it('should keep full precision for amounts beyond Number.MAX_SAFE_INTEGER', () => {
    // Reported gasCost.amount that previously threw when routed through Number
    expect(parseAmountToBigInt('41604892007835073514745')).toBe(
      41604892007835073514745n
    )
    expect(parseAmountToBigInt('9007199254740993')).toBe(9007199254740993n)
  })

  it('should truncate fractional amounts', () => {
    expect(parseAmountToBigInt('1234.5')).toBe(1234n)
    expect(parseAmountToBigInt('0.99')).toBe(0n)
    expect(parseAmountToBigInt('-1234.5')).toBe(-1234n)
    expect(parseAmountToBigInt('41604892007835073514745.99')).toBe(
      41604892007835073514745n
    )
  })

  it('should return 0n and warn for non-decimal input', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Exponential and radix-prefixed strings must not be reinterpreted:
    // BigInt('0x1f') is 31n, and '4.16e22'.split('.')[0] would be 4n
    expect(parseAmountToBigInt('abc')).toBe(0n)
    expect(parseAmountToBigInt('4.16e22')).toBe(0n)
    expect(parseAmountToBigInt('0x1f')).toBe(0n)
    expect(parseAmountToBigInt('1,234')).toBe(0n)
    expect(parseAmountToBigInt('.5')).toBe(0n)
    expect(warn).toHaveBeenCalledTimes(5)

    warn.mockRestore()
  })

  it('should handle a missing amount without warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(parseAmountToBigInt()).toBe(0n)
    expect(parseAmountToBigInt('')).toBe(0n)
    expect(parseAmountToBigInt('   ')).toBe(0n)
    expect(warn).not.toHaveBeenCalled()

    warn.mockRestore()
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

  it('should normalize a comma decimal separator', () => {
    expect(formatSlippage('0,5', '0.5', false)).toBe('0.5')
    expect(formatSlippage('1,5', '0.5', false)).toBe('1.5')
    expect(formatSlippage('0,25', '0.5', false)).toBe('0.25')
  })

  it('should normalize a comma decimal separator while typing (returnInitial)', () => {
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

  it('should not attempt to normalize ambiguous separator combinations', () => {
    expect(formatSlippage('1,,5', '0.5', false)).toBe('1')
    expect(formatSlippage('1,234.5', '0.5', false)).toBe('1')
    expect(formatSlippage('150,,5', '0.5', false)).toBe('150')
    expect(formatSlippage('-150,,5', '0.5', false)).toBe('-150')
  })
})
