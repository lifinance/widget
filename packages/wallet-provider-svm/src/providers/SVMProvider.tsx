import { ChainId, ChainType, isSVMAddress, Solana } from '@lifi/sdk'
import {
  type Account,
  SVMContext,
  type WalletConnector,
  type WalletProviderProps,
} from '@lifi/wallet-provider'
import {
  type Adapter,
  type SignerWalletAdapter,
  WalletReadyState,
} from '@solana/wallet-adapter-base'
import {
  ConnectionContext,
  useWallet,
  type Wallet,
} from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { SVMBaseProvider } from './SVMBaseProvider.js'

export function useInSVMContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

export const SVMProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
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
      wallets
        .filter(
          (wallet: Wallet) =>
            wallet.adapter.readyState === WalletReadyState.Installed ||
            wallet.adapter.readyState === WalletReadyState.Loadable
        )
        .map((wallet: Wallet) => wallet.adapter),
    [wallets]
  )

  const nonDetectedWallets = useMemo(
    () =>
      wallets
        .filter(
          (wallet: Wallet) =>
            wallet.adapter.readyState !== WalletReadyState.Installed &&
            wallet.adapter.readyState !== WalletReadyState.Loadable
        )
        .map((wallet: Wallet) => wallet.adapter),
    [wallets]
  )

  const handleConnect = useCallback(
    async (
      connector: WalletConnector,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const adapter = connector as unknown as Adapter
      connect(adapter.name)
      adapter.once('connect', (publicKey: PublicKey) => {
        onSuccess?.(publicKey?.toString(), ChainId.SOL)
      })
    },
    [connect]
  )

  return (
    <SVMContext.Provider
      value={{
        isEnabled: true,
        account: account as Account,
        sdkProvider: Solana({
          async getWalletAdapter() {
            return currentWallet?.adapter as SignerWalletAdapter
          },
        }),
        installedWallets: installedWallets as WalletConnector[],
        nonDetectedWallets: nonDetectedWallets as WalletConnector[],
        isConnected: connected,
        connect: handleConnect,
        disconnect,
        isValidAddress: isSVMAddress,
        isExternalContext,
      }}
    >
      {children}
    </SVMContext.Provider>
  )
}
