import type { Connector as BigmiConnector } from '@bigmi/client'
import { ChainType } from '@lifi/sdk'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import type { Connector } from 'wagmi'
import type { CreateConnectorFnExtended } from '../connectors/types'

type WalletTypes = {
  [ChainType.EVM]: Connector | CreateConnectorFnExtended
  [ChainType.SVM]: WalletAdapter
  [ChainType.UTXO]: BigmiConnector
  [ChainType.MVM]: WalletWithRequiredFeatures
}

type DuplicateRule<T> = (wallet: T) => boolean

const KNOWN_DUPLICATES_RULES = {
  [ChainType.MVM]: [
    (wallet: WalletWithRequiredFeatures) =>
      '_name' in wallet &&
      (wallet._name as string)?.toLowerCase() === 'onekey wallet' &&
      wallet.name.toLowerCase() === 'sui wallet',
  ],
  [ChainType.EVM]: [
    // Add EVM rules here
  ],
  [ChainType.SVM]: [
    // Add SVM rules here
  ],
  [ChainType.UTXO]: [
    // Add UTXO rules here
  ],
}

export function removeDuplicateWallets<T extends ChainType>(
  ecosystem: T,
  wallets: WalletTypes[T][]
): WalletTypes[T][] {
  const rules = KNOWN_DUPLICATES_RULES[ecosystem] as DuplicateRule<
    WalletTypes[T]
  >[]

  if (!rules || rules.length === 0) {
    return wallets
  }

  return wallets.filter((wallet) => !rules.some((rule) => rule(wallet)))
}
