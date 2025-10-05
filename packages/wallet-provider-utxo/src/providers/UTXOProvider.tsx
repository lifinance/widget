import {
  type Connector,
  connect,
  disconnect,
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { isUTXOAddress } from '@bigmi/core'
import { BigmiContext, useAccount, useConfig, useConnect } from '@bigmi/react'
import { ChainId, ChainType, UTXO } from '@lifi/sdk'
import {
  isWalletInstalled,
  UTXOContext,
  type WalletConnector,
  type WalletProviderProps,
} from '@lifi/wallet-provider'
import {
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'

export function useInUTXOContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

export const UTXOProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
  walletConfig,
  children,
}) => {
  const forceInternalWalletManagement =
    walletConfig?.forceInternalWalletManagement

  const inUTXOContext = useInUTXOContext()

  if (inUTXOContext && !forceInternalWalletManagement) {
    return (
      <CaptureUTXOValues isExternalContext={inUTXOContext}>
        {children}
      </CaptureUTXOValues>
    )
  }

  return (
    <UTXOBaseProvider>
      <CaptureUTXOValues isExternalContext={inUTXOContext}>
        {children}
      </CaptureUTXOValues>
    </UTXOBaseProvider>
  )
}

const CaptureUTXOValues: FC<
  PropsWithChildren<{ isExternalContext: boolean }>
> = ({ children, isExternalContext }) => {
  const bigmiConfig = useConfig()
  const { connectors } = useConnect()
  const currentWallet = useAccount()

  const account = {
    ...currentWallet,
    chainType: ChainType.UTXO,
    chainId: ChainId.BTC,
    address: currentWallet.account?.address,
    addresses: currentWallet.accounts?.map((account: any) => account.address),
  }

  const handleDisconnect = useCallback(async () => {
    const connectedAccount = getAccount(bigmiConfig)
    if (connectedAccount.connector) {
      await disconnect(bigmiConfig, {
        connector: connectedAccount.connector,
      })
    }
  }, [bigmiConfig])

  const installedWallets = useMemo(
    () =>
      connectors.filter((connector: Connector) =>
        isWalletInstalled(connector.id)
      ),
    [connectors]
  )

  const nonDetectedWallets = useMemo(
    () =>
      connectors.filter(
        (connector: Connector) => !isWalletInstalled(connector.id)
      ),
    [connectors]
  )

  const handleConnect = useCallback(
    async (
      connector: WalletConnector,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const data = await connect(bigmiConfig, {
        connector: connector as Connector,
      })
      onSuccess?.(data.accounts[0].address, ChainId.BTC)
    },
    [bigmiConfig]
  )

  return (
    <UTXOContext.Provider
      value={{
        isEnabled: true,
        sdkProvider: UTXO({
          getWalletClient: () => getBigmiConnectorClient(bigmiConfig),
        }),
        account,
        isConnected: account.isConnected,
        installedWallets,
        nonDetectedWallets,
        connect: handleConnect,
        disconnect: handleDisconnect,
        isValidAddress: isUTXOAddress,
        isExternalContext,
      }}
    >
      {children}
    </UTXOContext.Provider>
  )
}
