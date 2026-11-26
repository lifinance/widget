import { beforeEach, describe, expect, it, vi } from 'vitest'

const { selectedModuleId, init, setWallet } = vi.hoisted(() => ({
  selectedModuleId: { value: undefined as string | undefined },
  init: vi.fn(),
  setWallet: vi.fn(),
}))

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  Networks: { PUBLIC: 'Public Global Stellar Network ; September 2015' },
  StellarWalletsKit: { init, setWallet },
  selectedModuleId,
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/bitget', () => ({
  BITGET_WALLET_ID: 'bitget',
  BitgetModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/varial', () => ({
  VARIAL_ID: 'varial',
  VarialModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/hana', () => ({
  HANA_ID: 'hana',
  HanaModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/klever', () => ({
  KLEVER_ID: 'klever',
  KleverModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/lobstr', () => ({
  LOBSTR_ID: 'lobstr',
  LobstrModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/onekey', () => ({
  ONEKEY_ID: 'onekey',
  OneKeyModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/rabet', () => ({
  RABET_ID: 'rabet',
  RabetModule: class {},
}))
vi.mock('@creit.tech/stellar-wallets-kit/modules/xbull', () => ({
  XBULL_ID: 'xbull',
  xBullModule: class {},
}))

describe('initStellarWalletsKit', () => {
  beforeEach(() => {
    vi.resetModules()
    init.mockClear()
    setWallet.mockClear()
    selectedModuleId.value = undefined
  })

  it('moves a session saved under the old Freighter id to Varial', async () => {
    selectedModuleId.value = 'freighter'
    const { initStellarWalletsKit } =
      await import('./createStellarWalletsKit.js')

    initStellarWalletsKit()

    expect(setWallet).toHaveBeenCalledWith('varial')
  })

  it('leaves any other saved wallet alone', async () => {
    selectedModuleId.value = 'xbull'
    const { initStellarWalletsKit } =
      await import('./createStellarWalletsKit.js')

    initStellarWalletsKit()

    expect(setWallet).not.toHaveBeenCalled()
  })

  it('does nothing when no wallet was saved', async () => {
    const { initStellarWalletsKit } =
      await import('./createStellarWalletsKit.js')

    initStellarWalletsKit()

    expect(setWallet).not.toHaveBeenCalled()
  })

  it('enables Varial under its new id', async () => {
    const { ENABLED_WALLET_IDS } = await import('./createStellarWalletsKit.js')

    expect(ENABLED_WALLET_IDS).toContain('varial')
    expect(ENABLED_WALLET_IDS).not.toContain('freighter')
  })
})
