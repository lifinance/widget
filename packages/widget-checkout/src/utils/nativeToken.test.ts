import { describe, expect, it } from 'vitest'
import { isNativeToken, NATIVE_TOKEN_ADDRESS } from './nativeToken.js'

describe('isNativeToken', () => {
  it('matches the zero sentinel address', () => {
    expect(isNativeToken(NATIVE_TOKEN_ADDRESS)).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isNativeToken('0x0000000000000000000000000000000000000000')).toBe(
      true
    )
    expect(isNativeToken('0X0000000000000000000000000000000000000000')).toBe(
      true
    )
  })

  it('returns false for ERC20 addresses', () => {
    expect(isNativeToken('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')).toBe(
      false
    )
  })

  it('returns false for undefined', () => {
    expect(isNativeToken(undefined)).toBe(false)
  })
})
