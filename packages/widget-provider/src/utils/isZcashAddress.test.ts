import { describe, expect, it } from 'vitest'
import { isZcashAddress } from './isZcashAddress.js'

const transparentP2PKH = 't1KszAHEXNWDLsKKLQPZWNTgqzJgJRkYqRT'
const transparentP2SH = 't3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd'
const shielded =
  'zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9slya'
/** ZIP-316 test vector: P2PKH + Sapling receivers. */
const unified =
  'u1l8xunezsvhq8fgzfl7404m450nwnd76zshscn6nfys7vyz2ywyh4cc5daaq0c7q2su5lqfh23sp7fkf3kt27ve5948mzpfdvckzaect2jtte308mkwlycj2u0eac077wu70vqcetkxf'
/** Orchard-only receiver, 106 characters. */
const unifiedOrchard =
  'u1k9eh52jx5q4y8lw6x208lsep4t6yzwk7mdwz9e6239qywjkqzdcd3al3d64zwnqx296p3klxnash5w2e0elg39qrydxx0s0qz5m2gnt0'
/** Transparent + Sapling + Orchard receivers, 213 characters. */
const unifiedMixed =
  'u1glfempz42e5sh4zmwqwdapw6s3pxzpmfzu9mcuc83e5m8jj3mwjnhfxd8xcujvfyw7sl6vs66rcvsncs6np5hcdm37tlwgs52mkd35xtch3uusvcgqwmc462ver33qf9a0gwg3uqa96usls756tdc74mnrchpv8fepeksrk4yeecxr42u7n0y2pkeldjyldhcypvr6frmx0y7tamvdx'

describe('isZcashAddress', () => {
  it('accepts every Zcash wallet address format', () => {
    expect(isZcashAddress(transparentP2PKH)).toBe(true)
    expect(isZcashAddress(transparentP2SH)).toBe(true)
    expect(isZcashAddress(shielded)).toBe(true)
    expect(isZcashAddress(unified)).toBe(true)
    expect(isZcashAddress(unifiedOrchard)).toBe(true)
    expect(isZcashAddress(unifiedMixed)).toBe(true)
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

  // An input capped below the address length keeps the regex shape, so only
  // the bech32m checksum catches the cut.
  it('rejects a unified address cut short or with a changed character', () => {
    expect(isZcashAddress(unifiedMixed.slice(0, 128))).toBe(false)
    expect(isZcashAddress(unifiedOrchard.slice(0, -1))).toBe(false)
    expect(isZcashAddress(`${unifiedOrchard.slice(0, -1)}q`)).toBe(false)
  })
})
