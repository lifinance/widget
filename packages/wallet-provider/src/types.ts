import type { ChainType } from '@lifi/sdk'

interface AccountBase<CT extends ChainType, WalletConnector = undefined> {
  address?: string
  addresses?: readonly string[]
  chainId?: number
  chainType: CT
  connector?: WalletConnector
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  isReconnecting: boolean
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected'
  // TODO: might be missing for some chain types
  name?: string
}

// TODO: Add types for each chain type
// export type EVMAccount = AccountBase<ChainType.EVM, Connector>
// export type SVMAccount = AccountBase<ChainType.SVM, WalletAdapter>
// export type UTXOAccount = AccountBase<ChainType.UTXO, BigmiConnector>
// export type MVMAccount = AccountBase<ChainType.MVM, WalletWithRequiredFeatures>
// export type DefaultAccount = AccountBase<ChainType>

export type Account = AccountBase<ChainType, any>

// export type Account =
//   | EVMAccount
//   | SVMAccount
//   | UTXOAccount
//   | MVMAccount
//   | DefaultAccount
