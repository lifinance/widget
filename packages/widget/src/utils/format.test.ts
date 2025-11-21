import { describe, expect, it } from 'vitest'
import { formatInputAmount } from './format.js'

describe('formatInputAmount', () => {
  describe('empty and null cases', () => {
    it('should return empty string for empty input', () => {
      expect(formatInputAmount('')).toBe('')
    })

    it('should return empty string for whitespace-only input', () => {
      expect(formatInputAmount('   ')).toBe('')
    })
  })

  describe('trimming and comma replacement', () => {
    it('should trim whitespace', () => {
      expect(formatInputAmount('  123  ')).toBe('123')
    })

    it('should replace commas with dots', () => {
      expect(formatInputAmount('1,23')).toBe('1.23')
    })
  })

  describe('multiple dots handling', () => {
    it('should keep only the first dot when there are multiple dots', () => {
      expect(formatInputAmount('1.2.3')).toBe('1.23')
    })

    it('should handle multiple consecutive dots', () => {
      expect(formatInputAmount('0..')).toBe('')
    })

    it('should handle multiple dots with returnInitial=true', () => {
      expect(formatInputAmount('0..', null, true)).toBe('0.')
    })

    it('should handle multiple dots with decimals limit', () => {
      expect(formatInputAmount('1.2.3456789', 2)).toBe('1.23')
    })

    it('should handle multiple dots starting with dot', () => {
      expect(formatInputAmount('..5')).toBe('0.5')
    })
  })

  describe('returnInitial = true', () => {
    it('should return formatted amount as-is when returnInitial is true', () => {
      expect(formatInputAmount('123.45', null, true)).toBe('123.45')
    })

    it('should prepend 0 when starts with dot', () => {
      expect(formatInputAmount('.', null, true)).toBe('0.')
      expect(formatInputAmount('.5', null, true)).toBe('0.5')
      expect(formatInputAmount(',', null, true)).toBe('0.')
    })
  })

  describe('returnInitial = false (default)', () => {
    it('should format numbers and prepend 0 when starts with dot', () => {
      expect(formatInputAmount('123')).toBe('123')
      expect(formatInputAmount('123.45')).toBe('123.45')
      expect(formatInputAmount('.5')).toBe('0.5')
    })

    it('should handle leading zeros in integer part', () => {
      expect(formatInputAmount('00123')).toBe('123')
    })

    it('should remove trailing zeros in fraction part', () => {
      expect(formatInputAmount('123.45000')).toBe('123.45')
    })

    it('should handle zero with trailing zeros', () => {
      // When integer is empty and fraction is empty, returns empty string
      expect(formatInputAmount('0.000')).toBe('')
      expect(formatInputAmount('0.', null, false)).toBe('')
      expect(formatInputAmount('0.00', null, false)).toBe('')
      expect(formatInputAmount('0.01', 2, false)).toBe('0.01')
      expect(formatInputAmount('0.123456789', 6, false)).toBe('0.123456')
    })

    it('should handle fraction-only input', () => {
      expect(formatInputAmount('.123')).toBe('0.123')
    })
  })

  describe('decimals parameter', () => {
    it('should limit fraction to specified decimals', () => {
      expect(formatInputAmount('123.456789', 2)).toBe('123.45')
    })

    it('should limit fraction to 0 decimals', () => {
      expect(formatInputAmount('123.456', 0)).toBe('123')
    })

    it('should handle decimals with returnInitial true', () => {
      expect(formatInputAmount('123.456789', 2, true)).toBe('123.45')
      expect(formatInputAmount('0.00', 2, true)).toBe('0.00')
      expect(formatInputAmount('0.123456789', 6, true)).toBe('0.123456')
    })
  })

  describe('edge cases', () => {
    it('should handle zero', () => {
      // When integer is empty and fraction is empty, returns empty string
      expect(formatInputAmount('0')).toBe('')
    })

    it('should handle negative numbers', () => {
      expect(formatInputAmount('-123.45')).toBe('123.45')
    })

    it('should return empty string for invalid input', () => {
      expect(formatInputAmount('abc')).toBe('')
    })
  })

  describe('NaN handling', () => {
    it('should return empty string for NaN input', () => {
      expect(formatInputAmount('NaN')).toBe('')
    })

    it('should cut decimals when Number() returns NaN but parseFloat() succeeds', () => {
      expect(formatInputAmount('123.456789abc', 2)).toBe('123.45')
      expect(formatInputAmount('123.456789abc', 2, true)).toBe('123.45')
    })
  })
})
