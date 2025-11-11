import type { Connector as BigmiConnector } from '@bigmi/client'
import { useAccount as useBigmiAccount } from '@bigmi/react'
import { ChainId, ChainType } from '@lifi/sdk'
import { useCurrentWallet } from '@mysten/dapp-kit'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletConnector as SolanaWalletConnector } from '@solana/client-core'
import {
  useWalletSession,
  useWalletStandardConnectors,
} from '@solana/react-hooks'
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { useAccount as useAccountInternal } from 'wagmi'
import { create } from 'zustand'
import type { CreateConnectorFnExtended } from '../connectors/types.js'

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
export type SVMAccount = AccountBase<ChainType.SVM, SolanaWalletConnector>
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
  | SolanaWalletConnector
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
  const session = useWalletSession()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { lastConnectedAccount } = useLastConnectedAccount()
  const svmWalletConnectors = useWalletStandardConnectors()
  const activeSVMConnector = svmWalletConnectors.find(
    (connector) => connector.id === session?.connector.id
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when wallet changes
  return useMemo(() => {
    const svm: Account = session?.account.publicKey
      ? {
          address: session?.account.publicKey.toString(),
          chainId: ChainId.SOL,
          chainType: ChainType.SVM,
          connector: activeSVMConnector,
          isConnected: Boolean(session?.account.publicKey),
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: !session,
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
      currentWallet?.accounts?.length && connectionStatus === 'connected'
        ? {
            address: currentWallet?.accounts[0].address,
            chainId: ChainId.SUI,
            chainType: ChainType.MVM,
            connector: currentWallet,
            isConnected: connectionStatus === 'connected',
            isConnecting: false,
            isReconnecting: false,
            isDisconnected: !currentWallet,
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
    const evm: Account = { ...wagmiAccount, chainType: ChainType.EVM }
    const utxo: Account = {
      ...bigmiAccount,

      chainType: ChainType.UTXO,
      chainId: ChainId.BTC,
      address: bigmiAccount.account?.address,
      addresses: bigmiAccount.accounts?.map((account) => account.address),
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
            (lastConnectedAccount as SolanaWalletConnector)?.name ===
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
    session?.account.publicKey,
    wagmiAccount.connector?.uid,
    wagmiAccount.connector?.id,
    wagmiAccount.status,
    wagmiAccount.address,
    wagmiAccount.chainId,
    bigmiAccount.connector?.uid,
    bigmiAccount.connector?.id,
    bigmiAccount.status,
    bigmiAccount.account?.address,
    bigmiAccount.chainId,
    args?.chainType,
    lastConnectedAccount,
    currentWallet?.accounts?.length,
    connectionStatus,
  ])
}
