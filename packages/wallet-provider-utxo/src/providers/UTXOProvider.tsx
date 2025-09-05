import {
  type Connector,
  connect,
  disconnect,
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { BigmiContext, useAccount, useConfig, useConnect } from '@bigmi/react'
import { UTXOContext } from '@lifi/wallet-store'
import { type FC, type PropsWithChildren, useCallback, useContext } from 'react'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'

interface UTXOProviderProps {
  forceInternalWalletManagement?: boolean
}

export function useInUTXOContext(): boolean {
  const context = useContext(BigmiContext)

  return Boolean(context)
}

export const UTXOProvider: FC<PropsWithChildren<UTXOProviderProps>> = ({
  forceInternalWalletManagement,
  children,
}) => {
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
  const bigmiAccount = useAccount()

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
        currentWallet: bigmiAccount,
        // connectionStatus,
        // isConnected: connected,
        connect: handleConnect,
        disconnect: handleDisconnect,
        isExternalContext,
      }}
    >
      {children}
    </UTXOContext.Provider>
  )
}
