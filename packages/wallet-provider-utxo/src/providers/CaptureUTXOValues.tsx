import {
  type Connector,
  connect,
  disconnect,
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { isUTXOAddress } from '@bigmi/core'
import { useAccount, useConfig, useConnect } from '@bigmi/react'
import { ChainId, ChainType, UTXO } from '@lifi/sdk'
import { isWalletInstalled, UTXOContext } from '@lifi/wallet-provider'
import { type FC, type PropsWithChildren, useCallback, useMemo } from 'react'

interface CaptureUTXOValuesProps {
  isExternalContext: boolean
}

export const CaptureUTXOValues: FC<
  PropsWithChildren<CaptureUTXOValuesProps>
> = ({ children, isExternalContext }) => {
  const bigmiConfig = useConfig()
  const { connectors } = useConnect()
  const currentWallet = useAccount()

  const account = {
    ...currentWallet,
    chainType: ChainType.UTXO,
    chainId: ChainId.BTC,
    address: currentWallet.account?.address,
    addresses: currentWallet.accounts?.map((account) => account.address),
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
        onSuccess?.(data.accounts[0].address, ChainId.BTC)
      }
    },
    [bigmiConfig, connectors]
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
