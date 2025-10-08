import { ChainId, ChainType, Sui } from '@lifi/sdk'
import { MVMContext } from '@lifi/wallet-provider'
import {
  useConnectWallet,
  useCurrentWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'
import { isValidSuiAddress } from '@mysten/sui/utils'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { type FC, type PropsWithChildren, useCallback } from 'react'

interface CaptureMVMValuesProps {
  isExternalContext: boolean
}

export const CaptureMVMValues: FC<PropsWithChildren<CaptureMVMValuesProps>> = ({
  children,
  isExternalContext,
}) => {
  const wallets = useWallets()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { mutateAsync: disconnect } = useDisconnectWallet()
  const { mutateAsync: connect } = useConnectWallet()

  const account =
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
          status: 'disconnected' as const,
        }

  const handleConnect = useCallback(
    async (
      connectorIdOrName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const connector = wallets.find(
        (wallet) => (wallet.id ?? wallet.name) === connectorIdOrName
      )
      if (connector) {
        await connect(
          { wallet: connector as WalletWithRequiredFeatures },
          {
            onSuccess: (standardConnectOutput) => {
              onSuccess?.(
                standardConnectOutput.accounts[0].address,
                ChainId.SUI
              )
            },
          }
        )
      }
    },
    [connect, wallets]
  )

  return (
    <MVMContext.Provider
      value={{
        isEnabled: true,
        account,
        sdkProvider: Sui({
          getWallet: async () => currentWallet!,
        }),
        isConnected: account.isConnected,
        installedWallets: wallets,
        connect: handleConnect,
        disconnect,
        isValidAddress: isValidSuiAddress,
        isExternalContext,
      }}
    >
      {children}
    </MVMContext.Provider>
  )
}
