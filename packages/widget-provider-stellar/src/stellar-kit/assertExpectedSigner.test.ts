import { describe, expect, it, vi } from 'vitest'

vi.mock('@creit.tech/stellar-wallets-kit/modules/varial', () => ({
  VARIAL_ID: 'varial',
}))

const { assertExpectedSigner } = await import('./assertExpectedSigner.js')

describe('assertExpectedSigner', () => {
  it('throws when Varial signed with another account', () => {
    expect(() =>
      assertExpectedSigner({
        walletId: 'varial',
        expectedAddress: 'GCONNECTED',
        signerAddress: 'GOTHER',
      })
    ).toThrow(
      'The wallet signed with account GOTHER, but the widget is connected to GCONNECTED. Switch to the connected account in your wallet and try again.'
    )
  })

  it('passes when Varial signed with the connected account', () => {
    expect(() =>
      assertExpectedSigner({
        walletId: 'varial',
        expectedAddress: 'GCONNECTED',
        signerAddress: 'GCONNECTED',
      })
    ).not.toThrow()
  })

  it('passes when Varial returns no signer', () => {
    expect(() =>
      assertExpectedSigner({
        walletId: 'varial',
        expectedAddress: 'GCONNECTED',
        signerAddress: undefined,
      })
    ).not.toThrow()
    expect(() =>
      assertExpectedSigner({
        walletId: 'varial',
        expectedAddress: 'GCONNECTED',
        signerAddress: '',
      })
    ).not.toThrow()
  })

  it('ignores other wallets', () => {
    expect(() =>
      assertExpectedSigner({
        walletId: 'klever',
        expectedAddress: 'GCONNECTED',
        signerAddress: 'GOTHER',
      })
    ).not.toThrow()
    expect(() =>
      assertExpectedSigner({
        walletId: null,
        expectedAddress: 'GCONNECTED',
        signerAddress: 'GOTHER',
      })
    ).not.toThrow()
  })
})
