import { type Connector, connect, disconnect, getAccount } from '@bigmi/client'
import { useConfig } from '@bigmi/react'
import { ChainType } from '@lifi/sdk'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { WalletManagementEvent } from '../types/events.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'
import { CardListItemButton } from './CardListItemButton.js'
import { getTagType } from './WalletTag.js'
import type { WalletListItemButtonProps } from './types.js'

interface UTXOListItemButtonProps extends WalletListItemButtonProps {
  connector: Connector
}

export const UTXOListItemButton = ({
  ecosystemSelection,
  connector,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: UTXOListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const config = useConfig()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = connector.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Bitcoin'
    : connectorName

  const handleUTXOConnect = async () => {
    try {
      const identityCheckPassed = isWalletInstalled((connector as Connector).id)
      if (!identityCheckPassed) {
        onNotInstalled?.(connector as Connector)
        return
      }
      const connectedAccount = getAccount(config)
      onConnecting?.()
      const data = await connect(config, { connector })
      if (connectedAccount.connector) {
        await disconnect(config, { connector: connectedAccount.connector })
      }
      setLastConnectedAccount(connector)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: data.accounts[0],
        chainId: data.chainId,
        chainType: ChainType.UTXO,
        connectorId: connector.id,
        connectorName: connectorName,
      })
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connector.id}
      icon={
        ecosystemSelection
          ? 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bitcoin.svg'
          : (getConnectorIcon(connector as Connector) ?? '')
      }
      onClick={handleUTXOConnect}
      title={connectorDisplayName}
      tagType={ecosystemSelection ? undefined : getTagType(connector.id)}
    />
  )
}
