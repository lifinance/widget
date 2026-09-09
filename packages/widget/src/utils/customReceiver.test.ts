import { ChainType } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import {
  isCustomReceiverBlocked,
  isCustomReceiverUnsupported,
} from './customReceiver.js'

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

describe('isCustomReceiverBlocked', () => {
  const signer = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
  const other = 'GBUQWP3BOUZX34TOND2QV7QQ7K7VJTG6VSE7WMLBTMDJLLAW7YKGU6EP'
  const stellarRoute = {
    fromChainType: ChainType.STL,
    toChainType: ChainType.STL,
  }

  it('allows a receiver that equals the connected Stellar account', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        toAddress: signer,
        signerAddress: signer,
      })
    ).toBe(false)
  })

  it('blocks a receiver that differs from the connected Stellar account', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        toAddress: other,
        signerAddress: signer,
      })
    ).toBe(true)
  })

  it('blocks a receiver while no Stellar account is connected', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        toAddress: signer,
        signerAddress: undefined,
      })
    ).toBe(true)
  })

  it('allows a Stellar route with no receiver', () => {
    expect(
      isCustomReceiverBlocked({ ...stellarRoute, signerAddress: signer })
    ).toBe(false)
  })

  it('blocks an integrator receiver requirement that cannot be filled', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        signerAddress: signer,
        receiverRequired: true,
      })
    ).toBe(true)
  })

  it('allows a required receiver that equals the connected Stellar account', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        toAddress: signer,
        signerAddress: signer,
        receiverRequired: true,
      })
    ).toBe(false)
  })

  it('allows a different receiver on a route that bridges out of Stellar', () => {
    expect(
      isCustomReceiverBlocked({
        fromChainType: ChainType.STL,
        toChainType: ChainType.EVM,
        toAddress: '0x000000000000000000000000000000000000dEaD',
        signerAddress: signer,
      })
    ).toBe(false)
  })

  it('allows a different receiver on a non-Stellar route', () => {
    expect(
      isCustomReceiverBlocked({
        fromChainType: ChainType.SVM,
        toChainType: ChainType.SVM,
        toAddress: other,
        signerAddress: signer,
        receiverRequired: true,
      })
    ).toBe(false)
  })

  it('compares the receiver and the signer case-insensitively', () => {
    expect(
      isCustomReceiverBlocked({
        ...stellarRoute,
        toAddress: signer.toLowerCase(),
        signerAddress: signer,
      })
    ).toBe(false)
  })
})
