import { ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import { isCustomReceiverUnsupported } from './customReceiver.js'

describe('isCustomReceiverUnsupported', () => {
  it('is true only when both sides are Stellar', () => {
    expect(isCustomReceiverUnsupported(ChainType.STL, ChainType.STL)).toBe(true)
  })

  it('is false when only the source is Stellar', () => {
    expect(isCustomReceiverUnsupported(ChainType.STL, ChainType.EVM)).toBe(
      false
    )
  })

  it('is false when only the destination is Stellar', () => {
    expect(isCustomReceiverUnsupported(ChainType.EVM, ChainType.STL)).toBe(
      false
    )
  })

  it('is false for a non-Stellar pair', () => {
    expect(isCustomReceiverUnsupported(ChainType.EVM, ChainType.SVM)).toBe(
      false
    )
  })

  it('is false while either chain is still unresolved', () => {
    expect(isCustomReceiverUnsupported(undefined, ChainType.STL)).toBe(false)
    expect(isCustomReceiverUnsupported(ChainType.STL, undefined)).toBe(false)
    expect(isCustomReceiverUnsupported(undefined, undefined)).toBe(false)
  })
})
