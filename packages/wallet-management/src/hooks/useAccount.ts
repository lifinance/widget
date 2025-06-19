import type { Connector as BigmiConnector } from '@bigmi/client'
import { useAccount as useBigmiAccount } from '@bigmi/react'
import { ChainId, ChainType } from '@lifi/sdk'
import { useCurrentWallet } from '@mysten/dapp-kit'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { UiWallet } from '@wallet-standard/react'
import { useWallets } from '@wallet-standard/react'
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { useAccount as useAccountInternal } from 'wagmi'
import { create } from 'zustand'
import type { CreateConnectorFnExtended } from '../connectors/types.js'

export interface AccountBase<CT extends ChainType, ConnectorType = undefined> {
  address?: string
  addresses?: readonly string[]
  chainId?: number
  chainType: CT
  connector?: ConnectorType
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  isReconnecting: boolean
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected'
}

export type EVMAccount = AccountBase<ChainType.EVM, Connector>
export type SVMAccount = AccountBase<ChainType.SVM, UiWallet>
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
  | UiWallet
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
  const bigmiAccount = useBigmiAccount()
  const wagmiAccount = useAccountInternal()
  const { currentWallet: suiWallet, connectionStatus } = useCurrentWallet()
  const wallets = useWallets()
  const solanaWallets = wallets
    .filter((wallet) =>
      wallet.chains.find((chain) => chain.startsWith('solana'))
    )
    .filter((wallet) => wallet.accounts.length > 0)
  const solanaWallet = solanaWallets.length > 0 ? solanaWallets[0] : undefined

  const { lastConnectedAccount } = useLastConnectedAccount()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(() => {
    const svm: Account = solanaWallet?.accounts.length
      ? {
          address: solanaWallet.accounts[0].address,
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: solanaWallet,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !solanaWallet,
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
            address: suiWallet.accounts[0].address,
            chainId: ChainId.SUI,
            chainType: ChainType.MVM,
            connector: suiWallet,
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: !suiWallet,
            status: 'connected',
          }
        : {
            chainType: ChainType.MVM,
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: true,
            status: 'disconnected',
          }
    const evm: Account = { ...wagmiAccount, chainType: ChainType.EVM }
    const utxo: Account = { ...bigmiAccount, chainType: ChainType.UTXO }
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
            (lastConnectedAccount as UiWallet)?.name === account.connector?.name
          return connectorIdMatch || connectorNameMatch
        }) || connectedAccounts[0]
      : connectedAccounts[0]

    return {
      account: selectedChainTypeAccount || selectedAccount || defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    }
  }, [
    solanaWallet?.accounts?.length,
    wagmiAccount.connector?.uid,
    wagmiAccount.connector?.id,
    wagmiAccount.status,
    wagmiAccount.address,
    wagmiAccount.chainId,
    bigmiAccount.connector?.uid,
    bigmiAccount.connector?.id,
    bigmiAccount.status,
    bigmiAccount.address,
    bigmiAccount.chainId,
    args?.chainType,
    lastConnectedAccount,
    connectionStatus,
    suiWallet?.accounts?.length,
  ])
}
