import type { WalletConnectAdapterConfig } from '@tronweb3/tronwallet-adapters'
import { describe, expect, it } from 'vitest'
import { resolveTronWalletConnectConfig } from './walletConnect.js'

const resolve = (config: Partial<WalletConnectAdapterConfig>) =>
  resolveTronWalletConnectConfig(config as WalletConnectAdapterConfig)!

describe('resolveTronWalletConnectConfig', () => {
  it('returns undefined when disabled', () => {
    expect(resolveTronWalletConnectConfig(undefined)).toBeUndefined()
    expect(resolveTronWalletConnectConfig(false)).toBeUndefined()
  })

  it('defaults to Mainnet, the shared project id, and the tron storage prefix', () => {
    expect(resolveTronWalletConnectConfig(true)).toEqual({
      network: 'Mainnet',
      options: {
        projectId: '5432e3507d41270bee46b7b85bbc2ef8',
        customStoragePrefix: 'tron',
      },
    })
  })

  it.each([
    ['mainnet', 'Mainnet'],
    ['MAINNET', 'Mainnet'],
    ['shasta', 'Shasta'],
    ['NILE', 'Nile'],
  ])('snaps %s to canonical casing %s', (input, expected) => {
    expect(resolve({ network: input }).network).toBe(expected)
  })

  it('passes chainId-style networks through untouched', () => {
    expect(resolve({ network: 'tron:0x2b6653dc' }).network).toBe(
      'tron:0x2b6653dc'
    )
    expect(resolve({ network: '0x2b6653dc' }).network).toBe('0x2b6653dc')
  })

  it('forces the tron storage prefix even when overridden', () => {
    expect(
      resolve({ options: { customStoragePrefix: 'evm' } }).options
        .customStoragePrefix
    ).toBe('tron')
  })

  it('lets a caller override the default project id', () => {
    expect(
      resolve({ options: { projectId: 'my-project-id' } }).options.projectId
    ).toBe('my-project-id')
  })
})
