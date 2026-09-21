import { ChainType } from '@lifi/sdk'
import type { WalletConnector } from '@lifi/widget-provider'
import { describe, expect, it } from 'vitest'
import {
  combineWalletLists,
  defaultWalletEcosystemsOrder,
} from './useCombinedWallets.js'

const connector = (name: string): WalletConnector => ({ id: name, name })

const ecosystemsOf = (
  wallets: ReturnType<typeof combineWalletLists>,
  name: string
) => wallets.find((w) => w.name === name)?.connectors.map((c) => c.chainType)

// One wallet present in every ecosystem, so ordering is the only variable.
const everywhere = (walletEcosystemsOrder?: Record<string, ChainType[]>) =>
  combineWalletLists(
    [connector('Omni')],
    [connector('Omni')],
    [connector('Omni')],
    [connector('Omni')],
    [connector('Omni')],
    [connector('Omni')],
    walletEcosystemsOrder
  )

describe('combineWalletLists ecosystem ordering', () => {
  it('orders Ethereum, Solana, Sui, Bitcoin, Tron, Stellar by default', () => {
    expect(ecosystemsOf(everywhere(), 'Omni')).toEqual([
      ChainType.EVM,
      ChainType.SVM,
      ChainType.MVM,
      ChainType.UTXO,
      ChainType.TVM,
      ChainType.STL,
    ])
  })

  it('matches the exported default order', () => {
    expect(ecosystemsOf(everywhere(), 'Omni')).toEqual(
      defaultWalletEcosystemsOrder
    )
  })

  it('lets a per-wallet order win over the default', () => {
    const order = ecosystemsOf(
      everywhere({ Omni: [ChainType.TVM, ChainType.UTXO] }),
      'Omni'
    )
    expect(order?.slice(0, 2)).toEqual([ChainType.TVM, ChainType.UTXO])
  })

  it('keeps ecosystems absent from a per-wallet order in default order', () => {
    const order = ecosystemsOf(everywhere({ Omni: [ChainType.STL] }), 'Omni')
    expect(order?.[0]).toBe(ChainType.STL)
    expect(order?.slice(1)).toEqual([
      ChainType.EVM,
      ChainType.SVM,
      ChainType.MVM,
      ChainType.UTXO,
      ChainType.TVM,
    ])
  })

  it('applies the default to a wallet with no configured order', () => {
    const wallets = combineWalletLists(
      [connector('Other')],
      [connector('Other')],
      [connector('Other')],
      [],
      [],
      [],
      { Omni: [ChainType.TVM] }
    )
    expect(ecosystemsOf(wallets, 'Other')).toEqual([
      ChainType.EVM,
      ChainType.SVM,
      ChainType.UTXO,
    ])
  })

  it('does not mutate the caller-supplied order array', () => {
    const order = [ChainType.TVM, ChainType.UTXO]
    everywhere({ Omni: order })
    expect(order).toEqual([ChainType.TVM, ChainType.UTXO])
  })
})
