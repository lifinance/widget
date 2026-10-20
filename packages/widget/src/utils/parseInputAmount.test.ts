import { parseUnits } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parseInputAmount } from './parseInputAmount.js'

vi.mock('viem', async (importOriginal) => {
  const viem = await importOriginal<typeof import('viem')>()
  return { ...viem, parseUnits: vi.fn(viem.parseUnits) }
})

describe('parseInputAmount', () => {
  beforeEach(() => {
    vi.mocked(parseUnits).mockClear()
  })

  it('should return 0n for an empty amount', () => {
    expect(parseInputAmount('', 18)).toBe(0n)
    expect(parseInputAmount('   ', 18)).toBe(0n)
    expect(parseInputAmount('-', 18)).toBe(0n)
    expect(parseInputAmount('.', 18)).toBe(0n)
    expect(parseInputAmount('-.', 18)).toBe(0n)
    // viem 2.55.4+ throws on these values, so they must not reach parseUnits
    expect(parseUnits).not.toHaveBeenCalled()
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
