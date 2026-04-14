import { ChainId, ChainType } from '@lifi/sdk'
import { SuiProvider as SuiSDKProvider } from '@lifi/sdk-provider-sui'
import { SuiContext } from '@lifi/widget-provider'
import {
  useCurrentWallet,
  useDAppKit,
  useWalletConnection,
  useWallets,
} from '@mysten/dapp-kit-react'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'
import type { SuiProviderConfig } from '../types.js'
import { WalletSigner } from '../WalletSigner.js'

interface SuiProviderValuesProps {
  isExternalContext: boolean
  config?: SuiProviderConfig
}

export const SuiProviderValues: FC<
  PropsWithChildren<SuiProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const wallets = useWallets()
  const dappKit = useDAppKit()
  const { connectWallet: connect, disconnectWallet: disconnect } = dappKit
  const currentWallet = useCurrentWallet()
  const { status: connectionStatus, isConnected } = useWalletConnection()

  const account = useMemo(
    () =>
      currentWallet?.accounts?.length && connectionStatus === 'connected'
        ? {
            address: currentWallet?.accounts[0].address,
            chainId: ChainId.SUI,
            chainType: ChainType.MVM,
            connector: currentWallet,
            isConnected: isConnected,
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
            status: 'disconnected' as const,
          },
    [currentWallet, connectionStatus, isConnected]
  )

  const installedWallets = useMemo(() => wallets, [wallets])

  const sdkProvider = useMemo(
    () =>
      config?.sdkProvider ??
      SuiSDKProvider({
        getClient: async () => dappKit.getClient(),
        getSigner: async () => new WalletSigner(dappKit),
      }),
    [dappKit, config?.sdkProvider]
  )

  const handleConnect = useCallback(
    async (
      connectorIdOrName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const connector = wallets.find(
        (wallet) => wallet.name === connectorIdOrName
      )
      if (connector) {
        const { accounts } = await connect({ wallet: connector })
        if (accounts.length > 0) {
          onSuccess?.(accounts[0].address, ChainId.SUI)
        }
      }
    },
    [connect, wallets]
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
    <SuiContext.Provider value={contextValue}>{children}</SuiContext.Provider>
  )
}
