import { ChainId, ChainType } from '@lifi/sdk'
import { SuiProvider as SuiSDKProvider } from '@lifi/sdk-provider-sui'
import { SuiContext } from '@lifi/widget-provider'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'
import {
  useCurrentWallet,
  useDAppKit,
  useWalletConnection,
  useWallets,
} from '../hooks.js'
import { CurrentAccountSigner } from '../signer.js'

interface SuiProviderValuesProps {
  isExternalContext: boolean
}

export const SuiProviderValues: FC<
  PropsWithChildren<SuiProviderValuesProps>
> = ({ children, isExternalContext }) => {
  const wallets = useWallets()
  const dappKit = useDAppKit()
  const { connectWallet: connect, disconnectWallet: disconnect } = dappKit
  const currentWallet = useCurrentWallet()
  const { status: connectionStatus, isConnected } = useWalletConnection()

  const account =
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
        }

  const installedWallets = wallets

  const sdkProvider = useMemo(
    () =>
      SuiSDKProvider({
        getClient: async () => dappKit.getClient(),
        getSigner: async () => new CurrentAccountSigner(dappKit),
      }),
    [dappKit]
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

  return (
    <SuiContext.Provider
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
    </SuiContext.Provider>
  )
}
