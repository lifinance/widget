import { ChainId, ChainType } from '@lifi/sdk'
import { SolanaProvider as SolanaSDKProvider } from '@lifi/sdk-provider-solana'
import { SolanaContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { useWalletAccount } from '../hooks/useWalletAccount.js'
import type { SolanaProviderConfig } from '../types.js'
import { useSolanaWalletStandard as useWallet } from '../wallet-standard/useSolanaWalletStandard.js'

interface SolanaProviderValuesProps {
  isExternalContext: boolean
  config?: SolanaProviderConfig
}

export const SolanaProviderValues: FC<
  PropsWithChildren<SolanaProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const {
    wallets,
    selectedWallet: currentWallet,
    connect,
    disconnect,
    connected,
  } = useWallet()

  const { address: accountAddress } = useWalletAccount()

  const connector = useMemo(
    () =>
      currentWallet
        ? { name: currentWallet.name, icon: currentWallet.icon }
        : undefined,
    [currentWallet]
  )

  const account = useMemo(
    () =>
      accountAddress
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
          },
    [accountAddress, connected, connector]
  )

  const isConnected = account.isConnected

  const walletRef = useRef(currentWallet)
  walletRef.current = currentWallet

  const sdkProvider = useMemo(
    () =>
      config?.sdkProvider ??
      SolanaSDKProvider({
        async getWallet() {
          if (!walletRef.current) {
            throw new Error('Wallet not connected')
          }

          return walletRef.current
        },
      }),
    [config?.sdkProvider]
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
        const address = await connect(walletName)
        if (address) {
          onSuccess?.(address, ChainId.SOL)
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    },
    [connect]
  )

  const handleDisconnect = useCallback(async () => {
    await disconnect()
  }, [disconnect])

  const contextValue = useMemo(
    () => ({
      isEnabled: true,
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      connect: handleConnect,
      disconnect: handleDisconnect,
    }),
    [
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      handleConnect,
      handleDisconnect,
    ]
  )

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  )
}
