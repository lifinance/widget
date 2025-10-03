import { ChainId, ChainType, isSVMAddress } from '@lifi/sdk'
import { SVMContext } from '@lifi/wallet-provider'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { ConnectionContext, useWallet } from '@solana/wallet-adapter-react'
import { type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { SVMBaseProvider } from './SVMBaseProvider.js'

interface SVMProviderProps {
  walletConfig?: any // TODO: WidgetWalletConfig type
}

export function useInSVMContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

export const SVMProvider: FC<PropsWithChildren<SVMProviderProps>> = ({
  walletConfig,
  children,
}) => {
  const forceInternalWalletManagement =
    walletConfig?.forceInternalWalletManagement

  const inSVMContext = useInSVMContext()

  if (inSVMContext && !forceInternalWalletManagement) {
    return (
      <CaptureSVMValues isExternalContext={inSVMContext}>
        {children}
      </CaptureSVMValues>
    )
  }

  return (
    <SVMBaseProvider>
      <CaptureSVMValues isExternalContext={inSVMContext}>
        {children}
      </CaptureSVMValues>
    </SVMBaseProvider>
  )
}

const CaptureSVMValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const {
    wallets,
    wallet: currentWallet,
    select: connect, // We use autoConnect on wallet selection
    disconnect,
    connected,
  } = useWallet()

  const account = currentWallet?.adapter.publicKey
    ? {
        address: currentWallet?.adapter.publicKey.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connector: currentWallet?.adapter,
        isConnected: Boolean(currentWallet?.adapter.publicKey),
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: !currentWallet,
        status: 'connected',
      }
    : {
        chainType: ChainType.SVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected',
      }

  const installedWallets = useMemo(
    () =>
      wallets.filter(
        (wallet: any) =>
          wallet.adapter.readyState === WalletReadyState.Installed ||
          wallet.adapter.readyState === WalletReadyState.Loadable
      ),
    [wallets]
  )

  const nonDetectedWallets = useMemo(
    () =>
      wallets.filter(
        (wallet: any) =>
          wallet.adapter.readyState !== WalletReadyState.Installed &&
          wallet.adapter.readyState !== WalletReadyState.Loadable
      ),
    [wallets]
  )

  return (
    <SVMContext.Provider
      value={{
        account,
        installedWallets,
        nonDetectedWallets,
        isConnected: connected,
        connect,
        disconnect,
        isValidAddress: isSVMAddress,
        isExternalContext,
      }}
    >
      {children}
    </SVMContext.Provider>
  )
}
