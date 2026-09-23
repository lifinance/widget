import { ChainId } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { isDestinationOnlyChain } from './chainType.js'

describe('isDestinationOnlyChain', () => {
  it('is true for ZEC only', () => {
    expect(isDestinationOnlyChain(ChainId.ZEC)).toBe(true)
    expect(isDestinationOnlyChain(ChainId.BTC)).toBe(false)
    expect(isDestinationOnlyChain(ChainId.ETH)).toBe(false)
  })

  it('is false without a chain', () => {
    expect(isDestinationOnlyChain(undefined)).toBe(false)
    expect(isDestinationOnlyChain(Number.NaN)).toBe(false)
  })
})
