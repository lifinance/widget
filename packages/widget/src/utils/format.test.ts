import { describe, expect, it, vi } from 'vitest'
import { formatInputAmount, parseInputAmount } from './format.js'

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

vi.mock('viem', async (importOriginal) => {
  const viem = await importOriginal<typeof import('viem')>()
  return {
    ...viem,
    // Simulate viem 2.55.4+, which throws on values that are not decimal numbers
    parseUnits: (value: string, decimals: number) => {
      if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(value)) {
        throw new Error(`Value \`${value}\` is not a valid decimal number.`)
      }
      return viem.parseUnits(value, decimals)
    },
  }
})

describe('parseInputAmount', () => {
  it('should return 0n for an empty amount', () => {
    expect(parseInputAmount('', 18)).toBe(0n)
    expect(parseInputAmount('   ', 18)).toBe(0n)
    expect(parseInputAmount('-', 18)).toBe(0n)
  })

  it('should parse decimal amounts', () => {
    expect(parseInputAmount('1', 6)).toBe(1_000_000n)
    expect(parseInputAmount('1.', 6)).toBe(1_000_000n)
    expect(parseInputAmount('.5', 6)).toBe(500_000n)
    expect(parseInputAmount(' 1.5 ', 6)).toBe(1_500_000n)
  })

  it('should throw for invalid amounts', () => {
    expect(() => parseInputAmount('abc', 6)).toThrow()
  })
})
