import { ChainId, ChainType, type SDKProvider } from '@lifi/sdk'
import { TronProvider as TronSDKProvider } from '@lifi/sdk-provider-tron'
import { TronContext } from '@lifi/widget-provider'
import {
  type AdapterName,
  AdapterState,
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
  } = useWallet()

  const connector = currentWallet
    ? {
        name: currentWallet.adapter.name,
        icon: currentWallet.adapter.icon,
      }
    : undefined

  const account = address
    ? {
        address: address,
        chainId: ChainId.TRN,
        chainType: ChainType.TVM,
        connector,
        isConnected,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected' as const,
      }
    : {
        chainType: ChainType.TVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected' as const,
      }

  const sdkProvider = useMemo(
    () =>
      TronSDKProvider({
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
        .filter((wallet) => wallet.adapter.state !== AdapterState.NotFound)
        .map((wallet) => ({
          name: wallet.adapter.name,
          icon: wallet.adapter.icon,
          wallet: wallet.adapter,
        })),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      walletName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      try {
        const wallet = wallets.find((w) => w.adapter.name === walletName)
        if (!wallet) {
          throw new Error(`Wallet ${walletName} not found`)
        }
        select(walletName as AdapterName)
        await wallet.adapter.connect()
        const connectedAddress = wallet.adapter.address
        if (connectedAddress) {
          onSuccess?.(connectedAddress, ChainId.TRN)
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    },
    [wallets, select]
  )

  return (
    <TronContext.Provider
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
    </TronContext.Provider>
  )
}
