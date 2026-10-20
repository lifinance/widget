import { describe, expect, it, vi } from 'vitest'
import { parseInputAmount } from './parseInputAmount.js'

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
    expect(parseInputAmount('.', 18)).toBe(0n)
    expect(parseInputAmount('-.', 18)).toBe(0n)
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
