import { ChainId, ChainType, type SDKProvider } from '@lifi/sdk'
import { TronProvider as TronSDKProvider } from '@lifi/sdk-provider-tron'
import { TronContext } from '@lifi/widget-provider'
import {
  type AdapterName,
  WalletReadyState,
} from '@tronweb3/tronwallet-abstract-adapter'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'

interface TronProviderValuesProps {
  isExternalContext: boolean
}

export const TronProviderValues: FC<
  PropsWithChildren<TronProviderValuesProps>
> = ({ children, isExternalContext }) => {
  const {
    address,
    connected: isConnected,
    wallet: currentWallet,
    disconnect,
    wallets,
    select,
    connecting,
  } = useWallet()

  const connector = useMemo(
    () =>
      currentWallet
        ? {
            name: currentWallet.adapter.name,
            icon: currentWallet.adapter.icon,
          }
        : undefined,
    [currentWallet]
  )

  const account = useMemo(
    () =>
      address
        ? {
            address: address,
            chainId: ChainId.TRN,
            chainType: ChainType.TVM,
            connector,
            isConnected,
            isConnecting: connecting,
            isReconnecting: false,
            isDisconnected: false,
            status: 'connected' as const,
          }
        : {
            chainType: ChainType.TVM,
            isConnected: false,
            isConnecting: connecting,
            isReconnecting: false,
            isDisconnected: true,
            status: connecting
              ? ('connecting' as const)
              : ('disconnected' as const),
          },
    [address, connector, isConnected, connecting]
  )

  const sdkProvider = useMemo(
    () =>
      TronSDKProvider({
        multicallBatchSize: 50,
        getWallet: async () => {
          if (!currentWallet?.adapter) {
            throw new Error('No Tron wallet connected')
          }
          return currentWallet.adapter
        },
      }) as SDKProvider,
    [currentWallet]
  )

  const installedWallets = useMemo(
    () =>
      wallets
        .filter(
          (wallet) => wallet.adapter.readyState === WalletReadyState.Found
        )
        .map((wallet) => ({
          name: wallet.adapter.name,
          icon: wallet.adapter.icon,
        })),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      walletName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const wallet = wallets.find((w) => w.adapter.name === walletName)
      if (!wallet) {
        throw new Error(`Wallet ${walletName} not found`)
      }
      select(walletName as AdapterName)
      // Connect directly on the adapter — the hook's connect() requires adapter
      // state that hasn't updated yet. May overlap with autoConnect, but adapters
      // handle duplicate connects as a no-op.
      await wallet.adapter.connect()
      const connectedAddress = wallet.adapter.address
      if (connectedAddress) {
        onSuccess?.(connectedAddress, ChainId.TRN)
      }
    },
    [wallets, select]
  )

  const contextValue = useMemo(
    () => ({
      isEnabled: true,
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      connect: handleConnect,
      disconnect,
    }),
    [
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      handleConnect,
      disconnect,
    ]
  )

  return (
    <TronContext.Provider value={contextValue}>{children}</TronContext.Provider>
  )
}
