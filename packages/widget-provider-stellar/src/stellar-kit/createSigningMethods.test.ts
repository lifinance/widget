import { beforeEach, describe, expect, it, vi } from 'vitest'

let selectedModuleId = 'varial'
let signerAddress: string | undefined

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    signTransaction: vi.fn(async () => ({
      signedTxXdr: 'SIGNED_XDR',
      signerAddress,
    })),
    signAuthEntry: vi.fn(async () => ({
      signedAuthEntry: 'SIGNED_ENTRY',
      signerAddress,
    })),
    get selectedModule() {
      return { productId: selectedModuleId }
    },
  },
}))

vi.mock('@creit.tech/stellar-wallets-kit/modules/varial', () => ({
  VARIAL_ID: 'varial',
}))

const { createSigningMethods } = await import('./createSigningMethods.js')
const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit')

const PUBLIC = 'Public Global Stellar Network ; September 2015'
const wrongAccount =
  'The wallet signed with account GOTHER, but the widget is connected to GCONNECTED. Switch to the connected account in your wallet and try again.'

const methods = () =>
  createSigningMethods({
    walletAddress: 'GCONNECTED',
    networkPassphrase: PUBLIC,
  })

describe('createSigningMethods', () => {
  beforeEach(() => {
    selectedModuleId = 'varial'
    signerAddress = 'GCONNECTED'
    vi.mocked(StellarWalletsKit.signTransaction).mockClear()
    vi.mocked(StellarWalletsKit.signAuthEntry).mockClear()
  })

  it('asks the kit to sign with the connected address and network', async () => {
    await methods().signTransaction('XDR')
    await methods().signAuthEntry('ENTRY')

    expect(StellarWalletsKit.signTransaction).toHaveBeenCalledWith('XDR', {
      address: 'GCONNECTED',
      networkPassphrase: PUBLIC,
    })
    expect(StellarWalletsKit.signAuthEntry).toHaveBeenCalledWith('ENTRY', {
      address: 'GCONNECTED',
      networkPassphrase: PUBLIC,
    })
  })

  it('returns the signature when Varial signed with the connected account', async () => {
    await expect(methods().signTransaction('XDR')).resolves.toEqual({
      signedTxXdr: 'SIGNED_XDR',
      signerAddress: 'GCONNECTED',
    })
    await expect(methods().signAuthEntry('ENTRY')).resolves.toEqual({
      signedAuthEntry: 'SIGNED_ENTRY',
      signerAddress: 'GCONNECTED',
    })
  })

  it('rejects a transaction that Varial signed with another account', async () => {
    signerAddress = 'GOTHER'

    await expect(methods().signTransaction('XDR')).rejects.toThrow(wrongAccount)
  })

  it('rejects an auth entry that Varial signed with another account', async () => {
    signerAddress = 'GOTHER'

    await expect(methods().signAuthEntry('ENTRY')).rejects.toThrow(wrongAccount)
  })

  it('accepts a Varial signature that reports no signer', async () => {
    signerAddress = undefined

    await expect(methods().signTransaction('XDR')).resolves.toBeDefined()
    await expect(methods().signAuthEntry('ENTRY')).resolves.toBeDefined()
  })

  it('leaves other wallets unchecked', async () => {
    selectedModuleId = 'xbull'
    signerAddress = 'GOTHER'

    await expect(methods().signTransaction('XDR')).resolves.toBeDefined()
    await expect(methods().signAuthEntry('ENTRY')).resolves.toBeDefined()
  })
})
