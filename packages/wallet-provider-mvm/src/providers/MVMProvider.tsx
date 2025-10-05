import { ChainId, ChainType, Sui } from '@lifi/sdk'
import {
  type Account,
  MVMContext,
  type WalletConnector,
  type WalletProviderProps,
} from '@lifi/wallet-provider'
import {
  SuiClientContext,
  useConnectWallet,
  useCurrentWallet,
  useDisconnectWallet,
  useWallets,
} from '@mysten/dapp-kit'
import { isValidSuiAddress } from '@mysten/sui/utils'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { type FC, type PropsWithChildren, useCallback, useContext } from 'react'
import { MVMBaseProvider } from './MVMBaseProvider.js'

export function useInMVMContext(): boolean {
  const context = useContext(SuiClientContext)
  return Boolean(context)
}

export const MVMProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
  walletConfig,
  chains,
  children,
}) => {
  const forceInternalWalletManagement =
    walletConfig?.forceInternalWalletManagement

  const inSuiContext = useInMVMContext()

  if (inSuiContext && !forceInternalWalletManagement) {
    return (
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    )
  }

  return (
    <MVMBaseProvider chains={chains}>
      <CaptureMVMValues isExternalContext={inSuiContext}>
        {children}
      </CaptureMVMValues>
    </MVMBaseProvider>
  )
}

const CaptureMVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
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
          status: 'disconnected',
        }

  const handleConnect = useCallback(
    async (
      connector: WalletConnector,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      await connect(
        { wallet: connector as unknown as WalletWithRequiredFeatures },
        {
          onSuccess: (standardConnectOutput) => {
            onSuccess?.(standardConnectOutput.accounts[0].address, ChainId.SUI)
          },
        }
      )
    },
    [connect]
  )

  return (
    <MVMContext.Provider
      value={{
        isEnabled: true,
        account: account as Account,
        sdkProvider: Sui({
          getWallet: async () => currentWallet!,
        }),
        isConnected: account.isConnected,
        installedWallets: wallets as WalletConnector[],
        nonDetectedWallets: [] as WalletConnector[],
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
