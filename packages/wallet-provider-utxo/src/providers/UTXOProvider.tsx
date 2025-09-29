import {
  type Connector,
  connect,
  disconnect,
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { isUTXOAddress } from '@bigmi/core'
import { BigmiContext, useAccount, useConfig, useConnect } from '@bigmi/react'
import { ChainId, ChainType } from '@lifi/sdk'
import { UTXOContext } from '@lifi/wallet-provider'
import { type FC, type PropsWithChildren, useCallback, useContext } from 'react'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'

interface UTXOProviderProps {
  walletConfig?: any // TODO: WidgetWalletConfig type
}

export function useInUTXOContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

export const UTXOProvider: FC<PropsWithChildren<UTXOProviderProps>> = ({
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
  const { connectors: bigmiConnectors } = useConnect()
  const currentWallet = useAccount()

  const account = {
    ...currentWallet,
    chainType: ChainType.UTXO,
    chainId: ChainId.BTC,
    address: currentWallet.account?.address,
    addresses: currentWallet.accounts?.map((account: any) => account.address),
  }

  const handleConnect = useCallback(
    async (connector: Connector) => {
      return await connect(bigmiConfig, { connector })
    },
    [bigmiConfig]
  )

  const handleDisconnect = useCallback(async () => {
    const connectedAccount = getAccount(bigmiConfig)
    if (connectedAccount.connector) {
      await disconnect(bigmiConfig, {
        connector: connectedAccount.connector,
      })
    }
  }, [bigmiConfig])

  return (
    <UTXOContext.Provider
      value={{
        walletClient: getBigmiConnectorClient(bigmiConfig),
        wallets: bigmiConnectors,
        account,
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
