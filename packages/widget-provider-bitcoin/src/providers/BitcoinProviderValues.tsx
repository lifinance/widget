import {
  type Connector,
  connect,
  disconnect,
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { useAccount, useConfig, useConnect } from '@bigmi/react'
import { ChainId, ChainType } from '@lifi/sdk'
import { BitcoinProvider as BitcoinSDKProvider } from '@lifi/sdk-provider-bitcoin'
import { BitcoinContext, isWalletInstalled } from '@lifi/widget-provider'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'
import type { BitcoinProviderConfig } from '../types'

interface BitcoinProviderValuesProps {
  isExternalContext: boolean
  config?: BitcoinProviderConfig
}

export const BitcoinProviderValues: FC<
  PropsWithChildren<BitcoinProviderValuesProps>
> = ({ children, isExternalContext, config }) => {
  const bigmiConfig = useConfig()
  const { connectors } = useConnect()
  const currentWallet = useAccount()

  const account = useMemo(
    () => ({
      ...currentWallet,
      chainType: ChainType.UTXO,
      chainId: ChainId.BTC,
      address: currentWallet.account?.address,
      addresses: currentWallet.accounts?.map((account) => account.address),
    }),
    [currentWallet]
  )

  const isConnected = account.isConnected

  const sdkProvider = useMemo(() => {
    const getWalletClient = () => getBigmiConnectorClient(bigmiConfig)
    if (typeof config?.sdkProvider === 'function') {
      return config.sdkProvider({ getWalletClient })
    }
    return config?.sdkProvider ?? BitcoinSDKProvider({ getWalletClient })
  }, [bigmiConfig, config?.sdkProvider])

  const installedWallets = useMemo(
    () =>
      connectors.filter((connector: Connector) =>
        isWalletInstalled(connector.id)
      ),
    [connectors]
  )

  const handleConnect = useCallback(
    async (
      connectorIdOrName: string,
      onSuccess?: (address: string, chainId: number) => void
    ) => {
      const connector = connectors.find(
        (connector) => (connector.id ?? connector.name) === connectorIdOrName
      )
      if (connector) {
        const data = await connect(bigmiConfig, {
          connector: connector as Connector,
        })
        if (data.accounts.length > 0) {
          onSuccess?.(data.accounts[0].address, ChainId.BTC)
        }
      }
    },
    [bigmiConfig, connectors]
  )

  const handleDisconnect = useCallback(async () => {
    const connectedAccount = getAccount(bigmiConfig)
    if (connectedAccount.connector) {
      await disconnect(bigmiConfig, {
        connector: connectedAccount.connector,
      })
    }
  }, [bigmiConfig])

  const contextValue = useMemo(
    () => ({
      isEnabled: true,
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      connect: handleConnect,
      disconnect: handleDisconnect,
    }),
    [
      account,
      sdkProvider,
      installedWallets,
      isConnected,
      isExternalContext,
      handleConnect,
      handleDisconnect,
    ]
  )

  return (
    <BitcoinContext.Provider value={contextValue}>
      {children}
    </BitcoinContext.Provider>
  )
}
