import type { Connector as BigmiConnector } from '@bigmi/client'
import { ChainId, ChainType } from '@lifi/sdk'
import {
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
} from '@lifi/wallet-provider'
import type { CreateConnectorFnExtended } from '@lifi/wallet-provider-evm'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { create } from 'zustand'

export interface AccountBase<
  CT extends ChainType,
  WalletConnector = undefined,
> {
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
}

export type EVMAccount = AccountBase<ChainType.EVM, Connector>
export type SVMAccount = AccountBase<ChainType.SVM, WalletAdapter>
export type UTXOAccount = AccountBase<ChainType.UTXO, BigmiConnector>
export type MVMAccount = AccountBase<ChainType.MVM, WalletWithRequiredFeatures>
export type DefaultAccount = AccountBase<ChainType>

export type Account =
  | EVMAccount
  | SVMAccount
  | UTXOAccount
  | MVMAccount
  | DefaultAccount

export interface AccountResult {
  account: Account
  /**
   * Connected accounts
   */
  accounts: Account[]
}

interface UseAccountArgs {
  chainType?: ChainType
}

const defaultAccount: AccountBase<ChainType> = {
  chainType: ChainType.EVM,
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
}

export type LastConnectedAccount =
  | WalletAdapter
  | Connector
  | BigmiConnector
  | CreateConnectorFnExtended
  | WalletWithRequiredFeatures
  | null

interface LastConnectedAccountStore {
  lastConnectedAccount: LastConnectedAccount
  setLastConnectedAccount: (account: LastConnectedAccount) => void
}

export const useLastConnectedAccount = create<LastConnectedAccountStore>(
  (set) => ({
    lastConnectedAccount: null,
    setLastConnectedAccount: (account) =>
      set({ lastConnectedAccount: account }),
  })
)

/**
 * @param args When we provide args we want to return either account with corresponding chainType or default disconnected one
 * @returns - Account result
 */
export const useAccount = (args?: UseAccountArgs): AccountResult => {
  const { currentWallet: evmWallet } = useEVMContext()
  const { currentWallet: utxoWallet } = useUTXOContext()
  const { currentWallet: svmWallet } = useSVMContext()
  const { currentWallet: suiWallet, connectionStatus } = useMVMContext()
  const { lastConnectedAccount } = useLastConnectedAccount()

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when wallet changes
  return useMemo(() => {
    const svm: Account = svmWallet?.adapter.publicKey
      ? {
          address: svmWallet?.adapter.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: svmWallet?.adapter,
          isConnected: Boolean(svmWallet?.adapter.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !svmWallet,
          status: 'connected',
        }
      : {
          chainType: ChainType.SVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        }
    const sui: Account =
      suiWallet?.accounts?.length && connectionStatus === 'connected'
        ? {
            address: suiWallet?.accounts[0].address,
            chainId: ChainId.SUI,
            chainType: ChainType.MVM,
            connector: suiWallet,
            isConnected: connectionStatus === 'connected',
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: !suiWallet,
            status: connectionStatus,
          }
        : {
            chainType: ChainType.MVM,
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: true,
            status: 'disconnected',
          }
    const evm: Account = { ...evmWallet, chainType: ChainType.EVM }
    const utxo: Account = {
      ...utxoWallet,

      chainType: ChainType.UTXO,
      chainId: ChainId.BTC,
      address: utxoWallet.account?.address,
      addresses: utxoWallet.accounts?.map((account: any) => account.address),
    }
    const accounts = [evm, svm, utxo, sui]
    const connectedAccounts = accounts.filter(
      (account) => account.isConnected && account.address
    )

    // If a chainType argument is provided, attempt to find a connected account with the matching chainType.
    // If no matching account is found, fallback to the default account.
    // If no chainType argument, selectedAccount should be used.
    const selectedChainTypeAccount = args?.chainType
      ? connectedAccounts.find(
          (account) => account.chainType === args?.chainType
        ) || defaultAccount
      : undefined

    // If lastConnectedAccount exists, attempt to find a connected account with a matching connector ID or name.
    // If no matching account is found, fallback to the first connected account.
    // If lastConnectedAccount is not present, simply select the first connected account.
    const selectedAccount = lastConnectedAccount
      ? connectedAccounts.find((account) => {
          const connectorIdMatch =
            (lastConnectedAccount as Connector)?.id ===
            (account.connector as Connector)?.id
          const connectorNameMatch =
            !(lastConnectedAccount as Connector)?.id &&
            (lastConnectedAccount as WalletAdapter)?.name ===
              account.connector?.name
          return connectorIdMatch || connectorNameMatch
        }) || connectedAccounts[0]
      : connectedAccounts[0]

    return {
      account: selectedChainTypeAccount || selectedAccount || defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    }
  }, [
    svmWallet?.adapter.publicKey,
    evmWallet.connector?.uid,
    evmWallet.connector?.id,
    evmWallet.status,
    evmWallet.address,
    evmWallet.chainId,
    utxoWallet.connector?.uid,
    utxoWallet.connector?.id,
    utxoWallet.status,
    utxoWallet.account?.address,
    utxoWallet.chainId,
    args?.chainType,
    lastConnectedAccount,
    suiWallet?.accounts?.length,
    connectionStatus,
  ])
}
