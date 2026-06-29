import type { Route } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  applyPriceOffset,
  deriveLimitPrice,
  deriveReceiveAmount,
  formatPrice,
  getRouteProviderKey,
  invertPrice,
} from './limitOrder.js'

const route = (overrides: object): Route => overrides as Route

describe('getRouteProviderKey', () => {
  it('prefers toolDetails.key over tool', () => {
    expect(
      getRouteProviderKey(
        route({ steps: [{ toolDetails: { key: 'across' }, tool: 'fallback' }] })
      )
    ).toBe('across')
  })

  it('falls back to tool when toolDetails.key is absent', () => {
    expect(getRouteProviderKey(route({ steps: [{ tool: 'lifi' }] }))).toBe(
      'lifi'
    )
  })

  it('returns undefined for an empty steps array', () => {
    expect(getRouteProviderKey(route({ steps: [] }))).toBeUndefined()
  })
})

describe('deriveReceiveAmount', () => {
  it('multiplies send by price', () => {
    expect(deriveReceiveAmount('2', '1500')).toBe('3000')
  })

  it('returns empty string when send is missing', () => {
    expect(deriveReceiveAmount('', '1500')).toBe('')
    expect(deriveReceiveAmount(undefined, '1500')).toBe('')
  })

  it('returns empty string when price is missing', () => {
    expect(deriveReceiveAmount('2', '')).toBe('')
    expect(deriveReceiveAmount('2', undefined)).toBe('')
  })

  it('returns empty string for zero or negative send', () => {
    expect(deriveReceiveAmount('0', '1500')).toBe('')
    expect(deriveReceiveAmount('-1', '1500')).toBe('')
  })

  it('respects toDecimals', () => {
    expect(deriveReceiveAmount('1', '1.123456789', 4)).toBe('1.1234')
  })
})

describe('deriveLimitPrice', () => {
  it('divides receive by send', () => {
    expect(deriveLimitPrice('2', '3000')).toBe('1500')
  })

  it('returns empty string when either input is missing', () => {
    expect(deriveLimitPrice('', '3000')).toBe('')
    expect(deriveLimitPrice('2', '')).toBe('')
  })
})

describe('invertPrice', () => {
  it('returns 1/price', () => {
    expect(invertPrice('2')).toBe('0.5')
  })

  it('returns empty string for missing or invalid input', () => {
    expect(invertPrice('')).toBe('')
    expect(invertPrice(undefined)).toBe('')
    expect(invertPrice('0')).toBe('')
  })
})

describe('applyPriceOffset', () => {
  it('applies a positive percent', () => {
    expect(applyPriceOffset('1000', 2)).toBe('1020')
  })

  it('applies a negative percent', () => {
    expect(applyPriceOffset('1000', -5)).toBe('950')
  })

  it('returns empty string for missing price', () => {
    expect(applyPriceOffset(undefined, 2)).toBe('')
    expect(applyPriceOffset('', 2)).toBe('')
  })
})

describe('formatPrice', () => {
  it('uses 4 decimals for values >= 1', () => {
    expect(formatPrice(2227.17)).toBe('2227.1700')
  })

  it('uses 6 decimals for values < 1', () => {
    expect(formatPrice(0.000449)).toBe('0.000449')
  })

  it('returns empty string for non-positive or non-finite input', () => {
    expect(formatPrice(0)).toBe('')
    expect(formatPrice(-1)).toBe('')
    expect(formatPrice(Number.NaN)).toBe('')
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe('')
  })
})
