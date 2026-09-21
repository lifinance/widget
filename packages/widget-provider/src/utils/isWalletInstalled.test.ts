import { afterEach, describe, expect, it } from 'vitest'
import { isWalletInstalled } from './isWalletInstalled.js'

afterEach(() => {
  ;(globalThis as any).window = undefined
})

describe('isWalletInstalled', () => {
  it('reports MetaMask EVM from the injected provider', () => {
    ;(globalThis as any).window = { ethereum: { isMetaMask: true } }
    expect(isWalletInstalled('metaMask')).toBeTruthy()
  })

  it('no longer answers for MetaMask Bitcoin', () => {
    // Rabby sets `isMetaMask` too. Bitcoin presence is the connector's to report.
    ;(globalThis as any).window = { ethereum: { isMetaMask: true } }
    expect(isWalletInstalled('io.metamask.bitcoin')).toBe(true)
    ;(globalThis as any).window = {}
    expect(isWalletInstalled('io.metamask.bitcoin')).toBe(true)
  })

  it('no longer answers for any Bitcoin connector', () => {
    ;(globalThis as any).window = {}
    for (const id of [
      'com.okex.wallet.bitcoin',
      'XverseProviders.BitcoinProvider',
      'unisat',
      'io.xdefi',
      'so.onekey.app.wallet.bitcoin',
      'LeatherProvider',
      'bitget',
      'OylProvider',
      'binance',
      'app.magiceden.bitcoin',
      'unhosted.bitcoin',
    ]) {
      expect(isWalletInstalled(id)).toBe(true)
    }
  })

  it('still distinguishes Coinbase Browser from the extension', () => {
    ;(globalThis as any).window = {
      ethereum: { isCoinbaseWallet: true, isCoinbaseBrowser: true },
    }
    expect(isWalletInstalled('coinbase')).toBeFalsy()
  })

  it('returns true for an unknown wallet', () => {
    ;(globalThis as any).window = {}
    expect(isWalletInstalled('some.unknown.wallet')).toBe(true)
  })
})
