import { describe, expect, it } from 'vitest'
import { isZcashAddress } from './isZcashAddress.js'

const transparentP2PKH = 't1KszAHEXNWDLsKKLQPZWNTgqzJgJRkYqRT'
const transparentP2SH = 't3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd'
const shielded =
  'zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9slya'
const unified =
  'u1l8xunezsvhq8fgzfl7404m450nwnd76zshscn6nfys7vyz2ywyh4cc5daaq0c7q2su5lqfh23sp7fkyy6c4p8faxzv7lnrdad83xmn9t9t8'

describe('isZcashAddress', () => {
  it('accepts every Zcash wallet address format', () => {
    expect(isZcashAddress(transparentP2PKH)).toBe(true)
    expect(isZcashAddress(transparentP2SH)).toBe(true)
    expect(isZcashAddress(shielded)).toBe(true)
    expect(isZcashAddress(unified)).toBe(true)
  })

  // Zcash answers for the whole UTXO slot, so it must not claim its neighbour.
  it('rejects a Bitcoin address', () => {
    expect(isZcashAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(false)
    expect(isZcashAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBe(false)
    expect(isZcashAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toBe(
      false
    )
  })

  it('rejects a truncated address and an empty value', () => {
    expect(isZcashAddress(transparentP2PKH.slice(0, -1))).toBe(false)
    expect(isZcashAddress(shielded.slice(0, -1))).toBe(false)
    expect(isZcashAddress('')).toBe(false)
  })
})
