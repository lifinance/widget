import { ChainType } from '@lifi/sdk'
import {
  type Account,
  useEVMContext,
  useMVMContext,
  useSVMContext,
  useUTXOContext,
  type WalletConnector,
} from '@lifi/widget-provider'
import { useMemo } from 'react'
import { create } from 'zustand'

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

const defaultAccount: Account = {
  chainType: ChainType.EVM,
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
}

interface LastConnectedAccountStore {
  lastConnectedAccount: WalletConnector | null
  setLastConnectedAccount: (account: WalletConnector | null) => void
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
  const { account: evmAccount } = useEVMContext()
  const { account: utxoAccount } = useUTXOContext()
  const { account: svmAccount } = useSVMContext()
  const { account: suiAccount } = useMVMContext()
  const { lastConnectedAccount } = useLastConnectedAccount()

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when wallet changes
  return useMemo(() => {
    const accounts = [evmAccount, svmAccount, utxoAccount, suiAccount].filter(
      (account) => account !== null
    )
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
            lastConnectedAccount?.id === account.connector?.id
          const connectorNameMatch =
            !lastConnectedAccount?.id &&
            lastConnectedAccount?.name === account.connector?.name
          return connectorIdMatch || connectorNameMatch
        }) || connectedAccounts[0]
      : connectedAccounts[0]

    return {
      account: selectedChainTypeAccount || selectedAccount || defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    }
  }, [
    svmAccount?.address,
    evmAccount?.connector?.uid,
    evmAccount?.connector?.id,
    evmAccount?.status,
    evmAccount?.address,
    evmAccount?.chainId,
    utxoAccount?.connector?.uid,
    utxoAccount?.connector?.id,
    utxoAccount?.status,
    utxoAccount?.address,
    utxoAccount?.chainId,
    suiAccount?.address,
    suiAccount?.status,
    args?.chainType,
    lastConnectedAccount,
  ])
}
