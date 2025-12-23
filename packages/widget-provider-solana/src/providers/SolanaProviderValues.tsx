import { ChainId, ChainType } from '@lifi/sdk'
import { SolanaProvider as SolanaSDKProvider } from '@lifi/sdk-provider-solana'
import { SolanaContext } from '@lifi/widget-provider'
import type { Transaction } from '@solana/kit'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'
import { useWalletAccount } from '../hooks/useWalletAccount'
import { useWalletSigner } from '../hooks/useWalletSigner'
import { useSolanaWalletStandard as useWallet } from './SolanaWalletStandardProvider'

interface SolanaProviderValuesProps {
  isExternalContext: boolean
}

export const SolanaProviderValues: FC<
  PropsWithChildren<SolanaProviderValuesProps>
> = ({ children, isExternalContext }) => {
  const {
    wallets,
    selectedWallet: currentWallet,
    select,
    disconnect,
    connected,
  } = useWallet()
  const { address: accountAddress } = useWalletAccount()
  const { signer } = useWalletSigner()

  const connector = currentWallet
    ? {
        name: currentWallet.name,
        icon: currentWallet.icon,
      }
    : undefined

  const account = accountAddress
    ? {
        address: accountAddress,
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connector,
        isConnected: connected,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected' as const,
      }
    : {
        chainType: ChainType.SVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected' as const,
      }

  const isConnected = account.isConnected

  const sdkProvider = useMemo(
    () =>
      SolanaSDKProvider({
        async getWallet() {
          if (!signer || !accountAddress) {
            throw new Error('Wallet not connected')
          }

          return {
            account: {
              address: signer.address,
              publicKey: new TextEncoder().encode(accountAddress),
            },
            async signTransaction(transaction: Transaction) {
              if (!signer) {
                throw new Error('Signer not available')
              }

              const [signedTx] = await signer.modifyAndSignTransactions([
                transaction,
              ])

              return signedTx
            },
          }
        },
      }),
    [signer, accountAddress]
  )

  // Convert Wallet Standard wallets to a format the UI expects
  const installedWallets = useMemo(
    () =>
      wallets
        .filter((wallet) => wallet.installed && wallet.connectable)
        .map((wallet) => ({
          name: wallet.name,
          icon: wallet.icon,
          wallet: wallet.wallet,
        })),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      walletName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      try {
        await select(walletName)
        if (accountAddress) {
          onSuccess?.(accountAddress, ChainId.SOL)
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    },
    [select, accountAddress]
  )

  return (
    <SolanaContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider,
        installedWallets,
        isConnected,
        isExternalContext,
        connect: handleConnect,
        disconnect,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
