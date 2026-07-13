import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import { ChainId, ChainType } from '@lifi/sdk'
import {
  StellarProvider as StellarSDKProvider,
  type StellarWallet,
} from '@lifi/sdk-provider-stellar'
import { StellarContext } from '@lifi/widget-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { useStellarWalletsKit } from '../stellar-kit/useStellarWalletsKit.js'
import type { StellarProviderConfig } from '../types.js'

interface StellarProviderValuesProps {
  isExternalContext: boolean
  config?: StellarProviderConfig
}

export const StellarProviderValues: FC<
  PropsWithChildren<StellarProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const {
    networkPassphrase,
    wallets,
    selectedWalletId,
    address,
    connected,
    connecting,
    connect,
    disconnect,
  } = useStellarWalletsKit(config)

  const selectedWallet = useMemo(
    () => wallets.find((wallet) => wallet.id === selectedWalletId),
    [wallets, selectedWalletId]
  )

  const connector = useMemo(
    () =>
      selectedWallet
        ? {
            id: selectedWallet.id,
            name: selectedWallet.name,
            icon: selectedWallet.icon,
          }
        : undefined,
    [selectedWallet]
  )

  const account = useMemo(
    () =>
      address
        ? {
            address,
            chainId: ChainId.XLM,
            chainType: ChainType.STL,
            connector,
            isConnected: connected,
            isConnecting: connecting,
            isReconnecting: false,
            isDisconnected: false,
            status: 'connected' as const,
          }
        : {
            chainType: ChainType.STL,
            isConnected: false,
            isConnecting: connecting,
            isReconnecting: false,
            isDisconnected: true,
            status: 'disconnected' as const,
          },
    [address, connected, connecting, connector]
  )

  const addressRef = useRef(address)
  addressRef.current = address

  const sdkProvider = useMemo(() => {
    const getWallet = async (): Promise<StellarWallet> => {
      const walletAddress = addressRef.current
      if (!walletAddress) {
        throw new Error('Wallet not connected')
      }
      return {
        address: walletAddress,
        networkPassphrase,
        signTransaction: (xdr, opts) =>
          StellarWalletsKit.signTransaction(xdr, {
            address: walletAddress,
            networkPassphrase,
            ...opts,
          }),
        signAuthEntry: (authEntry, opts) =>
          StellarWalletsKit.signAuthEntry(authEntry, {
            address: walletAddress,
            networkPassphrase,
            ...opts,
          }),
      }
    }
    if (typeof config?.sdkProvider === 'function') {
      return config.sdkProvider({ getWallet })
    }
    return (
      config?.sdkProvider ??
      StellarSDKProvider({ getWallet, networkPassphrase })
    )
  }, [config?.sdkProvider, networkPassphrase])

  const installedWallets = useMemo(
    () =>
      wallets
        .filter((wallet) => wallet.isAvailable)
        .map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          icon: wallet.icon,
        })),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      walletId: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      try {
        const connectedAddress = await connect(walletId)
        if (connectedAddress) {
          onSuccess?.(connectedAddress, ChainId.XLM)
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
      isConnected: account.isConnected,
      isExternalContext,
      connect: handleConnect,
      disconnect: handleDisconnect,
    }),
    [
      account,
      sdkProvider,
      installedWallets,
      isExternalContext,
      handleConnect,
      handleDisconnect,
    ]
  )

  return <StellarContext value={contextValue}>{children}</StellarContext>
}
